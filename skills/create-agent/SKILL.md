---
name: create-agent
description: This skill should be used when the user asks to "create a new dev-team agent", "scaffold a subagent", "port a Gemini/Cursor/Cline agent", "canonicalize an agent", or "validate the agents folder". Owns the full lifecycle — generate, research, validate, and update dev-team subagents to match the plugin's 7-section spec, tool allowlist, and task-tracker integration.
---

# create-agent

Owns the full lifecycle of a dev-team subagent. Five procedures: **Create**, **Port**, **Research**, **Validate**, **Update** — each ends by invoking Validate so the loop is always closed.

## When this skill applies

Trigger on any of:

- "create a new dev-team agent for `<domain>`"
- "scaffold a `<role>` subagent"
- "port the `<slug>` agent from Gemini / Cursor / Cline"
- "canonicalize `agents/<slug>.md`"
- "validate the agents folder"
- "the canonical structure changed — update all agents"

Do **not** trigger for: editing `.claude-plugin/plugin.json`, generating MCP servers, generating non-agent skills, authoring slash commands.

## Anatomy of a dev-team agent

Every agent file under `agents/<slug>.md` must satisfy:

1. **YAML frontmatter** — required keys: `name`, `description`, `tools`. Recommended: `model: inherit`.
2. **7 canonical sections** (verbatim headings, in order): `Role`, `When to use`, `When NOT to use (Boundaries)`, `Workflow`, `Tools`, `Constraints`, `Worked example`.
3. **Body ≤ 200 lines.** Overflow goes to `knowledge/<slug>-refs.md`.
4. **Default-deny tool allowlist** per spec §5.4. Review-only agents (`security-analyst`, `pentester`) must not have `Write` or `Edit`.
5. **No absolute home paths** — macOS `/U⁠sers/`, Linux `/h⁠ome/`, or Windows `C:\U⁠sers\` patterns are forbidden. Use `~` or relative paths.
6. **No Gemini residue** — no `UFC Hydration`, no `execute_agent`, no `.gemini/` references.

Full structural detail: `references/agent-structure.md`.

## Procedures

### Create — new agent from scratch

Use when no source agent exists. Steps:

1. Pick the slug (kebab-case matching one of the 13 in spec §5.1, or a new slug if extending).
2. Read `references/agent-structure.md` and `references/tool-allowlists.md` to determine the allowlist.
3. Run Research procedure if domain knowledge is needed.
4. Author `agents/<slug>.md` with the 7 canonical sections. Reference shared docs by relative path: `knowledge/coding-standards.md`, `knowledge/task-tracker-api.md`, etc.
5. Read `references/integration.md` and weave the task-tracker MCP protocol into the Workflow section (`get_task` → `update_task(in_progress)` → work → `complete_task`).
6. Run Validate. Fix findings. Repeat until strict-pass.

**Reference output:** `examples/backend-developer.md` is the canonical pilot — follow its shape.

### Port — from external source

Use when porting from `.gemini/agents/<slug>/`, Cursor rules, Cline modes, or any other external agent format.

1. Run the port script:
   ```bash
   bun ../../scripts/port-agent.ts <slug>
   ```
   This emits `agents/<slug>.md` with `TODO(author):` markers in sections that need human judgment.
2. Resolve every `TODO(author):` marker using `references/agent-structure.md`, `references/tool-allowlists.md`, and `references/integration.md`.
3. Strip any external-tool residue the script missed (Gemini emoji sirens, `UFC Hydration`, etc. are already filtered, but check for new patterns).
4. Run Validate. Fix findings.

The port script lives at `scripts/port-agent.ts` (repo root). Sources read from `.gemini/agents/<slug>/agent.{json,md}`.

### Research — gather domain refs

Use when the agent's domain is unfamiliar or when external library APIs are involved.

Procedure (full detail in `references/research.md`):

1. Grep the codebase first — existing patterns trump invented ones.
2. For external library APIs: prepend `use context7` to any code you intend to write. Library APIs change; training data is stale.
3. For general domain knowledge: use `WebSearch` (current) or `WebFetch` (specific URL).
4. Land the gathered refs:
   - **≤ 30 lines** → inline in the agent body's `Workflow` or `Tools` section.
   - **> 30 lines or cross-cutting** → extract to `knowledge/<slug>-refs.md` and link from the agent body.

### Validate — lint the agents folder

Run after every Create, Port, or Update. This is the gate.

```bash
# Lint one agent (strict — no TODO markers allowed)
bun ../../scripts/verify-agents.ts <slug>

# Lint everything
bun ../../scripts/verify-agents.ts

# Pilot-stage only: allow TODO(author) markers
bun ../../scripts/verify-agents.ts <slug> --allow-todo

# Lint skills (frontmatter + residue paths only)
bun ../../scripts/verify-agents.ts --skills
```

Linter checks: YAML frontmatter (`name`, `description`, `tools`), 7 canonical sections, ≤ 200-line body, no absolute home paths, no `TODO(author)` markers (unless `--allow-todo`).

Exit 0 = pass. Any non-zero exit means findings printed to stderr — read them and route back to Create or Update.

### Update — sweep when canonical changes

Use when `references/agent-structure.md`, `references/tool-allowlists.md`, or `references/integration.md` is edited (because spec §5.4–§5.6 changed).

1. Edit the affected reference doc inside this skill **first** — it is the single source of truth.
2. For each affected agent in `agents/`: re-read the agent body, apply the change, re-run Validate.
3. If a change touches all agents (e.g. allowlist matrix shape), batch-edit then run `bun ../../scripts/verify-agents.ts` once.
4. Commit per agent or per coherent batch — never one giant sweep that's hard to review.

## Tool wiring

This skill does not introduce new tools. It composes:

| Tool | Used by | Notes |
|---|---|---|
| `bun ../../scripts/port-agent.ts` | Port | Reads `.gemini/agents/<slug>/`, emits skeleton |
| `bun ../../scripts/verify-agents.ts` | Validate | Lints frontmatter, sections, line cap, residue |
| `context7` MCP | Research | Authoritative library APIs |
| `WebSearch` / `WebFetch` | Research | General + specific URL |
| `Read` / `Grep` / `Glob` | All | Explore before edit |
| `Edit` / `Write` | Create, Update | Author the agent file |

The calling agent (`agent-builder`) needs at minimum: `Read, Write, Edit, Bash, Grep, Glob, Skill, WebSearch` per spec §5.4.

## Integration with shared system

- **task-tracker MCP** — invoke from inside an `agent-builder` task. The agent calls `update_task(in_progress)` before this skill, `complete_task` after.
- **`/buddy` routing** — `/buddy "build me a <X> agent"` routes to `agent-builder`, which invokes this skill.
- **Hand-off** — completing an agent file rarely requires a commit on its own. If commit/PR is needed, create a follow-on task targeted at `github-manager` via `create_task`.

Full protocol: `references/integration.md`.

## Validation checklist

Before marking any procedure complete:

- [ ] Frontmatter has `name`, `description`, `tools`
- [ ] All 7 canonical sections present, in order, headings verbatim
- [ ] Body ≤ 200 lines
- [ ] Tool allowlist matches `references/tool-allowlists.md` for the slug
- [ ] No absolute home paths anywhere in the file
- [ ] References to shared docs use relative paths (`knowledge/...`)
- [ ] `bun ../../scripts/verify-agents.ts <slug>` exits 0 (strict, no `--allow-todo`)

If any check fails, route back to Create or Update — do not mark the task complete.

## Reference files

- **`references/agent-structure.md`** — canonical 7 sections, frontmatter contract, 200-line cap, default-deny tools
- **`references/tool-allowlists.md`** — per-agent allowlist matrix mirroring spec §5.4 (single source of truth for what each agent may use)
- **`references/integration.md`** — task-tracker MCP protocol, `/buddy` routing, knowledge tiers (§5.5), `github-manager` hand-off
- **`references/research.md`** — when to use `context7` / `WebSearch` / repo grep, where gathered refs land

## Examples

- **`examples/backend-developer.md`** — the canonical pilot agent. Strict-verify passes. Use it as the shape reference for any new agent.

## Self-update rule

This skill is the single source of truth for "how to author a dev-team agent." When the parent spec (`specs/plugin-pivot.md`) §5.4, §5.5, or §5.6 changes:

1. Update the matching reference doc inside this skill **first**.
2. Run the Update procedure to sweep `agents/`.
3. Re-validate.

Never let the spec drift ahead of this skill. The skill ships with the plugin; users extending the plugin rely on it as documentation of the canonical shape.
