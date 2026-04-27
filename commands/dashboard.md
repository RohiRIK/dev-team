---
description: "Launch the dev-team kanban dashboard — a localhost-only Bun-served web UI that mirrors the task-tracker MCP state."
argument-hint: "[port — default 3000]"
allowed-tools: Bash
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

The harness runs the command below. It exports `CLAUDE_PROJECT_DIR` so the server can find `.dev-team/tasks.json` for the current workspace.

!`PORT="${1:-3000}" CLAUDE_PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$PWD}" bun "${CLAUDE_PLUGIN_ROOT}/dashboard/src/server.ts"`

The server prints its URL on startup. Open it in any browser. Press `Ctrl+C` in the terminal to stop.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `EADDRINUSE` | Another process holds the port. Re-run with `/dev-team:dashboard 3001`. |
| Page shows "No tasks yet" but you have tasks | Confirm `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` exists. The dashboard reads from `CLAUDE_PROJECT_DIR`, not the working dir. |
| Page shows the error panel | `tasks.json` is malformed (hand-edited or older format). Follow the on-screen `rm` instruction and re-run `/buddy`. |
| Live badge stuck on `connecting…` | `fs.watch` failed (rare on networked filesystems). Toggle `live` off → on; the client falls back to 2 s polling. |
