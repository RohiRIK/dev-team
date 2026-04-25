import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { lintFile, type EngineRegistryLike } from "../verify-agents.ts"

const WORKFLOW_BODY = [
  "## Role",
  "role",
  "## When to use",
  "use",
  "## When NOT to use",
  "not use",
  "## Workflow",
  "1. step",
  "## Tools",
  "tools",
  "## Constraints",
  "constraints",
  "## Worked example",
  "example",
  "",
].join("\n")

const FM_BASE = (extra = ""): string =>
  [
    "---",
    "name: backend-developer",
    'description: "test agent"',
    "tools: Read",
    "model: inherit",
    extra,
    "---",
  ]
    .filter((line, i, a) => !(line === "" && i === a.length - 2))
    .join("\n") + "\n"

const makeAgent = (extra = ""): string => `${FM_BASE(extra)}${WORKFLOW_BODY}`

const REGISTRY: EngineRegistryLike = {
  engines: {
    claude: { command: "claude" },
    "gemini-cli": { command: "gemini" },
    goose: { command: "goose" },
  },
}

describe("verify-agents engines frontmatter", () => {
  test("missing engines field → pass (optional)", () => {
    const findings = lintFile("backend-developer.md", makeAgent(), {
      allowTodo: false,
      mode: "agent",
      registry: REGISTRY,
    })
    expect(findings).toEqual([])
  })

  test("valid engines list → pass", () => {
    const findings = lintFile(
      "backend-developer.md",
      makeAgent("engines: claude, gemini-cli, goose"),
      { allowTodo: false, mode: "agent", registry: REGISTRY },
    )
    expect(findings).toEqual([])
  })

  test("unknown slug → error", () => {
    const findings = lintFile(
      "backend-developer.md",
      makeAgent("engines: claude, not-a-real-engine"),
      { allowTodo: false, mode: "agent", registry: REGISTRY },
    )
    expect(findings.some((f) => /unknown engine slug: not-a-real-engine/.test(f.issue))).toBe(true)
  })

  test("invalid slug casing (not kebab-case) → error", () => {
    const findings = lintFile(
      "backend-developer.md",
      makeAgent("engines: Claude, Gemini_CLI"),
      { allowTodo: false, mode: "agent", registry: REGISTRY },
    )
    expect(findings.some((f) => /invalid engine slug/.test(f.issue))).toBe(true)
  })

  test("duplicate slugs → error", () => {
    const findings = lintFile(
      "backend-developer.md",
      makeAgent("engines: claude, claude"),
      { allowTodo: false, mode: "agent", registry: REGISTRY },
    )
    expect(findings.some((f) => /duplicate engine slug/.test(f.issue))).toBe(true)
  })

  test("whitespace not normalised (no leading space around commas) — still accepted", () => {
    // `a, b, c` is canonical — kebab tokens separated by `, ` are fine.
    const findings = lintFile(
      "backend-developer.md",
      makeAgent("engines: claude,gemini-cli,goose"),
      { allowTodo: false, mode: "agent", registry: REGISTRY },
    )
    expect(findings).toEqual([])
  })

  test("design-only agent declaring engines → warning, not error", () => {
    const findings = lintFile(
      "product-manager.md",
      makeAgent("engines: claude, gemini-cli"),
      { allowTodo: false, mode: "agent", registry: REGISTRY },
    )
    // Warning is a finding with `warn: true`; no other issue should appear.
    expect(findings).toHaveLength(1)
    expect(findings[0]?.warn).toBe(true)
    expect(findings[0]?.issue).toMatch(
      /declares engines but is design-only; field will be ignored/,
    )
  })

  test("design-only agent without engines → pass silently", () => {
    const findings = lintFile("product-manager.md", makeAgent(), {
      allowTodo: false,
      mode: "agent",
      registry: REGISTRY,
    })
    expect(findings).toEqual([])
  })

  test("empty engines value → error", () => {
    const findings = lintFile("backend-developer.md", makeAgent("engines:  "), {
      allowTodo: false,
      mode: "agent",
      registry: REGISTRY,
    })
    expect(findings.some((f) => /empty engines field/.test(f.issue))).toBe(true)
  })

  test("existing 7-section + 200-line rules still enforced", () => {
    // Missing `## Worked example` section.
    const brokenBody = WORKFLOW_BODY.replace("## Worked example\nexample\n", "")
    const raw = `${FM_BASE()}${brokenBody}`
    const findings = lintFile("backend-developer.md", raw, {
      allowTodo: false,
      mode: "agent",
      registry: REGISTRY,
    })
    expect(findings.some((f) => /missing section: ## Worked example/.test(f.issue))).toBe(true)
  })

  test("skill mode ignores engines entirely", () => {
    const raw =
      '---\nname: my-skill\ndescription: "x"\nengines: not-a-real-engine\n---\nbody\n'
    const findings = lintFile("my-skill/SKILL.md", raw, {
      allowTodo: false,
      mode: "skill",
      registry: REGISTRY,
    })
    expect(findings).toEqual([])
  })
})

describe("verify-agents integration with engines.json loader", () => {
  let stateDir: string

  beforeEach(async () => {
    stateDir = await mkdtemp(join(tmpdir(), "verify-agents-"))
  })

  afterEach(async () => {
    await rm(stateDir, { recursive: true, force: true })
  })

  test("loads engines from state/engines.json via loadEngineRegistry", async () => {
    const { loadRegistryForLint } = await import("../verify-agents.ts")
    await mkdir(join(stateDir, "state"), { recursive: true })
    await writeFile(
      join(stateDir, "state", "engines.json"),
      JSON.stringify({
        engines: {
          "gemini-cli": {
            command: "gemini",
            stdin_ok: true,
            env_passthrough: ["PATH"],
          },
        },
      }),
    )
    const reg = await loadRegistryForLint(join(stateDir, "state", "engines.json"))
    // claude fallback always present + gemini-cli loaded
    expect(Object.keys(reg.engines).sort()).toEqual(["claude", "gemini-cli"])
  })

  test("missing engines.json falls back to claude-only", async () => {
    const { loadRegistryForLint } = await import("../verify-agents.ts")
    const reg = await loadRegistryForLint(join(stateDir, "does-not-exist.json"))
    expect(Object.keys(reg.engines)).toEqual(["claude"])
  })
})
