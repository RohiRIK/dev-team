import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { ensureGitignored, saveState, stateDir } from "../store.ts"
import { emptyState } from "../types.ts"

const saved: Record<string, string | undefined> = {}

beforeEach(() => {
  saved.DEV_TEAM_STATE_DIR = process.env.DEV_TEAM_STATE_DIR
  saved.CLAUDE_PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR
  // biome-ignore lint/performance/noDelete: process.env delete is required to fully unset keys for test isolation
  delete process.env.DEV_TEAM_STATE_DIR
  // biome-ignore lint/performance/noDelete: process.env delete is required to fully unset keys for test isolation
  delete process.env.CLAUDE_PROJECT_DIR
})

afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k]
    else process.env[k] = v
  }
})

describe("stateDir", () => {
  test("uses DEV_TEAM_STATE_DIR when set and fully resolved", () => {
    process.env.DEV_TEAM_STATE_DIR = "/tmp/custom"
    expect(stateDir()).toBe("/tmp/custom")
  })

  test("falls back when DEV_TEAM_STATE_DIR contains unexpanded ${...}", () => {
    process.env.DEV_TEAM_STATE_DIR = "${CLAUDE_PROJECT_DIR}/.dev-team"
    process.env.CLAUDE_PROJECT_DIR = "/workspace"
    expect(stateDir()).toBe("/workspace/.dev-team")
  })

  test("uses CLAUDE_PROJECT_DIR + /.dev-team when DEV_TEAM_STATE_DIR is unset", () => {
    process.env.CLAUDE_PROJECT_DIR = "/workspace"
    expect(stateDir()).toBe("/workspace/.dev-team")
  })

  test("falls back to cwd/.dev-team when both env vars are unset", () => {
    expect(stateDir()).toBe(join(process.cwd(), ".dev-team"))
  })
})

describe("ensureGitignored", () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "dev-team-gitignore-"))
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  test("creates .gitignore inside a repo that has none", async () => {
    await mkdir(join(dir, ".git"))
    await ensureGitignored(dir)
    const body = await readFile(join(dir, ".gitignore"), "utf8")
    expect(body).toContain(".dev-team/")
  })

  test("appends entry when .gitignore exists without it", async () => {
    await mkdir(join(dir, ".git"))
    await writeFile(join(dir, ".gitignore"), "node_modules\ndist\n", "utf8")
    await ensureGitignored(dir)
    const body = await readFile(join(dir, ".gitignore"), "utf8")
    expect(body).toContain("node_modules")
    expect(body).toContain(".dev-team/")
  })

  test("is idempotent when entry already present (with or without trailing slash)", async () => {
    await mkdir(join(dir, ".git"))
    await writeFile(join(dir, ".gitignore"), "node_modules\n.dev-team\n", "utf8")
    const before = await readFile(join(dir, ".gitignore"), "utf8")
    await ensureGitignored(dir)
    await ensureGitignored(dir)
    const after = await readFile(join(dir, ".gitignore"), "utf8")
    expect(after).toBe(before)
    const matches = after.match(/^\.dev-team\/?$/gm)
    expect(matches?.length).toBe(1)
  })

  test("no-op outside a git repo — no .gitignore created", async () => {
    await ensureGitignored(dir)
    await expect(readFile(join(dir, ".gitignore"), "utf8")).rejects.toThrow()
  })

  test("finds repo root in a nested subdirectory", async () => {
    await mkdir(join(dir, ".git"))
    const nested = join(dir, "a", "b", "c")
    await mkdir(nested, { recursive: true })
    await ensureGitignored(nested)
    const body = await readFile(join(dir, ".gitignore"), "utf8")
    expect(body).toContain(".dev-team/")
  })
})

describe("saveState gitignore integration", () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "dev-team-save-"))
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  test("saveState bootstraps .gitignore when run inside a repo", async () => {
    await mkdir(join(dir, ".git"))
    process.env.CLAUDE_PROJECT_DIR = dir
    await saveState(emptyState())
    const body = await readFile(join(dir, ".gitignore"), "utf8")
    expect(body).toContain(".dev-team/")
    const tasksPath = join(dir, ".dev-team", "tasks.json")
    const tasks = await readFile(tasksPath, "utf8")
    expect(JSON.parse(tasks).tasks).toEqual([])
  })
})
