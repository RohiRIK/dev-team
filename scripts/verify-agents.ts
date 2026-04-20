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
 *
 * Skills mode (--skills) — checks per skills/<name>/SKILL.md:
 *   1. YAML frontmatter present with: name, description (no `tools` required)
 *   2. No absolute home paths
 *   (No 7-section rule, no body line cap, no TODO check.)
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

const ROOT = resolve(import.meta.dir, "..")
const AGENTS_DIR = join(ROOT, "agents")
const SKILLS_DIR = join(ROOT, "skills")

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

type Finding = { file: string; issue: string }

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

function lintFile(
  file: string,
  raw: string,
  allowTodo: boolean,
  mode: "agent" | "skill",
): Finding[] {
  const findings: Finding[] = []
  const push = (issue: string): number => findings.push({ file, issue })

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
  }

  for (const { pattern, label } of RESIDUE_PATTERNS) {
    if (pattern.test(raw)) push(`residue found — ${label}`)
  }

  return findings
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
  const raws = await Promise.all(targets.map((t) => readFile(t.abs, "utf8").catch(() => "")))
  const allFindings: Finding[] = []
  targets.forEach((t, i) => {
    const raw = raws[i]
    if (!raw) {
      allFindings.push({ file: t.display, issue: "file not found or empty" })
      return
    }
    allFindings.push(...lintFile(t.display, raw, allowTodo, mode))
  })

  if (allFindings.length === 0) {
    console.log(`[verify-agents] ✔ ${targets.length} ${mode} file(s) passed`)
    return
  }

  for (const { file, issue } of allFindings) {
    console.error(`[verify-agents] ✘ ${file}: ${issue}`)
  }
  console.error(`[verify-agents] ${allFindings.length} issue(s) across ${targets.length} file(s)`)
  process.exit(1)
}

main().catch((err: Error) => {
  console.error(`[verify-agents] fatal: ${err.message}`)
  process.exit(1)
})
