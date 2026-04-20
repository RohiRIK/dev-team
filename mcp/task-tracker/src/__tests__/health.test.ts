import { describe, expect, test } from "bun:test"
import { createTask } from "../tools/createTask.ts"
import { health } from "../tools/health.ts"
import { emptyState } from "../types.ts"

describe("health", () => {
  test("returns status ok with zero tasks", () => {
    const result = health(emptyState(), "0.1.0")
    expect(result.status).toBe("ok")
    expect(result.name).toBe("task-tracker")
    expect(result.version).toBe("0.1.0")
    expect(result.taskCount).toBe(0)
  })

  test("taskCount reflects actual task count", () => {
    let state = emptyState()
    state = createTask(state, { agent: "backend-developer", title: "task one" }).state
    state = createTask(state, { agent: "frontend-developer", title: "task two" }).state
    state = createTask(state, { agent: "qa-tester", title: "task three" }).state
    expect(health(state, "0.1.0").taskCount).toBe(3)
  })

  test("result shape has exactly status, name, version, taskCount", () => {
    const result = health(emptyState(), "0.1.0")
    expect(Object.keys(result).sort()).toEqual(["name", "status", "taskCount", "version"])
  })
})
