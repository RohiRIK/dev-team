# dev-team docs

Long-form docs for the `dev-team` plugin. The repo root `README.md` is the install-and-go entry point; these pages expand on the shape of the system.

- [architecture.md](./architecture.md) — plugin shape, `/buddy` data flow, task-tracker state.
- [agents.md](./agents.md) — the 14 agents grouped by lifecycle phase.
- [task-tracker.md](./task-tracker.md) — MCP tools, lifecycle, state file, auto-gitignore.
- [buddy.md](./buddy.md) — routing matrix, preview-approve-dispatch gate, tie-breakers.
- [create-agent.md](./create-agent.md) — the `create-agent` skill: Create, Port, Research, Validate, Update.
- [contributing.md](./contributing.md) — add an agent, run tests, release flow.

For the authoritative protocol and source, follow the links into `../commands/`, `../agents/`, `../skills/`, and `../knowledge/`.
