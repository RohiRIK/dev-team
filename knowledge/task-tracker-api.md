# task-tracker MCP — protocol reference

Shared protocol doc. Every agent in `agents/` cites this file from its `## Workflow`. The MCP server is bundled in the plugin at `mcp/task-tracker/` and registered via `.mcp.json`.

## Scope

The `task-tracker` MCP is the only inter-agent coordination channel in the plugin. `/buddy` creates tasks, each specialist agent picks up its task, marks progress, and hands off via new tasks with `dependsOn` wiring.

State persists to `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` — one plain JSON file per workspace. No database, no cloud call. Atomic writes via `fs.rename` with a cross-device fallback for cloud-synced filesystems.

## Tool catalogue

Seven tools. Use the fully-qualified name `mcp__plugin_dev-team_task-tracker__<tool>` from agent / command code. (`dispatch_engine` is alpha, gated behind `DEV_TEAM_MULTI_ENGINE=1`.)

### `create_task`

Creates a new task in `pending` status. Returns `{id, status}`.

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `agent` | string (≤ 64) | ✓ | Must match a slug under `agents/`. |
| `title` | string (≤ 200) | ✓ | One-line outcome — what this task delivers. |
| `description` | string (≤ 1000) | — | Context, acceptance, hand-off. Use the template below. |
| `dependsOn` | `string[]` | — | Task ids that must be `completed` before this task can complete. Unknown ids throw. |
| `tags` | `string[]` (≤ 32 each) | — | Free-form labels — `api`, `iac`, `security`, etc. |

### `list_tasks`

Returns a summary array. Each row has 5 fields — keeps `/buddy`'s context light.

**Row shape:** `{id, agent, title, status, updatedAt}`.

**Filters** (all optional):

| Filter | Type | Notes |
|---|---|---|
| `status` | enum | `pending` \| `in_progress` \| `blocked` \| `completed` \| `cancelled` |
| `agent` | string | Exact slug match. |
| `limit` | int ≤ 500 | Cap the result set. |

### `get_task`

Full row for one task by id. Call this when `list_tasks`'s summary fields aren't enough — e.g. to read `description`, `result`, `artifacts`, or the current `dependsOn`.

### `update_task`

Partial update. At minimum the `id`; any subset of `{status, description, result, artifacts}` may accompany it.

- Setting `status: "in_progress"` stamps `startedAt` (first time only).
- Setting `status: "completed"` stamps `completedAt` and enforces: **every id in `dependsOn` must already be `completed`**. Unmet deps throw.
- Setting `status: "blocked"` is the escape hatch when an agent needs more input — put the question in `result`.

### `complete_task`

Convenience wrapper around `update_task({status: "completed", ...})`. Optional `result` (≤ 500 chars) and `artifacts`.

### `dispatch_engine` (alpha, env-gated)

Hands a single task off to an external CLI engine (e.g. `gemini-cli`, `goose`, `opencode`, `minimax-cli`) instead of executing it in-session under Claude. Gated behind `DEV_TEAM_MULTI_ENGINE=1`; throws when unset. Engines are loaded from `state/engines.json` at call time via `loadEngineRegistry()` (`mcp/task-tracker/src/engines.ts`).

**Input:** `{task_id: string, engine: string}` — `engine` must be a key in the registry.

**Returns:** `{task_id, engine, exit_code, stdout_path, stderr_path}` — the orchestrator can read the log paths to surface output to the user.

**Lifecycle.** The tool drives the task through this transition for the caller:

| Before | Tool action | After |
|---|---|---|
| `pending` | `update_task({status: "in_progress"})` is set automatically on dispatch — claim is implicit. | `in_progress` |
| `in_progress` | Engine exits 0 → `complete_task` with stdout-tail `result` and the log as an artifact. | `completed` |
| `in_progress` | Engine exits non-zero (or spawn throws) → `update_task({status: "blocked", result: <stderr first 500 chars>})`. | `blocked` |

The tool **never leaves a task `in_progress`** on its own — every code path lands in either `completed` or `blocked`.

**Behaviour.**

1. Reads the task and engine config; throws hard on unknown task id, unknown engine slug, or **missing binary on `PATH`**. The tool itself does not auto-downgrade — that decision belongs to `/buddy` at preview time (see Fallback semantics below).
2. Writes `${stateDir}/prompts/<task_id>.txt` with the task body. Prompts are **file-passed**; never placed on argv.
3. Spawns `engine.command` with `args_template` (substituting `{{prompt_file}}`) — direct `Bun.spawn` exec, never `/bin/sh -c`.
4. Child env is restricted to the keys in `engine.env_passthrough` (explicit allowlist) — not the parent's full env.
5. Streams stdout to `${stateDir}/artifacts/<task_id>.log` and stderr to `${stateDir}/artifacts/<task_id>.err` regardless of exit code.
6. On exit 0 → completes the task. On non-zero → blocks the task with the first 500 chars of stderr as `result` so the orchestrator can show the user what went wrong without spilling a full transcript.

**Fallback semantics (missing binary).** The tool errors hard when `engine.command` is not on `PATH`. The auto-downgrade-to-`claude` happens **upstream in `/buddy`'s preview gate**, not in this tool: `/buddy` probes each engine via `Bun.which(<command>)` before rendering / re-rendering the plan and rewrites missing-engine cells to `claude (fallback)` so the user approves the actual routing. By the time `dispatch_engine` is called, the engine is expected to exist; a hard failure here means the binary disappeared between preview and dispatch.

**Env-gate.** Calling this tool with `DEV_TEAM_MULTI_ENGINE` unset (or any value other than `1`) throws immediately with a flag-required message. This keeps the alpha surface invisible to users who haven't opted in.

## Task lifecycle

Each agent's own `## Workflow` follows this shape:

1. **Pull.** `get_task(id)` — read `description`, `dependsOn` results, any prior context.
2. **Claim.** `update_task({id, status: "in_progress"})`.
3. **Work.** Do the thing. Read files, run tests, write artifacts. Keep narration in the task, not in chat.
4. **Hand off (if needed).** `create_task({agent: <next>, title, description, dependsOn: [current_id]})`. Chain terminates at `github-manager` for anything code-related.
5. **Complete.** `complete_task({id, result: "<short summary ≤ 500 chars>", artifacts: [...]})`. `result` is the one-screen answer; artifacts are pointers, not payloads.

## Status enum

| Status | Meaning | Set by |
|---|---|---|
| `pending` | Created, not yet claimed | `create_task` default |
| `in_progress` | Agent is actively working | `update_task` on claim |
| `blocked` | Agent needs input; `result` carries the question | `update_task` when input is needed |
| `completed` | Done, `result` + artifacts recorded | `complete_task` |
| `cancelled` | Abandoned; `result` explains why | `update_task` |

## Task `description` template

Every `create_task` description should fit this shape so the receiving agent can start without re-reading the chat:

```
<1-line outcome>

Source / context:
- <link or file path: PRD, design, prior task id, spec section>

Acceptance:
- <bullet list of concrete done criteria>

Hand-off:
- On completion, create a task targeted at <next agent> with dependsOn: [<this task id>]. (Or: "This is the last step — no hand-off.")
```

## `result` + `artifacts` conventions

- `result` (≤ 500 chars): one-screen answer. Metric deltas, PR URL, pass/fail counts, key decision. Never a transcript.
- `artifacts[]`: pointers only. Each item is `{kind: "file" | "url" | "note", path: string}`. Large outputs go into files in the repo; link them here.

## Hand-off matrix (abbreviated)

Full matrix in `commands/buddy.md`. Common hand-offs:

| From | Typical next | Why |
|---|---|---|
| `product-manager` | `system-architect` | PRD → design |
| `system-architect` | `backend-developer` / `frontend-developer` / `database-admin` | design → impl |
| `cloud-architect` | `devops-engineer` | plan → execute |
| any dev role | `qa-tester` | impl → regression |
| `security-analyst` / `pentester` | originating dev role | findings → fix (review-only agents never self-fix) |
| any | `github-manager` | terminal step — commit + PR |

## Never do

- Do not `complete_task` with unmet `dependsOn`. The server throws; you will break the chain.
- Do not stuff transcripts into `result` or `description`. Those fields are capped on purpose. Artifacts are the escape hatch.
- Do not mutate `.dev-team/tasks.json` directly. Always go through the MCP tools.
- Do not dispatch a subagent from inside another agent — that is `/buddy`'s job. If you need more work done, `create_task` and return.
- `/buddy` only calls `create_task` **after** the user approves the dispatch plan preview. No tasks are created during the parse / plan phase.

## Where to look

- MCP source: `mcp/task-tracker/src/` (types, tools, atomic store)
- Routing matrix: `commands/buddy.md`
- State on disk: `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json`
- Spec §6 (JSON schema), §5.5 (knowledge tiers): `specs/plugin-pivot.md`
