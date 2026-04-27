import type { Task, TaskState, TaskStatus } from "./types.ts"

/* ── Column config ─────────────────────────────────────────────────────── */

export interface Column {
  status: TaskStatus
  label: string
  dot: string
  bg: string
  border: string
}

export const COLUMNS: readonly Column[] = [
  {
    status: "pending",
    label: "Pending",
    dot: "#a1a1aa",
    bg: "rgba(24,24,27,.4)",
    border: "rgba(63,63,70,.5)",
  },
  {
    status: "in_progress",
    label: "In Progress",
    dot: "#60a5fa",
    bg: "rgba(23,37,84,.3)",
    border: "rgba(30,58,138,.4)",
  },
  {
    status: "blocked",
    label: "Blocked",
    dot: "#fbbf24",
    bg: "rgba(69,26,3,.2)",
    border: "rgba(120,53,15,.4)",
  },
  {
    status: "completed",
    label: "Completed",
    dot: "#34d399",
    bg: "rgba(6,78,59,.2)",
    border: "rgba(6,95,70,.4)",
  },
  {
    status: "cancelled",
    label: "Cancelled",
    dot: "#f87171",
    bg: "rgba(127,29,29,.2)",
    border: "rgba(153,27,27,.4)",
  },
] as const

/* ── Status non-colour glyph (UX-SPEC §5.4 — colour is not the only signal) */

const STATUS_GLYPH: Readonly<Record<TaskStatus, string>> = {
  pending: "○",
  in_progress: "▶",
  blocked: "■",
  completed: "✓",
  cancelled: "✕",
}

/* ── Agent colours ─────────────────────────────────────────────────────── */

export const AGENT_COLORS: Readonly<Record<string, { bg: string; fg: string }>> = {
  "product-manager": { bg: "rgba(76,29,149,.6)", fg: "#c4b5fd" },
  "system-architect": { bg: "rgba(49,46,129,.6)", fg: "#a5b4fc" },
  "cloud-architect": { bg: "rgba(12,74,110,.6)", fg: "#7dd3fc" },
  "ui-ux-designer": { bg: "rgba(131,24,67,.6)", fg: "#f9a8d4" },
  "backend-developer": { bg: "rgba(6,78,59,.6)", fg: "#6ee7b7" },
  "frontend-developer": { bg: "rgba(22,78,99,.6)", fg: "#67e8f9" },
  "database-admin": { bg: "rgba(124,45,18,.6)", fg: "#fdba74" },
  "ml-engineer": { bg: "rgba(112,26,117,.6)", fg: "#f0abfc" },
  "devops-engineer": { bg: "rgba(19,78,74,.6)", fg: "#5eead4" },
  "qa-tester": { bg: "rgba(113,63,18,.6)", fg: "#fde047" },
  "security-analyst": { bg: "rgba(127,29,29,.6)", fg: "#fca5a5" },
  pentester: { bg: "rgba(136,19,55,.6)", fg: "#fda4af" },
  "github-manager": { bg: "rgba(63,63,70,.6)", fg: "#d4d4d8" },
  "agent-builder": { bg: "rgba(54,83,20,.6)", fg: "#bef264" },
}

/* ── HTML helpers ──────────────────────────────────────────────────────── */

export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function agentBadge(agent: string): string {
  const c = AGENT_COLORS[agent] ?? { bg: "rgba(39,39,42,.8)", fg: "#d4d4d8" }
  return `<span class="badge" style="background:${c.bg};color:${c.fg}" aria-label="Agent: ${esc(agent)}">${esc(agent)}</span>`
}

/* ── Card ──────────────────────────────────────────────────────────────── */

export function renderCard(task: Task): string {
  const tags = task.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")

  const deps =
    task.dependsOn.length > 0
      ? `<p class="deps">⤹ depends on ${task.dependsOn.length} task${task.dependsOn.length > 1 ? "s" : ""}</p>`
      : ""

  const escTitle = esc(task.title)
  const escId = esc(task.id)
  const glyph = STATUS_GLYPH[task.status]

  return `
    <article class="card"
             data-task-id="${escId}"
             data-agent="${esc(task.agent)}"
             data-status="${esc(task.status)}"
             data-tags="${esc(task.tags.join(" "))}"
             data-search="${esc(`${task.title} ${task.description ?? ""} ${task.result ?? ""}`.toLowerCase())}"
             tabindex="0"
             role="button"
             aria-haspopup="dialog"
             aria-label="Open task: ${escTitle}">
      <div class="card-head">
        <h3 class="card-title" title="${escTitle}">${escTitle}</h3>
        <span class="card-time">${timeAgo(task.updatedAt)}</span>
      </div>
      <div class="badges">
        <span class="status-glyph" aria-hidden="true">${glyph}</span>
        ${agentBadge(task.agent)}${tags}
      </div>
      ${deps}
    </article>`
}

/* ── Column ────────────────────────────────────────────────────────────── */

export function renderColumn(col: Column, tasks: Task[], filterAgent: string | null): string {
  const sorted = tasks
    .filter((t) => t.status === col.status)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const headingId = `col-${col.status}-h`
  const cards =
    sorted.length > 0
      ? sorted.map(renderCard).join("")
      : `<p class="empty">${
          filterAgent
            ? `No <strong>${esc(filterAgent)}</strong> tasks<br>in this column`
            : "No tasks"
        }</p>`

  const accessibleHeading = `${col.label} tasks (${sorted.length})`

  return `
    <section class="column"
             role="region"
             aria-labelledby="${headingId}"
             style="background:${col.bg};border-color:${col.border}">
      <div class="col-header">
        <span class="dot" aria-hidden="true" style="background:${col.dot}"></span>
        <h2 id="${headingId}">${esc(accessibleHeading)}</h2>
        <span class="count" aria-hidden="true">${sorted.length}</span>
      </div>
      <div class="col-cards">${cards}</div>
    </section>`
}

/* ── Columns shell (used by /api/tasks partial) ────────────────────────── */

export function renderColumns(tasks: Task[], filterAgent: string | null): string {
  return COLUMNS.map((col) => renderColumn(col, tasks, filterAgent)).join("")
}

/* ── Empty state (UX-SPEC §4.1) ────────────────────────────────────────── */

export function renderEmptyBoard(): string {
  return `
    <div class="empty-board" role="region" aria-label="Empty board">
      <div class="icon" aria-hidden="true">📋</div>
      <h2>No tasks yet</h2>
      <p>Run <code>/buddy &lt;request&gt;</code> to get started.</p>
      <p>The dashboard updates live as agents pick up tasks.</p>
    </div>`
}

/* ── Error panel (UX-SPEC §4.5) ─────────────────────────────────────────
 * Server-rendered. No client JS needed for the alert itself. */

export function renderErrorPanel(path: string, message: string): string {
  return `
    <section class="error-panel" role="alert">
      <h2>⚠ Could not read task state</h2>
      <dl>
        <dt>Path</dt>
        <dd>${esc(path)}</dd>
        <dt>Error</dt>
        <dd>${esc(message)}</dd>
      </dl>
      <p>This usually means the file was edited by hand or written by an older version of the task-tracker. Try:</p>
      <p><code>rm ${esc(path)}</code></p>
      <p>…then re-run <code>/buddy</code>.</p>
      <button onclick="window.location.reload()" type="button">↻ Retry</button>
    </section>`
}

/* ── Filter pill (when filter !== "all") ───────────────────────────────── */

function filterPill(filterAgent: string | null): string {
  if (!filterAgent || filterAgent === "all") return ""
  return `<button type="button" id="filter-pill" class="filter-pill" aria-label="Clear filter">filter: ${esc(filterAgent)} ✕</button>`
}

/* ── Header (page-only — partials don't redraw it) ─────────────────────── */

interface HeaderInputs {
  done: number
  total: number
  pct: number
  agents: readonly string[]
  selectedAgent: string
  updatedAtIso: string
}

function renderHeader(h: HeaderInputs): string {
  const agentOpts = h.agents
    .map(
      (a) =>
        `<option value="${esc(a)}"${a === h.selectedAgent ? " selected" : ""}>${esc(a)}</option>`,
    )
    .join("")

  const statusOpts = COLUMNS.map(
    (c) => `<option value="${esc(c.status)}">${esc(c.label)}</option>`,
  ).join("")

  return `
  <header>
    <a class="skip-link" href="#board">Skip to board</a>

    <div class="header-left">
      <h1>dev-team</h1>
      <span class="label">kanban</span>
    </div>

    <div class="progress-wrap" aria-label="Completion progress">
      <div class="progress-bar" role="progressbar"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="${h.pct}">
        <div class="progress-fill" style="width:${h.pct}%"></div>
      </div>
      <span class="progress-text">${h.done}/${h.total} done</span>
    </div>

    <select id="agent-filter" aria-label="Filter by agent">
      <option value="all">All agents</option>
      ${agentOpts}
    </select>

    <select id="status-filter" aria-label="Filter by status">
      <option value="all">All statuses</option>
      ${statusOpts}
    </select>

    <select id="tag-filter" aria-label="Filter by tag">
      <option value="all">All tags</option>
    </select>

    <input id="search-input" type="search" aria-label="Search tasks"
           placeholder="search title, description, result…" />

    ${filterPill(h.selectedAgent)}

    <button id="poll-toggle" class="poll-on" type="button"
            aria-pressed="true" aria-label="Toggle live updates">● live</button>
    <button id="refresh-btn" type="button" aria-label="Refresh now">↻ refresh</button>

    <span id="conn-state" data-state="connecting" aria-live="polite">● connecting…</span>

    <span class="last-update">last update:
      <time id="last-time" datetime="${esc(h.updatedAtIso)}">${esc(new Date(h.updatedAtIso).toLocaleTimeString())}</time>
    </span>
  </header>

  <div id="conn-banner" role="status" aria-live="polite" data-visible="false">
    ⚠ Lost connection to server — retrying every 5s
    <button id="retry-now" type="button" aria-label="Retry connection now">↻ now</button>
  </div>`
}

/* ── Drawer + live region scaffolding (rendered once on the page) ──────── */

function renderDrawer(): string {
  return `
  <div id="drawer" class="drawer-backdrop" role="dialog"
       aria-modal="true" aria-labelledby="drawer-title"
       aria-hidden="true" data-open="false">
    <aside class="drawer">
      <div class="drawer-head">
        <h2 id="drawer-title">Task</h2>
        <button id="drawer-close" class="drawer-close" type="button"
                aria-label="Close task details">✕</button>
      </div>
      <div id="drawer-body"></div>
    </aside>
  </div>
  <div id="sr-live" class="sr-only" aria-live="polite" aria-atomic="false"></div>`
}

/* ── Full page shell ───────────────────────────────────────────────────── */

export interface BoardPageInputs {
  state: TaskState
  selectedAgent: string
}

export function renderPage(inputs: BoardPageInputs): string {
  const { state, selectedAgent } = inputs
  const total = state.tasks.length
  const done = state.tasks.filter((t) => t.status === "completed").length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const agents = [...new Set(state.tasks.map((t) => t.agent))].sort()

  const main =
    total === 0
      ? renderEmptyBoard()
      : renderColumns(state.tasks, selectedAgent === "all" ? null : selectedAgent)

  const header = renderHeader({
    done,
    total,
    pct,
    agents,
    selectedAgent,
    updatedAtIso: state.updatedAt,
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>dev-team — Kanban Board</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  ${header}
  <main id="board" role="region" aria-label="Kanban board" tabindex="-1">${main}</main>
  ${renderDrawer()}
  <script src="/client.js" defer></script>
</body>
</html>`
}

/* ── Error page (full HTML — used when JSON parse fails) ──────────────── */

export function renderErrorPage(path: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>dev-team — Error</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <header>
    <div class="header-left">
      <h1>dev-team</h1>
      <span class="label">kanban</span>
    </div>
  </header>
  <main id="board" role="region" aria-label="Error">${renderErrorPanel(path, message)}</main>
</body>
</html>`
}
