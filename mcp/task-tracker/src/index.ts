#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"
import { loadState, saveState } from "./store.ts"
import { CompleteTaskInput, completeTask } from "./tools/completeTask.ts"
import { CreateTaskInput, createTask } from "./tools/createTask.ts"
import { GetTaskInput, getTask } from "./tools/getTask.ts"
import { ListTasksInput, listTasks } from "./tools/listTasks.ts"
import { UpdateTaskInput, updateTask } from "./tools/updateTask.ts"
import { health } from "./tools/health.ts"

const server = new Server(
  { name: "task-tracker", version: "0.1.0" },
  { capabilities: { tools: {} } },
)

const zodToJsonSchema = (schema: z.ZodTypeAny): Record<string, unknown> => {
  const shape = (schema as z.ZodObject<z.ZodRawShape>).shape
  const properties: Record<string, unknown> = {}
  const required: string[] = []
  for (const [key, field] of Object.entries(shape)) {
    const inner = field as z.ZodTypeAny
    const unwrapped = inner instanceof z.ZodOptional ? inner._def.innerType : inner
    const isOptional = inner instanceof z.ZodOptional
    if (!isOptional) required.push(key)
    if (unwrapped instanceof z.ZodString) properties[key] = { type: "string" }
    else if (unwrapped instanceof z.ZodNumber) properties[key] = { type: "number" }
    else if (unwrapped instanceof z.ZodArray) {
      const element = unwrapped._def.type as z.ZodTypeAny
      const items =
        element instanceof z.ZodString ? { type: "string" } : { type: "object" }
      properties[key] = { type: "array", items }
    } else if (unwrapped instanceof z.ZodEnum)
      properties[key] = { type: "string", enum: unwrapped.options }
    else properties[key] = {}
  }
  return { type: "object", properties, required }
}

const tools = [
  {
    name: "create_task",
    description:
      "Create a task. Returns {id, status}. Required: agent (slug from agents/), title. Optional: description, dependsOn (task ids), tags.",
    inputSchema: zodToJsonSchema(CreateTaskInput),
  },
  {
    name: "list_tasks",
    description:
      "List tasks. Returns only summary fields {id, agent, title, status, updatedAt}. Use get_task(id) for full row. Filters: status, agent, limit.",
    inputSchema: zodToJsonSchema(ListTasksInput),
  },
  {
    name: "get_task",
    description: "Get the full row for one task by id.",
    inputSchema: zodToJsonSchema(GetTaskInput),
  },
  {
    name: "update_task",
    description:
      "Update a task. Any combination of status, description, result, artifacts. Bumps updatedAt.",
    inputSchema: zodToJsonSchema(UpdateTaskInput),
  },
  {
    name: "complete_task",
    description:
      "Mark a task completed. Sets status=completed, completedAt. Optionally records result + artifacts.",
    inputSchema: zodToJsonSchema(CompleteTaskInput),
  },
  {
    name: "health",
    description: "Return server health: status, name, version, and current task count. Read-only.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
]

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params
  const state = await loadState()
  try {
    switch (name) {
      case "create_task": {
        const { state: next, result } = createTask(state, args as never)
        await saveState(next)
        return { content: [{ type: "text", text: JSON.stringify(result) }] }
      }
      case "list_tasks": {
        const rows = listTasks(state, args as never)
        return { content: [{ type: "text", text: JSON.stringify(rows) }] }
      }
      case "get_task": {
        const row = getTask(state, args as never)
        return { content: [{ type: "text", text: JSON.stringify(row) }] }
      }
      case "update_task": {
        const { state: next, result } = updateTask(state, args as never)
        await saveState(next)
        return { content: [{ type: "text", text: JSON.stringify(result) }] }
      }
      case "complete_task": {
        const { state: next, result } = completeTask(state, args as never)
        await saveState(next)
        return { content: [{ type: "text", text: JSON.stringify(result) }] }
      }
      case "health": {
        const result = health(state)
        return { content: [{ type: "text", text: JSON.stringify(result) }] }
      }
      default:
        throw new Error(`unknown tool: ${name}`)
    }
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: (err as Error).message }],
    }
  }
})

async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error("[task-tracker] fatal:", err)
  process.exit(1)
})
