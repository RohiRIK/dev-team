# Agent Context Hub - Shared Context System

## Overview

The Agent Context Hub is an MCP (Model Context Protocol) server that enables multi-agent coordination through a shared context system. All agents can access and contribute to a centralized "blackboard" where tasks, results, and metadata are stored.

## Core Concept: The Blackboard Pattern

Think of the shared context as a **collaborative whiteboard** where:
- 🎯 **Tasks** are posted for agents to execute
- 📊 **Results** are shared between agents
- 📝 **Metadata** stores additional session information
- 🔔 **Subscriptions** notify agents of changes

## Shared Context Structure

```typescript
interface SharedContext {
  sessionId: string;                        // Unique session identifier
  tasks: Map<string, AgentTask>;            // All tasks in this session
  results: Map<string, any>;                // Agent outputs/results
  meta: Record<string, any>;                // Custom metadata
  subscriptions: Map<string, string[]>;     // Agent subscriptions
  createdAt: Date;                          // Session start time
  updatedAt: Date;                          // Last update time
}
```

### Task Structure

```typescript
interface AgentTask {
  id: string;                               // Unique task ID
  agentName: string;                        // Agent assigned
  task: string;                             // Task description
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  input: any;                               // Input data
  output?: any;                             // Result data
  dependencies: string[];                   // Required task IDs
  createdAt: Date;
  completedAt?: Date;
  progress: number;                         // 0-100
  error?: string;                           // Error message if failed
}
```

## Available MCP Tools

### 1. Task Management

#### `create_agent_task`
Creates a new task for an agent with optional dependencies.

```json
{
  "sessionId": "my-session-123",
  "agentName": "backend-developer",
  "task": "Create REST API endpoints",
  "input": {
    "endpoints": ["/users", "/posts"],
    "database": "PostgreSQL"
  },
  "dependencies": []
}
```

**Returns**: `{ success: true, taskId: "task_xxx", agentName: "...", status: "pending", dependencies: [] }`

#### `update_task_status`
Updates task progress and status.

```json
{
  "sessionId": "my-session-123",
  "taskId": "task_xxx",
  "status": "in_progress",
  "progress": 50,
  "output": {
    "completedEndpoints": ["/users"]
  }
}
```

#### `get_task_status`
Retrieves status of specific task or all tasks in a session.

```json
{
  "sessionId": "my-session-123",
  "taskId": "task_xxx"  // Optional - omit to get all tasks
}
```

#### `get_ready_tasks`
Gets tasks ready to execute (all dependencies satisfied).

```json
{
  "sessionId": "my-session-123"
}
```

**Returns**: Array of tasks with status "pending" and all dependencies completed.

### 2. Context Storage

#### `store_context`
Stores arbitrary data in the shared context.

```json
{
  "sessionId": "my-session-123",
  "key": "api_design",
  "value": {
    "architecture": "REST",
    "authentication": "JWT",
    "database": "PostgreSQL"
  }
}
```

#### `get_context`
Retrieves stored context data.

```json
{
  "sessionId": "my-session-123",
  "key": "api_design"  // Optional - omit to get all metadata
}
```

### 3. Agent Coordination

#### `subscribe`
Subscribe an agent to specific topics for notifications.

```json
{
  "sessionId": "my-session-123",
  "agentId": "devops-engineer",
  "topics": ["deployment", "infrastructure"]
}
```

#### `publish`
Publish a message to subscribed agents.

```json
{
  "sessionId": "my-session-123",
  "topic": "deployment",
  "message": {
    "event": "build_complete",
    "artifact": "api-v1.2.3.tar.gz"
  }
}
```

### 4. Task Analysis & Learning

#### `elicit_task_details`
Analyzes user input to extract task structure.

```json
{
  "userInput": "Build a REST API with authentication and deploy to AWS"
}
```

**Returns**: `{ mainGoal, complexity, suggestedSubtasks, requiredAgents, estimatedDuration }`

#### `record_task_outcome`
Records task outcomes for retrospective learning.

```json
{
  "outcome": {
    "sessionId": "my-session-123",
    "taskId": "task_xxx",
    "agentName": "backend-developer",
    "taskDescription": "Build REST API",
    "success": true,
    "durationMs": 45000,
    "issues": [],
    "output": { "endpoints": 5 }
  }
}
```

#### `find_similar_past_tasks`
Finds similar past tasks based on description.

```json
{
  "taskDescription": "Deploy Node.js application",
  "limit": 5
}
```

#### `analyze_task_performance`
Analyzes performance of tasks in a session.

```json
{
  "sessionId": "my-session-123"
}
```

#### `generate_recommendations`
Generates recommendations based on task history.

```json
{
  "sessionId": "my-session-123"
}
```

## Usage Patterns

### Pattern 1: Sequential Workflow

```
1. User: "Build and deploy an API"

2. Orchestrator creates tasks:
   - create_agent_task(backend-developer, "Build API")
   - create_agent_task(qa-tester, "Test API", deps=[backend-task])
   - create_agent_task(devops-engineer, "Deploy API", deps=[qa-task])

3. Agents execute in order:
   - Backend dev starts immediately
   - QA waits for backend completion
   - DevOps waits for QA completion
```

### Pattern 2: Parallel Execution

```
1. User: "Build a full-stack app"

2. Orchestrator creates parallel tasks:
   - create_agent_task(backend-developer, "Build API")
   - create_agent_task(frontend-developer, "Build UI")
   
3. Both agents work simultaneously

4. After both complete:
   - create_agent_task(qa-tester, "Integration test", deps=[api-task, ui-task])
```

### Pattern 3: Shared Context

```
1. Architect designs system:
   - store_context("architecture", { design: "microservices" })

2. Multiple agents read the design:
   - Backend dev: get_context("architecture")
   - DevOps: get_context("architecture")
   - Security: get_context("architecture")

3. Each contributes their part:
   - Backend: store_context("api_spec", {...})
   - DevOps: store_context("infrastructure", {...})
   - Security: store_context("security_requirements", {...})
```

### Pattern 4: Event-Driven Collaboration

```
1. DevOps subscribes to build events:
   - subscribe("devops-engineer", ["build_complete"])

2. Backend completes build:
   - publish("build_complete", { artifact: "api-v1.0.0" })

3. DevOps receives notification and deploys
```

## MCP Server Configuration

Add to your `settings.json` or MCP client configuration:

```json
{
  "mcpServers": {
    "agent-context-hub": {
      "command": "bun",
      "args": ["run", "mcp/agent-context-hub/src/index.ts"],
      "env": {}
    }
  }
}
```

## Resources Available

The MCP server also provides resources for monitoring:

- `session://list` - List all active sessions
- `session://{sessionId}` - Get session details
- `queue://tasks/{sessionId}` - View task queue
- `blackboard://{sessionId}` - View shared context

## Best Practices

### ✅ DO

- **Use descriptive session IDs**: `project-api-deployment-20250127`
- **Store shared design decisions** in context for all agents
- **Check dependencies** before creating dependent tasks
- **Update task progress** regularly for visibility
- **Record task outcomes** for learning

### ❌ DON'T

- **Don't create circular dependencies**: Task A depends on B, B depends on A
- **Don't skip error handling**: Always check task status before proceeding
- **Don't store large files** in context: Use references instead
- **Don't forget to complete tasks**: Update status to 'completed' or 'failed'

## Example: Complete Multi-Agent Workflow

```typescript
// 1. User request: "Build secure API and deploy to AWS"

// 2. Orchestrator analyzes task
const details = await elicit_task_details({
  userInput: "Build secure API and deploy to AWS"
});
// Returns: { 
//   mainGoal: "Secure API deployment",
//   requiredAgents: ["backend-developer", "security-analyst", "devops-engineer"],
//   suggestedSubtasks: [...],
//   complexity: "medium"
// }

// 3. Create session and tasks
const sessionId = "api-deployment-20250127";

// Task 1: Design security
const securityTask = await create_agent_task({
  sessionId,
  agentName: "security-analyst",
  task: "Define security requirements for API",
  input: { type: "REST API", sensitivity: "high" }
});

// Task 2: Build API (depends on security design)
const buildTask = await create_agent_task({
  sessionId,
  agentName: "backend-developer",
  task: "Build API with security requirements",
  input: {},
  dependencies: [securityTask.taskId]
});

// Task 3: Deploy (depends on build)
const deployTask = await create_agent_task({
  sessionId,
  agentName: "devops-engineer",
  task: "Deploy API to AWS",
  input: { region: "us-east-1" },
  dependencies: [buildTask.taskId]
});

// 4. Agents execute sequentially
// Security analyst completes first
await update_task_status({
  sessionId,
  taskId: securityTask.taskId,
  status: "completed",
  output: { requirements: [...] }
});
await store_context({
  sessionId,
  key: "security_requirements",
  value: { authentication: "OAuth2", encryption: "TLS 1.3" }
});

// Backend developer starts (dependencies satisfied)
const readyTasks = await get_ready_tasks({ sessionId });
// Returns: [buildTask]

// Backend completes
await update_task_status({
  sessionId,
  taskId: buildTask.taskId,
  status: "completed",
  output: { apiUrl: "http://api.example.com" }
});

// DevOps deploys (dependencies satisfied)
await update_task_status({
  sessionId,
  taskId: deployTask.taskId,
  status: "completed",
  output: { productionUrl: "https://api.prod.example.com" }
});

// 5. Record outcomes for learning
await record_task_outcome({
  outcome: {
    sessionId,
    taskId: buildTask.taskId,
    agentName: "backend-developer",
    taskDescription: "Build secure API",
    success: true,
    durationMs: 120000,
    issues: [],
    output: { endpoints: 10 }
  }
});
```

## Monitoring & Debugging

### Check Session Status
```typescript
// Get all tasks in a session
const allTasks = await get_task_status({ sessionId: "my-session" });

// Get specific task
const task = await get_task_status({ 
  sessionId: "my-session", 
  taskId: "task_xxx" 
});
```

### View Shared Context
```typescript
// Get all metadata
const context = await get_context({ sessionId: "my-session" });

// Get specific key
const architecture = await get_context({ 
  sessionId: "my-session", 
  key: "architecture" 
});
```

### Analyze Performance
```typescript
const performance = await analyze_task_performance({ 
  sessionId: "my-session" 
});
// Returns: { totalTasks, completed, failed, avgDuration, ... }

const recommendations = await generate_recommendations({ 
  sessionId: "my-session" 
});
// Returns: suggestions based on task history
```

## Troubleshooting

### Task Stuck in Pending
```typescript
// Check if dependencies are completed
const task = await get_task_status({ sessionId, taskId });
console.log(task.dependencies); // Check these task IDs

// Get ready tasks to see what can execute
const ready = await get_ready_tasks({ sessionId });
```

### Session Not Found
```bash
# Create new session by creating first task
await create_agent_task({
  sessionId: "new-session-id",
  agentName: "backend-developer",
  task: "Initialize session",
  input: {}
});
```

### Context Data Missing
```typescript
// Verify what's stored
const allContext = await get_context({ sessionId });
console.log(Object.keys(allContext)); // List all keys

// Store required data
await store_context({
  sessionId,
  key: "missing_data",
  value: { ... }
});
```

---

## Summary

The Agent Context Hub enables sophisticated multi-agent collaboration through:

1. **Task Coordination**: Create, track, and manage agent tasks with dependencies
2. **Shared Knowledge**: Store and retrieve context accessible to all agents  
3. **Event System**: Subscribe and publish to coordinate agent activities
4. **Learning**: Record and analyze outcomes to improve future performance

**Key Principle**: Think of it as a **shared workspace** where agents coordinate, communicate, and collaborate to accomplish complex multi-step workflows.
