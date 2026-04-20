import { z } from "zod"
import { type State, TaskStatus, type TaskSummary } from "../types.ts"

export const ListTasksInput = z.object({
  status: TaskStatus.optional(),
  agent: z.string().min(1).max(64).optional(),
  limit: z.number().int().positive().max(500).optional(),
})
export type ListTasksInput = z.infer<typeof ListTasksInput>

export function listTasks(state: State, input: ListTasksInput): TaskSummary[] {
  const { status, agent, limit } = input
  let rows = state.tasks
  if (status) rows = rows.filter((t) => t.status === status)
  if (agent) rows = rows.filter((t) => t.agent === agent)
  if (limit) rows = rows.slice(0, limit)
  return rows.map(({ id, agent: a, title, status: s, updatedAt }) => ({
    id,
    agent: a,
    title,
    status: s,
    updatedAt,
  }))
}
