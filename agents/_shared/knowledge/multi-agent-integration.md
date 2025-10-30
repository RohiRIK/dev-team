# Complete Multi-Agent System Integration Guide

## System Overview

The dev-team workspace now has a complete multi-agent execution system:

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
│ • Tasks        │◄────►│ • Execute agents   │
│ • Context      │      │ • Gemini API       │
│ • Events       │      │ • Results          │
└────────────────┘      └────────────────────┘
         │                        │
         └────────┬───────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    [29 Agents]      [Results]
```

## Components

### 1. Agent Context Hub
**Location**: `mcp/agent-context-hub`
**Purpose**: Coordination and task management

**Tools**:
- `create_agent_task` - Create new agent task
- `update_task_status` - Update task progress
- `get_task_status` - Check task status
- `get_ready_tasks` - Find tasks ready to execute
- `store_context` - Store shared data
- `get_context` - Retrieve shared data
- `subscribe_to_topics` - Listen for events
- `publish_event` - Broadcast events
- `initialize_agent` - Load agent config
- `execute_workflow` - Run multi-step workflows

### 2. Agent Execution Hub
**Location**: `mcp/agent-execution-hub`
**Purpose**: Actual agent execution with Gemini API

**Tools**:
- `execute_agent` - Execute agent with task
- `get_agent_config` - Load agent configuration
- `get_execution_status` - Check execution status
- `cancel_execution` - Stop running execution
- `list_active_executions` - Monitor active executions

### 3. Buddy Orchestrator
**Location**: `agents/buddy`
**Purpose**: Main coordinator of all agents

**Responsibilities**:
- Route tasks to appropriate agents
- Coordinate multi-agent workflows
- Manage MCP servers
- Provide tool support
- Handle system operations

## Usage Patterns

### Pattern 1: Single Agent Execution

**Use Case**: Simple one-off task

```javascript
// Direct execution
execute_agent("github-manager", "List all PRs")
```

**Flow**:
1. Buddy receives request
2. Calls `execute_agent` on Execution Hub
3. Execution Hub loads agent config
4. Calls Gemini API with agent's system prompt
5. Returns result

### Pattern 2: Coordinated Execution

**Use Case**: Task tracking and result sharing

```javascript
// 1. Create task
const task = create_agent_task("github-manager", "List all PRs")

// 2. Execute with coordination
execute_agent("github-manager", task.description, {
  mcpContext: { taskId: task.taskId }
})

// 3. Check status
get_task_status(task.taskId)

// 4. Get results
get_context(`task_${task.taskId}_result`)
```

**Flow**:
1. Context Hub creates task
2. Execution Hub executes agent
3. Results stored in Context Hub
4. Other agents can access results

### Pattern 3: Multi-Agent Workflow

**Use Case**: Complex task requiring multiple agents

```javascript
// 1. Create workflow
const workflow = {
  "name": "code-review",
  "steps": [
    {
      "id": "analyze",
      "tool": "execute_agent",
      "args": {
        "agentName": "code-analyzer",
        "task": "Analyze code quality"
      }
    },
    {
      "id": "security",
      "tool": "execute_agent",
      "args": {
        "agentName": "security-scanner",
        "task": "Scan for vulnerabilities"
      },
      "dependencies": ["analyze"]
    },
    {
      "id": "report",
      "tool": "store_context",
      "args": {
        "key": "review-report",
        "data": "${security.result}"
      },
      "dependencies": ["security"]
    }
  ]
}

// 2. Execute workflow
execute_workflow(workflow)
```

**Flow**:
1. Context Hub processes workflow
2. Executes steps in dependency order
3. Each step calls Execution Hub
4. Results stored and shared
5. Final report available to all agents

### Pattern 4: Event-Driven Coordination

**Use Case**: Reactive agent collaboration

```javascript
// Agent 1: Subscribe to events
subscribe_to_topics("github-manager", ["code-pushed"])

// Agent 2: Trigger event
publish_event("code-pushed", {
  repo: "myorg/myrepo",
  branch: "main"
})

// Agent 1: Receives event and executes
execute_agent("github-manager", "Process new code push")
```

**Flow**:
1. Agents subscribe to topics
2. Events trigger notifications
3. Agents react and execute
4. Results shared via Context Hub

## Configuration

### settings.json

Both MCP servers are configured:

```json
{
  "mcpServers": {
    "agent-context-hub": {
      "command": "bun",
      "args": ["mcp/agent-context-hub/src/index.ts"],
      "env": {
        "AGENTS_PATH": "agents"
      }
    },
    "agent-execution-hub": {
      "command": "bun",
      "args": ["mcp/agent-execution-hub/src/index.ts"],
      "env": {
        "GEMINI_API_KEY": "$GEMINI_API_KEY"
      }
    }
  }
}
```

### agent.json

Buddy has access to both servers:

```json
{
  "tools": [
    {
      "name": "Agent Context Hub MCP",
      "description": "Coordination with task management"
    },
    {
      "name": "Agent Execution Hub MCP",
      "description": "Agent execution with Gemini API"
    }
  ]
}
```

## Real-World Examples

### Example 1: GitHub PR Review

```javascript
// Buddy orchestrates the workflow

// 1. Create coordinated task
const task = create_agent_task("github-manager", 
  "Review PR #123 in myorg/myrepo")

// 2. Execute GitHub agent
const execution = execute_agent("github-manager", 
  "Fetch and analyze PR #123", {
    mcpContext: { taskId: task.taskId }
  })

// 3. Execute security scan
execute_agent("security-scanner", 
  "Scan PR #123 for vulnerabilities", {
    mcpContext: { taskId: task.taskId }
  })

// 4. All results stored in Context Hub
const results = get_context(`task_${task.taskId}_results`)
```

### Example 2: Infrastructure Deployment

```javascript
// Multi-step deployment workflow

const workflow = {
  "name": "deploy-app",
  "steps": [
    {
      "id": "validate",
      "tool": "execute_agent",
      "args": {
        "agentName": "infrastructure-engineer",
        "task": "Validate Terraform config"
      }
    },
    {
      "id": "security-check",
      "tool": "execute_agent",
      "args": {
        "agentName": "security-scanner",
        "task": "Check for security issues"
      },
      "dependencies": ["validate"]
    },
    {
      "id": "deploy",
      "tool": "execute_agent",
      "args": {
        "agentName": "infrastructure-engineer",
        "task": "Apply Terraform changes"
      },
      "dependencies": ["security-check"]
    }
  ]
}

execute_workflow(workflow)
```

### Example 3: Code Quality Analysis

```javascript
// Parallel analysis with result aggregation

// Create tasks
const tasks = [
  create_agent_task("code-analyzer", "Analyze code quality"),
  create_agent_task("security-scanner", "Scan for vulnerabilities"),
  create_agent_task("test-engineer", "Run test suite")
]

// Execute in parallel
tasks.forEach(task => {
  execute_agent(task.agentName, task.description, {
    mcpContext: { taskId: task.taskId }
  })
})

// Wait for all to complete
while (tasks.some(t => get_task_status(t.taskId).status === "running")) {
  await sleep(1000)
}

// Aggregate results
const results = tasks.map(t => 
  get_context(`task_${t.taskId}_result`)
)
```

## Testing

### Test Context Hub

```bash
cd mcp/agent-context-hub
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | bun src/index.ts
```

### Test Execution Hub

```bash
cd mcp/agent-execution-hub
```

### Test Agent Execution

```bash
cd mcp/agent-execution-hub
./test.sh
```

## Troubleshooting

### Problem: Agent not found

**Solution**: Check agent directory exists
```bash
ls agents/github-manager/
```

### Problem: Gemini API error

**Solution**: Verify API key
```bash
echo $GEMINI_API_KEY
```

### Problem: Task stuck in "running"

**Solution**: Check execution status or cancel
```javascript
get_execution_status(executionId)
cancel_execution(executionId)
```

### Problem: Context not shared

**Solution**: Verify task coordination
```javascript
// Must include mcpContext
execute_agent("agent-name", "task", {
  mcpContext: { taskId: "task_123" }
})
```

## Best Practices

1. **Always coordinate complex workflows** using Context Hub
2. **Use workflows for multi-step processes** instead of manual orchestration
3. **Store results in Context Hub** for agent collaboration
4. **Monitor executions** for long-running tasks
5. **Subscribe to events** for reactive behavior
6. **Load agent config first** to understand capabilities
7. **Handle errors gracefully** with try-catch patterns
8. **Use parallel execution** when tasks are independent
9. **Keep tasks atomic** for better tracking
10. **Document workflows** for team understanding

## Next Steps

1. Add more specialized agents to `agents/`
2. Create workflow templates in `mcp/agent-context-hub/workflows/templates/`
3. Build custom MCP servers for domain-specific tools
4. Implement agent-to-agent direct communication
5. Add workflow scheduling and automation
6. Build monitoring dashboard for executions
7. Create workflow library for common patterns
8. Add result persistence beyond in-memory storage

## Resources

- [Agent Context Hub Docs](../agent-context-hub/agent.md)
- [Agent Execution Hub Docs](../agent-execution-hub/agent.md)
- [Buddy Knowledge](../../agents/buddy/knowledge/mcp-servers.md)
- [MCP Specification](https://modelcontextprotocol.io/)
