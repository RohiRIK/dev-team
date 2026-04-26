# Architecture

The `dev-team` plugin turns one Claude Code session into a small specialist team. It is a single plugin with four shipped components: agents, a slash command, skills, and one bundled MCP server. No external services.

## Plugin shape

```
dev-team/
├── .claude-plugin/plugin.json     manifest (name, version, component roots)
├── .mcp.json                      registers the task-tracker MCP
├── agents/                        14 specialist subagents (Markdown + YAML frontmatter)
├── commands/buddy.md              /buddy orchestrator
├── knowledge/                     cross-cutting docs referenced by agents
├── skills/create-agent/           lifecycle skill for authoring agents
├── mcp/task-tracker/              bun-based MCP server, atomic JSON store
└── scripts/                       verify-agents.ts, port-agent.ts, gen-prereqs.ts
```

`plugin.json` declares `components: { agents, commands, skills, mcpServers }`. `.mcp.json` points the `task-tracker` server at `${CLAUDE_PLUGIN_ROOT}/mcp/task-tracker/src/index.ts` launched under `bun`.

## /buddy data flow

`/buddy` is the only orchestrator. It never writes production code, tests, or commits — it only calls `create_task`, dispatches subagents via the `Task` tool, and posts a closeout summary.

```
 user
  |
  |  /buddy <request>
  v
+------------------+
|  /buddy (parse)  |    route to one agent or a multi-step DAG
+------------------+
          |
          v
+------------------+
|  plan preview    |    render table of {agent, title, depends-on}
+------------------+
          |
          |  waits for user reply
          v
+------------------+
|  approval gate   |    "go" / change-request / decline / ambiguous
+------------------+
          |
          |  on "go"
          v
+----------------------------+
|  create_task x N (MCP)     |  pending rows written to .dev-team/tasks.json
+----------------------------+
          |
          v
+----------------------------+
|  Task dispatch (wave 1)    |  parallel subagents for deps-free tasks
+----------------------------+
          |
          v    per agent:   update_task(in_progress) -> work -> complete_task(result, artifacts)
+----------------------------+
|  poll via get_task         |  dispatch next wave as deps resolve
+----------------------------+
          |
          v
+------------------+
|  closeout        |    one-screen summary + routing confidence
+------------------+
```

Key property: tasks are only created **after** the user approves the preview. The plan is held in memory during the approval loop. See [buddy.md](./buddy.md) for the full gate logic.

## Task-tracker state

State persists to `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` — one JSON file per workspace. Writes are atomic (`fs.rename` with a cross-device fallback for cloud-synced filesystems).

On first write, the MCP walks up from the state directory to find the nearest `.git` and appends `.dev-team/` to the repo's `.gitignore` (idempotent, silent, skipped outside a git repo). This keeps task state out of version control without requiring the user to configure anything.

The MCP exposes five tools:

- `create_task` — new `pending` row with optional `dependsOn` and `tags`.
- `list_tasks` — summary rows, optionally filtered by `status` / `agent` / `limit`.
- `get_task` — full row by id, including `description`, `result`, `artifacts`.
- `update_task` — partial update; enforces that `dependsOn` ids are all `completed` before allowing `status: completed`.
- `complete_task` — convenience wrapper for `update_task({ status: "completed", ... })`.

Full protocol and status enum: [task-tracker.md](./task-tracker.md) and the canonical doc at `../knowledge/task-tracker-api.md`.

## Agent shape

Every agent in `agents/` follows a canonical 7-section body (`Role`, `When to use`, `When NOT to use`, `Workflow`, `Tools`, `Constraints`, `Worked example`) and is capped at 200 lines. Overflow lands in `knowledge/<slug>-refs.md`.

Tool allowlists are default-deny. Review-only agents (`security-analyst`, `pentester`) have no `Write` / `Edit`. `qa-tester` has `Edit` but no `Write` (tests evolve; new production files belong to dev roles). Design-only agents (`product-manager`, `system-architect`, `cloud-architect`, `ui-ux-designer`) have no `Bash`.

See [agents.md](./agents.md) for the full roster and [create-agent.md](./create-agent.md) for how agent files are authored and validated.

## Skills

One skill ships with this version: `create-agent`. It owns the full lifecycle of a dev-team agent (create, port, research, validate, update) and is invoked by the `agent-builder` agent. Additional skills (`CodingStandards`, `TddWorkflow`, etc.) land in subsequent minor versions. See [create-agent.md](./create-agent.md).

## Multi-engine dispatch (alpha, v0.3.0)

Opt-in routing of individual tasks to external CLI engines (`gemini-cli`, `goose`, `opencode`, `minimax-cli`) instead of running them in-session with Claude. Gated behind `DEV_TEAM_MULTI_ENGINE=1`. Full spec: [`../specs/multi-engine-dispatch.md`](../specs/multi-engine-dispatch.md).

**Why.** Token efficiency (long-running or code-heavy tasks run on cheaper or local engines), user-controlled routing (pick the engine that fits the task class), and a single place to wire new engines without touching `/buddy`.

**Dispatch split — two paths, one orchestrator.**

After `create_task`, `/buddy` routes each task by the Engine cell on the approved plan. There are exactly two dispatch paths:

```
                 /buddy (after approval)
                       |
        +--------------+---------------+
        |                              |
        v                              v
  Engine = claude              Engine = gemini-cli / opencode / goose / minimax-cli
        |                              |
        v                              v
  Task tool                    mcp__plugin_dev-team_task-tracker__dispatch_engine
        |                              |
        v                              v
  Claude subagent              Bun.spawn(engine.command, args_template)
  runs in-session              external CLI subprocess (separate process, separate context)
  (same context window)                |
        |                              v
        |              .dev-team/prompts/<id>.txt   <-- prompt body (file-passed, never argv)
        |              .dev-team/artifacts/<id>.log <-- stdout stream
        |              .dev-team/artifacts/<id>.err <-- stderr stream
        |                              |
        +--------------+---------------+
                       |
                       v
          task-tracker MCP records terminal state
          (completed | blocked) — never in_progress
```

**Per-task lifecycle inside the dispatch_engine path.**

```
dispatch_engine (MCP)     resolve engine from state/engines.json (loadEngineRegistry)
        |
        v
update_task(in_progress)  implicit claim
        |
        v
write .dev-team/prompts/<id>.txt        prompt body — file-passed, never argv
        |
        v
spawn engine.command [args_template]    direct exec, no shell, restricted env
        |
        v
stream stdout -> .dev-team/artifacts/<id>.log
        |
        +-- exit 0   -> complete_task(result = stdout tail, artifact = log)
        +-- exit ≠0  -> update_task(status: blocked, result = stderr first 500 chars)
        +-- spawn throw -> same blocked path (never stuck in_progress)
```

Agents that opt in declare an `engines:` list in their frontmatter (pilot set: 4 agents in v0.3.0-alpha). `scripts/verify-agents.ts` enforces the field is a subset of the registry keys.

**File layout.**

- `state/engines.json` — committed registry of allowed engines (`command`, `args_template`, `prompt_flag`, `stdin_ok`, `env_passthrough`).
- `.dev-team/prompts/<id>.txt` — per-task prompt body, gitignored with the rest of `.dev-team/`.
- `.dev-team/artifacts/<id>.log` — stdout transcript, referenced from `task.artifacts[]`.

**Security stance.**

- Prompts are **file-passed, never argv** — no command-line length or escaping surface.
- Subprocess is **exec directly**, never through `/bin/sh -c` — no shell metacharacter exposure.
- Child env is an **explicit allowlist** per engine (`env_passthrough`), not the parent's full env.
- Missing binary → **auto-downgrade to claude** with a hint in the tool error; no partial spawn.
- Feature is **env-gated** while in alpha — shipped off by default.

**Rollout.** v0.3.0-alpha behind `DEV_TEAM_MULTI_ENGINE=1`. Four pilot agents declare `engines:` today. Once the dispatch tool has soaked through real runs, the flag flips to default-on in a later minor release. Until then, agents without the env var see the plugin behave exactly as in 0.2.x.

## What this plugin is not

- Not a background daemon — `/buddy` runs inside one Claude Code session.
- Not a multi-workspace coordinator — one `.dev-team/tasks.json` per workspace.
- Not a replacement for your cloud — the task-tracker MCP is local JSON only.
- Not opinionated about your stack — agents describe their tool preferences, but the plugin does not install CLIs.
