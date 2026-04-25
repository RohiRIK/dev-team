#!/usr/bin/env bun
/**
 * verify-agents.ts — lint agents/*.md (default) or skills/SKILL.md (--skills).
 *
 * Agents mode (default) — checks per agents/*.md:
 *   1. YAML frontmatter present with: name, description, tools
 *   2. Canonical 7 sections present
 *   3. Body length ≤ 200 lines
 *   4. No absolute home paths
 *   5. No TODO(author) markers (use --allow-todo during drafting)
 *   6. Optional `engines:` field — kebab-case slugs, cross-checked against
 *      `state/engines.json`. Design-only agents warn if they declare engines.
 *
 * Skills mode (--skills) — checks per skills/<name>/SKILL.md:
 *   1. YAML frontmatter present with: name, description (no `tools` required)
 *   2. No absolute home paths
 *   (No 7-section rule, no body line cap, no TODO check, no engines check.)
 *
 * Usage:
 *   bun scripts/verify-agents.ts                  # lint all agents/*.md
 *   bun scripts/verify-agents.ts <slug>           # lint one agent
 *   bun scripts/verify-agents.ts --allow-todo     # tolerate TODOs (pilot)
 *   bun scripts/verify-agents.ts --skills         # lint skills/**\/SKILL.md
 *
 * Exit: 0 on pass, 1 on any failure.
 */
import { readFile, readdir } from "node:fs/promises"
import { join, resolve } from "node:path"
import { loadEngineRegistry } from "../mcp/task-tracker/src/engines.ts"

const ROOT = resolve(import.meta.dir, "..")
const AGENTS_DIR = join(ROOT, "agents")
const SKILLS_DIR = join(ROOT, "skills")
const ENGINES_JSON = join(ROOT, "state", "engines.json")

const REQUIRED_FRONTMATTER_AGENT = ["name", "description", "tools"] as const
const REQUIRED_FRONTMATTER_SKILL = ["name", "description"] as const
const REQUIRED_SECTIONS = [
  "Role",
  "When to use",
  "When NOT to use",
  "Workflow",
  "Tools",
  "Constraints",
  "Worked example",
] as const

// Agents whose role is design/architecture — they produce specs, not code,
// so routing them to a non-Claude CLI is a no-op. If they declare engines,
// warn rather than error.
const DESIGN_ONLY_AGENTS = new Set<string>([
  "product-manager",
  "system-architect",
  "ui-ux-designer",
  "cloud-architect",
])

const RESIDUE_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\/U[s]ers\//, label: "absolute macOS home path" },
  { pattern: /\/h[o]me\/[a-z]/, label: "absolute Linux home path" },
  { pattern: /C:\\U[s]ers\\/i, label: "absolute Windows home path" },
]

const SECTION_REGEXES = REQUIRED_SECTIONS.map((section) => ({
  section,
  re: new RegExp(`^##\\s+${section.replace(/\(/g, "\\(").replace(/\)/g, "\\)")}\\b`, "m"),
}))

const TODO_AUTHOR = /TODO\(author\)/
// Pre-compiled at module scope (perf pattern). Matches kebab-case: starts
// with a lowercase letter, then lowercase alphanumerics or hyphens.
const ENGINE_SLUG = /^[a-z][a-z0-9-]*$/
// Extracts the engines line from raw frontmatter. Value captured verbatim.
const ENGINES_LINE = /^engines\s*:\s*(.*)$/m

export type EngineRegistryLike = {
  engines: Record<string, unknown>
}

export type Finding = { file: string; issue: string; warn?: boolean }

export type LintOptions = {
  allowTodo: boolean
  mode: "agent" | "skill"
  registry: EngineRegistryLike
}

function splitFrontmatter(raw: string): { yaml: string; body: string } | null {
  if (!raw.startsWith("---\n")) return null
  const end = raw.indexOf("\n---\n", 4)
  if (end === -1) return null
  return { yaml: raw.slice(4, end), body: raw.slice(end + 5) }
}

function parseYamlKeys(yaml: string): Set<string> {
  const keys = new Set<string>()
  for (const line of yaml.split("\n")) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/)
    if (m?.[1]) keys.add(m[1])
  }
  return keys
}

function agentSlugFromFile(file: string): string {
  // `backend-developer.md` or `path/to/backend-developer.md`
  const base = file.split("/").pop() ?? file
  return base.replace(/\.md$/, "")
}

type EnginesParse =
  | { kind: "absent" }
  | { kind: "ok"; slugs: string[] }
  | { kind: "error"; issues: string[] }

function parseEnginesField(yaml: string): EnginesParse {
  const m = yaml.match(ENGINES_LINE)
  if (!m) return { kind: "absent" }
  const raw = (m[1] ?? "").trim()
  if (raw === "") {
    return { kind: "error", issues: ["empty engines field (remove it or list slugs)"] }
  }

  const issues: string[] = []
  const seen = new Set<string>()
  const slugs: string[] = []
  // Split on comma, trim each token. `a,b` and `a, b` are both fine;
  // internal whitespace inside a token fails the kebab-case regex.
  for (const rawTok of raw.split(",")) {
    const tok = rawTok.trim()
    if (tok === "") {
      issues.push("empty slug between commas")
      continue
    }
    if (!ENGINE_SLUG.test(tok)) {
      issues.push(`invalid engine slug: ${tok} (must match /^[a-z][a-z0-9-]*$/)`)
      continue
    }
    if (seen.has(tok)) {
      issues.push(`duplicate engine slug: ${tok}`)
      continue
    }
    seen.add(tok)
    slugs.push(tok)
  }

  if (issues.length > 0) return { kind: "error", issues }
  return { kind: "ok", slugs }
}

export function lintFile(file: string, raw: string, opts: LintOptions): Finding[] {
  const { allowTodo, mode, registry } = opts
  const findings: Finding[] = []
  const push = (issue: string, warn = false): number =>
    findings.push(warn ? { file, issue, warn } : { file, issue })

  const parts = splitFrontmatter(raw)
  if (!parts) {
    push("missing YAML frontmatter (expected `---\\n...\\n---`)")
    return findings
  }

  const required = mode === "agent" ? REQUIRED_FRONTMATTER_AGENT : REQUIRED_FRONTMATTER_SKILL
  const keys = parseYamlKeys(parts.yaml)
  for (const k of required) {
    if (!keys.has(k)) push(`frontmatter missing key: ${k}`)
  }

  if (mode === "agent") {
    for (const { section, re } of SECTION_REGEXES) {
      if (!re.test(parts.body)) push(`missing section: ## ${section}`)
    }

    const bodyLines = parts.body.split("\n").length
    if (bodyLines > 200) push(`body too long: ${bodyLines} lines (max 200)`)

    if (!allowTodo && TODO_AUTHOR.test(raw)) {
      push("unresolved TODO(author) marker")
    }

    // Engines field (optional). Design-only agents warn instead of using it.
    const parsed = parseEnginesField(parts.yaml)
    if (parsed.kind === "error") {
      for (const issue of parsed.issues) push(issue)
    } else if (parsed.kind === "ok") {
      const slug = agentSlugFromFile(file)
      if (DESIGN_ONLY_AGENTS.has(slug)) {
        push(`[${slug}] declares engines but is design-only; field will be ignored`, true)
      } else {
        const known = registry.engines
        for (const tok of parsed.slugs) {
          if (!(tok in known)) {
            push(`unknown engine slug: ${tok} (not in state/engines.json)`)
          }
        }
      }
    }
  }

  for (const { pattern, label } of RESIDUE_PATTERNS) {
    if (pattern.test(raw)) push(`residue found — ${label}`)
  }

  return findings
}

/**
 * Load the engine registry for lint-time cross-checks. Prefers the shared
 * loader from the task-tracker MCP; falls back to `{claude}` if the file is
 * missing or malformed so that linting never crashes in a fresh clone.
 */
export async function loadRegistryForLint(path?: string): Promise<EngineRegistryLike> {
  const reg = await loadEngineRegistry(path ?? ENGINES_JSON)
  return { engines: reg.engines as Record<string, unknown> }
}

async function discoverSkillFiles(): Promise<{ rel: string; abs: string }[]> {
  const entries = await readdir(SKILLS_DIR).catch(() => [] as string[])
  return entries.map((dir) => ({
    rel: `${dir}/SKILL.md`,
    abs: join(SKILLS_DIR, dir, "SKILL.md"),
  }))
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const allowTodo = args.includes("--allow-todo")
  const skillsMode = args.includes("--skills")
  const slugs = args.filter((a) => !a.startsWith("--"))

  type Target = { display: string; abs: string }
  let targets: Target[] = []

  if (skillsMode) {
    const files = await discoverSkillFiles()
    targets = files.map((f) => ({ display: f.rel, abs: f.abs }))
  } else {
    const names = slugs.length
      ? slugs.map((s) => `${s}.md`)
      : (await readdir(AGENTS_DIR).catch(() => [])).filter((f) => f.endsWith(".md"))
    targets = names.map((n) => ({ display: n, abs: join(AGENTS_DIR, n) }))
  }

  if (targets.length === 0) {
    console.log(`[verify-agents] no ${skillsMode ? "skills" : "agents"} to lint`)
    return
  }

  const mode: "agent" | "skill" = skillsMode ? "skill" : "agent"
  // Load registry + all file bodies in parallel (existing perf pattern).
  const [registry, raws] = await Promise.all([
    loadRegistryForLint(),
    Promise.all(targets.map((t) => readFile(t.abs, "utf8").catch(() => ""))),
  ])
  const allFindings: Finding[] = []
  targets.forEach((t, i) => {
    const raw = raws[i]
    if (!raw) {
      allFindings.push({ file: t.display, issue: "file not found or empty" })
      return
    }
    allFindings.push(...lintFile(t.display, raw, { allowTodo, mode, registry }))
  })

  const errors = allFindings.filter((f) => !f.warn)
  const warnings = allFindings.filter((f) => f.warn)

  for (const { file, issue } of warnings) {
    console.warn(`[verify-agents] ⚠ ${file}: ${issue}`)
  }

  if (errors.length === 0) {
    const warnNote = warnings.length > 0 ? ` (${warnings.length} warning(s))` : ""
    console.log(`[verify-agents] ✔ ${targets.length} ${mode} file(s) passed${warnNote}`)
    return
  }

  for (const { file, issue } of errors) {
    console.error(`[verify-agents] ✘ ${file}: ${issue}`)
  }
  console.error(`[verify-agents] ${errors.length} issue(s) across ${targets.length} file(s)`)
  process.exit(1)
}

// Only run main() when executed directly (not when imported by tests).
if (import.meta.main) {
  main().catch((err: Error) => {
    console.error(`[verify-agents] fatal: ${err.message}`)
    process.exit(1)
  })
}
