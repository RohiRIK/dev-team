#!/usr/bin/env bun
/**
 * port-agent.ts — port one Gemini agent to Claude plugin shape.
 *
 * Usage:
 *   bun scripts/port-agent.ts <slug>            # write agents/<slug>.md
 *   bun scripts/port-agent.ts <slug> --dry-run  # print to stdout
 *
 * Source: .gemini/agents/<slug>/{agent.json,agent.md}
 * Target: agents/<slug>.md
 *
 * Emits a skeleton with YAML frontmatter + canonical 7 sections (§5.6).
 * The body is pre-filled from the source where a 1:1 mapping exists; sections
 * requiring human judgment (When NOT to use, Tools rationale, Constraints,
 * Worked example) are stubbed with `TODO(author):` markers for T-17.
 */
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"

const ROOT = resolve(import.meta.dir, "..")
const SRC_DIR = join(ROOT, ".gemini", "agents")
const OUT_DIR = join(ROOT, "agents")

type GeminiAgentJson = {
  agent: { name: string; id: string; description: string; role?: string }
  capabilities?: string[]
  expertise?: { primary?: string[]; secondary?: string[] }
  tags?: string[]
}

const PREAMBLE_PATTERNS = [
  /^🚨🚨🚨[\s\S]*?(?=^#\s|^##\s)/m,
  /^UFC Hydration[^\n]*\n?/gm,
  /^DO NOT LIE[^\n]*\n?/gm,
  /^LOAD CONTEXT BOOTLOADER[^\n]*\n?/gm,
  /^BEFORE DOING OR SAYING[^\n]*\n?/gm,
  /^SESSION STARTUP REQUIREMENT[^\n]*\n?/gm,
  /^MANDATORY FIRST ACTION[^\n]*\n?/gm,
  /^OUTPUT UPON SUCCESS:[^\n]*\n?/gm,
]

function stripPreamble(md: string): string {
  let out = md
  for (const re of PREAMBLE_PATTERNS) out = out.replace(re, "")
  return out.replace(/^\s*\n+/, "").trimEnd()
}

function extractSection(md: string, heading: string): string {
  const re = new RegExp(
    `^##\\s+${heading.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*\\n([\\s\\S]*?)(?=^##\\s|\\Z)`,
    "m",
  )
  return (md.match(re)?.[1] ?? "").trim()
}

function bulletList(items: string[] | undefined): string {
  if (!items || items.length === 0) return "- TODO(author): fill in"
  return items.map((s) => `- ${s}`).join("\n")
}

function renderYaml(slug: string, j: GeminiAgentJson): string {
  const name = j.agent.name
  const desc = j.agent.description.replace(/"/g, '\\"').trim()
  return [
    "---",
    `name: ${slug}`,
    `description: "${desc}"`,
    "# tools allowlist — edit in T-16 per spec §5.4 (default-deny)",
    "tools: Read, Grep, Glob, Write, Edit, Bash",
    "model: inherit",
    "---",
  ].join("\n")
}

function renderBody(slug: string, j: GeminiAgentJson, md: string): string {
  const role = extractSection(md, "Role") || `You are the ${j.agent.name} agent.`
  const workflow =
    extractSection(md, "Workflow Process") ||
    extractSection(md, "Workflow") ||
    "TODO(author): numbered workflow steps"
  const caps = bulletList(j.capabilities)
  const primary = j.expertise?.primary ?? []
  const secondary = j.expertise?.secondary ?? []
  const expertise =
    primary.length || secondary.length
      ? [
          primary.length ? `**Primary:** ${primary.join(", ")}` : "",
          secondary.length ? `**Secondary:** ${secondary.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join("  \n")
      : ""

  return `## Role

${role}

## When to use

${caps}
${expertise ? `\n${expertise}\n` : ""}
## When NOT to use (Boundaries)

- TODO(author): list sibling agents to delegate to (see spec §5.4)

## Workflow

${workflow}

## Tools

TODO(author): one-line rationale per tool in the allowlist above.

## Constraints

- TODO(author): hard rules (e.g. never modify \`.env\`, always run tests before reporting complete)
- Report progress via \`mcp__task-tracker__update_task\`; mark complete only when all acceptance criteria are met.

## Worked example

TODO(author): one short input → steps → output example.
`
}

async function portAgent(slug: string, dryRun: boolean): Promise<void> {
  const srcJson = join(SRC_DIR, slug, "agent.json")
  const srcMd = join(SRC_DIR, slug, "agent.md")
  if (!existsSync(srcJson)) throw new Error(`missing: ${srcJson}`)
  if (!existsSync(srcMd)) throw new Error(`missing: ${srcMd}`)

  const j = JSON.parse(await readFile(srcJson, "utf8")) as GeminiAgentJson
  const rawMd = await readFile(srcMd, "utf8")
  const cleanMd = stripPreamble(rawMd)

  const out = `${renderYaml(slug, j)}\n\n${renderBody(slug, j, cleanMd)}`

  if (dryRun) {
    process.stdout.write(out)
    return
  }

  const target = join(OUT_DIR, `${slug}.md`)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, out, "utf8")
  console.log(`[port-agent] wrote ${target} (${out.split("\n").length} lines)`)
}

const [slug, ...flags] = process.argv.slice(2)
if (!slug) {
  console.error("usage: bun scripts/port-agent.ts <slug> [--dry-run]")
  process.exit(1)
}
const dryRun = flags.includes("--dry-run")
portAgent(slug, dryRun).catch((err: Error) => {
  console.error(`[port-agent] ${err.message}`)
  process.exit(1)
})
