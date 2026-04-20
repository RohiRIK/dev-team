# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [0.1.0] — 2026-04-20

First public preview release.

### Added

- **14 specialist agents** — `product-manager`, `system-architect`, `cloud-architect`, `backend-developer`, `frontend-developer`, `database-admin`, `devops-engineer`, `ml-engineer`, `ui-ux-designer`, `qa-tester`, `security-analyst`, `pentaster`, `github-manager`, `agent-builder`. Each follows the canonical 7-section body (Role · When to use · When NOT to use · Workflow · Tools · Constraints · Worked example), is capped at 200 lines, and ships with a per-agent tool allowlist (default-deny per spec §5.4).
- **`/buddy` slash command** — parses requests, plans a task DAG on the `task-tracker` MCP, and dispatches the right specialist agent for each step.
- **`task-tracker` MCP server** — 5 tools (`create_task`, `list_tasks`, `get_task`, `update_task`, `complete_task`) + `health`. State persists to `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` via atomic rename with EXDEV fallback for cloud-synced filesystems. 34 tests, 80 %+ coverage.
- **`create-agent` skill** — full agent lifecycle: Create, Port, Research, Validate, Update procedures. Single source of truth for dev-team agent structure.
- **Knowledge docs** — `coding-standards.md`, `git-conventions.md`, `task-tracker-api.md`.
- **`scripts/verify-agents.ts`** — strict linter for agent bodies and skills; enforces frontmatter, canonical sections, 200-line cap, no `TODO(author):` markers in strict mode.
- **`scripts/gen-prereqs.ts`** — generates the Prerequisites block in `README.md` from the per-agent CLI table; `--check` mode for CI.
- **`scripts/port-agent.ts`** — ports an external agent source (any directory with `agent.json` + `agent.md`) to the plugin's canonical shape via `--src <dir>`.

### Infrastructure

- Bun workspace monorepo (`mcp/task-tracker` as a workspace package).
- Biome for formatting and linting; TypeScript strict mode with `noUncheckedIndexedAccess`.
- `git filter-repo` history scrub — rotated Context7 key removed from all blobs and binaries before publish.
- Retired Gemini-CLI infra: Rust launcher, 5 legacy MCPs, knowledge bootloaders.

[0.1.0]: https://github.com/rohirikman/dev-team/releases/tag/v0.1.0
