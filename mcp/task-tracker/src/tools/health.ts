import { z } from "zod"
import type { State } from "../types.ts"

export const HealthInput = z.object({})
export type HealthInput = z.infer<typeof HealthInput>

export interface HealthResult {
  status: "ok"
  name: string
  version: string
  taskCount: number
}

export function health(state: State): HealthResult {
  return {
    status: "ok",
    name: "task-tracker",
    version: "0.1.0",
    taskCount: state.tasks.length,
  }
}
