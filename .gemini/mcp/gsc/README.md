# GEMINI Subagent Core (GSC)

**Version 1.0.0**

Core hub for managing all GEMINI sub-agents with unified coordination, execution, and workflow capabilities.

---

## 🎯 Overview

GSC consolidates all redundant MCPs into a single, coherent framework that provides:

- **Complete agent coordination** and task management
- **Execution capabilities** including shell commands and API calls
- **Workflow orchestration** with sequential, parallel, and conditional execution
- **Context management** using the Blackboard pattern
- **Full audit trails** and logging
- **Task analysis** and clarification loops
- **Response quality evaluation** and sampling control

---

## 🏗️ Architecture

GSC is built on **7 core layers**:

### Layer 1: Resources
- **Agent Registry**: Automatic agent discovery and loading from `.gemini/agents`
- **Context Store**: Shared context management using Blackboard pattern
- **Resource Manager**: Unified access to repositories, configs, APIs, datasets

### Layer 2: Prompts
- Structured prompt templates for all agent interactions
- Orchestration patterns (sequential, parallel, fan-out/fan-in)
- Variable substitution and context-aware rendering

### Layer 3: Sampling
- Dynamic sampling strategies (deterministic, balanced, creative)
- Response quality evaluation
- Adaptive sampling based on task complexity and retry attempts

### Layer 4: Logging
- Centralized logging with multiple levels (debug, info, warn, error)
- Agent activity tracking
- Complete audit trails with retention policies

### Layer 5: Elicitation
- Task complexity analysis
- Multi-turn clarification engine
- Context enrichment with agent knowledge and resources

### Layer 6: Tools
- **Agent Coordination**: Task creation, status updates, dependency management
- **Shell Executor**: Execute commands, manage background processes
- **Agent Executor**: Execute agents with full context and sampling control
- **API Connector**: HTTP requests, Microsoft Graph API integration

### Layer 7: Workflows
- **Workflow Engine**: Execute predefined workflows
- **Workflow Loader**: Load workflow definitions from templates
- **Execution Orchestrator**: Coordinate multi-agent workflows

---

## 🚀 Quick Start

### Installation

```bash
cd .gemini/mcp/gsc
bun install
```

### Running the Server

```bash
bun run dev
```

### Configuration in Gemini CLI

Add to `.gemini/settings.json`:

```json
{
  "mcpServers": {
    "gsc": {
      "command": "bun",
      "args": ["run", ".gemini/mcp/gsc/src/index.ts"]
    }
  }
}
```

---

## 📋 Available Tools

### Agent Coordination

#### `create_agent_task`
Create a new agent task with dependencies.

```javascript
{
  "sessionId": "session_123",
  "agentName": "coder-agent",
  "task": "Implement login feature",
  "input": { "spec": "..." },
  "dependencies": ["task_1"]  // optional
}
```

#### `update_task_status`
Update task status and progress.

```javascript
{
  "sessionId": "session_123",
  "taskId": "task_1",
  "status": "completed",  // pending | in_progress | completed | failed
  "output": { "result": "..." },  // optional
  "progress": 100,  // optional
  "error": "error message"  // optional
}
```

#### `get_ready_tasks`
Get tasks ready to execute (no unmet dependencies).

```javascript
{
  "sessionId": "session_123"
}
```

#### `get_all_tasks`
Get all tasks for a session.

```javascript
{
  "sessionId": "session_123"
}
```

### Context Management

#### `store_context`
Store data in session context.

```javascript
{
  "sessionId": "session_123",
  "key": "api_spec",
  "value": { "endpoints": [...] }
}
```

#### `get_context`
Retrieve data from session context.

```javascript
{
  "sessionId": "session_123",
  "key": "api_spec"
}
```

### Agent Execution

#### `execute_agent`
Execute an agent with a specific task.

```javascript
{
  "agentName": "frontend-agent",
  "task": "Create React component",
  "context": { "componentName": "LoginForm" },
  "sessionId": "session_123",  // optional
  "taskId": "task_1"  // optional
}
```

### Shell Execution

#### `execute_shell_command`
Execute a shell command.

```javascript
{
  "command": "git",
  "args": ["status"],
  "cwd": "/path/to/repo",  // optional
  "timeout": 30000  // optional, in milliseconds
}
```

### Workflow Execution

#### `execute_workflow`
Execute a predefined workflow.

```javascript
{
  "workflowId": "frontend-template-generation",
  "sessionId": "session_123",
  "variables": {
    "componentName": "Dashboard"
  }
}
```

#### `list_workflows`
List all available workflows.

```javascript
{}
```

### Task Analysis

#### `analyze_task`
Analyze task complexity and requirements.

```javascript
{
  "taskDescription": "Build authentication system with OAuth"
}
```

---

## 📚 Resources

GSC exposes resources via URI:

- `gsc://registry` - All available agents
- `gsc://agent/{name}` - Specific agent configuration

---

## 🔧 Configuration

### MCP Configuration File

Located at `config/mcp-config.json`:

```json
{
  "mcp": {
    "id": "gsc",
    "name": "GEMINI Subagent Core",
    "version": "1.0.0",
    "capabilities": [
      "resource_management",
      "prompt_orchestration",
      "sampling_control",
      "logging_audit",
      "elicitation_loop",
      "tool_execution",
      "workflow_coordination"
    ]
  }
}
```

### Sampling Configuration

Adjust sampling strategies in code:

```typescript
import { samplingController } from './sampling/index.js';

// Use deterministic sampling for precise tasks
samplingController.setStrategy('deterministic');

// Use creative sampling for design tasks
samplingController.setStrategy('creative');

// Custom configuration
samplingController.setCustomConfig({
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 2048,
  retry_limit: 3
});
```

---

## 📝 Workflow Templates

GSC includes predefined workflow templates in `workflows/templates/`:

### 1. Frontend Template Generation
**File**: `frontend-template-generation.json`

Coordinates UX/UI and Frontend agents to generate templates.

### 2. Security Policy Validation
**File**: `security-policy-validation.json`

Uses compliance agent to validate security policies.

### 3. Multi-Agent Development
**File**: `multi-agent-development.json`

Coordinates Architect → Coder → Tester pipeline.

### Creating Custom Workflows

```json
{
  "id": "my-workflow",
  "name": "My Custom Workflow",
  "description": "Description here",
  "trigger": "manual/my-workflow",
  "executionMode": "sequential",
  "actions": [
    {
      "id": "step1",
      "type": "invoke_agent",
      "params": {
        "agentName": "agent-name",
        "task": "Task description",
        "context": "{{variable}}"
      },
      "dependencies": []
    }
  ]
}
```

---

## 🔍 Logging & Audit

### Access Logs

```typescript
import { globalLogger } from './logging/index.js';

// Get all logs
const logs = globalLogger.getLogs();

// Get logs by level
const errors = globalLogger.getLogsByLevel('error');

// Get logs by session
const sessionLogs = globalLogger.getLogsBySession('session_123');

// Export logs
const jsonLogs = globalLogger.exportLogs();
```

### Audit Trails

```typescript
import { auditTracker } from './logging/index.js';

// Get audit trail
const trail = auditTracker.getTrail('session_123');

// Get statistics
const stats = auditTracker.getTrailStats('session_123');

// Export trail
const trailJson = auditTracker.exportTrail('session_123');
```

---

## 🧪 Testing

```bash
# Type check
bun run typecheck

# Run tests (coming soon)
bun test
```

---

## 🤝 Integration with GEMINI

GSC is designed to work seamlessly with GEMINI as the meta-orchestrator:

1. **GEMINI** analyzes tasks and decides which agents to invoke
2. **GSC** coordinates agent execution, manages context, and tracks progress
3. **Sub-agents** execute their specialized tasks using GSC's tools and resources
4. **Workflows** automate common multi-agent patterns

---

## 📊 Project Structure

```
gsc/
├── src/
│   ├── index.ts                 # Main MCP server
│   ├── types.ts                 # Type definitions
│   │
│   ├── resources/               # Layer 1: Resources
│   │   ├── agent-registry.ts
│   │   ├── context-store.ts
│   │   ├── resource-manager.ts
│   │   └── index.ts
│   │
│   ├── prompts/                 # Layer 2: Prompts
│   │   ├── prompt-templates.ts
│   │   └── index.ts
│   │
│   ├── sampling/                # Layer 3: Sampling
│   │   ├── sampling-config.ts
│   │   ├── response-evaluator.ts
│   │   └── index.ts
│   │
│   ├── logging/                 # Layer 4: Logging
│   │   ├── agent-logger.ts
│   │   ├── audit-tracker.ts
│   │   └── index.ts
│   │
│   ├── elicitation/             # Layer 5: Elicitation
│   │   ├── task-analyzer.ts
│   │   ├── clarification-engine.ts
│   │   ├── context-enrichment.ts
│   │   └── index.ts
│   │
│   ├── tools/                   # Layer 6: Tools
│   │   ├── agent-coordination.ts
│   │   ├── agent-execution.ts
│   │   ├── shell-executor.ts
│   │   ├── api-connector.ts
│   │   └── index.ts
│   │
│   └── workflows/               # Layer 7: Workflows
│       ├── workflow-engine.ts
│       ├── workflow-loader.ts
│       ├── execution-orchestrator.ts
│       └── index.ts
│
├── workflows/
│   └── templates/
│       ├── frontend-template-generation.json
│       ├── security-policy-validation.json
│       └── multi-agent-development.json
│
├── config/
│   └── mcp-config.json
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🌟 Key Features

✅ **Unified Architecture** - Single MCP for all agent operations  
✅ **7-Layer Design** - Modular, maintainable, scalable  
✅ **Full Execution** - Shell commands, APIs, agent invocation  
✅ **Smart Coordination** - Dependency management, parallel execution  
✅ **Complete Traceability** - Audit trails, logging, performance tracking  
✅ **Adaptive Intelligence** - Task analysis, clarification loops, quality evaluation  
✅ **Workflow Automation** - Predefined patterns for common tasks  
✅ **MCP Compliant** - Follows Model Context Protocol specification  

---

## 📝 License

MIT

---

## 👤 Author

Rohi Rikman

---

## 🔗 Related Projects

- [GEMINI](../) - Meta-orchestrator for multi-agent systems
- [Buddy AI](../../../buddy) - CLI companion
- [Agent Context Hub](../agent-context-hub) - Legacy (now consolidated into GSC)
- [Agent Execution Hub](../agent-execution-hub) - Legacy (now consolidated into GSC)

---

**GSC v1.0.0** - Built with ❤️ for GEMINI
