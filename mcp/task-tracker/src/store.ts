import { mkdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { type State, StateSchema, emptyState } from "./types.ts"
import { writeAtomic } from "./writeAtomic.ts"

export const stateDir = (): string => {
  const dir = process.env.DEV_TEAM_STATE_DIR
  if (!dir) {
    throw new Error("DEV_TEAM_STATE_DIR not set (expected ${CLAUDE_PROJECT_DIR}/.dev-team)")
  }
  return dir
}

export const statePath = (): string => join(stateDir(), "tasks.json")

export async function loadState(): Promise<State> {
  const path = statePath()
  try {
    const raw = await readFile(path, "utf8")
    return StateSchema.parse(JSON.parse(raw))
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return emptyState()
    throw err
  }
}

export async function saveState(state: State): Promise<void> {
  const path = statePath()
  await mkdir(dirname(path), { recursive: true })
  const next: State = { ...state, updatedAt: new Date().toISOString() }
  await writeAtomic(path, `${JSON.stringify(next, null, 2)}\n`)
}
