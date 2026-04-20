import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const serverPath = join(dirname(fileURLToPath(import.meta.url)), "..", "index.ts")

let stateDir: string
let client: Client
let transport: StdioClientTransport

const call = async (name: string, args: Record<string, unknown>): Promise<unknown> => {
  const res = (await client.callTool({ name, arguments: args })) as {
    isError?: boolean
    content: { type: string; text: string }[]
  }
  const body = res.content[0]?.text ?? ""
  if (res.isError) throw new Error(`${name} failed: ${body}`)
  return body ? JSON.parse(body) : null
}

beforeEach(async () => {
  stateDir = await mkdtemp(join(tmpdir(), "task-tracker-it-"))
  transport = new StdioClientTransport({
    command: "bun",
    args: [serverPath],
    env: { ...process.env, DEV_TEAM_STATE_DIR: stateDir },
  })
  client = new Client({ name: "it-test", version: "0.0.0" }, { capabilities: {} })
  await client.connect(transport)
})

afterEach(async () => {
  await client.close()
  await rm(stateDir, { recursive: true, force: true })
})

describe("task-tracker stdio integration", () => {
  test("lists all 6 tools", async () => {
    const { tools } = await client.listTools()
    expect(tools.map((t) => t.name).sort()).toEqual([
      "complete_task",
      "create_task",
      "get_task",
      "health",
      "list_tasks",
      "update_task",
    ])
  })

  test("full lifecycle: create → list → get → update → complete → persists to disk", async () => {
    const created = (await call("create_task", {
      agent: "backend-developer",
      title: "Ship /health",
    })) as { id: string; status: string }
    expect(created.id).toMatch(/^t_[0-9A-HJKMNP-TV-Z]{26}$/)
    expect(created.status).toBe("pending")

    const list = (await call("list_tasks", {})) as unknown[]
    expect(list).toHaveLength(1)

    const full = (await call("get_task", { id: created.id })) as { title: string }
    expect(full.title).toBe("Ship /health")

    const updated = (await call("update_task", {
      id: created.id,
      status: "in_progress",
    })) as { startedAt: string | null; status: string }
    expect(updated.status).toBe("in_progress")
    expect(updated.startedAt).not.toBeNull()

    const done = (await call("complete_task", {
      id: created.id,
      result: "200 OK at /health",
    })) as { status: string; completedAt: string | null }
    expect(done.status).toBe("completed")
    expect(done.completedAt).not.toBeNull()

    const raw = await readFile(join(stateDir, "tasks.json"), "utf8")
    const parsed = JSON.parse(raw) as { tasks: { status: string }[] }
    expect(parsed.tasks[0]?.status).toBe("completed")
  })

  test("returns isError on validation failure", async () => {
    const res = (await client.callTool({
      name: "create_task",
      arguments: { agent: "backend-developer", title: "" },
    })) as { isError?: boolean }
    expect(res.isError).toBe(true)
  })

  test("rejects complete while deps unmet", async () => {
    const a = (await call("create_task", {
      agent: "backend-developer",
      title: "A",
    })) as { id: string }
    const b = (await call("create_task", {
      agent: "backend-developer",
      title: "B",
      dependsOn: [a.id],
    })) as { id: string }
    const res = (await client.callTool({
      name: "complete_task",
      arguments: { id: b.id },
    })) as { isError?: boolean; content: { text: string }[] }
    expect(res.isError).toBe(true)
    expect(res.content[0]?.text).toMatch(/dependenc/i)
  })
})
