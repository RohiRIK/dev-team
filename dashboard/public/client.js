/* dev-team dashboard — vanilla client.
 * SSE live updates, agent/status/tag filters, search, detail drawer,
 * connection banner.  No framework, no build step.
 */
;(() => {
  const $ = (id) => document.getElementById(id)
  const board = $("board")
  const toggle = $("poll-toggle")
  const refreshBtn = $("refresh-btn")
  const agentFilter = $("agent-filter")
  const statusFilter = $("status-filter")
  const tagFilter = $("tag-filter")
  const searchInput = $("search-input")
  const lastTime = $("last-time")
  const connState = $("conn-state")
  const connBanner = $("conn-banner")
  const retryNow = $("retry-now")
  const srLive = $("sr-live")
  const drawer = $("drawer")
  const drawerBody = $("drawer-body")
  const drawerClose = $("drawer-close")

  let polling = true
  let consecutiveFailures = 0
  let evtSource = null
  let pollInterval = null
  let lastFocusedCard = null
  let allTasks = []
  let announceTimer = 0

  /* ── Connection state (UX-SPEC §4.4 / §4.6) ───────────────────────── */

  function setConnState(state) {
    connState.dataset.state = state
    if (state === "connected") {
      connState.textContent = "● live"
    } else if (state === "connecting") {
      connState.textContent = "● connecting…"
    } else if (state === "lost") {
      connState.textContent = "○ paused"
    }
    connBanner.dataset.visible = state === "lost" ? "true" : "false"
  }

  /* ── Filter state ─────────────────────────────────────────────────── */

  function applyFilters() {
    const agent = agentFilter.value
    const status = statusFilter.value
    const tag = tagFilter.value
    const q = (searchInput.value || "").trim().toLowerCase()
    let visible = 0

    document.querySelectorAll(".card").forEach((card) => {
      const ca = card.dataset.agent || ""
      const cs = card.dataset.status || ""
      const ct = (card.dataset.tags || "").split(/\s+/)
      const cq = card.dataset.search || ""
      const ok =
        (agent === "all" || ca === agent) &&
        (status === "all" || cs === status) &&
        (tag === "all" || ct.includes(tag)) &&
        (q === "" || cq.includes(q))
      card.hidden = !ok
      if (ok) visible++
    })

    /* Per-column counts: show filtered count in header text. */
    document.querySelectorAll(".column").forEach((col) => {
      const visibleCards = col.querySelectorAll(".card:not([hidden])").length
      const heading = col.querySelector("h2")
      const count = col.querySelector(".count")
      if (count) count.textContent = String(visibleCards)
      if (heading) {
        const label =
          heading.dataset.label || heading.textContent.replace(/\s*tasks\s*\(\d+\)\s*$/, "").trim()
        heading.dataset.label = label
        heading.textContent = `${label} tasks (${visibleCards})`
      }
    })

    announce(`Showing ${visible} task${visible === 1 ? "" : "s"}`)
  }

  function announce(msg) {
    if (!srLive) return
    const now = Date.now()
    if (now - announceTimer < 800) return
    announceTimer = now
    srLive.textContent = msg
  }

  /* ── Drawer (task detail) ─────────────────────────────────────────── */

  function openDrawer(taskId) {
    const task = allTasks.find((t) => t.id === taskId)
    if (!task) return
    drawerBody.innerHTML = renderDetail(task)
    drawer.dataset.open = "true"
    drawer.setAttribute("aria-hidden", "false")
    drawerClose.focus()
  }

  function closeDrawer() {
    drawer.dataset.open = "false"
    drawer.setAttribute("aria-hidden", "true")
    if (lastFocusedCard && document.contains(lastFocusedCard)) {
      lastFocusedCard.focus()
    }
  }

  function escHtml(s) {
    return String(s || "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    )
  }

  function renderArtifact(a) {
    const path = escHtml(a.path)
    if (a.kind === "url")
      return `<li><a href="${path}" target="_blank" rel="noopener">${path}</a></li>`
    if (a.kind === "file") return `<li><code>${path}</code></li>`
    return `<li>${path}</li>`
  }

  function renderDetail(t) {
    const arts = (t.artifacts || []).map(renderArtifact).join("")
    const deps = (t.dependsOn || [])
      .map(
        (id) =>
          `<button class="dep-link" data-dep-id="${escHtml(id)}"><code>${escHtml(id)}</code></button>`,
      )
      .join(" ")
    const tags = (t.tags || []).map((x) => `<span class="tag">${escHtml(x)}</span>`).join(" ")
    return `
      <h2 id="drawer-title">${escHtml(t.title)}</h2>
      <dl>
        <dt>ID</dt><dd><code>${escHtml(t.id)}</code></dd>
        <dt>Agent</dt><dd>${escHtml(t.agent)}</dd>
        <dt>Status</dt><dd>${escHtml(t.status)}</dd>
        ${tags ? `<dt>Tags</dt><dd>${tags}</dd>` : ""}
        <dt>Description</dt><dd>${escHtml(t.description) || "<em>(none)</em>"}</dd>
        ${t.result ? `<dt>Result</dt><dd>${escHtml(t.result)}</dd>` : ""}
        ${arts ? `<dt>Artifacts</dt><dd><ul>${arts}</ul></dd>` : ""}
        ${deps ? `<dt>Depends on</dt><dd>${deps}</dd>` : ""}
        <dt>Created</dt><dd>${escHtml(t.createdAt)}</dd>
        ${t.startedAt ? `<dt>Started</dt><dd>${escHtml(t.startedAt)}</dd>` : ""}
        ${t.completedAt ? `<dt>Completed</dt><dd>${escHtml(t.completedAt)}</dd>` : ""}
      </dl>`
  }

  /* ── Refresh: pull HTML partial + JSON for drawer/filters ─────────── */

  async function refreshPanels() {
    try {
      const [graphRes, timelineRes] = await Promise.all([
        fetch("/graph"),
        fetch("/timeline"),
      ])
      if (graphRes.ok) {
        const html = await graphRes.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
        const incoming = doc.querySelector(".graph-main")
        const existing = document.querySelector(".panel-graph .panel-graph-body")
        if (incoming && existing) {
          const link = existing.querySelector(".panel-link")
          existing.innerHTML = (link ? link.outerHTML : "") + incoming.innerHTML
        }
      }
      if (timelineRes.ok) {
        const html = await timelineRes.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
        const incoming = doc.querySelector(".graph-main")
        const existing = document.querySelector(".panel-timeline .panel-timeline-body")
        if (incoming && existing) {
          const link = existing.querySelector(".panel-link")
          existing.innerHTML = (link ? link.outerHTML : "") + incoming.innerHTML
        }
      }
    } catch (_e) {
      /* panels are non-critical; fail silently */
    }
  }

  async function refresh() {
    try {
      const url = "/api/tasks"
      const [htmlRes, jsonRes] = await Promise.all([fetch(url), fetch(url + "?json=1")])
      if (!htmlRes.ok || !jsonRes.ok) throw new Error("fetch failed")
      const html = await htmlRes.text()
      const data = await jsonRes.json()
      allTasks = Array.isArray(data.tasks) ? data.tasks : []
      board.innerHTML = html
      lastTime.textContent = new Date().toLocaleTimeString()
      consecutiveFailures = 0
      setConnState(evtSource && evtSource.readyState === 1 ? "connected" : "connecting")
      applyFilters()
      rebuildTagFilterIfNeeded()
      refreshPanels()
    } catch (_e) {
      consecutiveFailures++
      if (consecutiveFailures >= 3) setConnState("lost")
    }
  }

  function rebuildTagFilterIfNeeded() {
    const seen = new Set()
    allTasks.forEach((t) => (t.tags || []).forEach((x) => seen.add(x)))
    const tags = [...seen].sort()
    const current = tagFilter.value
    const want =
      `<option value="all">All tags</option>` +
      tags.map((x) => `<option value="${escHtml(x)}">${escHtml(x)}</option>`).join("")
    if (tagFilter.innerHTML !== want) {
      tagFilter.innerHTML = want
      tagFilter.value = tags.includes(current) ? current : "all"
    }
  }

  /* ── SSE ──────────────────────────────────────────────────────────── */

  function openSSE() {
    if (evtSource) evtSource.close()
    setConnState("connecting")
    try {
      evtSource = new EventSource("/api/events")
      evtSource.addEventListener("open", () => setConnState("connected"))
      evtSource.addEventListener("tasks-updated", () => {
        if (polling) refresh()
      })
      evtSource.addEventListener("error", () => {
        consecutiveFailures++
        if (consecutiveFailures >= 3) setConnState("lost")
      })
    } catch (_e) {
      setConnState("lost")
    }
  }

  function closeSSE() {
    if (evtSource) {
      evtSource.close()
      evtSource = null
    }
  }

  /* ── Polling fallback (when SSE not used) ─────────────────────────── */

  function startPollingFallback() {
    if (pollInterval) clearInterval(pollInterval)
    pollInterval = setInterval(() => {
      if (polling) refresh()
    }, 2000)
  }

  /* ── Wire up ──────────────────────────────────────────────────────── */

  toggle.addEventListener("click", () => {
    polling = !polling
    toggle.setAttribute("aria-pressed", String(polling))
    if (polling) {
      toggle.textContent = "● live"
      toggle.className = "poll-on"
      openSSE()
    } else {
      toggle.textContent = "○ paused"
      toggle.className = "poll-off"
      closeSSE()
    }
  })

  refreshBtn.addEventListener("click", refresh)
  retryNow.addEventListener("click", () => {
    consecutiveFailures = 0
    refresh()
    openSSE()
  })

  agentFilter.addEventListener("change", applyFilters)
  statusFilter.addEventListener("change", applyFilters)
  tagFilter.addEventListener("change", applyFilters)
  searchInput.addEventListener("input", applyFilters)

  /* Esc on filters resets to "all". */
  ;[agentFilter, statusFilter, tagFilter].forEach((sel) => {
    sel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        sel.value = "all"
        applyFilters()
      }
    })
  })

  /* Card click / Enter / Space → drawer. Delegated. */
  board.addEventListener("click", (e) => {
    const card = e.target.closest(".card")
    if (!card) return
    lastFocusedCard = card
    openDrawer(card.dataset.taskId)
  })
  board.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return
    const card = e.target.closest(".card")
    if (!card) return
    e.preventDefault()
    lastFocusedCard = card
    openDrawer(card.dataset.taskId)
  })

  /* Drawer dependency clicks → reopen for that task. */
  drawer.addEventListener("click", (e) => {
    const dep = e.target.closest(".dep-link")
    if (dep) {
      openDrawer(dep.dataset.depId)
      return
    }
    if (e.target === drawer) closeDrawer()
  })
  drawerClose.addEventListener("click", closeDrawer)

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.dataset.open === "true") closeDrawer()
  })

  /* Initial run: skip refresh when SSR already rendered zero tasks to avoid
   * overwriting the .empty-board with empty column shells. The SSE
   * tasks-updated handler still calls refresh() unconditionally so any
   * subsequent change to a non-empty state is picked up immediately. */
  const initialTaskCount = Number(board.dataset.taskCount ?? "-1")
  const initialRefresh = initialTaskCount === 0 ? Promise.resolve() : refresh()
  initialRefresh.then(() => {
    if (typeof EventSource === "function") {
      openSSE()
    } else {
      startPollingFallback()
    }
  })
})()
