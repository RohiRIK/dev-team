import { z } from "zod"

export const TaskStatus = z.enum([
  "pending",
  "in_progress",
  "blocked",
  "completed",
  "cancelled",
])
export type TaskStatus = z.infer<typeof TaskStatus>

export const ArtifactSchema = z.object({
  kind: z.enum(["file", "url", "note"]),
  path: z.string().min(1).max(500),
})
export type Artifact = z.infer<typeof ArtifactSchema>

export const TaskSchema = z.object({
  id: z.string().regex(/^t_[0-9A-HJKMNP-TV-Z]{26}$/, "id must be t_<ULID>"),
  agent: z.string().min(1).max(64),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).default(""),
  status: TaskStatus,
  dependsOn: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  startedAt: z.string().datetime().nullable().default(null),
  completedAt: z.string().datetime().nullable().default(null),
  result: z.string().max(500).nullable().default(null),
  artifacts: z.array(ArtifactSchema).default([]),
  tags: z.array(z.string().min(1).max(32)).default([]),
})
export type Task = z.infer<typeof TaskSchema>

export const StateSchema = z.object({
  version: z.literal(1),
  sessionId: z.string().nullable().default(null),
  updatedAt: z.string().datetime(),
  tasks: z.array(TaskSchema),
})
export type State = z.infer<typeof StateSchema>

export const TaskSummarySchema = TaskSchema.pick({
  id: true,
  agent: true,
  title: true,
  status: true,
  updatedAt: true,
})
export type TaskSummary = z.infer<typeof TaskSummarySchema>

export const emptyState = (): State => ({
  version: 1,
  sessionId: null,
  updatedAt: new Date().toISOString(),
  tasks: [],
})
