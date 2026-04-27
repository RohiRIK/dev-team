---
description: "Launch the dev-team kanban dashboard — a localhost-only Bun-served web UI that mirrors the task-tracker MCP state."
argument-hint: "[port — default 3000]"
allowed-tools: Bash, AskUserQuestion
---

# /dev-team:dashboard — Open the kanban board

Boots the read-only kanban dashboard at `http://127.0.0.1:<port>` (default `3000`). The server reads `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` and pushes live updates over Server-Sent Events.

## Trust model — read this first

- **Localhost only.** The Bun server binds `127.0.0.1`, never the LAN. Other machines on the network cannot reach it.
- **Read-only.** The dashboard never writes to `tasks.json`. Only the `task-tracker` MCP writes (atomically, with EXDEV fallback).
- **No redaction.** Whatever your agents put in task `title`, `description`, `result`, or `artifacts` is shown verbatim. Don't paste secrets into a `/buddy` request and expect them hidden in the UI.

## What gets shown

Five columns (`pending` → `in_progress` → `blocked` → `completed` → `cancelled`) with one card per task. Filter by agent, by status, by tag. Search across title / description / result. Click any card to open the detail drawer.

## Run it

Follow these steps in order:

**1. Resolve the port** — use the argument if provided, otherwise `3000`.

**2. Check for a port conflict:**
```bash
lsof -ti :<port>
```
If this returns a PID, also run `ps -p <pid> -o comm=` to get the process name.

**3. If the port is occupied**, use `AskUserQuestion` to ask:
> "Port `<port>` is in use by `<process-name>` (PID `<pid>`). Kill it and start the dashboard?"

- **Yes** → run `kill <pid>`, then continue to step 4.
- **No** → reply "Re-run with `/dev-team:dashboard <other-port>` to use a different port." and stop.

**4. Start the server:**
```bash
PORT="<port>" CLAUDE_PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$PWD}" bun "${CLAUDE_PLUGIN_ROOT}/dashboard/src/server.ts"
```

The server prints its URL on startup. Open it in any browser. Press `Ctrl+C` in the terminal to stop.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `EADDRINUSE` | Port check failed before server started. Re-run and answer "Yes" to kill the occupant, or use `/dev-team:dashboard 3001`. |
| Page shows "No tasks yet" but you have tasks | Confirm `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` exists. The dashboard reads from `CLAUDE_PROJECT_DIR`, not the working dir. |
| Page shows the error panel | `tasks.json` is malformed (hand-edited or older format). Follow the on-screen `rm` instruction and re-run `/buddy`. |
| Live badge stuck on `connecting…` | `fs.watch` failed (rare on networked filesystems). Toggle `live` off → on; the client falls back to 2 s polling. |
