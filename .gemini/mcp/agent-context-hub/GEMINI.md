# Agent Context Hub MCP Server

## What Is This?

This is a **coordination server** that acts as a "shared workspace" (blackboard) for multiple AI agents to work together on complex tasks. Think of it as a project management system where agents can:

- 📋 Create and track tasks
- 📤 Share their work with other agents
- 📥 Read outputs from other agents
- 🔔 Get notified when other agents complete work
- 🎯 Coordinate who does what and when

## Why Do We Need It?

When you have multiple specialized agents (like a backend developer, frontend developer, and DevOps engineer) working together, they need a way to:

1. **Know what to do**: Task assignment and tracking
2. **Share information**: Pass data between agents (e.g., backend shares API endpoints with frontend)
3. **Work in order**: Some tasks depend on others (can't deploy before building)
4. **Avoid conflicts**: Coordinate timing and resources

This MCP server provides that coordination layer using the **blackboard pattern** - a shared workspace all agents can read from and write to.

## Architecture

Based on the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) specification, this server implements:

### Data Layer (JSON-RPC 2.0)

The server uses JSON-RPC 2.0 protocol to communicate with AI agents:

- **Lifecycle Management**: Handshake process where client and server agree on capabilities (what features are supported)
- **Tools**: 8 coordination tools agents can call (create tasks, store data, get status, etc.)
- **Resources**: Provides access to agent registry and shared context (like database views)
- **Prompts**: Pre-written templates for common coordination scenarios
- **Notifications**: Real-time updates when things change (task completed, context updated, etc.)

### Transport Layer

How the server communicates:

- **Stdio Transport**: Communication via standard input/output streams - the server reads from stdin and writes to stdout
- **Connection Management**: One client (like Gemini CLI) connects to this server per session
- **Process-based**: Runs as a separate process that stays alive during the conversation

## Multi-Agent Coordination Patterns

This server implements the **blackboard pattern** - a design where multiple independent agents collaborate by reading and writing to a shared workspace. Here's how it works:

### 1. Sequential Execution (One After Another)

**Use Case**: When tasks must happen in a specific order

**Example**: "Build API → Test API → Deploy API"

**How it works**:
- Each task declares which other tasks it depends on
- The backend developer's task has no dependencies, so it starts immediately
- The QA tester's task depends on the backend task, so it waits
- `get_ready_tasks` only returns tasks whose dependencies are completed
- Agents automatically wait for their turn

```
Backend Dev (Task 1) → QA Tester (Task 2) → DevOps (Task 3)
   ↓ complete             ↓ complete          ↓ complete
   triggers Task 2        triggers Task 3      Done!
```

### 2. Parallel Execution (Work Simultaneously)

**Use Case**: When tasks are independent and can happen at the same time

**Example**: "Build API + Build UI" (both can work at once)

**How it works**:
- Create multiple tasks with no dependencies between them
- All agents start working immediately
- They can still share context (e.g., both read the design doc)
- Great for speeding up workflows

```
Backend Dev (Task 1) ─┐
                       ├─→ Both running in parallel
Frontend Dev (Task 2) ─┘
         ↓
   Both complete → Integration (Task 3)
```

### 3. Shared Context (The Blackboard)

**Use Case**: Agents need to share information

**Example**: Architect creates design → All agents read it → Each contributes their part

**How it works**:
- Any agent can write data to the blackboard using `store_context(key, value)`
- Any agent can read data using `get_context(key)`
- Common shared items: designs, specifications, configurations, results
- Think of it like a shared Google Doc all agents can access

```
Architect:      store_context("design", {...})
                         ↓
Backend Dev:    get_context("design") → builds API
Frontend Dev:   get_context("design") → builds UI  
Security:       get_context("design") → reviews it
                         ↓
All agents store their results back to the blackboard
```

### 4. Event-Driven Updates (Pub/Sub)

**Use Case**: Agents need to be notified when something happens

**How it works**:
- Agents subscribe to topics they care about: `subscribe("deployment", agentId)`
- When something happens, publish an event: `publish("deployment", message)`
- Subscribed agents get notified immediately
- No need to constantly check for updates

## Key Features

### 1. Automatic Agent Discovery
**What**: Scans your `~/.gemini/agents` folder and finds all available agents  
**Why**: No manual registration needed - just add an agent folder and it's discovered  
**How**: Reads each agent's `agent.json` and `GEMINI.md` files on startup

### 2. Dynamic Agent Loading
**What**: Loads complete agent context including:
- Configuration (agent.json)
- System prompts (GEMINI.md)
- Knowledge files (knowledge/*.md)
- Available tools
- MCP server configs

**Why**: Orchestrator needs to know what each agent can do to assign tasks properly  
**How**: Recursively reads agent directory structure and caches the data

### 3. Task Dependency Management (DAG)
**What**: Directed Acyclic Graph (DAG) for task ordering  
**Why**: Ensures tasks execute in the right order without circular dependencies  
**How**: 
- Each task has a `dependencies: [taskId1, taskId2]` array
- System checks if all dependencies are completed before allowing task to run
- Prevents: Task A waits for B, B waits for A (deadlock)

### 4. Real-Time Progress Tracking
**What**: Live updates on task status and progress  
**Why**: Users and orchestrator can see what's happening in real-time  
**How**: 
- Agents call `update_task_status` with progress percentage
- Server sends notifications to subscribers
- Resources provide `/queue/tasks/{sessionId}` for monitoring

### 5. Session Isolation
**What**: Each orchestration gets its own isolated context/workspace  
**Why**: Multiple users or projects don't interfere with each other  
**How**: Every operation requires a `sessionId` - data is completely separate per session

### 6. Retrospective Learning
**What**: Records how tasks were executed and whether they succeeded  
**Why**: Learn from past experiences to improve future task planning  
**How**: 
- `record_task_outcome` stores: task description, agent used, success/failure, duration, issues
- `find_similar_past_tasks` searches history for similar work
- `analyze_task_performance` provides insights on what worked well
- `generate_recommendations` suggests improvements based on history

**Example**: If "Deploy to AWS" tasks often fail with timeout issues, the system learns to allocate more time or suggest checking network configs first.

## How It Works: Complete Workflow Example

### Scenario: "Build and deploy a secure REST API"

**Step 1: User Request**
```
User: "I need a REST API with authentication deployed to AWS"
```

**Step 2: Orchestrator (Buddy) Analyzes Task**
```typescript
// Buddy calls the MCP server to break down the task
const analysis = await elicit_task_details({
  userInput: "Build REST API with authentication deployed to AWS"
});

// Returns:
// {
//   mainGoal: "Secure API deployment",
//   complexity: "medium",
//   requiredAgents: ["security-analyst", "backend-developer", "devops-engineer"],
//   suggestedSubtasks: [
//     "Define security requirements",
//     "Build API with authentication",
//     "Deploy to AWS"
//   ]
// }
```

**Step 3: Create Session & Tasks**
```typescript
const sessionId = "api-deployment-20250127";

// Task 1: Security design (no dependencies - can start immediately)
const secTask = await create_agent_task({
  sessionId,
  agentName: "security-analyst",
  task: "Define authentication and security requirements",
  input: { apiType: "REST", sensitivity: "high" },
  dependencies: []
});

// Task 2: Build API (depends on security design)
const buildTask = await create_agent_task({
  sessionId,
  agentName: "backend-developer", 
  task: "Build REST API with specified security",
  input: { language: "TypeScript", framework: "Express" },
  dependencies: [secTask.taskId]  // Wait for security task
});

// Task 3: Deploy (depends on build)
const deployTask = await create_agent_task({
  sessionId,
  agentName: "devops-engineer",
  task: "Deploy API to AWS with proper security groups",
  input: { region: "us-east-1" },
  dependencies: [buildTask.taskId]  // Wait for build task
});
```

**Step 4: Agents Execute**

**Security Analyst (starts immediately)**:
```typescript
// 1. Does security analysis
const secRequirements = analyzeSecurityNeeds();

// 2. Shares results on the blackboard
await store_context({
  sessionId,
  key: "security_requirements",
  value: {
    authentication: "OAuth2 + JWT",
    encryption: "TLS 1.3",
    rateLimiting: "100 req/min per IP"
  }
});

// 3. Marks task complete
await update_task_status({
  sessionId,
  taskId: secTask.taskId,
  status: "completed",
  output: { summary: "Security requirements defined" }
});
```

**Backend Developer (waits for security task)**:
```typescript
// 1. Check what's ready to work on
const ready = await get_ready_tasks({ sessionId });
// Returns: [buildTask] because secTask is now completed

// 2. Read security requirements from blackboard
const secReqs = await get_context({
  sessionId,
  key: "security_requirements"
});

// 3. Build API using those requirements
const apiCode = buildAPI(secReqs);

// 4. Share API details on blackboard
await store_context({
  sessionId,
  key: "api_details",
  value: {
    endpoints: ["/auth/login", "/auth/register", "/api/users"],
    port: 3000,
    healthCheck: "/health"
  }
});

// 5. Mark complete
await update_task_status({
  sessionId,
  taskId: buildTask.taskId,
  status: "completed",
  output: { buildPath: "./dist", tests: "passing" }
});
```

**DevOps Engineer (waits for build task)**:
```typescript
// 1. Check what's ready
const ready = await get_ready_tasks({ sessionId });
// Returns: [deployTask] because buildTask is now completed

// 2. Read API details from blackboard
const apiDetails = await get_context({
  sessionId,
  key: "api_details"
});

// 3. Deploy to AWS
const deployment = deployToAWS(apiDetails);

// 4. Store deployment info
await store_context({
  sessionId,
  key: "deployment",
  value: {
    url: "https://api.example.com",
    region: "us-east-1",
    status: "healthy"
  }
});

// 5. Mark complete
await update_task_status({
  sessionId,
  taskId: deployTask.taskId,
  status: "completed",
  output: { url: "https://api.example.com" }
});
```

**Step 5: Orchestrator Aggregates Results**
```typescript
// Get all task statuses
const allTasks = await get_task_status({ sessionId });

// Get final deployment info
const deployment = await get_context({
  sessionId,
  key: "deployment"
});

// Present to user
console.log(`
✅ API successfully built and deployed!
🔒 Security: OAuth2 + JWT authentication
🚀 Live at: ${deployment.url}
📊 Endpoints: /auth/login, /auth/register, /api/users
`);
```

**Step 6: Learn for Next Time**
```typescript
// Record the outcome for retrospective learning
await record_task_outcome({
  outcome: {
    sessionId,
    taskId: buildTask.taskId,
    agentName: "backend-developer",
    taskDescription: "Build REST API with authentication",
    success: true,
    durationMs: 180000, // 3 minutes
    issues: [],
    output: { endpoints: 3, framework: "Express" }
  }
});

// Next time a similar request comes in:
const similar = await find_similar_past_tasks({
  taskDescription: "Build REST API",
  limit: 5
});
// Returns previous successful approaches to learn from
```

## 8 Essential Tools

### Task Management
1. **`create_agent_task`** - Assign work to an agent
2. **`update_task_status`** - Report progress and completion
3. **`get_task_status`** - Check status of tasks
4. **`get_ready_tasks`** - See what can be worked on now

### Context Sharing (Blackboard)
5. **`store_context`** - Save data for other agents
6. **`get_context`** - Read data from other agents

### Learning & Optimization
7. **`elicit_task_details`** - Analyze and break down user requests
8. **`record_task_outcome`** - Record results for future learning

### Advanced Features
- `find_similar_past_tasks` - Search task history
- `analyze_task_performance` - Get performance metrics
- `generate_recommendations` - Get suggestions based on history
- `subscribe` / `publish` - Event-driven coordination

## Configuration

Add to your `.geminirc` or MCP client config:

```json
{
  "mcpServers": {
    "agent-context-hub": {
      "command": "bun",
      "args": ["run", "/path/to/.gemini/mcp/agent-context-hub/src/index.ts"],
      "env": {}
    }
  }
}
```

## Documentation

- **Quick Reference**: `../agents/_shared/knowledge/shared-context-quickref.md`
- **Full Guide**: `../agents/_shared/knowledge/shared-context-hub.md`
- **Agent Management**: `../agents/_shared/knowledge/agent-management.md`

## Benefits

✅ **Coordination**: Multiple agents work together seamlessly  
✅ **Dependency Management**: Tasks execute in the right order automatically  
✅ **Information Sharing**: Agents build on each other's work  
✅ **Progress Visibility**: Real-time updates on what's happening  
✅ **Session Isolation**: Multiple projects don't interfere  
✅ **Learning**: System improves over time by learning from past tasks  
✅ **Scalability**: Add more agents without changing the coordination logic
