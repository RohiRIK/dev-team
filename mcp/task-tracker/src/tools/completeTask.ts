import { z } from "zod"
import { ArtifactSchema, type State, type Task, TaskStatus } from "../types.ts"
import { updateTask } from "./updateTask.ts"

export const CompleteTaskInput = z.object({
  id: z.string().min(1),
  result: z.string().max(500).optional(),
  artifacts: z.array(ArtifactSchema).optional(),
})
export type CompleteTaskInput = z.infer<typeof CompleteTaskInput>

export function completeTask(
  state: State,
  input: CompleteTaskInput,
): { state: State; result: Task } {
  const { id, result, artifacts } = CompleteTaskInput.parse(input)
  return updateTask(state, {
    id,
    status: TaskStatus.enum.completed,
    ...(result !== undefined && { result }),
    ...(artifacts !== undefined && { artifacts }),
  })
}
