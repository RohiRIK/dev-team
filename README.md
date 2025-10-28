# Dev Team - Multi-Agent AI System

A complete multi-agent AI system with **Buddy** as the main orchestrator, managing 29+ specialized agents through an advanced coordination and execution architecture.

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

## MCP Servers & Agents

This system leverages several Model Context Protocol (MCP) servers for agent coordination and execution, and includes over 29 specialized agents. For detailed information on each MCP server and agent, please refer to their respective directories within `.gemini/mcp/` and `.gemini/agents/`.

## Contributing

Please see the [CONTRIBUTING.md](/.github/CONTRIBUTING.md) file for details on how to contribute to this project.

## Code of Conduct

Please see the [CODE_OF_CONDUCT.md](/.github/CODE_OF_CONDUCT.md) file for details on our code of conduct.