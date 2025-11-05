# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-agent AI system with **Buddy AI** as the main orchestrator, managing 29+ specialized agents through an advanced coordination architecture. The system uses Model Context Protocol (MCP) servers for dynamic agent loading, task coordination, and workflow execution.

### Buddy AI - The Orchestrator

**Buddy AI** is the central orchestrator that:
- Provides a **unified interface** to all specialized agents
- **Routes tasks** intelligently to the appropriate agent(s) based on domain expertise
- **Coordinates multi-agent workflows** for complex projects
- **Handles simple tasks directly** without agent delegation
- **Manages system resources** and MCP servers efficiently

**Key Files:**
- `.gemini/agent.md` - Buddy's identity, capabilities, and orchestration logic
- `.gemini/agent.json` - Buddy's configuration (tools, context, routing rules)
- `.gemini/settings.json` - System-wide configuration including MCP servers
- `BUDDY-SETUP.md` - Complete setup and usage guide for Buddy AI

**Configuration:**
Buddy is **globally accessible** from any directory in the project through the Gemini CLI context discovery system. The `.gemini/agent.md` file is automatically loaded at startup.

## Key Architecture Concepts

### Agent System
- **Buddy** acts as the central orchestrator that routes requests to specialized agents
- **29+ specialized agents** in `agents/` directory, each with domain expertise (frontend-developer, backend-developer, security-analyst, etc.)
- Each agent has an `agent.md` file defining its role, capabilities, and knowledge base
- Agents are loaded dynamically via MCP servers to manage context efficiently
- **Shared resources** in `agents/_shared/` provide common knowledge, tools, and orchestration patterns

### MCP Servers Architecture
The system uses several MCP servers for different capabilities:

1. **agent-context-hub** (`mcp/agent-context-hub/`) - Unified agent coordinator with task management, shared context, and event-driven coordination
2. **fabric** (`mcp/fabric-integration/`) - Executes Fabric AI patterns for content processing (extract_wisdom, summarize, etc.)
3. **workflow-loader** (`mcp/workflow-loader/`) - Loads n8n workflows and documentation on-demand
4. **template** (`mcp/template/`) - Template for creating new MCP servers

External MCP servers (context7, deepwiki, fetch, sequential-thinking, playwright) are also configured.

### Key Directories
```
dev-team/
├── agents/              # 29+ specialized AI agents
│   ├── _shared/        # Common knowledge, tools, orchestration patterns
│   ├── _template/      # Template for new agents
│   └── [agent-name]/   # Each agent: agent.md, knowledge/, tools/
├── mcp/                # MCP server implementations
│   ├── agent-context-hub/  # Central coordination hub
│   ├── fabric-integration/ # Fabric patterns integration
│   ├── workflow-loader/    # n8n workflow loader
│   └── template/          # MCP server template
├── launcher/          # Rust-based launcher for managing MCP servers
├── .gemini/          # Gemini CLI configuration
│   ├── settings.json  # Main config with MCP servers
│   └── agent.json    # Buddy orchestrator config
└── scripts/          # Utility scripts
```

## Common Commands

### Development Setup
```bash
# Install MCP server dependencies
cd mcp/agent-context-hub && bun install
cd ../fabric-integration && bun install
cd ../workflow-loader && bun install

# Build and install Rust launcher (optional, for MCP server management)
cd launcher
cargo build --release
./install.sh
```

### Running the System
```bash
# Using the Rust launcher (starts all MCP servers automatically)
./buddy

# Or use the shell alias (after installation)
buddy

# Direct launcher execution
launcher/target/release/buddy-ai
```

### Testing
```bash
# Run agent context hub tests
cd mcp/agent-context-hub
bun run tests/run-all-tests.ts

# Test specific agent initialization
bun run tests/test-initialize-agent.ts

# Test workflow listing
bun run src/workflows/test-list-workflows.ts
```

### Creating New Components

#### New MCP Server
```bash
# Copy template
cp -r mcp/template mcp/your-server-name
cd mcp/your-server-name

# Update package.json (name, description)
# Install dependencies
bun install

# Implement tools in src/index.ts
# Register in .gemini/settings.json under mcpServers
```

#### New Agent
```bash
# Copy template
cp -r agents/_template agents/your-agent-name

# Edit agent.md with role, capabilities, workflow
# Add knowledge files in knowledge/
# Add tool definitions in tools/
# Update agents/_shared/orchestration.md routing matrix
```

## Critical Patterns and Best Practices

### MCP Server Development
**CRITICAL: Always use `.shape` with Zod schemas**

```typescript
// ✅ CORRECT
inputSchema: z.object({
  param: z.string().describe('Description')
}).shape

// ❌ WRONG - Will cause TypeScript compilation errors
inputSchema: z.object({
  param: z.string()
})
```

This pattern is required by the MCP SDK and prevents type errors. See `mcp/MCP-GUIDE.md` for complete reference.

### Agent Orchestration
Buddy uses routing decision matrix in `agents/_shared/orchestration.md` to determine which agent(s) to load:
- **Sequential Workflow**: Chain agents for ordered tasks (e.g., backend → database → frontend → QA)
- **Parallel Consultation**: Load multiple agents simultaneously for different perspectives
- **Iterative Refinement**: Progressive improvement through specialist reviews
- **Escalation**: Start general, escalate to specialists as needed

### Context Management
- Only load agents when necessary (lazy loading)
- Use `agents/_shared/` for common resources to avoid duplication
- Max context window: 1,000,000 tokens (configured in settings.json)
- Compression enabled at 800k tokens → target 400k tokens

### Agent Structure
Each agent has:
- `agent.md` - Role definition, capabilities, workflow process
- `knowledge/` - Domain-specific knowledge files
- `tools/` - Tool definitions and usage guides
- `mcp/mission.md` - (Optional) MCP integration mission

Reference knowledge files using `@knowledge/filename.md` pattern.
Reference tools using `@tools/filename.md` pattern.

## Configuration Files

### .gemini/settings.json
Main configuration file containing:
- MCP server definitions (command, args, env, cwd)
- Auto-accept tools and MCP servers
- Context configuration (file discovery, token limits)
- UI preferences, telemetry settings

### .gemini/agent.json
Buddy orchestrator configuration with:
- System role and capabilities
- MCP tools access
- Orchestration knowledge

## Important Implementation Notes

### Agent Context Hub
The agent-context-hub provides:
- Task creation with dependencies
- Parallel and sequential task execution
- Shared context blackboard pattern
- Event-driven pub/sub system
- Progress tracking and status updates
- Workflow templates in `workflows/templates/`

Access via MCP tools: `create_agent_task`, `execute_agent`, `get_task_status`, `store_context`, `get_context`

### Fabric Integration
Execute AI patterns for content processing:
- `extract_wisdom` - Extract key insights
- `summarize` - Condense information
- `analyze_claims` - Fact-checking
- `create_agenda` - Structure tasks

### Launcher (Rust)
Beautiful CLI launcher that:
- Starts all MCP servers concurrently
- Provides progress bars and status indicators
- Handles clean shutdown on Ctrl+C
- No orphaned processes

Built with: colored, indicatif, tokio, ctrlc

## Development Workflow

### Working with Buddy AI

When working on this codebase, **Buddy AI** is your primary interface:

1. **Start with Buddy**: Launch Buddy using `./buddy` or `gemini` command
2. **Let Buddy Route**: Describe your task, let Buddy determine which agent(s) to use
3. **Trust the Orchestration**: Buddy knows the agent capabilities and routing logic
4. **Provide Context**: Give enough detail for Buddy to make intelligent routing decisions

### Buddy's Workflow

1. **Understanding Requests**: Buddy analyzes your request and consults orchestration knowledge (`agents/_shared/orchestration.md`)
2. **Routing Decision**: Buddy decides to either:
   - Handle the task directly (simple queries, system operations)
   - Route to a single specialized agent
   - Coordinate multiple agents for complex workflows
3. **Loading Context**: Buddy loads agent.md files on-demand, plus relevant knowledge and tools
4. **Multi-Agent Coordination**: Uses agent-context-hub MCP for complex multi-step workflows
5. **Execution**: Executes tasks using agents and MCP tools
6. **Result Delivery**: Returns results to you with clear explanations

### Example Workflows

**Single Agent Task:**
```
You: "I need to optimize my database queries"
Buddy: Loads database-admin → Provides optimization guidance
```

**Multi-Agent Task:**
```
You: "Build a secure REST API with authentication"
Buddy: Coordinates backend-developer → security-analyst → database-admin → qa-tester
```

**Direct Handling:**
```
You: "What's the difference between Bun and Node.js?"
Buddy: Answers directly without loading agents
```

### Testing Agent Coordination

Test agent interactions using test scripts:
```bash
cd mcp/agent-context-hub
bun run tests/run-all-tests.ts
bun run tests/test-initialize-agent.ts
```

## TypeScript/Bun Projects
- All MCP servers use Bun runtime (fast JavaScript/TypeScript)
- Type-safe with TypeScript 5.3+
- Module type: ESM (use `import` not `require`)
- Zod for schema validation

## Rust Project (Launcher)
- Compiled release binary for production use
- Dependencies: colored, indicatif, tokio, ctrlc, serde, serde_json
- Build: `cargo build --release`
- Binary location: `launcher/target/release/buddy-ai`

## Debugging and Troubleshooting

### MCP Server Issues
- Check server logs: Set `LOG_LEVEL=debug` in env
- Test server standalone: `cd mcp/[server-name] && bun run dev`
- Verify tool registration with `.shape` suffix on schemas
- Check `settings.json` for correct paths and args

### Agent Loading Issues
- Verify agent.md exists and is properly formatted
- Check AGENTS_PATH environment variable
- Use agent-context-hub tools to list available agents
- Review `agents/_shared/orchestration.md` for routing logic

### Context Overflow
- Use Fabric patterns to compress large content
- Remove old agent contexts when loading new ones
- Prioritize essential context only
- Enable chat compression (configured at 800k tokens)
