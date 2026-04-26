# dev-team

A Claude Code plugin that turns one chat into a 14-agent dev team. One slash command — `/buddy` — parses your request, previews a plan, and dispatches specialist subagents (product, design, build, review, ship) through a built-in `task-tracker` MCP. State lives in `.dev-team/tasks.json` in your repo. No database, no cloud, no external services.

**Status:** v0.2.1 preview. Fixes marketplace discoverability and namespaces the `task-tracker` MCP tool names so `/buddy` can actually reach them. Also in 0.2.x: plan-preview-and-approve gate in `/buddy`, auto-gitignore of `.dev-team/`, and the 14-agent lineup below.

## Why / why not

**Use this when** you want to keep a single feature or bug in one chat but still get separation between product, design, implementation, QA, security, and the PR. `/buddy` does the routing; you stay in one thread and review a plan before anything runs.

**Skip this when** you already have a project-management system you trust, you're doing a one-liner that doesn't need a multi-step DAG, or you need observability beyond a JSON file on disk. There is no dashboard, no queue, no remote runner — just subagents, one MCP, and a file.

## Quickstart

```bash
# 1. Add the marketplace and install (one-time per machine)
claude plugin marketplace add RohiRIK/dev-team
claude plugin install dev-team

# 2. Open any project in Claude Code
/buddy add a /health endpoint that returns {status:"ok"}
```

Expected output — `/buddy` renders a plan table and waits for approval:

```
Planned dispatch for: "add a /health endpoint that returns {status:'ok'}"

| # | Agent              | Task                                       | Depends on |
|---|--------------------|--------------------------------------------|------------|
| 1 | backend-developer  | Add GET /health returning {status:'ok'}    | —          |
| 2 | qa-tester          | Regression test for /health                | 1          |
| 3 | github-manager     | Commit + PR /health                        | 2          |

Routing confidence: high — clear backend endpoint signal.
Security gate: not needed — no auth / input / secret / external-data surface.

Reply "go" to dispatch, or describe changes (swap agents, drop steps, reorder).
```

Reply `go` and `/buddy` creates the tasks, dispatches the agents, and reports back when every task is in a terminal state. Task state is written to `.dev-team/tasks.json`, which is auto-added to `.gitignore` on first write.

### Install from source

```bash
git clone https://github.com/RohiRIK/dev-team.git
cd dev-team
bun install
claude --plugin-dir .
```

## How `/buddy` works

`/buddy` is an orchestrator, not a worker. Every invocation goes through the same gate:

1. **Parse** the request, decide single-agent vs. multi-step DAG using the routing matrix.
2. **Preview** the full plan as a table (as shown above) and stop. No task is created yet.
3. **Approve or revise.** Reply `go` to dispatch. Reply with changes (swap an agent, drop a step, reorder, tighten scope) and `/buddy` re-renders the full plan. Reply `cancel` to abort with no tasks created.
4. **Dispatch** — `create_task` for each step, then `Task` tool invocations in dependency order. Parallel where deps allow.
5. **Watch + close out** — every agent reports via the `task-tracker` MCP. When all tasks are terminal, `/buddy` posts a per-agent summary and a routing-confidence line.

Single-agent requests still show a one-row preview and still wait for approval. The full routing matrix, ambiguity tie-breakers, refusal rules, and three worked examples live in [`commands/buddy.md`](commands/buddy.md).

## What's inside — 14 agents, five lifecycle phases

Each agent ships with a scoped tool allowlist (default-deny) and a canonical 7-section body (Role, When to use, When NOT to use, Workflow, Tools, Constraints, Worked example). Full specs in [`agents/<slug>.md`](agents/).

### Define

| Agent | Focus |
|---|---|
| [`product-manager`](agents/product-manager.md) | PRDs, user stories, roadmaps, prioritisation — specs only, never code. |

### Design

| Agent | Focus |
|---|---|
| [`system-architect`](agents/system-architect.md) | System design, ADRs, C4 diagrams, service decomposition — design-only. |
| [`cloud-architect`](agents/cloud-architect.md) | Cloud topology, region / zone / network choice, IaC plans, cost and HA / DR models — plans, never executes. |
| [`ui-ux-designer`](agents/ui-ux-designer.md) | Flows, wireframes, design-system tokens, accessibility audits, Figma handoff — no runnable code. |

### Build

| Agent | Focus |
|---|---|
| [`backend-developer`](agents/backend-developer.md) | REST / GraphQL APIs, server-side logic, background jobs, Bun migrations — full implement → test → document loop. |
| [`frontend-developer`](agents/frontend-developer.md) | React / Next.js components, pages, client state, Tailwind / CSS, component tests. |
| [`database-admin`](agents/database-admin.md) | Schemas, migrations, index / query tuning, backup / restore, replicas. Owns the data tier. |
| [`ml-engineer`](agents/ml-engineer.md) | Data pipelines, model training / evaluation / deploy, experiment tracking, production drift monitoring. |
| [`devops-engineer`](agents/devops-engineer.md) | Executes cloud-architect plans: CI, container builds, Kubernetes, runtime env, deploy debugging. |

### Review

| Agent | Focus |
|---|---|
| [`qa-tester`](agents/qa-tester.md) | E2E / integration / regression tests, bug-fix verification, flake triage. Edits tests; never writes prod code. |
| [`security-analyst`](agents/security-analyst.md) | Defensive review — OWASP, authz, secret / dep scans, threat models, cloud-posture audit. Review-only, hands off every fix. |
| [`pentester`](agents/pentester.md) | Authorised offensive PoCs — nmap, burp, sqlmap, nuclei. Proves exploitability; hands off every fix. |

### Ship

| Agent | Focus |
|---|---|
| [`github-manager`](agents/github-manager.md) | Commits, branches, PRs, issue hygiene, releases, `gh` CLI. Every dev chain terminates here. |

### Meta

| Agent | Focus |
|---|---|
| [`agent-builder`](agents/agent-builder.md) | Scaffolds, ports, and validates dev-team subagents via the `create-agent` skill. Use to add or refresh agents. |

<!-- BEGIN: gen-prereqs -->

## Prerequisites

Agents are Bash-enabled but do not install CLIs themselves. Install the ones the agents you use actually need — no global install required for the plugin itself.

### Per-agent CLIs

| Agent | CLIs |
|---|---|
| `backend-developer` | `bun`, `bunx`, `uv`, `uvx`, `curl`, `jq` |
| `frontend-developer` | `bun`, `bunx`, `vite`, `playwright` |
| `database-admin` | `psql`, `sqlite3`, `drizzle-kit / prisma` |
| `devops-engineer` | `docker`, `docker-compose`, `kubectl`, `helm`, `gh` |
| `cloud-architect` | `terraform`, `aws`, `gcloud`, `az` |
| `qa-tester` | `playwright`, `vitest`, `bun test`, `pytest` |
| `security-analyst` | `bunx varlock`, `trivy`, `semgrep`, `gitleaks` |
| `pentester` | `nmap`, `nikto`, `ffuf` *(authorised testing only)* |
| `ml-engineer` | `uv`, `python`, `jupyter` |
| `ui-ux-designer` | *no Bash — no CLI deps* |
| `github-manager` | `gh`, `git` |
| `product-manager` | *no Bash — no CLI deps* |
| `agent-builder` | `bun`, `bunx` |
| `system-architect` | *no Bash — no CLI deps* |

### Package-manager preferences

- **Node ecosystem** → `bun` / `bunx` (never `npm`, `npx`, `yarn`, `pnpm`).
- **Python ecosystem** → `uv` / `uvx` (never `pip`, `pipx`, `poetry`).
- **JSON reading** → `jq` (never `python3 -c 'import json...'`).

_This section is generated by `scripts/gen-prereqs.ts`. Edit the script's `PER_AGENT_CLIS` table and re-run to update._

<!-- END: gen-prereqs -->

### Per-engine CLIs (optional, alpha)

`/buddy` can route individual tasks to external CLI engines instead of running them in-session under Claude. Opt-in via `DEV_TEAM_MULTI_ENGINE=1`; with the flag unset, every task runs on `claude` and the engine column is hidden from the plan preview. Install only the engines you actually plan to route to — none are required.

| Engine | CLI | Description | Install hint |
|---|---|---|---|
| `gemini-cli` | `gemini` | Google Gemini CLI — long-context tasks, cheap-token workloads. | `bun add -g @google/gemini-cli` (or follow the upstream repo) |
| `opencode` | `opencode` | OpenCode terminal agent — open-source alternative to Claude Code for local routing. | See [opencode.ai](https://opencode.ai) for the platform-specific binary. |
| `goose` | `goose` | Block's Goose agent — autonomous local-first execution. | `brew install block-goose-cli` (macOS); see [block.github.io/goose](https://block.github.io/goose) for other platforms. |
| `minimax-cli` | `minimax` | MiniMax CLI — alternative model provider. | Follow the MiniMax CLI install instructions. |
| `aider` | `aider` | Aider — pair-programming CLI; supports `--message-file` for headless dispatch. | `pipx install aider-chat` (or `uv tool install aider-chat`). |
| `github-copilot` | `gh copilot` | GitHub Copilot CLI subcommand — best for shell-suggest tasks, experimental for full agent runs. | Install GitHub CLI then `gh extension install github/gh-copilot`. |
| `codex` | `codex` | OpenAI Codex CLI — agentic coding with `codex exec --full-auto`. | See OpenAI's Codex CLI release notes for the install command. |
| `cursor-agent` | `cursor-agent` | Cursor headless agent CLI. | See [cursor.com](https://cursor.com) for the headless agent download. |
| `pi` | `pi` | Pi by Inflection — conversational; less suited to coding agents. Included for completeness. | Follow the upstream `pi` CLI install instructions. |

When an engine's binary is missing on `PATH` at preview time, `/buddy` rewrites the row to `claude (fallback)` so you approve the actual routing — the dispatch never silently swaps engines after `go`. The registry is at [`state/engines.json`](state/engines.json); to add a new engine, add a row there and rerun `bun scripts/verify-agents.ts`. Per-agent allowlists live in each agent's `engines:` frontmatter.

**Check what's installed:** run `bun scripts/engines-doctor.ts` to probe each engine's binary via `PATH` and print a one-line status per row. Add `--json` for machine-readable output. Exits non-zero only when no engine resolves at all.

_The Per-engine CLIs table is hand-edited; `scripts/gen-prereqs.ts` only owns the per-agent block above. Update this table when the registry changes._


## State

Task state lives at `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` — one JSON file per workspace. The `task-tracker` MCP reads and writes atomically (`fs.rename` with a cross-device fallback for network / cloud-synced filesystems). No database server, no cloud call.

On first task save, the MCP adds `.dev-team/` to the repo's `.gitignore` — idempotent and silent, only when the workspace is inside a git repo. Outside a git repo (e.g. `/tmp`), nothing is written to `.gitignore` and state still persists normally.

## Troubleshooting

### `/buddy` doesn't appear in the slash-command list

The plugin registered but commands aren't visible yet. In Claude Code, run:

```
/reload-plugins
```

Then type `/` — `/buddy` should appear. If it still doesn't, confirm the install with `/plugin list` and reinstall: `claude plugin uninstall dev-team && claude plugin install dev-team`.

### `/plugin update` hangs or returns "already up to date" but you're still on an older version

Versions older than 0.2.1 shipped a non-canonical `source` field in the marketplace manifest that prevented `/plugin update` from resolving. Fix:

```bash
claude plugin marketplace remove RohiRIK/dev-team
claude plugin marketplace add RohiRIK/dev-team
claude plugin install dev-team
```

This re-hydrates the marketplace entry against 0.2.1+ and future `/plugin update` calls will work normally.

### Uninstall

```bash
claude plugin uninstall dev-team
claude plugin marketplace remove RohiRIK/dev-team   # optional — removes the marketplace registration too
```

Task state in `.dev-team/tasks.json` is per-workspace and not touched by uninstall. Delete it manually if you want a clean slate.

## Docs

- [`docs/architecture.md`](docs/architecture.md) — how `/buddy`, the `task-tracker` MCP, and the agents wire together.
- [`docs/agents.md`](docs/agents.md) — full agent specs, tool allowlists, and the canonical 7-section shape.
- [`docs/task-tracker.md`](docs/task-tracker.md) — MCP tool reference (`create_task`, `update_task`, `complete_task`, `list_tasks`, `get_task`).
- [`docs/development.md`](docs/development.md) — local dev, verify scripts, release process.

## Limitations (v0.2.x)

- **Single session per workspace.** Concurrent `/buddy` runs in the same workspace can race; keep it to one at a time.
- **Routing is keyword-based**, not model-driven. Weak matches are flagged as low-confidence in the plan preview; feedback is captured in `state/routing-feedback.jsonl`.
- **No built-in observability UI.** Read `.dev-team/tasks.json` directly, or ask `/buddy` for a status summary.
- **Only the `task-tracker` MCP ships.** Agents can use any user-registered MCPs, but the plugin itself depends on just the bundled server.

## Development

```bash
bun install                              # dependencies
bun scripts/verify-agents.ts             # lint agents (strict — fails on TODO markers)
bun scripts/verify-agents.ts --skills    # lint skills
bun test                                 # run task-tracker MCP tests
bun scripts/gen-prereqs.ts               # regenerate the Prerequisites block
bun scripts/gen-prereqs.ts --check       # fail CI if the README block drifted
```

Canonical agent shape: [`skills/create-agent/references/agent-structure.md`](skills/create-agent/references/agent-structure.md).

## License

MIT — see [`LICENSE`](LICENSE).
