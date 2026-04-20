# Research — gathering domain references

Reference for the `create-agent` skill. When authoring or porting an agent whose domain is unfamiliar, use this procedure to gather authoritative references without bloating the agent body.

## Order of preference

Cheap, grounded sources first. Only escalate when they fail.

1. **Grep the codebase** — existing patterns trump invented ones. If `frontend-developer` already handles Tailwind, the new agent cites that, not a fresh StackOverflow answer.
2. **`knowledge/*.md`** — shared plugin docs may already cover the cross-cutting concern.
3. **`context7` MCP** — authoritative, current library APIs. Always prepend `use context7` before writing code against any external library.
4. **`WebSearch`** — general, current domain knowledge (best practices, tool comparisons, recent announcements).
5. **`WebFetch`** — one known URL (spec page, RFC, canonical blog post).

Training data is stale. Library APIs change. Do not write code from memory for an unfamiliar library — always verify via `context7` or official docs.

## When to use each tool

### Grep the codebase

Use first, always. Covers: existing patterns, prior art, sibling-agent references, consistent naming.

```bash
# Example: before authoring an agent that handles GraphQL
rg "graphql|Apollo|urql" --type ts -l
```

If hits exist, read the files; conform to the pattern.

### context7 (MCP)

Use when the agent will need to reference or invoke an external library API. Prepend the directive to the query:

> `use context7` — how does the `@modelcontextprotocol/sdk` Server class handle stdio disconnects?

context7 returns authoritative, current API shape. Use its output verbatim; do not re-interpret.

### WebSearch

Use for general domain knowledge that isn't a specific library API. Examples: "2025 best practices for `<topic>`", "differences between `<tool A>` and `<tool B>`".

Never trust a single result — scan 3–5 top hits for consensus before citing.

### WebFetch

Use when a specific URL is known (RFC, library README, design doc). Prefer over WebSearch when the destination is clear.

## Where gathered refs land

After research, two landing zones:

### Inline (≤ 30 lines total)

If the gathered context fits in ≤ 30 lines, inline it in the agent body. Place under:

- `## Workflow` — if the refs shape the procedural steps (e.g. a 3-step RAG retrieval pattern).
- `## Tools` — if the refs explain why a tool is on the allowlist (e.g. "uses `context7` to verify `langchain` API").

Inline refs must be concise. If more than 30 lines of reference material is load-bearing, extract instead.

### Extract — `knowledge/<slug>-refs.md` (> 30 lines or cross-cutting)

Create a sibling knowledge file at the plugin root:

```
knowledge/
├── coding-standards.md          ← tier 2 shared
├── task-tracker-api.md          ← tier 2 shared
└── ml-engineer-refs.md          ← tier 2 agent-specific long-form
```

The agent body links it: *"See `knowledge/ml-engineer-refs.md` for PyTorch vs. JAX framework notes."*

Split rule: if two agents cite the same ref, promote from `<slug>-refs.md` to a topic file (e.g. `ml-frameworks.md`).

## What makes a good reference entry

Each ref entry in the knowledge file should have:

1. **Source** — URL or library name + version.
2. **Retrieved** — date (`YYYY-MM-DD`). Stale refs decay fast in fast-moving libraries.
3. **Summary** — 1–3 sentences of what the ref says that's load-bearing for the agent.
4. **Applicable to** — which parts of the agent's workflow use it.

Example entry in `knowledge/ml-engineer-refs.md`:

```markdown
## PyTorch DataLoader — pin_memory on MPS

- Source: pytorch.org/docs/stable/data.html
- Retrieved: 2026-04-18
- Summary: `pin_memory=True` is a no-op on MPS (Apple Silicon) as of PyTorch 2.5. Does not error, just silently ignored.
- Applicable to: `ml-engineer` Workflow step 4 (data loader setup) — do not set it defensively, it misleads reviewers.
```

## Anti-patterns

- **Do not paste full API docs** into the agent body. Reference and link.
- **Do not invent examples** from memory when an external library is involved. Grep the project or hit `context7`.
- **Do not copy-paste StackOverflow answers** without verifying against the official source.
- **Do not skip the retrieved date** — a year-old ref can be wrong.

## Validation

After landing refs, run the Validate procedure. The linter catches:

- Body > 200 lines (overflow that should have been extracted).
- Absolute home paths in any URL or example.
- `TODO(author)` markers left unresolved.

No dedicated "ref quality" linter exists — manual review for accuracy is required. When in doubt, err toward `context7` and current docs.
