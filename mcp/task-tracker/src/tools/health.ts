import type { State } from "../types.ts"

export interface HealthResult {
  status: "ok"
  name: string
  version: string
  taskCount: number
}

export function health(state: State, version: string): HealthResult {
  return {
    status: "ok",
    name: "task-tracker",
    version,
    taskCount: state.tasks.length,
  }
}
