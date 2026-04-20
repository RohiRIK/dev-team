# Integration — task-tracker, /buddy, knowledge tiers, hand-off

Reference for the `create-agent` skill. Describes how a new or ported agent plugs into the shared system.

## task-tracker MCP protocol

Every agent coordinates work through the `task-tracker` MCP server (registered in `.mcp.json`, persists to `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json`). Full tool schemas: `knowledge/task-tracker-api.md`.

### The five tools

| Tool | Purpose | Called when |
|---|---|---|
| `create_task` | Create new task with `{agent, title, description?, dependsOn?, tags?}`. Returns `{id, status: "pending"}` | `/buddy` creates initial tasks; agents create follow-on tasks (commit, review, deploy) |
| `list_tasks` | List with filters `{status?, agent?, limit?}`. Returns summary rows only (`id, agent, title, status, updatedAt`) | Agent scans for adjacent work; `/buddy` shows queue |
| `get_task` | Full row for one id. Returns all fields including `description`, `result`, `artifacts`, `dependsOn` | Agent reads its assignment; reads `dependsOn` outputs before starting |
| `update_task` | Update `{status?, description?, result?, artifacts?}`. Bumps `updatedAt` | Agent marks `in_progress`; asks questions by updating `description` and waiting |
| `complete_task` | Mark `status: "completed"`, record `result` and `artifacts`. Sets `completedAt` | Agent finishes work |

### Agent lifecycle (every agent follows this)

1. **Pull** — `get_task(id)` with the assigned id. Read any `dependsOn` task results so prior work isn't redone.
2. **Claim** — `update_task({id, status: "in_progress"})` so other agents see ownership.
3. **Work** — execute the role-specific workflow. If acceptance criteria are ambiguous, `update_task` with the question in `description` and wait. Never guess requirements.
4. **Complete** — `complete_task({id, result, artifacts})`.
5. **Hand off** — if follow-on work is needed, `create_task({agent, title, dependsOn: [id]})`.

Agents that skip step 2 or step 4 break the orchestrator's visibility into the queue. Silent finishes are treated as bugs.

## /buddy routing

`/buddy <problem>` is the user-facing entry point. It:

1. Parses the problem.
2. Decomposes into 1+ tasks.
3. Picks the right agent slug per the routing matrix (draft in Phase 4 / T-22).
4. Creates tasks via `create_task`.
5. Dispatches the first agent.

Agents do not call `/buddy` directly. They coordinate via `task-tracker` — `/buddy` polls `list_tasks` to know what to dispatch next.

### Creating a `/buddy`-routable task

When a new agent is authored, its `## When to use` section becomes input to the routing matrix. Phrase triggers as problems the user says, not as internal labels:

- ✓ "Implement a new HTTP endpoint"
- ✗ "Backend implementation tasks"

The stronger the trigger language, the better `/buddy` routes.

## Knowledge tiers (§5.5)

Where knowledge lives:

| Tier | Location | Loaded how | Examples |
|---|---|---|---|
| 1. Agent body | `agents/<slug>.md` | Always (system prompt) | Role, workflow, constraints — max ~200 lines |
| 2. Shared plugin docs | `knowledge/*.md` (plugin root) | On demand via `Read` | `coding-standards.md`, `task-tracker-api.md`, `git-conventions.md` |
| 3. Project knowledge | User's workspace | On demand via `Read`/`Grep`/`Glob` | The actual codebase |

**Why no auto-inject:** Claude subagents get a fresh context per invocation. Injecting 8 knowledge files every call wastes tokens. On-demand retrieval keeps context small.

**Placement rules:**

- Short, agent-specific (< 30 lines) → inline in agent body.
- Cross-cutting, used by ≥ 2 agents → `knowledge/<topic>.md` at plugin root.
- Agent-specific but long (> 30 lines) → `knowledge/<slug>-refs.md` at plugin root.
- Gemini-specific or obsolete → delete.

Reference from the agent body by relative path: *"Consult `knowledge/coding-standards.md` before writing code."*

## Hand-off pattern

Agents are scoped. When work crosses a boundary, hand off by creating a follow-on task.

### Common hand-offs

| Completing agent | Needs | Hand-off target |
|---|---|---|
| `backend-developer` | Commit + PR for shipped code | `github-manager` |
| `frontend-developer` | Commit + PR for shipped UI | `github-manager` |
| `database-admin` | Migration review before apply | `security-analyst` |
| `security-analyst` | Fix for identified vulnerability | `backend-developer` / `frontend-developer` (depending on layer) |
| `qa-tester` | Missing test coverage in prod code | `backend-developer` / `frontend-developer` |
| `product-manager` | Implementation of new spec | `system-architect` or a dev role |
| Any agent | Publish release | `devops-engineer` → `github-manager` |

### Hand-off mechanics

At the end of the work, before `complete_task`:

```
create_task({
  agent: "github-manager",
  title: "Commit & PR /health endpoint",
  description: "Commit the files in artifacts[] and open a PR against main.",
  dependsOn: [<current_task_id>],
  tags: ["commit", "pr"]
})
```

Then `complete_task` the current task. The follow-on task sits in `pending` until `/buddy` or the target agent picks it up.

### Never do

- Never do a sibling's job because it's "just one commit." `backend-developer` writing a commit violates the boundary and the orchestrator loses visibility.
- Never temporarily expand a review-only agent's allowlist. Hand off instead.
- Never skip `dependsOn` on a follow-on — the target agent reads it to get context.

## Applying integration in the Workflow section

When authoring an agent's `## Workflow` section, weave these three protocols in:

1. **Pull + Claim** in steps 1–2 (always).
2. **Domain workflow** in the middle steps (role-specific).
3. **Complete + Hand off** in the last 1–2 steps (always).

The pilot `agents/backend-developer.md` demonstrates this shape — use it as a template.

## When this contract changes

Parent spec: `specs/plugin-pivot.md` §5.5, §5.7, §10. Update this file first when those sections change, then run the Update procedure in `SKILL.md`.
