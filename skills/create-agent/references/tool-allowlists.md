# Tool allowlists — per-agent matrix

Reference for the `create-agent` skill. Mirrors `specs/plugin-pivot.md` §5.4 verbatim. Single source of truth for what each agent may invoke.

## Principle

**Default-deny, grant only what the role needs.** Every agent's `tools:` frontmatter is explicit. Never `*`, never inherited, never "all tools".

## Universal tools (every agent gets these)

- `mcp__task-tracker__create_task` / `list_tasks` / `get_task` / `update_task` / `complete_task` — every agent reports progress via `task-tracker`.
- `Skill` — every agent may invoke plugin-shipped skills (`CodingStandards`, `TddWorkflow`, `create-agent`, etc.). Not listed per-row below; assume present.

Note: spec §5.4 does not currently list the `Skill` tool column. The pilot (`agents/backend-developer.md`) includes `Skill` in its `tools:` list. Treat `Skill` as universal; flag to the spec maintainer for explicit inclusion in the matrix.

## Per-agent matrix

| Agent | Read | Grep | Glob | Write | Edit | Bash | Rationale |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| `backend-developer` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Full implement→test→verify loop for server code |
| `frontend-developer` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Full dev loop for UI; Bash for `bun dev`, builds |
| `database-admin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Migrations, schema, query tuning; Bash for CLI tools |
| `devops-engineer` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Broad Bash for CI, containers, deploy automation |
| `cloud-architect` | ✓ | ✓ | ✓ | ✓ | — | — | Design-only — writes docs/IaC plans, no execution |
| `system-architect` | ✓ | ✓ | ✓ | ✓ | — | — | Design-only — writes specs/diagrams, no execution |
| `qa-tester` | ✓ | ✓ | ✓ | — | ✓ | ✓ | Edits existing tests, runs suites; no new-file authorship of prod code |
| `security-analyst` | ✓ | ✓ | ✓ | — | — | ✓ | **Review-only** — no Write/Edit; Bash for scanners (semgrep, trivy) |
| `pentaster` | ✓ | ✓ | ✓ | — | — | ✓ | **Review-only** — no Write/Edit; Bash for offensive tooling |
| `ml-engineer` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Full dev loop for model/data code |
| `ui-ux-designer` | ✓ | ✓ | ✓ | ✓ | ✓ | — | Static artefacts (Figma exports, SVGs, MD docs); no execution |
| `github-manager` | ✓ | ✓ | ✓ | — | — | ✓ | `gh` CLI via Bash; never directly edits source — goes through PRs |
| `product-manager` | ✓ | ✓ | ✓ | ✓ | — | — | Specs, PRDs, roadmaps only; no code or execution |
| `agent-builder` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Scaffolds agents; invokes `create-agent` skill whose procedures require Bash to run `scripts/port-agent.ts` and `scripts/verify-agents.ts`. **Spec §5.4 correction:** row originally listed Bash=—; the skill's Port and Validate procedures need it. |

## Review-only agents (hard rule)

`security-analyst` and `pentaster` **must not** have `Write` or `Edit` in their allowlist. When they identify a fix, they hand off to an agent with the right allowlist via `create_task(agent: <target>)`.

When `verify-agents.ts` is extended with a per-agent allowlist check, it should hard-fail if these two slugs declare `Write` or `Edit`.

## Escalation pattern

When a restricted agent needs more access:

1. The restricted agent creates a follow-on task (`create_task`) targeted at an agent with the right allowlist.
2. `/buddy` routes the new task accordingly.
3. **Never** temporarily expand the restricted agent's `tools:` list — security boundary is not negotiable.

Example: `security-analyst` finds a SQL injection in `backend-developer`'s code → creates task "Fix SQL injection in `src/queries.ts:42`" → targets `backend-developer` → completes own task with the finding.

## Applying the matrix

During the Create or Port procedure, after picking the slug:

1. Look up the row in the matrix above.
2. Translate to the frontmatter `tools:` line. Example for `backend-developer`:
   ```yaml
   tools: Read, Grep, Glob, Write, Edit, Bash, Skill
   ```
3. In the agent body's `## Tools` section, add one bullet per tool stating why the role has it.

## When this matrix changes

`specs/plugin-pivot.md` §5.4 is the parent spec. When it changes:

1. Update this file to match.
2. Run the Update procedure in `SKILL.md` to sweep `agents/`.
3. Re-run `bun ../../scripts/verify-agents.ts` to confirm every agent's `tools:` line matches its row.
