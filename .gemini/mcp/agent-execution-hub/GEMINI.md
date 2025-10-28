# Agent Execution Hub

## Overview

The Agent Execution Hub is an MCP server that actually **executes agents** with the Gemini API. It's the sister server to Agent Context Hub:

- **Agent Context Hub**: Coordinates tasks, manages shared context, handles events
- **Agent Execution Hub**: Loads agent configs and executes them with Gemini API

## Architecture

```
┌─────────────────────┐
│  Buddy Orchestrator │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ Context │  │Execution│
│   Hub   │  │   Hub   │
└─────────┘  └─────────┘
     │           │
     └─────┬─────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
  [Tasks]    [Results]
```

## Complete Workflow

### 1. Traditional Execution (Without Coordination)

```javascript
// Execute agent directly
{
  "method": "tools/call",
  "params": {
    "name": "execute_agent",
    "arguments": {
      "agentName": "github-manager",
      "task": "List all open pull requests",
      "context": {
        "repo": "myorg/myrepo"
      }
    }
  }
}
```

### 2. Coordinated Execution (With Context Hub)

```javascript
// Step 1: Create task in Context Hub
{
  "method": "tools/call",
  "params": {
    "name": "create_agent_task",
    "arguments": {
      "agentName": "github-manager",
      "description": "List all open pull requests",
      "context": { "repo": "myorg/myrepo" }
    }
  }
}
// Returns: { taskId: "task_123" }

// Step 2: Execute agent with coordination
{
  "method": "tools/call",
  "params": {
    "name": "execute_agent",
    "arguments": {
      "agentName": "github-manager",
      "task": "List all open pull requests for myorg/myrepo",
      "context": { "repo": "myorg/myrepo" },
      "mcpContext": {
        "taskId": "task_123",
        "coordinationHub": "agent-context-hub"
      }
    }
  }
}
// Returns: { executionId: "exec_456", status: "running" }

// Step 3: Execution Hub updates task status (automatic)
// Step 4: Execution Hub stores result (automatic)

// Step 5: Check execution status
{
  "method": "tools/call",
  "params": {
    "name": "get_execution_status",
    "arguments": {
      "executionId": "exec_456"
    }
  }
}
```

## Tools

### execute_agent

Execute an agent with Gemini API.

**Parameters:**
- `agentName`: Name of agent (e.g., "github-manager")
- `task`: Task description for the agent
- `context`: Additional context object
- `mcpContext`: Optional coordination context
  - `taskId`: Task ID from Agent Context Hub
  - `coordinationHub`: Name of coordination hub

**Returns:**
```json
{
  "executionId": "exec_123",
  "agentName": "github-manager",
  "task": "List all open pull requests",
  "status": "completed",
  "result": "Found 5 open PRs: ...",
  "startTime": 1234567890,
  "endTime": 1234567900,
  "tokensUsed": 1234
}
```

### get_agent_config

Load agent configuration without executing.

**Parameters:**
- `agentName`: Name of agent to load

**Returns:**
```json
{
  "config": {
    "name": "github-manager",
    "role": "GitHub operations specialist",
    "systemPrompt": "...",
    "capabilities": ["pr-management", "issue-tracking"],
    "tools": ["github"],
    "mcpServers": ["github-mcp"],
    "knowledgeFiles": ["knowledge/github-ops.md"]
  },
  "geminiConfig": {
    "model": "gemini-1.5-pro"
  },
  "knowledgeContent": "# GitHub Operations\n..."
}
```

### get_execution_status

Get status of running or completed execution.

**Parameters:**
- `executionId`: Execution ID from execute_agent

**Returns:** Same as execute_agent result

### cancel_execution

Cancel a running execution.

**Parameters:**
- `executionId`: Execution ID to cancel

**Returns:**
```json
{
  "cancelled": true
}
```

### list_active_executions

List all currently running executions.

**Parameters:** None

**Returns:**
```json
{
  "executions": [
    {
      "executionId": "exec_123",
      "agentName": "github-manager",
      "status": "running",
      "startTime": 1234567890
    }
  ]
}
```

## Integration Patterns

### Pattern 1: Simple Execution

Use when you just need to run an agent once:

```javascript
execute_agent("github-manager", "List PRs") → result
```

### Pattern 2: Monitored Execution

Use when you need to track execution:

```javascript
const { executionId } = execute_agent(...)
while (status !== "completed") {
  status = get_execution_status(executionId)
  wait(1000)
}
```

### Pattern 3: Coordinated Multi-Agent

Use for complex workflows:

```javascript
// Create tasks in Context Hub
const task1 = create_agent_task("github-manager", ...)
const task2 = create_agent_task("security-scanner", ...)

// Execute with coordination
execute_agent("github-manager", task1.description, { mcpContext: task1 })
execute_agent("security-scanner", task2.description, { mcpContext: task2 })

// Context Hub automatically tracks progress
```

## Environment Variables

- `GEMINI_API_KEY`: Required for Gemini API access

## Error Handling

All tools return structured errors:

```json
{
  "error": "Agent not found: invalid-agent",
  "tool": "execute_agent"
}
```

Common errors:
- "Agent not found" - Invalid agent name
- "GEMINI_API_KEY not set" - Missing API key
- "Gemini API error: 403" - API authentication failed
- "Execution not found" - Invalid execution ID

## Performance

- **Execution time**: Depends on agent task complexity (1-30s typical)
- **Token usage**: Tracked per execution
- **Concurrent executions**: No limit (memory-based)
- **Result storage**: In-memory (cleared on restart)

## Best Practices

1. **Always check agent config first** with `get_agent_config`
2. **Use mcpContext for coordination** when working with multiple agents
3. **Monitor long-running executions** with `get_execution_status`
4. **Cancel stuck executions** if needed
5. **Store results in Context Hub** for agent collaboration

## Examples

### Execute GitHub Agent

```bash
echo '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "execute_agent",
    "arguments": {
      "agentName": "github-manager",
      "task": "List all repositories in myorg organization"
    }
  }
}' | bun src/index.ts
```

### Coordinated Security Scan

```bash
# 1. Create task
create_agent_task("security-scanner", "Scan repository for vulnerabilities")

# 2. Execute with coordination
execute_agent("security-scanner", "...", {
  mcpContext: { taskId: "task_123" }
})

# 3. Results automatically stored in Context Hub
get_context("security-scan-results")
```

## Troubleshooting

**Problem**: "Agent not found"
- Check agent name matches directory in `.gemini/agents/`
- Verify `agent.json` exists in agent directory

**Problem**: "GEMINI_API_KEY not set"
- Set environment variable: `export GEMINI_API_KEY=your-key`
- Update settings.json with env config

**Problem**: Execution hangs
- Use `cancel_execution` to stop
- Check Gemini API status
- Review agent's system prompt for loops

## See Also

- [Agent Context Hub](../agent-context-hub/README.md) - Coordination server
- [Buddy Knowledge](../../agents/buddy/knowledge/mcp-servers.md) - Orchestration guide
