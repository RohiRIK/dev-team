# PRD — dev-team Dashboard

**Status:** Draft v1
**Date:** 2026-04-26
**Owner:** product-manager
**Component:** `dashboard/` — kanban view of the `task-tracker` MCP
**Depends on:** `dashboard/ARCHITECTURE.md` (ADR-0001)
**UX detail owner:** `ui-ux-designer` (`dashboard/UX-SPEC.md` — to be authored)

---

## 1. Problem

`/buddy` orchestrates a multi-agent dev team via the `task-tracker` MCP, which writes state to `${CLAUDE_PROJECT_DIR}/.dev-team/tasks.json`. Today, the only way a human can tell what the agents are doing is to `cat` that JSON file or watch the Claude Code transcript scroll. The `dashboard/` directory exists as a Bun-served kanban, but:

- It is not reachable from an installed plugin (no slash command).
- It cannot be filtered, searched, or drilled into — every task description is rendered inline in a card.
- It signals status with colour only — no a11y affordance, no textual cue, hard to scan when 30+ tasks are open.
- It re-renders the whole board every 2 s regardless of activity, masking real changes inside churn.
- It has no empty / error / loading state — a fresh repo shows five "No tasks" columns and no guidance.

The result: developers and reviewers cannot trust the dashboard as their primary signal of agent activity, so they fall back to reading the transcript, defeating the purpose of the multi-agent workflow.

## 2. Users & Jobs-to-be-Done

### Persona A — Developer running `/buddy`

Solo engineer running `/buddy <request>` on their own machine. Wants to see, at a glance, *which agent is doing what right now* and *what's blocked on what*. Switches to the dashboard for the same reason a developer alt-tabs to a CI page: to confirm progress without parsing log lines.

**Job:** "When I kick off a multi-agent run, I want to watch the work fan out and converge so I know whether to keep working in parallel or wait."

### Persona B — Reviewer watching progress

Code reviewer, tech lead, or pairing partner — not driving `/buddy` but watching it on a shared screen, in a recording, or over the shoulder. Cares about *outcomes and artifacts*: which PRD got written, which file got changed, which task is stuck.

**Job:** "When I review a `/buddy` session, I want to navigate from a finished task to its artifact (PRD, ADR, code path) without scrolling the transcript."

## 3. Success Metrics

Leading indicators (validate within first two weeks of shipping each P0 capability):

| Metric | Target | How measured |
|---|---|---|
| Dashboard launched per `/buddy` session | ≥ 60% | Count of `/dev-team:dashboard` invocations vs. `/buddy` invocations in the same project (manual log review during dogfood) |
| Time-to-first-glance after task state change | ≤ 2 s | Manual: change a task via MCP, observe browser update latency |
| Sessions where developer uses transcript-only as primary signal | < 25% | Self-report in dogfood survey |

Non-metric: we do not optimise raw task-throughput — that's a `/buddy` concern, not a dashboard concern.

## 4. Requirements

Priorities are P0 (must ship first), P1 (next), P2 (nice-to-have). Sequencing follows the architect's ADR ranking (#1, #3, #4, #5 are P0/P1; #2 SSE is P1 because polling already works).

### P0 — Reachability and trust

| ID | Requirement | Type |
|---|---|---|
| R1 | The plugin MUST expose a `/dev-team:dashboard` slash command that starts the Bun server with `CLAUDE_PROJECT_DIR` exported and prints the URL. | must |
| R2 | The Bun server MUST bind `127.0.0.1` only (no LAN exposure). | must |
| R3 | `dashboard/README.md` MUST document: how to launch via slash command, the localhost-only trust model, and that task content is not redacted. | must |
| R4 | When `tasks.json` is missing or empty, the dashboard MUST render an empty-state panel with the exact remediation: "Run `/buddy <request>` to create your first task." | must |
| R5 | When `tasks.json` is malformed, the dashboard MUST render an error panel showing the file path it tried to read and the parse error message — never a raw 500. | must |

### P1 — Real-time and orientation

| ID | Requirement | Type |
|---|---|---|
| R6 | The dashboard MUST update within 2 s of a task state change without a full-page reload. (SSE per ADR #2; polling fallback acceptable until SSE ships.) | must |
| R7 | If the live-update channel disconnects for 3 consecutive cycles, the dashboard MUST show a top banner "lost connection — retrying" and clear it on reconnect. | must |
| R8 | Each task card MUST be filterable by agent, by status, and by tag. Filters MUST be combinable (AND across dimensions, OR within a dimension). | must |
| R9 | The dashboard MUST support free-text search across task `title`, `description`, and `result` fields. Search MUST be combinable with R8 filters. | must |
| R10 | Status MUST be conveyed by both colour AND a textual/iconographic cue (not colour alone). Specific visual treatment is owned by `UX-SPEC.md`. | must |
| R11 | Each task card MUST be openable into a detail view (drawer or modal — UX owns the form factor) showing: full description, full result, all artifacts as clickable links, depends-on list with task IDs that link to their own detail views, timestamps (created / started / completed), and tags. | must |

### P2 — Insight

| ID | Requirement | Type |
|---|---|---|
| R12 | The dashboard SHOULD render a dependency graph view of the current task set, with edges from `dependsOn` and nodes coloured by status. | should |
| R13 | The dashboard SHOULD render a completion timeline (Gantt-style or simple horizontal bar chart) of completed tasks for the current session, ordered by `startedAt`. | should |
| R14 | The dashboard COULD persist filter / search state in the URL (querystring) so a reviewer can share a deep-link to "all blocked tasks tagged auth". | could |
| R15 | The dashboard COULD show a per-agent throughput sparkline (tasks completed in the current session by agent). | could |

## 5. Acceptance Criteria

All criteria are written in given/when/then form for `qa-tester`. UX-specific assertions (spacing, colour values, exact copy) are deferred to `UX-SPEC.md`; this PRD asserts behaviour and contract only.

### AC-1 — Slash command launches dashboard (R1)

- **Given** the `dev-team` plugin is installed and `${CLAUDE_PROJECT_DIR}` is set,
- **When** the user invokes `/dev-team:dashboard`,
- **Then** a Bun server starts, binds `127.0.0.1:3000` (or the next free port if 3000 is taken), and the URL is printed in the Claude Code transcript.

### AC-2 — Localhost-only binding (R2)

- **Given** the dashboard server is running,
- **When** a request arrives on a non-loopback interface (e.g. `curl http://<lan-ip>:3000/`),
- **Then** the connection is refused or times out.

### AC-3 — Empty state (R4)

- **Given** `tasks.json` does not exist OR has `tasks: []`,
- **When** the user opens `/`,
- **Then** the page renders a single centred panel containing the literal string "Run `/buddy <request>` to create your first task." and no kanban columns.

### AC-4 — Malformed-file error state (R5)

- **Given** `tasks.json` exists but is not valid JSON,
- **When** the user opens `/`,
- **Then** the page renders an error panel showing (a) the absolute path to the file and (b) the parser error message. The HTTP status is 200, not 500.

### AC-5 — Live update on state change (R6)

- **Given** the dashboard is open,
- **When** an agent transitions a task from `pending` to `in_progress` via the MCP,
- **Then** the corresponding card moves columns within 2 seconds without a full-page reload.

### AC-6 — Disconnect banner (R7)

- **Given** the dashboard is open and the server is killed,
- **When** 3 consecutive update attempts fail,
- **Then** a banner with text "lost connection — retrying" appears at the top of the page; **and when** the server is restarted, the banner disappears on the next successful update.

### AC-7 — Combined filters (R8)

- **Given** the task set contains tasks across multiple agents and statuses,
- **When** the user selects agent=`frontend-developer` AND status=`in_progress` AND tag=`auth`,
- **Then** only cards matching all three predicates are visible; counts in column headers reflect the filtered set.

### AC-8 — Search (R9)

- **Given** at least one task has the substring "rate limit" in its description,
- **When** the user types `rate limit` into the search box,
- **Then** only cards whose `title`, `description`, or `result` contains that substring (case-insensitive) remain visible.

### AC-9 — Status not colour-only (R10)

- **Given** a screen reader OR a user with deuteranopia,
- **When** they perceive a task card,
- **Then** the status is identifiable from a non-colour cue (text label, icon, or shape) without reference to colour. (UX-SPEC owns the specific cue.)

### AC-10 — Task detail view (R11)

- **Given** the dashboard is open with at least one task,
- **When** the user activates a card (click or keyboard),
- **Then** a detail view renders the task's full description, full result, all artifacts as clickable links (`file:`, `http(s):`, or note text), each `dependsOn` ID as a link that opens that task's detail view, and the timestamps `createdAt` / `startedAt` / `completedAt`.

### AC-11 — Dependency graph (R12, P2)

- **Given** the task set contains at least one task with a non-empty `dependsOn`,
- **When** the user opens the graph view,
- **Then** the page renders a directed graph where nodes are tasks (labelled by ID + agent), edges go from dependency to dependent, and node colour matches status.

### AC-12 — Completion timeline (R13, P2)

- **Given** the task set contains at least one task with a non-null `completedAt`,
- **When** the user opens the timeline view,
- **Then** completed tasks are rendered as horizontal bars from `startedAt` to `completedAt`, ordered by `startedAt`, with the agent name as the row label.

## 6. Non-Goals

The dashboard explicitly does NOT ship the following in v1, and a PR proposing them should be redirected to a follow-up ADR:

- **Write actions.** Creating, editing, cancelling, or re-ordering tasks from the UI. The MCP is the write authority; mixing read and write paths invites contention.
- **Drag-and-drop status changes.** Statuses are agent-managed, not human-managed.
- **Multi-user / remote access.** Localhost-only. Any remote-access proposal needs its own ADR with auth and threat model.
- **Auth, sessions, or per-user views.** No login, no roles. One developer, one machine.
- **Persistent history beyond `tasks.json`.** No separate database; no archive of prior sessions. If the user wants history, they version `tasks.json` themselves.
- **Notifications (push, email, desktop, sound).** Out of scope for v1. The dashboard is a pull surface, not a push surface.
- **Mobile / responsive layout below tablet.** Optimised for desktop side-window use.
- **A SPA framework rewrite (React / Vue / Svelte).** Per ADR §7, the SSR + tiny client JS is the right size.
- **Production hardening (TLS, structured logs, health checks, metrics).** Local dev tool.
- **Internationalisation.** English only.
- **Theming beyond a single dark/light pair.** UX owns whether even that ships.

## 7. Open Questions

These resolve before the corresponding requirement enters implementation. Each is addressed to the named owner.

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q1 | Does the `task-tracker` MCP write `tasks.json` atomically (write-temp + rename)? If not, SSE on mtime can read a half-written file. | system-architect | R6 / SSE work |
| Q2 | What port-fallback strategy if 3000 is in use — increment, fail, or prompt? | product-manager + frontend-developer | R1 / AC-1 |
| Q3 | Drawer vs modal vs route for task detail (R11)? | ui-ux-designer | R11 / AC-10 |
| Q4 | Graph rendering approach (Mermaid vs vis.js vs hand-rolled SVG)? | ui-ux-designer + frontend-developer | R12 |
| Q5 | Should filter / search state survive a reload via querystring even in v1, or wait for P2 (R14)? | product-manager | R8 / R9 polish |
| Q6 | When a task is cancelled, does it stay visible (greyed) or disappear from the default view? | product-manager | R8 polish |

## 8. Prioritised Backlog (sequencing)

Order is RICE-informed (Reach × Impact × Confidence ÷ Effort). Reach = "fraction of dashboard users hit by this gap"; Impact = 1–3; Effort matches the architect's S/M sizing.

| Order | Item | R | I | C | E | Score | Tier | ADR ref |
|---|---|---|---|---|---|---|---|---|
| 1 | `/dev-team:dashboard` slash command + plugin wiring (R1) | 1.0 | 3 | 0.9 | S(1) | 2.7 | P0 | #3 |
| 2 | Localhost-only bind + README trust model (R2, R3) | 1.0 | 2 | 1.0 | XS(0.5) | 4.0 | P0 | #5 |
| 3 | Empty + error states (R4, R5) | 1.0 | 2 | 1.0 | S(1) | 2.0 | P0 | #4 |
| 4 | Status non-colour cue + a11y wiring (R10) | 0.6 | 2 | 0.9 | S(1) | 1.08 | P0 | #4 |
| 5 | SSE live updates + disconnect banner (R6, R7) | 1.0 | 3 | 0.7 | M(2) | 1.05 | P1 | #2 |
| 6 | Filter by agent / status / tag (R8) | 0.8 | 3 | 0.9 | S(1) | 2.16 | P1 | new |
| 7 | Free-text search (R9) | 0.7 | 2 | 0.9 | S(1) | 1.26 | P1 | new |
| 8 | Task detail view (R11) | 0.9 | 3 | 0.8 | M(2) | 1.08 | P1 | new |
| 9 | Dependency graph (R12) | 0.4 | 2 | 0.6 | M(2) | 0.24 | P2 | new |
| 10 | Completion timeline (R13) | 0.3 | 2 | 0.6 | M(2) | 0.18 | P2 | new |
| 11 | Filter / search state in URL (R14) | 0.3 | 1 | 0.8 | XS(0.5) | 0.48 | P2 | new |
| 12 | Per-agent throughput sparkline (R15) | 0.2 | 1 | 0.5 | S(1) | 0.10 | P2 | new |

The architect's ADR improvements #1 (deduplicate render code) and parts of #4 (a11y) are framed here as enablers — they unblock R8 / R10 / R11 by giving the frontend-developer a single component layer to extend. They do not need their own backlog rows in this PRD.

## 9. Hand-off

Implementation tasks below are created as `task-tracker` entries with `dependsOn: [<this PRD's task id>]`.

| Recipient | Title | Covers | Depends on |
|---|---|---|---|
| ui-ux-designer | UX-SPEC for empty/error/loading + status cue + detail view + filter bar | R4, R5, R7, R10, R11, AC-3, AC-4, AC-6, AC-9, AC-10, Q3 | this PRD |
| frontend-developer | Implement P0 stack: slash command + localhost bind + README + empty/error states + a11y status cue | R1–R5, R10 | UX-SPEC |
| frontend-developer | Implement P1 stack: SSE + disconnect banner + filters + search + detail view | R6–R9, R11 | UX-SPEC, ADR Q1 resolved |
| system-architect | Verify `task-tracker` writes `tasks.json` atomically (Q1) | unblocks R6 | ADR §5 |

## 10. Glossary

- **Task state** — the four agent-managed values (`pending`, `in_progress`, `blocked`, `completed`, `cancelled`) on a `Task`. Mirrored in `dashboard/src/types.ts`.
- **Live update** — any mechanism (SSE in v1, polling in v0) that refreshes the dashboard within 2 s of a task mutation.
- **Detail view** — a per-task surface showing all fields including `dependsOn` and `artifacts`. Form factor (drawer / modal / route) is UX-owned.
- **Artifact** — a `{kind, path}` tuple on a task, where `kind ∈ {"file", "url", "note"}`.
