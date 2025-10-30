# Agent Loader MCP Server

This MCP server provides dynamic agent loading capabilities for Gemini CLI.

## Features

- **list_available_agents**: Lists all available agents
- **load_agent_context**: Loads agent-specific agent.md context
- **load_agent_config**: Loads agent configuration (agent.json)
- **load_agent_knowledge**: Loads specific knowledge files
- **load_shared_context**: Loads shared context
- **load_shared_tools**: Loads shared tools documentation

## Installation

To set up the project, navigate to the `mcp/agent-loader` directory and install the dependencies using Bun:

```bash
cd mcp/agent-loader
bun install
```

## Development

- `bun run dev`: Build and run the server in development mode.
- `bun run typecheck`: Run TypeScript type checking.

## Why Bun?

- **No build step needed**: Bun runs TypeScript directly
- **Faster**: 3x faster than Node.js
- **Smaller**: No `dist/` folder needed
- **Native TypeScript**: Built-in TS support

## Usage with Gemini CLI

The MCP server is automatically started by Gemini CLI when configured in `settings.json`.

Example configuration for `settings.json`:

```json
{
  "mcpServers": {
    "agent-loader": {
      "command": "bun",
      "args": ["mcp/agent-loader/src/index.ts"]
    }
  }
}
```

No `npm run build` required!

## Tools

### `list_available_agents`
Returns a list of all agent directories (excluding _shared).

### `load_agent_context`
Loads the `agent.md` file for a specific agent.

**Parameters:**
- `agent_name` (string): Name of the agent

### `load_agent_config`
Loads the `agent.json` configuration file.

**Parameters:**
- `agent_name` (string): Name of the agent

### `load_agent_knowledge`
Loads a specific knowledge file from an agent's knowledge directory.

**Parameters:**
- `agent_name` (string): Name of the agent
- `knowledge_file` (string): Filename (e.g., "security-rules.md")

### `load_shared_context`
Loads the shared context from `agents/_shared/context.md`.

### `load_shared_tools`
Loads the shared tools documentation from `agents/_shared/tools.md`.