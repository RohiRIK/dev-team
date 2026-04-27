# dev-team Dashboard

Read-only Bun-served kanban for the [`task-tracker`](../mcp/task-tracker) MCP. Watches `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json` and pushes live updates to the browser over Server-Sent Events.

## Launch

From inside Claude Code with the `dev-team` plugin installed:

```
/dev-team:dashboard
```

Or, manually:

```bash
cd dashboard
CLAUDE_PROJECT_DIR=/path/to/your/repo bun src/server.ts
# → dashboard → http://127.0.0.1:3000
```

## Trust model

- **Localhost only.** The server binds `127.0.0.1`, never `0.0.0.0`. Other machines on your LAN cannot reach the dashboard.
- **Read-only.** No HTTP route mutates state. The MCP is the sole writer for `tasks.json`.
- **No redaction.** Task `title`, `description`, `result`, and `artifacts[].path` render verbatim. If you paste an API key into a `/buddy` request, it appears in the dashboard. Don't.
- **No telemetry.** No external requests. The Inter font is loaded via `<link>` from Google Fonts (the only external resource); remove that line in `public/styles.css` to go fully offline.

## What appears

Five columns: `pending`, `in_progress`, `blocked`, `completed`, `cancelled`. One card per task with title, agent badge, tags, dependency count, and status glyph. Click any card to open the detail drawer (full description, result, artifacts as clickable links, depends-on IDs, timestamps).

Filters: agent, status, tag, free-text search. All combinable.

## States

| Trigger | UI |
|---|---|
| `tasks.json` missing | Empty-state panel: "No tasks yet — run `/buddy <request>`" |
| `tasks.json` malformed | Error panel with file path, parse error, and remediation |
| MCP writes `tasks.json` | Browser refetches within ~50 ms (fs-watch debounced) |
| 3 consecutive fetch failures | "Lost connection" banner with retry button |

## Architecture

```
Browser  ←─ SSE  ──  Bun server  ──  fs.watch  →  .dev-team/tasks.json
                 ↘  GET /         ↗  read-only
                  GET /api/tasks
```

- `src/server.ts` — Bun HTTP + SSE, binds 127.0.0.1, serves `public/styles.css` and `public/client.js` as static assets.
- `src/components.ts` — single source of truth for board / column / card / empty / error rendering. Used by both the full-page route and the partial route.
- `src/store.ts` — reads `tasks.json`. ENOENT → empty state, JSON parse error → `TasksParseError`.
- `public/client.js` — vanilla JS: SSE listener, filters, search, drawer, connection banner. No build step.
- `public/styles.css` — single stylesheet. WCAG 2.2 AA compliant per `UX-SPEC.md` §5.4.

See `ARCHITECTURE.md` (ADR-0001) for the rationale, `PRD.md` for requirements, and `UX-SPEC.md` for the component contracts and a11y audit.

## Ports

`/dev-team:dashboard` accepts an optional port: `/dev-team:dashboard 3001`. The default is `3000`.

## Stopping

`Ctrl+C` in the launching terminal. The watcher and HTTP server clean up on `SIGINT`/`SIGTERM`.
