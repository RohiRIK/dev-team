import { ulid } from "ulid"
import { z } from "zod"
import { type State, type Task, TaskSchema, TaskStatus } from "../types.ts"

export const CreateTaskInput = z.object({
  agent: z.string().min(1).max(64),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  dependsOn: z.array(z.string()).optional(),
  tags: z.array(z.string().min(1).max(32)).optional(),
})
export type CreateTaskInput = z.infer<typeof CreateTaskInput>

export function createTask(
  state: State,
  input: CreateTaskInput,
): { state: State; result: { id: string; status: "pending" } } {
  const parsed = CreateTaskInput.parse(input)
  const deps = parsed.dependsOn ?? []
  const ids = new Set(state.tasks.map((t) => t.id))
  const missing = deps.filter((d) => !ids.has(d))
  if (missing.length) {
    throw new Error(`unknown dependency id(s): ${missing.join(", ")}`)
  }
  const now = new Date().toISOString()
  const task: Task = TaskSchema.parse({
    id: `t_${ulid()}`,
    agent: parsed.agent,
    title: parsed.title,
    description: parsed.description ?? "",
    status: TaskStatus.enum.pending,
    dependsOn: deps,
    createdAt: now,
    updatedAt: now,
    startedAt: null,
    completedAt: null,
    result: null,
    artifacts: [],
    tags: parsed.tags ?? [],
  })
  const nextState: State = {
    ...state,
    updatedAt: now,
    tasks: [...state.tasks, task],
  }
  return { state: nextState, result: { id: task.id, status: "pending" } }
}
