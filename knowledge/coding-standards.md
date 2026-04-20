# dev-team coding standards — shared rules

Cross-cutting rules every code-writing agent (`backend-developer`, `frontend-developer`, `database-admin`, `devops-engineer`, `ml-engineer`, `agent-builder`) follows. Language-specific detail lives in the `CodingStandards` skill; this file is the shared layer that sits above it.

Load order (agent `## Workflow` step "Load standards"):
1. `CodingStandards` skill for the language at hand (TypeScript / Python / Bash / PowerShell / Swift / Rust).
2. `Read` this file for cross-cutting rules.

## Non-negotiables

| Rule | Why | Applies to |
|---|---|---|
| **Immutability.** Create new objects — never mutate inputs or shared state. Use spread (`{...obj, key}` / `[...arr, x]`). | Mutation causes cross-cutting bugs that don't surface until production. Immutable code composes; mutable code breeds exceptions. | All languages |
| **Explicit return types on exported functions.** Never rely on inference across module boundaries. | Inference leaks implementation details into consumers' types, then breaks silently when the impl changes. | TS, Python (via type hints), Rust, Swift |
| **No `any` / `unknown` cast without a runtime check.** If you don't know the type, validate it; don't assert. | `as any` is how well-typed codebases rot. Validate at the boundary with Zod / Pydantic / a type guard. | TS (`any`), Python (`Any`), Rust (`unsafe`) |
| **Validate inputs at system boundaries.** Every handler, CLI entry, queue consumer, external API response. Zod (TS), Pydantic (Python), typed param types (PS). Inside the boundary, trust the types. | One validation layer, not a thousand. | All languages |
| **No hardcoded secrets.** API keys, passwords, tokens, connection strings → environment variables + `.env.schema`. | Committed secrets can't be un-committed. Rotation is expensive. | All languages |
| **No `console.log` / `print` left in shipped code.** Use the project's logger with a structured level. | Log spam breaks observability and hides real signals. | TS, Python, Rust |

## Size and shape

| Limit | Target | Hard ceiling |
|---|---|---|
| File length | ≤ 400 lines | 800 |
| Function length | ≤ 30 lines | 50 |
| Cyclomatic nesting | ≤ 3 | 4 |

Past the ceiling — split. Not past the target — leave it alone. "Decompose preemptively" is a trap.

## Error handling

- **Throw at the boundary; catch at the handler.** Deep functions raise; the top of the request / job catches, logs, and returns a safe shape.
- **Error messages are for humans reading logs at 3 a.m.** Include the failing value, the expected shape, and the action that triggered it. `ValidationError: expected email, got "n/a" at POST /users input.email` beats `invalid input`.
- **Never swallow errors with an empty `catch`.** Either handle, enrich + re-raise, or let it propagate.
- **Never `catch` to hide a bug.** If a cast is throwing, fix the cast — don't wrap it.

## External library usage

- **`context7` MCP is authoritative** for any non-stdlib API shape. Prepend `use context7` before writing code against an external library. Do not trust training-data memory for library APIs — they change.
- **Pin versions** in lockfiles (`bun.lock`, `uv.lock`, `Cargo.lock`). Unlocked dependencies break reproducibility.
- **Package-manager choice** (per user rules):
  - Node → `bun` / `bunx`. Never `npm` / `npx` / `yarn` / `pnpm`.
  - Python → `uv` / `uvx`. Never `pip` / `pipx` / `poetry`.
  - JSON reading in shell → `jq`. Never `python3 -c 'import json...'`.

## Testing expectations

- **Coverage target:** 80% on code that is not pure boilerplate (per user `CLAUDE.md`).
- **Write the test first** for every new behaviour and every bug fix. RED → GREEN → refactor.
- **Tests hit real integration points where feasible** — real DB in integration tests, not mocks. Mocks that drift from reality are worse than no test.
- **One assertion per test's name.** A test titled `creates user` must fail for one reason.

## Comments

Default to no comments. Write a comment only when the **why** is non-obvious: a hidden constraint, a workaround for a specific external bug, a subtle invariant. Never explain what well-named code already says. Never reference a ticket id, a caller, or the commit — that belongs in PR description / git history and rots.

## Feature-flag / dead-code hygiene

- No half-implemented feature flags. If the flag is off everywhere, delete the branch.
- No `// removed` comments. Git history already knows.
- No backwards-compatibility shims for code that is not shipped.

## Before handing off

Every dev agent, before `complete_task`:
- [ ] Type-check passes (`bunx tsc --noEmit`, `mypy`, `cargo check`, etc.)
- [ ] Formatter / linter clean (`biome check`, `ruff`, `cargo fmt`)
- [ ] Tests green for the changed scope
- [ ] No secrets, no `console.log`, no absolute home paths in shipped files
- [ ] `CodingStandards` rules for the language followed

## Pointers

- Per-language rules: `Skill tool → CodingStandards` (TypeScript, Python, Bash, PowerShell, Swift, Rust).
- Git / commit / PR shape: `knowledge/git-conventions.md`.
- Task-tracker protocol: `knowledge/task-tracker-api.md`.
- Per-agent tool allowlist: spec §5.4 (mirrored in `skills/create-agent/references/tool-allowlists.md`).
