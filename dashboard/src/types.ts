/* ── Task types (mirrors mcp/task-tracker/src/types.ts) ── */

export type TaskStatus = "pending" | "in_progress" | "blocked" | "completed" | "cancelled"

export interface Artifact {
  kind: "file" | "url" | "note"
  path: string
}

export interface Task {
  id: string
  agent: string
  title: string
  description: string
  status: TaskStatus
  dependsOn: string[]
  createdAt: string
  updatedAt: string
  startedAt: string | null
  completedAt: string | null
  result: string | null
  artifacts: Artifact[]
  tags: string[]
}

export interface TaskState {
  version: number
  sessionId: string | null
  updatedAt: string
  tasks: Task[]
}
