# task-tracker MCP

The `task-tracker` MCP is the only inter-agent coordination channel in the plugin. `/buddy` creates tasks, each specialist agent claims its task, works, and hands off via new tasks with `dependsOn` wiring. State is plain JSON on disk.

Full protocol: [../knowledge/task-tracker-api.md](../knowledge/task-tracker-api.md).

## State

- Path: `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` — one file per workspace.
- Format: JSON array of task rows.
- Writes: atomic (`fs.rename`, with a cross-device fallback for cloud-synced filesystems).
- Auto-gitignore: on first save the MCP walks up to the nearest `.git` and appends `.dev-team/` to `.gitignore`. Idempotent, silent, and a no-op outside a git repo.

Never edit `tasks.json` by hand. Go through the MCP tools.

## Five tools

Tools are exposed under the namespace `mcp__task-tracker__<tool>`.

### create_task

Creates a new task in `pending`. Returns `{ id, status }`.

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `agent` | string (≤ 64) | yes | Must match a slug under `agents/`. |
| `title` | string (≤ 200) | yes | One-line outcome. |
| `description` | string (≤ 1000) | no | Context, acceptance, hand-off. See template in the protocol doc. |
| `dependsOn` | `string[]` | no | Task ids that must be `completed` first. Unknown ids throw. |
| `tags` | `string[]` | no | Free-form labels. |

### list_tasks

Returns a summary array. Row shape: `{ id, agent, title, status, updatedAt }`. Filters: `status`, `agent`, `limit` (≤ 500).

### get_task

Full row by id — use this when summary fields are not enough (reading `description`, `result`, `artifacts`, current `dependsOn`).

### update_task

Partial update. At minimum the `id`; any subset of `{ status, description, result, artifacts }` may accompany it.

- `status: "in_progress"` stamps `startedAt` (first time only).
- `status: "completed"` stamps `completedAt` and enforces every id in `dependsOn` is already `completed`. Unmet deps throw.
- `status: "blocked"` is the escape hatch when an agent needs more input — put the question in `result`.

### complete_task

Convenience wrapper for `update_task({ status: "completed", ... })`. Optional `result` (≤ 500 chars) and `artifacts`.

## Status enum

| Status | Meaning | Set by |
|---|---|---|
| `pending` | Created, not yet claimed. | `create_task` default |
| `in_progress` | Agent is actively working. | `update_task` on claim |
| `blocked` | Agent needs input; `result` carries the question. | `update_task` when input is needed |
| `completed` | Done; `result` + artifacts recorded. | `complete_task` |
| `cancelled` | Abandoned; `result` explains why. | `update_task` |

## Lifecycle

Every agent's own `## Workflow` section follows this five-step shape:

1. **Pull** — `get_task(id)` to read description, dependsOn results, prior context.
2. **Claim** — `update_task({ id, status: "in_progress" })`.
3. **Work** — read files, run tests, write artifacts. Keep narration inside task fields, not in chat.
4. **Hand off (if needed)** — `create_task({ agent: <next>, dependsOn: [current_id], ... })`. Code-producing chains terminate at `github-manager`.
5. **Complete** — `complete_task({ id, result, artifacts })`. `result` ≤ 500 chars; artifacts are pointers, not payloads.

## Artifact convention

`artifacts[]` is pointers, not content. Each item is `{ kind: "file" | "url" | "note", path: string }`. Large outputs live in repo files — link to them.

## What the MCP will not do

- Not a queue or scheduler — `/buddy` dispatches subagents via the `Task` tool; the MCP only tracks state.
- Not a cross-workspace store — one JSON per workspace.
- Not a transcript log — `result` is capped at 500 chars on purpose. Use artifacts for larger output.
- Not directly editable — do not mutate `tasks.json` by hand; always go through the tools.

Full field-by-field reference, examples, and the canonical `description` template: [../knowledge/task-tracker-api.md](../knowledge/task-tracker-api.md).
