import { readFile, stat } from "node:fs/promises"
import { join } from "node:path"
import { z } from "zod"

// Built-in fallback engine — always present in the returned registry so that
// /buddy keeps working when state/engines.json is missing or malformed.
const CLAUDE_FALLBACK: EngineConfig = {
  command: "claude",
  stdin_ok: true,
  env_passthrough: ["PATH", "HOME"],
}

export const EngineConfigSchema = z
  .object({
    command: z.string().min(1),
    prompt_flag: z.string().min(1).optional(),
    args_template: z.array(z.string()).optional(),
    stdin_ok: z.boolean(),
    env_passthrough: z.array(z.string()),
  })
  .strict()

export const EngineRegistrySchema = z
  .object({
    engines: z.record(z.string(), EngineConfigSchema),
  })
  .strict()

export type EngineConfig = z.infer<typeof EngineConfigSchema>
export type EngineRegistry = z.infer<typeof EngineRegistrySchema>

let loggedLoadError = false
const logOnce = (msg: string): void => {
  if (loggedLoadError) return
  loggedLoadError = true
  process.stderr.write(`[task-tracker] ${msg}\n`)
}

const resolveEnginesPath = async (input?: string): Promise<string> => {
  if (input) {
    // Accept either a directory (look for engines.json inside) or a direct
    // file path. Tests pass the state dir; the MCP server passes a dir too.
    try {
      const s = await stat(input)
      if (s.isDirectory()) return join(input, "engines.json")
    } catch {
      // fall through — treat as a file path
    }
    return input
  }
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
  return join(projectDir, "state", "engines.json")
}

const fallbackRegistry = (): EngineRegistry => ({
  engines: { claude: { ...CLAUDE_FALLBACK } },
})

export async function loadEngineRegistry(
  path?: string,
): Promise<EngineRegistry> {
  const filePath = await resolveEnginesPath(path)
  let raw: string
  try {
    raw = await readFile(filePath, "utf8")
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return fallbackRegistry()
    }
    logOnce(`failed to read ${filePath}: ${(err as Error).message}`)
    return fallbackRegistry()
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    logOnce(`malformed JSON in ${filePath}: ${(err as Error).message}`)
    return fallbackRegistry()
  }

  // Zod validation errors MUST propagate — the tests assert that unknown keys
  // and missing required fields cause loadEngineRegistry to reject.
  const validated = EngineRegistrySchema.parse(parsed)
  return {
    engines: { claude: { ...CLAUDE_FALLBACK }, ...validated.engines },
  }
}
