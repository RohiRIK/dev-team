import { z } from "zod"
import type { State, Task } from "../types.ts"

export const GetTaskInput = z.object({ id: z.string().min(1) })
export type GetTaskInput = z.infer<typeof GetTaskInput>

export function getTask(state: State, input: GetTaskInput): Task {
  const { id } = input
  const row = state.tasks.find((t) => t.id === id)
  if (!row) throw new Error(`task not found: ${id}`)
  return row
}
