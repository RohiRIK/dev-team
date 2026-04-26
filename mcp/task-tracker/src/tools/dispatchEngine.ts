/**
 * dispatch_engine — spawn a task-tracker task on an external CLI engine
 * (gemini-cli, goose, opencode, …) gated behind DEV_TEAM_MULTI_ENGINE=1.
 *
 * Implements specs/multi-engine-dispatch.md §4.4 (Dispatch) + §4.5 (Security).
 *
 * Contract (per tests in ../__tests__/dispatch-engine.test.ts):
 *   - prompts live at <stateDir>/prompts/<task_id>.txt (file-passed, never argv)
 *   - stdout streams to  <stateDir>/artifacts/<task_id>.log
 *   - exit 0  → complete_task with log artifact + short result line
 *   - exit ≠0 → updateTask({status: "blocked", result: <stderr snippet>})
 *   - spawn throw → same blocked path (never leave in_progress)
 *   - engine binary missing → reject/flag; never invoke deps.spawn
 *   - env child receives ONLY keys listed in engine.env_passthrough
 *   - argv NEVER passes the raw prompt body; {{prompt_file}} is substituted
 *   - subprocess is invoked directly, never through /bin/sh -c
 */

import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { z } from "zod"
import { type EngineConfig, loadEngineRegistry } from "../engines.ts"
import { stateDir as resolveStateDir } from "../store.ts"
import type { State } from "../types.ts"
import { completeTask } from "./completeTask.ts"
import { updateTask } from "./updateTask.ts"

export const DispatchEngineInput = z.object({
  task_id: z.string().min(1),
  engine: z.string().min(1),
})

export type DispatchEngineInput = z.infer<typeof DispatchEngineInput>

export interface SpawnResult {
  exitCode: number
  stdout: string
  stderr: string
}

export interface SpawnArgs {
  command: string
  args: string[]
  env?: Record<string, string>
  stdin?: string
}

export interface DispatchDeps {
  which: (cmd: string) => string | null
  spawn: (args: SpawnArgs) => Promise<SpawnResult>
}

export interface DispatchResult {
  state: State
  error?: string
}

const PROMPT_FILE_TOKENS = new Set(["{{prompt_file}}", "{prompt_file}"])

const buildPromptBody = (title: string, description: string): string => {
  const body = description?.trim().length ? description : title
  // Guarantee a non-empty body so downstream engines don't choke.
  return `${body}\n`
}

const buildArgs = (
  template: readonly string[] | undefined,
  promptFlag: string | undefined,
  promptFilePath: string,
): string[] => {
  if (template && template.length > 0) {
    return template.map((arg) =>
      PROMPT_FILE_TOKENS.has(arg) ? promptFilePath : arg,
    )
  }
  if (promptFlag) return [promptFlag, promptFilePath]
  // No template and no prompt_flag — pass the file path as sole positional arg.
  return [promptFilePath]
}

const buildChildEnv = (
  passthroughKeys: readonly string[],
): Record<string, string> => {
  const out: Record<string, string> = {}
  for (const key of passthroughKeys) {
    const val = process.env[key]
    if (typeof val === "string") out[key] = val
  }
  return out
}

const STDERR_SNIPPET_LEN = 500

const snippet = (text: string): string =>
  text.length > STDERR_SNIPPET_LEN ? text.slice(0, STDERR_SNIPPET_LEN) : text

const tail = (text: string, lines = 5): string => {
  const trimmed = text.replace(/\n+$/, "")
  const parts = trimmed.split("\n")
  return parts.slice(-lines).join("\n")
}

export async function dispatchEngine(
  state: State,
  input: DispatchEngineInput,
  deps: DispatchDeps,
): Promise<DispatchResult> {
  // AC #19 — feature gate.
  if (process.env.DEV_TEAM_MULTI_ENGINE !== "1") {
    throw new Error(
      "dispatch_engine is disabled — set DEV_TEAM_MULTI_ENGINE=1 to enable the multi-engine gate",
    )
  }

  // Locate the task up front so we can blame the caller for bad ids before
  // touching the filesystem.
  const task = state.tasks.find((t) => t.id === input.task_id)
  if (!task) {
    throw new Error(`task not found: ${input.task_id}`)
  }

  // AC #14 — registry lookup.
  const registry = await loadEngineRegistry(resolveStateDir())
  const engine: EngineConfig | undefined = registry.engines[input.engine]
  if (!engine) {
    throw new Error(
      `unknown engine "${input.engine}" — not in registry (available: ${Object.keys(
        registry.engines,
      ).join(", ")})`,
    )
  }

  // AC #15 — binary presence check. Never call spawn without it.
  const resolvedBinary = deps.which(engine.command)
  if (!resolvedBinary) {
    return {
      state,
      error: `engine binary "${engine.command}" is not installed — auto-downgrade to claude. Install ${engine.command} or pick a different engine.`,
    }
  }

  // AC #10, #17 — prompt body lands in a file; argv stays clean.
  const dir = resolveStateDir()
  const promptsDir = join(dir, "prompts")
  const artifactsDir = join(dir, "artifacts")
  await mkdir(promptsDir, { recursive: true })
  await mkdir(artifactsDir, { recursive: true })

  const promptPath = join(promptsDir, `${task.id}.txt`)
  const logPath = join(artifactsDir, `${task.id}.log`)
  const promptBody = buildPromptBody(task.title, task.description)
  await writeFile(promptPath, promptBody, "utf8")

  const args = buildArgs(engine.args_template, engine.prompt_flag, promptPath)
  const childEnv = buildChildEnv(engine.env_passthrough)

  try {
    const res = await deps.spawn({
      command: engine.command,
      args,
      env: childEnv,
    })

    // Stream stdout to the log file regardless of exit code so post-mortems
    // have the full transcript.
    await writeFile(logPath, res.stdout, "utf8")

    if (res.exitCode === 0) {
      const summary = tail(res.stdout) || `engine=${input.engine} exit=0`
      const next = completeTask(state, {
        id: task.id,
        result: snippet(summary),
        artifacts: [{ kind: "file", path: logPath }],
      })
      return { state: next.state }
    }

    const errSnip = snippet(
      res.stderr.trim().length
        ? res.stderr
        : `engine=${input.engine} exited ${res.exitCode} with no stderr`,
    )
    const next = updateTask(state, {
      id: task.id,
      status: "blocked",
      result: errSnip,
    })
    return {
      state: next.state,
      error: errSnip,
    }
  } catch (err) {
    // AC #12 — never leave a task stuck in_progress.
    const msg = snippet(
      `spawn failed: ${(err as Error).message ?? String(err)}`,
    )
    const next = updateTask(state, {
      id: task.id,
      status: "blocked",
      result: msg,
    })
    return { state: next.state, error: msg }
  }
}
