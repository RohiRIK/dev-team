# create-agent skill

`create-agent` owns the full lifecycle of a dev-team subagent. It is the single source of truth for "how to author a dev-team agent" — shape, tool allowlist, task-tracker integration, validation.

Full skill: [../skills/create-agent/SKILL.md](../skills/create-agent/SKILL.md).

## When the skill applies

Trigger on any of:

- "create a new dev-team agent for `<domain>`"
- "scaffold a `<role>` subagent"
- "port the `<slug>` agent from Gemini / Cursor / Cline"
- "canonicalize `agents/<slug>.md`"
- "validate the agents folder"
- "the canonical structure changed — update all agents"

It is invoked from inside the `agent-builder` agent. `/buddy` routes "create / port / scaffold / validate an agent" requests to `agent-builder`, which runs the skill.

## Canonical agent shape

Every file under `../agents/<slug>.md` must satisfy:

1. **YAML frontmatter** — `name`, `description`, `tools`. Recommended `model: inherit`.
2. **7 canonical sections** (verbatim, in order): `Role`, `When to use`, `When NOT to use (Boundaries)`, `Workflow`, `Tools`, `Constraints`, `Worked example`.
3. **Body ≤ 200 lines.** Overflow goes to `knowledge/<slug>-refs.md`.
4. **Default-deny tool allowlist.** Review-only agents have no `Write` / `Edit`. Design-only agents have no `Bash`.
5. **No absolute home paths** — macOS Users, Linux home, and Windows Users prefixes are forbidden. Use `~` or relative paths.
6. **No residue** — no Gemini / Cursor / Cline preambles, no stale MCP references.

## The five procedures

### Create — new agent from scratch

Use when no source agent exists. Pick a slug, read the skill's `references/agent-structure.md` and `references/tool-allowlists.md`, run Research if the domain is unfamiliar, author the 7 sections, weave in the task-tracker protocol from `references/integration.md`, then run Validate until strict-pass.

### Port — from external source

Use when porting from `.gemini/agents/<slug>/` or another external format. Runs `scripts/port-agent.ts <slug>` to emit a skeleton with `TODO(author):` markers, then human-authors every TODO, strips residue, and runs Validate.

### Research — gather domain refs

Use when the domain is unfamiliar or external library APIs are involved. Grep the codebase first (existing patterns trump invented ones). For external libraries, prepend `use context7` to any code you intend to write — library APIs change; training data is stale. Refs ≤ 30 lines inline in the agent body; larger or cross-cutting refs land in `knowledge/<slug>-refs.md`.

### Validate — lint the agents folder

The gate for every Create / Port / Update. Run:

```bash
bun ../../scripts/verify-agents.ts <slug>           # strict — no TODO markers
bun ../../scripts/verify-agents.ts                  # lint all agents
bun ../../scripts/verify-agents.ts <slug> --allow-todo   # pilot stage
bun ../../scripts/verify-agents.ts --skills         # lint skills
```

Checks: frontmatter (`name`, `description`, `tools`), 7 canonical sections, ≤ 200-line body, no absolute home paths, no `TODO(author)` markers (unless `--allow-todo`). Exit 0 = pass; non-zero means findings on stderr.

### Update — sweep when canonical changes

Use when `references/agent-structure.md`, `references/tool-allowlists.md`, or `references/integration.md` is edited. Update the reference doc first (it is the source of truth), then for each affected agent re-apply the change and re-run Validate. Commit per agent or per coherent batch.

## Reference files

Inside the skill:

- `references/agent-structure.md` — 7 sections, frontmatter contract, 200-line cap, default-deny tools.
- `references/tool-allowlists.md` — per-agent allowlist matrix (mirrors spec §5.4).
- `references/integration.md` — task-tracker protocol, `/buddy` routing, knowledge tiers, `github-manager` hand-off.
- `references/research.md` — when to use `context7` / `WebSearch` / repo grep; where refs land.

## Example

`examples/backend-developer.md` is the canonical pilot. Strict-verify passes. Use it as the shape reference for any new agent.

## Self-update rule

When the parent spec (`specs/plugin-pivot.md`) §5.4 / §5.5 / §5.6 changes:

1. Update the matching reference doc inside the skill first.
2. Run the Update procedure to sweep `agents/`.
3. Re-validate.

Never let the spec drift ahead of the skill. See [../skills/create-agent/SKILL.md](../skills/create-agent/SKILL.md) for the full procedure text, validation checklist, and worked examples.
