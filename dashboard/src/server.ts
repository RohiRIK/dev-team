import { type FSWatcher, watch } from "node:fs"
import { dirname, join } from "node:path"
import {
  renderColumns,
  renderErrorPage,
  renderGraphPage,
  renderPage,
  renderTimelinePage,
} from "./components.ts"
import type { Task } from "./types.ts"
import { TasksParseError, loadTasks, resolveWorkspace, tasksFilePath } from "./store.ts"

const PORT = Number(process.env.PORT ?? 3000)
const HOST = "127.0.0.1"
const PUBLIC_DIR = join(import.meta.dir, "..", "public")

/* ── SSE pub/sub (UX-SPEC §4.4 — fs.watch on tasks dir) ──────────────── */

type Subscriber = (data: string) => void
const subscribers = new Set<Subscriber>()

function broadcast(eventName: string, payload: string): void {
  const frame = `event: ${eventName}\ndata: ${payload}\n\n`
  for (const send of subscribers) {
    try {
      send(frame)
    } catch {
      /* dead subscriber — its readable stream will be cleaned up on close */
    }
  }
}

/** Watch the .dev-team directory (not the file directly). Atomic writes
 *  rename a temp file over tasks.json, which fs.watch on the file handle
 *  may miss. Watching the parent dir catches every rename. */
function startWatcher(): FSWatcher | null {
  const path = tasksFilePath()
  const dir = dirname(path)
  try {
    let lastTick = 0
    const watcher = watch(dir, { persistent: true }, (_evt, filename) => {
      if (filename !== "tasks.json" && filename !== null) return
      const now = Date.now()
      if (now - lastTick < 50) return // dedupe duplicate fs events
      lastTick = now
      broadcast("tasks-updated", String(now))
    })
    watcher.on("error", (err) => {
      process.stderr.write(`[dashboard] watcher error: ${err.message}\n`)
    })
    return watcher
  } catch (err) {
    process.stderr.write(
      `[dashboard] fs.watch failed (${(err as Error).message}); SSE will idle, clients fall back to polling.\n`,
    )
    return null
  }
}

/* ── Shared page-route handler ────────────────────────────────────────── */

const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" } as const

async function handlePageRoute(render: (tasks: Task[]) => string): Promise<Response> {
  try {
    const state = await loadTasks()
    return new Response(render(state.tasks), { headers: HTML_HEADERS })
  } catch (err) {
    if (err instanceof TasksParseError) {
      return new Response(renderErrorPage(err.path, err.message), { status: 200, headers: HTML_HEADERS })
    }
    throw err
  }
}

/* ── Static asset serving (public/) ──────────────────────────────────── */

async function serveStatic(pathname: string): Promise<Response | null> {
  const allowed: Record<string, string> = {
    "/styles.css": "text/css; charset=utf-8",
    "/client.js": "application/javascript; charset=utf-8",
  }
  const ct = allowed[pathname]
  if (!ct) return null
  const file = Bun.file(join(PUBLIC_DIR, pathname))
  if (!(await file.exists())) return null
  return new Response(file, {
    headers: { "content-type": ct, "cache-control": "no-cache" },
  })
}

/* ── HTTP handler ────────────────────────────────────────────────────── */

const server = Bun.serve({
  port: PORT,
  hostname: HOST,

  async fetch(req) {
    const url = new URL(req.url)

    /* Static assets */
    const asset = await serveStatic(url.pathname)
    if (asset) return asset

    /* SSE — long-lived stream */
    if (url.pathname === "/api/events") {
      const stream = new ReadableStream({
        start(controller) {
          const enc = new TextEncoder()
          const send: Subscriber = (data) => controller.enqueue(enc.encode(data))
          subscribers.add(send)
          send("event: open\ndata: ready\n\n")

          const ping = setInterval(() => {
            try {
              send(": ping\n\n")
            } catch {
              clearInterval(ping)
            }
          }, 25_000)

          req.signal.addEventListener("abort", () => {
            clearInterval(ping)
            subscribers.delete(send)
            try {
              controller.close()
            } catch {
              /* already closed */
            }
          })
        },
      })

      return new Response(stream, {
        headers: {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache, no-transform",
          connection: "keep-alive",
          "x-accel-buffering": "no",
        },
      })
    }

    /* Full page */
    if (url.pathname === "/") {
      try {
        const state = await loadTasks()
        const agent = url.searchParams.get("agent") ?? "all"
        return new Response(renderPage({ state, selectedAgent: agent }), {
          headers: { "content-type": "text/html; charset=utf-8" },
        })
      } catch (err) {
        if (err instanceof TasksParseError) {
          return new Response(renderErrorPage(err.path, err.message), {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8" },
          })
        }
        throw err
      }
    }

    /* Partial / JSON */
    if (url.pathname === "/api/tasks") {
      try {
        const state = await loadTasks()
        const agentFilter = url.searchParams.get("agent")
        const tasks =
          agentFilter && agentFilter !== "all"
            ? state.tasks.filter((t) => t.agent === agentFilter)
            : state.tasks

        if (url.searchParams.has("json")) {
          return Response.json({ ...state, tasks })
        }
        return new Response(
          renderColumns(tasks, agentFilter && agentFilter !== "all" ? agentFilter : null),
          { headers: { "content-type": "text/html; charset=utf-8" } },
        )
      } catch (err) {
        if (err instanceof TasksParseError) {
          return Response.json(
            { error: "parse_error", path: err.path, message: err.message },
            { status: 500 },
          )
        }
        throw err
      }
    }

    if (url.pathname === "/graph") return handlePageRoute(renderGraphPage)
    if (url.pathname === "/timeline") return handlePageRoute(renderTimelinePage)

    return new Response("Not found", { status: 404 })
  },
})

const watcher = startWatcher()

const url = `http://${server.hostname}:${server.port}`
process.stdout.write(`dashboard → ${url}\n`)
process.stdout.write(`workspace  ${resolveWorkspace()}\n`)

function shutdown(): void {
  watcher?.close()
  server.stop()
  process.exit(0)
}
process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
