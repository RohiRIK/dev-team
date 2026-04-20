# Agent structure — canonical contract

Reference for the `create-agent` skill. Single source of truth for how a dev-team agent file is shaped. Mirrors `specs/plugin-pivot.md` §5.6.

## File location

Every agent lives at `agents/<slug>.md` in the plugin root. `<slug>` is kebab-case and matches one of the 13 agents kept per §5.1 (unless extending the team).

## YAML frontmatter

Required keys:

| Key | Type | Rule |
|---|---|---|
| `name` | string | Must equal the file slug (`agents/<name>.md`) |
| `description` | string | One sentence. Starts with "Use when..." or similar. Scoped to the agent's role — no over-broad claims |
| `tools` | comma-separated list | Explicit allowlist per `tool-allowlists.md`. Never `*` |

Recommended:

| Key | Value | Rationale |
|---|---|---|
| `model` | `inherit` | Follows the user's chosen model; opt out with a specific model only when the role demands it |

Forbidden keys: anything Gemini-specific (`capabilities`, `expertise.primary`, `tags`). Those belonged to `.gemini/agents/<slug>/agent.json` and do not port.

### Frontmatter example

```yaml
---
name: backend-developer
description: "Use when implementing backend features, REST/GraphQL APIs, server-side logic, database integration, or migrating Node.js/Python projects to Bun. Owns the full implement → test → document loop for server-side code."
tools: Read, Grep, Glob, Write, Edit, Bash, Skill
model: inherit
---
```

## Canonical sections (verbatim headings, in order)

Every agent body contains exactly these seven `##` headings, in this order:

1. `## Role`
2. `## When to use`
3. `## When NOT to use (Boundaries)`
4. `## Workflow`
5. `## Tools`
6. `## Constraints`
7. `## Worked example`

The linter (`scripts/verify-agents.ts`) enforces presence. Headings must match verbatim — no variants ("When not to use", "Process", "Example").

### Section contracts

**Role** — 2–4 sentences. What the agent owns end-to-end. Include the multi-agent framing: "You are one specialist in a multi-agent dev-team coordinated by `/buddy` via the `task-tracker` MCP."

**When to use** — bullet list. 5–10 concrete triggers, each phrased as the user problem ("Implement a new HTTP endpoint"). Append `**Primary stack:**` / `**Secondary:**` lines for core vs. adjacent expertise.

**When NOT to use (Boundaries)** — bullet list. Each entry names the sibling agent to hand off to. Pattern: `- UI / React / styling work → **frontend-developer**`. Non-negotiable — weak boundaries cause `/buddy` routing conflicts.

**Workflow** — numbered list, 6–10 steps. Covers: (1) pull task from `task-tracker`, (2) mark in-progress, (3) load standards / invoke skills, (4) explore surface area, (5) test first / apply domain procedure, (6) implement, (7) verify, (8) document only the why, (9) complete + hand off follow-on tasks. Reference shared docs inline by relative path (`knowledge/task-tracker-api.md`, `knowledge/coding-standards.md`).

**Tools** — bullet list. One line per tool in the frontmatter `tools:` list, stating **why** the agent has it. Includes the `Skill` tool with the specific skills invoked (e.g. `CodingStandards`, `TddWorkflow`).

**Constraints** — bullet list. Hard rules the agent must obey. Always include: (1) language/package-manager rules (`bun` not `npm`, `uv` not `pip`), (2) "never modify `.env` / secrets", (3) "never commit or open PRs — `github-manager`'s job", (4) coverage target, (5) "always report progress via task-tracker".

**Worked example** — one short input → steps → output example. Keep it under 20 lines. Shows the agent completing a representative task end-to-end including the final `complete_task` call and any follow-on task creation.

## Hard limits

| Limit | Value | Enforced by |
|---|---|---|
| Body length | ≤ 200 lines (everything after closing `---`) | `verify-agents.ts` |
| No absolute home paths | macOS `/U⁠sers/`, Linux `/h⁠ome/`, Windows `C:\U⁠sers\` forbidden — use `~` or relative paths | `verify-agents.ts` |
| No `TODO(author)` markers | Only allowed with `--allow-todo` flag (pilot stage) | `verify-agents.ts` |
| No Gemini residue | No `UFC Hydration`, no `execute_agent`, no `.gemini/` refs | manual + grep |

When a section's content would push the body past 200 lines, extract the overflow to `knowledge/<slug>-refs.md` and link from the agent body. Never pad, never compress below the section contracts.

## Writing style

- **Imperative** where describing actions ("Run the test suite", not "You should run the test suite").
- **Present tense** for role descriptions ("You own server-side implementation").
- **No emojis** unless explicitly requested.
- **No narration** of what well-named code does.

## Verification

After editing any agent file:

```bash
bun ../../scripts/verify-agents.ts <slug>
```

Strict mode (no `--allow-todo`) must exit 0 before the agent is considered done.

## When this contract changes

`specs/plugin-pivot.md` §5.6 is the parent spec. When it changes, update this file first, then run the Update procedure in `SKILL.md` to sweep all agents in `agents/`.
