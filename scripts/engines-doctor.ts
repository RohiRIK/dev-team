#!/usr/bin/env bun
/**
 * engines-doctor.ts — probe each engine in state/engines.json and report
 * which CLI binaries are installed on this device.
 *
 * Usage:
 *   bun scripts/engines-doctor.ts            # human-readable table
 *   bun scripts/engines-doctor.ts --json     # machine output
 *
 * Exit: 0 if at least one engine resolves; 1 if every engine is missing.
 *       (claude is always considered present — it's the built-in fallback.)
 */
import { resolve } from "node:path"
import { loadEngineRegistry } from "../mcp/task-tracker/src/engines.ts"

interface ProbeResult {
  engine: string
  command: string
  installed: boolean
  resolved_path: string | null
}

const probe = async (
  registryPath: string,
): Promise<ProbeResult[]> => {
  const registry = await loadEngineRegistry(registryPath)
  const results: ProbeResult[] = []
  for (const [engine, cfg] of Object.entries(registry.engines)) {
    const resolvedPath = Bun.which(cfg.command)
    results.push({
      engine,
      command: cfg.command,
      installed: resolvedPath !== null,
      resolved_path: resolvedPath,
    })
  }
  return results.sort((a, b) => a.engine.localeCompare(b.engine))
}

const renderTable = (results: ProbeResult[]): string => {
  const nameW = Math.max(6, ...results.map((r) => r.engine.length))
  const cmdW = Math.max(7, ...results.map((r) => r.command.length))
  const lines: string[] = []
  lines.push(
    `${"engine".padEnd(nameW)}  ${"command".padEnd(cmdW)}  status`,
  )
  lines.push(`${"-".repeat(nameW)}  ${"-".repeat(cmdW)}  ${"-".repeat(40)}`)
  for (const r of results) {
    const mark = r.installed ? "✓" : "✗"
    const detail = r.installed
      ? r.resolved_path
      : "not installed (engine will fall back to claude on dispatch)"
    lines.push(
      `${mark} ${r.engine.padEnd(nameW - 2)}  ${r.command.padEnd(cmdW)}  ${detail}`,
    )
  }
  return lines.join("\n")
}

const main = async (): Promise<void> => {
  const args = Bun.argv.slice(2)
  const json = args.includes("--json")
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
  const registryPath = resolve(projectDir, "state", "engines.json")

  const results = await probe(registryPath)

  if (json) {
    process.stdout.write(`${JSON.stringify({ engines: results }, null, 2)}\n`)
  } else {
    process.stdout.write(`${renderTable(results)}\n`)
  }

  const anyInstalled = results.some((r) => r.installed)
  process.exit(anyInstalled ? 0 : 1)
}

await main()
