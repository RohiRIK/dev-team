# task-tracker MCP — protocol reference

Shared protocol doc. Every agent in `agents/` cites this file from its `## Workflow`. The MCP server is bundled in the plugin at `mcp/task-tracker/` and registered via `.mcp.json`.

## Scope

The `task-tracker` MCP is the only inter-agent coordination channel in the plugin. `/buddy` creates tasks, each specialist agent picks up its task, marks progress, and hands off via new tasks with `dependsOn` wiring.

State persists to `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` — one plain JSON file per workspace. No database, no cloud call. Atomic writes via `fs.rename` with a cross-device fallback for cloud-synced filesystems.

## Tool catalogue

Five tools. Use the fully-qualified name `mcp__task-tracker__<tool>` from agent / command code.

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
