/**
 * Test fixtures for dashboard E2E tests.
 *
 * Provides:
 *  - makeWorkspace(tasks?)  — writes a temp .dev-team/tasks.json and returns its dir
 *  - startServer(workspace) — spawns `bun src/server.ts` bound to PORT 3099 against workspace
 *  - stopServer()           — kills the spawned process
 *
 * Using a fixed port (3099) is fine because tests run serially (workers:1).
 */

import { type ChildProcess, spawn } from "node:child_process"
import { mkdir, rm, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import type { TaskState } from "../src/types.ts"

// import.meta.dir is Bun-only; derive dirname from import.meta.url for Node/Playwright compat
const _dirname =
  typeof import.meta.dir === "string"
    ? import.meta.dir
    : dirname(fileURLToPath(import.meta.url))

const DASHBOARD_DIR = join(_dirname, "..")
export const PORT = 3099
export const BASE_URL = `http://127.0.0.1:${PORT}`

export const NOW = "2026-04-27T10:00:00.000Z"

/** Minimal valid TaskState with zero tasks */
export const EMPTY_STATE: TaskState = {
  version: 1,
  sessionId: "sess-test",
  updatedAt: NOW,
  tasks: [],
}

/** One task per status for filter/render tests */
export function makeFullState(): TaskState {
  return {
    version: 1,
    sessionId: "sess-test",
    updatedAt: NOW,
    tasks: [
      {
        id: "t_pending",
        agent: "frontend-developer",
        title: "Build login page",
        description: "rate limit the login endpoint so it does not get brute-forced",
        status: "pending",
        dependsOn: [],
        createdAt: NOW,
        updatedAt: NOW,
        startedAt: null,
        completedAt: null,
        result: null,
        artifacts: [],
        tags: ["auth"],
      },
      {
        id: "t_in_progress",
        agent: "backend-developer",
        title: "Add JWT auth",
        description: "backend jwt implementation",
        status: "in_progress",
        dependsOn: ["t_pending"],
        createdAt: NOW,
        updatedAt: NOW,
        startedAt: NOW,
        completedAt: null,
        result: null,
        artifacts: [
          { kind: "file", path: "/src/auth.ts" },
          { kind: "url", path: "https://example.com/docs" },
        ],
        tags: ["auth", "backend"],
      },
      {
        id: "t_blocked",
        agent: "qa-tester",
        title: "Write auth tests",
        description: "blocked on JWT auth",
        status: "blocked",
        dependsOn: ["t_in_progress"],
        createdAt: NOW,
        updatedAt: NOW,
        startedAt: null,
        completedAt: null,
        result: null,
        artifacts: [],
        tags: ["auth"],
      },
      {
        id: "t_completed",
        agent: "product-manager",
        title: "Write PRD",
        description: "write the product requirements",
        status: "completed",
        dependsOn: [],
        createdAt: NOW,
        updatedAt: NOW,
        startedAt: NOW,
        completedAt: NOW,
        result: "PRD written and approved",
        artifacts: [{ kind: "note", path: "Stakeholder approved" }],
        tags: ["docs"],
      },
      {
        id: "t_cancelled",
        agent: "devops-engineer",
        title: "Set up staging env",
        description: "cancelled due to budget",
        status: "cancelled",
        dependsOn: [],
        createdAt: NOW,
        updatedAt: NOW,
        startedAt: null,
        completedAt: null,
        result: null,
        artifacts: [],
        tags: [],
      },
    ],
  }
}

/** Make 110 tasks for large-board regression */
export function makeLargeState(): TaskState {
  const statuses = ["pending", "in_progress", "completed"] as const
  const tasks = Array.from({ length: 110 }, (_, i) => ({
    id: `t_large_${i}`,
    agent: "backend-developer",
    title: `Task ${i}`,
    description: `Description ${i}`,
    status: statuses[i % 3],
    dependsOn: [] as string[],
    createdAt: NOW,
    updatedAt: NOW,
    startedAt: null as string | null,
    completedAt: null as string | null,
    result: null as string | null,
    artifacts: [] as { kind: "file" | "url" | "note"; path: string }[],
    tags: [] as string[],
  }))
  return { version: 1, sessionId: "sess-test", updatedAt: NOW, tasks }
}

/* ── Workspace helpers ─────────────────────────────────────────────────── */

export async function makeWorkspace(state?: TaskState | "missing" | "malformed"): Promise<string> {
  const dir = await mkTempDir()
  const devTeamDir = join(dir, ".dev-team")
  await mkdir(devTeamDir, { recursive: true })

  if (state === "missing") {
    // Do not write the file — ENOENT case
  } else if (state === "malformed") {
    await writeFile(join(devTeamDir, "tasks.json"), "{ NOT VALID JSON !!!")
  } else {
    const s = state ?? EMPTY_STATE
    await writeFile(join(devTeamDir, "tasks.json"), JSON.stringify(s, null, 2))
  }

  return dir
}

export async function cleanWorkspace(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true })
}

async function mkTempDir(): Promise<string> {
  const base = join(
    tmpdir(),
    `dashboard-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )
  await mkdir(base, { recursive: true })
  return base
}

/* ── Server lifecycle ──────────────────────────────────────────────────── */

let _proc: ChildProcess | null = null

export async function startServer(workspace: string): Promise<void> {
  if (_proc) await stopServer()

  await new Promise<void>((resolve, reject) => {
    _proc = spawn("bun", ["src/server.ts"], {
      cwd: DASHBOARD_DIR,
      env: {
        ...process.env,
        PORT: String(PORT),
        DEV_TEAM_WORKSPACE: workspace,
      },
      stdio: ["ignore", "pipe", "pipe"],
    })

    _proc.on("error", reject)

    let ready = false
    _proc.stdout?.on("data", (chunk: Buffer) => {
      if (!ready && chunk.toString().includes("dashboard →")) {
        ready = true
        resolve()
      }
    })
    _proc.stderr?.on("data", () => {
      /* absorb stderr */
    })

    // Timeout if server never prints the ready line
    setTimeout(() => {
      if (!ready) reject(new Error("Server did not start within 10 s"))
    }, 10_000)
  })
}

export async function stopServer(): Promise<void> {
  if (!_proc) return
  _proc.kill("SIGTERM")
  await new Promise<void>((r) => {
    _proc!.once("exit", r)
    setTimeout(r, 2_000) // fallback
  })
  _proc = null
}
