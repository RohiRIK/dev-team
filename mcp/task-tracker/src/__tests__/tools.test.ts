import { describe, expect, test } from "bun:test"
import { completeTask } from "../tools/completeTask.ts"
import { createTask } from "../tools/createTask.ts"
import { getTask } from "../tools/getTask.ts"
import { listTasks } from "../tools/listTasks.ts"
import { updateTask } from "../tools/updateTask.ts"
import { type State, emptyState } from "../types.ts"

const seed = (): State => emptyState()

const addOne = (
  state: State,
  partial: { agent?: string; title?: string; dependsOn?: string[] } = {},
): { state: State; id: string } => {
  const next = createTask(state, {
    agent: partial.agent ?? "backend-developer",
    title: partial.title ?? "Add /health endpoint",
    dependsOn: partial.dependsOn,
  })
  return { state: next.state, id: next.result.id }
}

describe("createTask", () => {
  test("creates a pending task with ULID id and defaults", () => {
    const { state, result } = createTask(seed(), {
      agent: "backend-developer",
      title: "Add /health endpoint",
    })
    expect(result.id).toMatch(/^t_[0-9A-HJKMNP-TV-Z]{26}$/)
    expect(result.status).toBe("pending")
    expect(state.tasks).toHaveLength(1)
    const [task] = state.tasks
    if (!task) throw new Error("expected task")
    expect(task.agent).toBe("backend-developer")
    expect(task.description).toBe("")
    expect(task.dependsOn).toEqual([])
    expect(task.createdAt).toBe(task.updatedAt)
    expect(task.startedAt).toBeNull()
  })

  test("rejects empty title", () => {
    expect(() => createTask(seed(), { agent: "backend-developer", title: "" })).toThrow()
  })

  test("rejects title over 200 chars", () => {
    expect(() =>
      createTask(seed(), { agent: "backend-developer", title: "x".repeat(201) }),
    ).toThrow()
  })

  test("rejects dependsOn referencing unknown task", () => {
    expect(() =>
      createTask(seed(), {
        agent: "backend-developer",
        title: "depends on nothing",
        dependsOn: ["t_01ABC00000000000000000000000"],
      }),
    ).toThrow(/unknown.+dependency/i)
  })

  test("accepts dependsOn referencing existing task", () => {
    const { state: s1, id: a } = addOne(seed())
    const { state: s2 } = addOne(s1, { title: "second", dependsOn: [a] })
    expect(s2.tasks).toHaveLength(2)
    expect(s2.tasks[1]?.dependsOn).toEqual([a])
  })
})

describe("listTasks", () => {
  test("returns only summary fields (id, agent, title, status, updatedAt)", () => {
    const { state } = addOne(seed())
    const rows = listTasks(state, {})
    expect(rows).toHaveLength(1)
    const [row] = rows
    if (!row) throw new Error("expected one row")
    expect(Object.keys(row).sort()).toEqual(["agent", "id", "status", "title", "updatedAt"])
  })

  test("filters by status", () => {
    const { state: s1, id } = addOne(seed())
    const { state: s2 } = addOne(s1, { title: "other" })
    const s3 = updateTask(s2, { id, status: "completed" }).state
    expect(listTasks(s3, { status: "completed" })).toHaveLength(1)
    expect(listTasks(s3, { status: "pending" })).toHaveLength(1)
  })

  test("filters by agent", () => {
    const { state: s1 } = addOne(seed(), { agent: "backend-developer" })
    const { state: s2 } = addOne(s1, { agent: "frontend-developer", title: "ui" })
    expect(listTasks(s2, { agent: "backend-developer" })).toHaveLength(1)
  })

  test("respects limit", () => {
    let s = seed()
    for (let i = 0; i < 5; i++) s = addOne(s, { title: `task ${i}` }).state
    expect(listTasks(s, { limit: 2 })).toHaveLength(2)
  })
})

describe("getTask", () => {
  test("returns full row for known id", () => {
    const { state, id } = addOne(seed())
    const row = getTask(state, { id })
    expect(row.id).toBe(id)
    expect(row.agent).toBe("backend-developer")
  })

  test("throws on unknown id", () => {
    expect(() => getTask(seed(), { id: "t_01ABC00000000000000000000000" })).toThrow(/not found/i)
  })
})

describe("updateTask", () => {
  test("updates description and bumps updatedAt", async () => {
    const { state, id } = addOne(seed())
    const originalTs = state.tasks[0]?.updatedAt
    await Bun.sleep(10)
    const next = updateTask(state, { id, description: "fleshed out" }).state
    const row = next.tasks[0]
    if (!row) throw new Error("expected task")
    expect(row.description).toBe("fleshed out")
    expect(row.updatedAt).not.toBe(originalTs)
  })

  test("transitions pending → in_progress sets startedAt", () => {
    const { state, id } = addOne(seed())
    const next = updateTask(state, { id, status: "in_progress" }).state
    const row = next.tasks[0]
    if (!row) throw new Error("expected task")
    expect(row.status).toBe("in_progress")
    expect(row.startedAt).not.toBeNull()
  })

  test("rejects unknown id", () => {
    expect(() =>
      updateTask(seed(), {
        id: "t_01ABC00000000000000000000000",
        status: "completed",
      }),
    ).toThrow(/not found/i)
  })

  test("rejects completing a task whose dependsOn is not completed", () => {
    const { state: s1, id: a } = addOne(seed())
    const { state: s2, id: b } = addOne(s1, { title: "B", dependsOn: [a] })
    expect(() => updateTask(s2, { id: b, status: "completed" })).toThrow(/dependenc/i)
  })
})

describe("completeTask", () => {
  test("sets status=completed, completedAt, returns row", () => {
    const { state, id } = addOne(seed())
    const { state: next, result } = completeTask(state, { id, result: "shipped" })
    const row = next.tasks[0]
    if (!row) throw new Error("expected task")
    expect(row.status).toBe("completed")
    expect(row.completedAt).not.toBeNull()
    expect(row.result).toBe("shipped")
    expect(result.id).toBe(id)
  })

  test("rejects complete if dependencies not completed", () => {
    const { state: s1, id: a } = addOne(seed())
    const { state: s2, id: b } = addOne(s1, { title: "B", dependsOn: [a] })
    expect(() => completeTask(s2, { id: b })).toThrow(/dependenc/i)
  })
})
