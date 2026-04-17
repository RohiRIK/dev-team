import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { join } from "node:path"
import { stateDir } from "../store.ts"

const saved: Record<string, string | undefined> = {}

beforeEach(() => {
  saved.DEV_TEAM_STATE_DIR = process.env.DEV_TEAM_STATE_DIR
  saved.CLAUDE_PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR
  delete process.env.DEV_TEAM_STATE_DIR
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
