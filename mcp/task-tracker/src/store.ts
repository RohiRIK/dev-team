import { mkdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { type State, StateSchema, emptyState } from "./types.ts"
import { writeAtomic } from "./writeAtomic.ts"

export const stateDir = (): string => {
  const explicit = process.env.DEV_TEAM_STATE_DIR
  if (explicit && !explicit.includes("${")) return explicit
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
  return join(projectDir, ".dev-team")
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
  await writeAtomic(path, `${JSON.stringify(state, null, 2)}\n`)
}
