#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

const server = new Server(
  { name: "task-tracker", version: "0.1.0" },
  { capabilities: { tools: {}, resources: {} } },
)

async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error("[task-tracker] fatal:", err)
  process.exit(1)
})
