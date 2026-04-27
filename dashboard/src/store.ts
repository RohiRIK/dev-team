import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { TaskState } from "./types.ts"

const STATE_DIR = ".dev-team"
const STATE_FILE = "tasks.json"

export function resolveWorkspace(): string {
  return (
    process.env.DEV_TEAM_WORKSPACE ??
    process.env.CLAUDE_PROJECT_DIR ??
    join(import.meta.dir, "..", "..")
  )
}

export function tasksFilePath(workspace?: string): string {
  return join(workspace ?? resolveWorkspace(), STATE_DIR, STATE_FILE)
}

/** Custom error thrown when tasks.json exists but cannot be parsed.
 *  ENOENT is treated as empty state — see `loadTasks`. */
export class TasksParseError extends Error {
  readonly path: string
  constructor(path: string, cause: unknown) {
    super((cause as Error).message ?? "Unknown parse error")
    this.name = "TasksParseError"
    this.path = path
  }
}

export async function loadTasks(workspace?: string): Promise<TaskState> {
  const path = tasksFilePath(workspace)

  let raw: string
  try {
    raw = await readFile(path, "utf8")
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return {
        version: 1,
        sessionId: null,
        updatedAt: new Date().toISOString(),
        tasks: [],
      }
    }
    throw err
  }

  try {
    return JSON.parse(raw) as TaskState
  } catch (err: unknown) {
    throw new TasksParseError(path, err)
  }
}
