# Dev Team - Multi-Agent AI System

A complete multi-agent AI system with **Buddy** as the main orchestrator, managing 29+ specialized agents through an advanced coordination and execution architecture.

## Overview

This system provides a powerful multi-agent platform where **Buddy** orchestrates specialized agents using two key MCP servers:

- **Agent Context Hub**: Coordinates tasks, manages shared context, and enables event-driven communication
- **Agent Execution Hub**: Prepares and executes agents dynamically via agent-loader
- **29+ Specialized Agents**: Each agent is an expert in their domain (GitHub, security, infrastructure, etc.)

The architecture enables sequential and parallel task execution, workflow automation, and seamless agent collaboration.

## Architecture

```
┌──────────────────────────────────────────────┐
│           Buddy (Orchestrator)               │
│  - Coordinates all agents                    │
│  - Routes tasks                              │
│  - Manages workflows                         │
└────────┬────────────────────────┬────────────┘
         │                        │
         ▼                        ▼
┌────────────────┐      ┌────────────────────┐
│ Context Hub    │      │ Execution Hub      │
│                │      │                    │
│ • Tasks        │◄────►│ • Prepare agents   │
│ • Context      │      │ • Load configs     │
│ • Events       │      │ • Agent-loader     │
└────────────────┘      └────────────────────┘
         │                        │
         └────────┬───────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    [29+ Agents]      [Results]
```

## Getting Started

### Prerequisites

*   [Bun](https://bun.sh/) - JavaScript/TypeScript runtime
*   [Node.js](https://nodejs.org/) - For some MCP servers
*   [Python](https://www.python.org/) & [uv](https://github.com/astral-sh/uv) - For Python tools
*   [Homebrew](https://brew.sh/) - Package manager (macOS/Linux)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd dev-team
   ```

2. **Install MCP server dependencies:**
   ```bash
   # Agent Context Hub
   cd .gemini/mcp/agent-context-hub
   bun install
   
   # Agent Execution Hub
   cd ../agent-execution-hub
   bun install
   
   # Agent Loader
   cd ../agent-loader
   bun install
   ```

3. **Configure in Claude Desktop/VS Code:**
   - The `.gemini/settings.json` file contains all MCP server configurations
   - Buddy automatically has access to all servers and agents

## Usage

### Using Buddy Directly

Buddy is your main interface. Simply ask Buddy to:
- Execute any agent: "Use github-manager to list my repos"
- Coordinate multiple agents: "Have security-scanner check the repo, then github-manager commit fixes"
- Run workflows: "Execute the code-review workflow"

### Using Agent Context Hub

For complex multi-agent coordination:

```javascript
// Create a task
create_agent_task("github-manager", "Update all READMEs")

// Execute with coordination
execute_agent("github-manager", "...", { mcpContext: { taskId: "task_123" }})

// Track progress
get_task_status("task_123")
```

### Using Agent Execution Hub

To prepare and execute agents:

```javascript
// Load agent configuration
get_agent_config("github-manager")

// Execute agent (returns config for agent-loader)
execute_agent("github-manager", "Say hello")
```

## MCP Servers

### Agent Context Hub
**Location**: `.gemini/mcp/agent-context-hub`

**Tools**: `create_agent_task`, `update_task_status`, `get_task_status`, `get_ready_tasks`, `store_context`, `get_context`, `subscribe_to_topics`, `publish_event`, `initialize_agent`, `execute_workflow`

### Agent Execution Hub
**Location**: `.gemini/mcp/agent-execution-hub`

**Tools**: `execute_agent`, `get_agent_config`, `get_execution_status`, `cancel_execution`, `list_active_executions`

### Agent Loader
**Location**: `.gemini/mcp/agent-loader`

**Tools**: Dynamically loads agent contexts on-demand

## Agents

**29+ Specialized Agents** organized by domain:

- **Development**: github-manager, code-analyzer, test-engineer
- **Infrastructure**: infrastructure-engineer, docker-specialist, kubernetes-expert
- **Security**: security-scanner, compliance-auditor
- **Data**: data-engineer, ml-engineer
- And many more...

Each agent is located in `.gemini/agents/<agent-name>/` with:
- `agent.json` - Configuration
- `agent.md` - System prompt
- `knowledge/` - Domain-specific knowledge
- `tools/` - Agent-specific tools

## Contributing

Please see the [CONTRIBUTING.md](/.github/CONTRIBUTING.md) file for details on how to contribute to this project.

## Code of Conduct

Please see the [CODE_OF_CONDUCT.md](/.github/CODE_OF_CONDUCT.md) file for details on our code of conduct.
