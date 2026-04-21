# Contributing

This page covers three common contribution paths: adding an agent, running tests, and cutting a release. For the canonical agent shape, read [create-agent.md](./create-agent.md) and `../skills/create-agent/SKILL.md`. For commit / PR conventions, see `../knowledge/git-conventions.md`.

## Add an agent

The `create-agent` skill owns the lifecycle. Use it directly or go through `/buddy`:

```
/buddy scaffold a new <domain> agent
```

`/buddy` routes the request to `agent-builder`, which invokes the [create-agent](./create-agent.md) skill.

Manual path:

1. Decide on a kebab-case slug. Check it does not collide with existing `../agents/<slug>.md`.
2. Read `../skills/create-agent/references/agent-structure.md` for the 7-section shape and `../skills/create-agent/references/tool-allowlists.md` for the tool allowlist matrix.
3. Author `../agents/<slug>.md` with frontmatter (`name`, `description`, `tools`) and the seven canonical headings verbatim: `Role`, `When to use`, `When NOT to use (Boundaries)`, `Workflow`, `Tools`, `Constraints`, `Worked example`.
4. Weave the task-tracker protocol into `Workflow` — see `../knowledge/task-tracker-api.md`. Every agent starts with `get_task` and ends with `complete_task`.
5. Keep the body at 200 lines or fewer. Overflow goes to `../knowledge/<slug>-refs.md`.
6. Run Validate (below) until strict-pass.
7. Update `../commands/buddy.md` if the new agent introduces a new routing signal.

Porting from a non-Claude format? Use `bun scripts/port-agent.ts <slug>` to emit a skeleton with `TODO(author):` markers, then human-author each marker.

## Run tests

Two suites, both run from the repo root.

### MCP tests (bun)

```bash
cd mcp/task-tracker
bun install       # first run only
bun test
```

Covers the task-tracker store, tool handlers, and atomic-write behaviour. Coverage target: 80 percent.

### Agent / skill lint

```bash
bun scripts/verify-agents.ts              # lint all agents (strict)
bun scripts/verify-agents.ts <slug>       # lint one agent
bun scripts/verify-agents.ts --skills     # lint skills
bun scripts/verify-agents.ts <slug> --allow-todo    # pilot stage
```

Exit 0 = pass. Non-zero exit prints findings on stderr — read them and fix before committing.

### README prereqs block

If you change an agent's tool allowlist, regenerate the README prerequisites block:

```bash
bun scripts/gen-prereqs.ts            # regenerate in place
bun scripts/gen-prereqs.ts --check    # fail CI if README block drifted
```

Edit the `PER_AGENT_CLIS` table inside `scripts/gen-prereqs.ts` when the agent's CLIs change.

## Commit conventions

Conventional commits. Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`. One concern per commit. No `Co-Authored-By` footers. Full detail: `../knowledge/git-conventions.md`.

## Release flow

1. **Branch.** Feature or fix branch off `main`. Never push directly to `main`.
2. **Open PR.** Describe scope and link related issues. Include a test plan. Run the full verify sweep locally before requesting review.
3. **Merge.** Squash to `main` after review.
4. **Tag.** Bump `version` in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` in the same PR that prepares the release. After merge, tag `vX.Y.Z` on `main` and push the tag.
5. **Publish.** The marketplace reads from the repo — tagging is sufficient for users installing via `claude plugin marketplace add <repo>` / `claude plugin install dev-team`.

## Versioning

Semver, scoped to plugin behaviour users observe.

- **Patch** — doc-only change, bug fix, README regen.
- **Minor** — new agent, new skill, new tool on an existing MCP, additive routing change.
- **Major** — breaking change to task schema, MCP tool surface, or agent allowlist defaults.

## House rules

- No absolute home paths in committed files — macOS Users, Linux home, and Windows Users prefixes are blocked by the pre-commit scan. Use `~` or repo-relative paths.
- No secrets in committed files. `.env` is gitignored; never commit tokens / API keys.
- No emojis in shipped docs, agent bodies, or commit messages.
- Canonical casing: `task-tracker`, `dev-team`, `/buddy`, `agent-builder`.
- `.dev-team/` is auto-gitignored by the MCP on first write — do not commit task state.
