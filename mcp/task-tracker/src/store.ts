import { appendFile, mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { dirname, join, parse } from "node:path"
import { type State, StateSchema, emptyState } from "./types.ts"
import { writeAtomic } from "./writeAtomic.ts"

const STATE_DIR_NAME = ".dev-team"

export const stateDir = (): string => {
  const explicit = process.env.DEV_TEAM_STATE_DIR
  if (explicit && !explicit.includes("${")) return explicit
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
  return join(projectDir, STATE_DIR_NAME)
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
  await ensureGitignored(dirname(dirname(path)))
  await writeAtomic(path, `${JSON.stringify(state, null, 2)}\n`)
}

let loggedGitignoreError = false

async function findRepoRoot(start: string): Promise<string | null> {
  let current = start
  const { root } = parse(current)
  while (true) {
    try {
      await stat(join(current, ".git"))
      return current
    } catch {}
    if (current === root) return null
    current = dirname(current)
  }
}

const GITIGNORE_HEADER = "# Added by dev-team plugin\n"
const GITIGNORE_ENTRY = `${STATE_DIR_NAME}/`
const gitignoreChecked = new Set<string>()

export async function ensureGitignored(projectDir: string): Promise<void> {
  if (gitignoreChecked.has(projectDir)) return
  try {
    const repoRoot = await findRepoRoot(projectDir)
    if (!repoRoot) {
      gitignoreChecked.add(projectDir)
      return
    }
    const gitignorePath = join(repoRoot, ".gitignore")
    let existing: string
    try {
      existing = await readFile(gitignorePath, "utf8")
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err
      await writeFile(gitignorePath, `${GITIGNORE_HEADER}${GITIGNORE_ENTRY}\n`, "utf8")
      gitignoreChecked.add(projectDir)
      return
    }
    const hasEntry = existing.split("\n").some((line) => {
      const trimmed = line.trim()
      return trimmed === STATE_DIR_NAME || trimmed === GITIGNORE_ENTRY
    })
    if (!hasEntry) {
      const prefix = existing.endsWith("\n") || existing === "" ? "" : "\n"
      await appendFile(gitignorePath, `${prefix}${GITIGNORE_ENTRY}\n`, "utf8")
    }
    gitignoreChecked.add(projectDir)
  } catch (err) {
    if (!loggedGitignoreError) {
      loggedGitignoreError = true
      process.stderr.write(
        `[task-tracker] failed to update .gitignore: ${(err as Error).message}\n`,
      )
    }
  }
}
