# `knowledge/` — shared plugin docs

Cross-cutting reference material that two or more agents load on demand via `Read`. Kept out of individual agent bodies so their system prompts stay under the ~200-line cap.

## The three tiers (spec §5.5)

| Tier | Location | Loaded | Purpose |
|------|----------|--------|---------|
| 1. Agent body | `agents/<slug>.md` | Always (system prompt) | Role, workflow, boundaries, one worked example |
| 2. **Shared plugin docs** | **`knowledge/*.md`** | On demand via `Read` | Cross-cutting: coding standards, git conventions, task-tracker API |
| 3. Project knowledge | User workspace | On demand via `Read` / `Grep` / `Glob` | The actual codebase — where most knowledge lives |

Subagents get a fresh context per invocation. Auto-injecting knowledge on every call wastes tokens; agents `Read` the file they need when they need it.

## What lives here

The stubs are filled in by **T-27** (plan: `plans/plugin-pivot.md`):

| File | Used by | Purpose |
|------|---------|---------|
| `coding-standards.md` | backend-developer, frontend-developer, ml-engineer, database-admin, devops-engineer | Shared language rules (immutability, no `any`, explicit return types, input validation) — supplements the `CodingStandards` skill |
| `git-conventions.md` | github-manager, all dev agents | Conventional-commits format, PR-body shape, staging rules |
| `task-tracker-api.md` | **Every agent** | Protocol for the 5 task-tracker MCP tools (`create_task` / `list_tasks` / `get_task` / `update_task` / `complete_task`) — schemas, status lifecycle, hand-off conventions |

## Migration log — `.gemini/agents/*/knowledge/*.md`

Original Gemini bundle shipped ~70 knowledge files across 26 agents. Migration decisions, per spec §5.5 migration rule:

1. **Short, agent-specific snippets** → inlined into the relevant agent body during T-17 hand-rewrite. No separate file survives.
2. **Cross-cutting (used by 2+ agents)** → represented here via the T-27 stubs above. The three files chosen cover every current inter-agent reference in `agents/*.md`.
3. **Gemini-specific** → deleted in **T-29/30/31** (Phase 6). Includes all of:
   - `_shared/knowledge/agent-management.md`
   - `_shared/knowledge/mandatory-{documentation,error-recovery,inter-agent-communication,quality-gates,research-caching,task-estimation,testing-requirements}.md`
   - `_shared/knowledge/mcp-servers.md`, `multi-agent-integration.md`, `system-architecture.md`, `task-summary-documentation.md`, `shared-context-hub.md`, `shared-context-quickref.md`, `tool-usage.md`, `quick-reference.md`
   - Per-agent `.gemini/agents/<slug>/knowledge/*.md` directories wholesale — the canonical 7-section body plus Claude Code's native tool docs cover what those files tried to prescribe.

## Adding a new knowledge file

Gate in PR review (spec §5.7):
- **Agent-specific** → inline into that agent's body instead.
- **Cross-cutting (2+ agents will `Read` it)** → add here, reference from each consuming agent's `## Workflow`.
- **Would bust the agent 200-line cap if inlined** → move here regardless.

Every entry here is cited by relative path from at least one agent body. If it's not cited, it doesn't belong here — delete it.
