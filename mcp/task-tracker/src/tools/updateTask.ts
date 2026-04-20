import { z } from "zod"
import { ArtifactSchema, type State, type Task, TaskStatus } from "../types.ts"

export const UpdateTaskInput = z.object({
  id: z.string().min(1),
  status: TaskStatus.optional(),
  description: z.string().max(1000).optional(),
  result: z.string().max(500).optional(),
  artifacts: z.array(ArtifactSchema).optional(),
})
export type UpdateTaskInput = z.infer<typeof UpdateTaskInput>

export function updateTask(state: State, input: UpdateTaskInput): { state: State; result: Task } {
  const current = state.tasks.find((t) => t.id === input.id)
  if (!current) throw new Error(`task not found: ${input.id}`)

  if (input.status === TaskStatus.enum.completed) {
    const unmet = current.dependsOn.filter((depId) => {
      const dep = state.tasks.find((t) => t.id === depId)
      return !dep || dep.status !== TaskStatus.enum.completed
    })
    if (unmet.length) {
      throw new Error(`cannot complete — unmet dependencies: ${unmet.join(", ")}`)
    }
  }

  const now = new Date().toISOString()
  const next: Task = {
    ...current,
    status: input.status ?? current.status,
    description: input.description ?? current.description,
    result: input.result ?? current.result,
    artifacts: input.artifacts ?? current.artifacts,
    updatedAt: now,
    startedAt:
      input.status === TaskStatus.enum.in_progress && current.startedAt === null
        ? now
        : current.startedAt,
    completedAt: input.status === TaskStatus.enum.completed ? now : current.completedAt,
  }
  const nextState: State = {
    ...state,
    updatedAt: now,
    tasks: state.tasks.map((t) => (t.id === next.id ? next : t)),
  }
  return { state: nextState, result: next }
}
