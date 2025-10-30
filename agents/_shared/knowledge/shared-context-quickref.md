# Agent Shared Context - Quick Reference

## What is Shared Context?

When working with other agents on a multi-agent task, you have access to a **shared workspace** (blackboard pattern) where you can:

- 📋 Track your tasks and their status
- 📤 Share your outputs with other agents
- 📥 Read outputs from other agents
- 🔔 Subscribe to notifications from other agents

## Essential Tools

### 1. Store Your Results
When you complete work, store it so other agents can use it:

```typescript
store_context({
  sessionId: "current-session-id",
  key: "your_output_name",
  value: { /* your data */ }
});
```

### 2. Read Other Agents' Work
Get context that other agents have shared:

```typescript
get_context({
  sessionId: "current-session-id",
  key: "architecture" // or any key another agent stored
});
```

### 3. Update Your Task Status
Let others know your progress:

```typescript
update_task_status({
  sessionId: "current-session-id",
  taskId: "your-task-id",
  status: "in_progress", // or "completed", "failed"
  progress: 75, // 0-100
  output: { /* your results */ }
});
```

### 4. Check What's Ready
See what tasks are waiting for you:

```typescript
get_ready_tasks({
  sessionId: "current-session-id"
});
```

## Common Scenarios

### Scenario 1: You Depend on Another Agent
```typescript
// 1. Check if their task is done
const otherTask = await get_task_status({
  sessionId: "current-session-id",
  taskId: "other-agent-task-id"
});

// 2. If completed, get their output
if (otherTask.status === "completed") {
  const theirWork = await get_context({
    sessionId: "current-session-id",
    key: "their_output"
  });
  
  // 3. Use their output in your work
  // ... do your work ...
  
  // 4. Store your results
  await store_context({
    sessionId: "current-session-id",
    key: "my_output",
    value: myResults
  });
}
```

### Scenario 2: Multiple Agents Need Your Output
```typescript
// 1. Do your work
const myResults = doMyWork();

// 2. Store it with a clear key name
await store_context({
  sessionId: "current-session-id",
  key: "api_design", // Clear name other agents will use
  value: {
    endpoints: [...],
    authentication: "OAuth2",
    database: "PostgreSQL"
  }
});

// 3. Update your task as completed
await update_task_status({
  sessionId: "current-session-id",
  taskId: "my-task-id",
  status: "completed",
  output: { summary: "API design complete with 10 endpoints" }
});

// 4. Optionally notify others
await publish({
  sessionId: "current-session-id",
  topic: "design_complete",
  message: { agent: "your-agent-name", key: "api_design" }
});
```

### Scenario 3: Collaborative Design
```typescript
// 1. Read the overall requirements
const requirements = await get_context({
  sessionId: "current-session-id",
  key: "requirements"
});

// 2. Add your domain expertise
const myContribution = {
  ...requirements,
  [myDomain]: {
    // your specific details
  }
};

// 3. Store updated design
await store_context({
  sessionId: "current-session-id",
  key: "architecture",
  value: myContribution
});
```

## Key Principles

### ✅ DO
- **Use descriptive key names** when storing context: `api_endpoints`, `security_requirements`, `test_results`
- **Update your task status** regularly so others know your progress
- **Check dependencies** before starting work
- **Store both raw data and summaries** for other agents

### ❌ DON'T
- **Don't assume context exists** - always check if `get_context` returns data
- **Don't overwrite shared keys** - append or use unique names
- **Don't store huge files** - store references/paths instead
- **Don't forget to mark tasks complete** - others may be waiting

## Example: Backend Dev + Frontend Dev + DevOps

```typescript
// BACKEND DEVELOPER
// 1. Build API
const apiCode = buildAPI();

// 2. Share API spec
await store_context({
  sessionId: "app-build-001",
  key: "api_spec",
  value: {
    baseUrl: "http://localhost:3000",
    endpoints: [
      { path: "/api/users", method: "GET" },
      { path: "/api/posts", method: "POST" }
    ]
  }
});

// 3. Mark complete
await update_task_status({
  sessionId: "app-build-001",
  taskId: "backend-task",
  status: "completed"
});

// FRONTEND DEVELOPER (reads backend's work)
// 1. Get API spec
const apiSpec = await get_context({
  sessionId: "app-build-001",
  key: "api_spec"
});

// 2. Build UI using the spec
const uiCode = buildUI(apiSpec);

// 3. Share build artifacts
await store_context({
  sessionId: "app-build-001",
  key: "frontend_build",
  value: {
    buildPath: "./dist",
    entryPoint: "index.html"
  }
});

// 4. Mark complete
await update_task_status({
  sessionId: "app-build-001",
  taskId: "frontend-task",
  status: "completed"
});

// DEVOPS ENGINEER (waits for both)
// 1. Check what's ready
const readyTasks = await get_ready_tasks({
  sessionId: "app-build-001"
});

// 2. If deployment task is ready
if (readyTasks.some(t => t.id === "deploy-task")) {
  // 3. Get both artifacts
  const apiSpec = await get_context({ sessionId: "app-build-001", key: "api_spec" });
  const frontend = await get_context({ sessionId: "app-build-001", key: "frontend_build" });
  
  // 4. Deploy
  deploy(apiSpec, frontend);
  
  // 5. Share deployment info
  await store_context({
    sessionId: "app-build-001",
    key: "deployment",
    value: {
      apiUrl: "https://api.prod.example.com",
      frontendUrl: "https://app.example.com"
    }
  });
}
```

## Getting Help

- **Full documentation**: See `shared-context-hub.md` in `_shared/knowledge/`
- **MCP Server location**: `mcp/agent-context-hub/`
- **Issues**: Check task status and context keys to debug

---

**Remember**: The shared context is your collaboration tool. Use it to communicate with other agents and build complex multi-step workflows together!
