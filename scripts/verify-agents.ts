#!/usr/bin/env bun
/**
 * verify-agents.ts — lint every agents/*.md against spec §5.6 + §5.4.
 *
 * Checks (per file):
 *   1. YAML frontmatter present with: name, description, tools
 *   2. Canonical 7 sections present: Role, When to use, When NOT to use,
 *      Workflow, Tools, Constraints, Worked example
 *   3. Body length ≤ 200 lines (from line after closing `---`)
 *   4. No Gemini residue: emoji siren, "UFC Hydration", "_shared"
 *   5. No absolute home paths (macOS, Linux, Windows User dirs)
 *   6. No TODO(author) markers (allowed during T-15 draft, fail after T-17)
 *
 * Usage:
 *   bun scripts/verify-agents.ts            # lint all agents/*.md
 *   bun scripts/verify-agents.ts <slug>     # lint one
 *   bun scripts/verify-agents.ts --allow-todo  # pass even with TODOs (pilot)
 *
 * Exit: 0 on pass, 1 on any failure.
 */
import { readFile, readdir } from "node:fs/promises"
import { join, resolve } from "node:path"

const ROOT = resolve(import.meta.dir, "..")
const AGENTS_DIR = join(ROOT, "agents")

const REQUIRED_FRONTMATTER = ["name", "description", "tools"] as const
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
  { pattern: /🚨/, label: "emoji siren (Gemini preamble)" },
  { pattern: /agents\/_shared\//, label: "_shared/ reference (Gemini convention)" },
  { pattern: /\/U[s]ers\//, label: "absolute macOS home path" },
  { pattern: /\/h[o]me\/[a-z]/, label: "absolute Linux home path" },
  { pattern: /C:\\U[s]ers\\/i, label: "absolute Windows home path" },
]

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

function lintFile(file: string, raw: string, allowTodo: boolean): Finding[] {
  const findings: Finding[] = []
  const push = (issue: string): number => findings.push({ file, issue })

  const parts = splitFrontmatter(raw)
  if (!parts) {
    push("missing YAML frontmatter (expected `---\\n...\\n---`)")
    return findings
  }

  const keys = parseYamlKeys(parts.yaml)
  for (const k of REQUIRED_FRONTMATTER) {
    if (!keys.has(k)) push(`frontmatter missing key: ${k}`)
  }

  for (const section of REQUIRED_SECTIONS) {
    const re = new RegExp(`^##\\s+${section.replace(/\(/g, "\\(").replace(/\)/g, "\\)")}\\b`, "m")
    if (!re.test(parts.body)) push(`missing section: ## ${section}`)
  }

  const bodyLines = parts.body.split("\n").length
  if (bodyLines > 200) push(`body too long: ${bodyLines} lines (max 200)`)

  for (const { pattern, label } of RESIDUE_PATTERNS) {
    if (pattern.test(raw)) push(`residue found — ${label}`)
  }

  if (!allowTodo && /TODO\(author\)/.test(raw)) {
    push("unresolved TODO(author) marker (finish T-17 before verify)")
  }

  return findings
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const allowTodo = args.includes("--allow-todo")
  const slugs = args.filter((a) => !a.startsWith("--"))

  const files = slugs.length
    ? slugs.map((s) => `${s}.md`)
    : (await readdir(AGENTS_DIR).catch(() => [])).filter((f) => f.endsWith(".md"))

  if (files.length === 0) {
    console.log("[verify-agents] no agents to lint")
    return
  }

  const allFindings: Finding[] = []
  for (const f of files) {
    const path = join(AGENTS_DIR, f)
    const raw = await readFile(path, "utf8").catch(() => "")
    if (!raw) {
      allFindings.push({ file: f, issue: "file not found or empty" })
      continue
    }
    allFindings.push(...lintFile(f, raw, allowTodo))
  }

  if (allFindings.length === 0) {
    console.log(`[verify-agents] ✔ ${files.length} file(s) passed`)
    return
  }

  for (const { file, issue } of allFindings) {
    console.error(`[verify-agents] ✘ ${file}: ${issue}`)
  }
  console.error(`[verify-agents] ${allFindings.length} issue(s) across ${files.length} file(s)`)
  process.exit(1)
}

main().catch((err: Error) => {
  console.error(`[verify-agents] fatal: ${err.message}`)
  process.exit(1)
})
