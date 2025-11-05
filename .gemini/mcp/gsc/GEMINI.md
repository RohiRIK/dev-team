# GEMINI Subagent Core (GSC) - Complete Usage Guide

## 🎯 What is GSC?

GSC is the **GEMINI Subagent Core** - a unified MCP (Model Context Protocol) framework that enables you to execute specialized AI agents with full context, knowledge, and coordination capabilities.

**Key Features:**
- ✅ Execute agents in isolated Gemini CLI sessions
- ✅ Full knowledge base loading from agent folders
- ✅ Async/background execution support
- ✅ Task coordination with dependencies
- ✅ Context sharing between agents
- ✅ Comprehensive logging and monitoring
- ✅ Structured JSON outputs with reasoning

---

## 🚀 Quick Start

### Basic Agent Execution
```javascript
// Execute an agent synchronously (wait for completion)
execute_agent("pentaster", "Scan package.json for vulnerabilities")

// Result includes full analysis with structured output
```

### Async Agent Execution
```javascript
// Execute in background (non-blocking)
execute_agent("pentaster", "Scan entire codebase", {async: true})

// Returns immediately with executionId: "exec_123..."
// Continue other work while agent runs
```

---

## 📚 Available Tools

### 1. **Agent Execution**

#### `execute_agent(agentName, task, options)`
Execute a specialized agent with a specific task.

**Parameters:**
- `agentName` (string, required): Name of the agent (e.g., "pentaster", "backend-developer")
- `task` (string, required): Task description for the agent
- `context` (object, optional): Additional context data
- `sessionId` (string, optional): Session ID for tracking
- `taskId` (string, optional): Task ID for result storage
- `async` (boolean, optional): Run in background if true

**Example - Synchronous:**
```javascript
execute_agent(
  "pentaster",
  "Analyze package.json for security vulnerabilities",
  {
    context: {
      file_path: ".gemini/mcp/gsc/package.json"
    }
  }
)
```

**Returns:**
```json
{
  "executionId": "exec_1762331274914_h6aj2y3wy",
  "agentName": "pentaster",
  "task": "Analyze package.json...",
  "status": "completed",
  "startTime": 1762331274915,
  "endTime": 1762331339206,
  "result": {
    "agentName": "pentaster",
    "task": "...",
    "response": {
      "response": "{\n  \"status\": \"success\",\n  \"result\": \"...\",\n  \"reasoning\": \"...\",\n  \"steps_completed\": [...],\n  \"recommendations\": [...],\n  \"metadata\": {\"confidence\": \"high\", \"completeness\": \"100%\"}\n}"
    },
    "executionMethod": "gemini-cli-non-interactive",
    "timestamp": "2025-11-05T08:28:59.206Z"
  }
}
```

**Example - Async (Background):**
```javascript
execute_agent(
  "backend-developer",
  "Review and suggest improvements for agent-execution.ts",
  {
    async: true
  }
)
```

**Returns (immediately):**
```json
{
  "executionId": "exec_1762331431382_enf4buq2q",
  "agentName": "backend-developer",
  "task": "Review and suggest improvements...",
  "status": "running",
  "startTime": 1762331431382,
  "metadata": {}
}
```

---

### 2. **Execution Monitoring & Results**

#### `get_execution_status(executionId)`
Check the status of an async agent execution.

**Parameters:**
- `executionId` (string, required): The execution ID from execute_agent

**Example:**
```javascript
get_execution_status("exec_1762331431382_enf4buq2q")
```

**Returns:**
```json
{
  "executionId": "exec_1762331431382_enf4buq2q",
  "agentName": "backend-developer",
  "status": "completed",  // or "running", "failed"
  "startTime": 1762331431382,
  "endTime": 1762331495123,
  "result": {
    "agentName": "backend-developer",
    "task": "Review and suggest improvements...",
    "response": {
      "status": "success",
      "result": "Review completed. Found 3 improvement opportunities...",
      "reasoning": "Analyzed code structure, identified bottlenecks...",
      "recommendations": [...],
      "steps_completed": [...],
      "metadata": {"confidence": "high", "completeness": "100%"}
    },
    "executionMethod": "gemini-cli-non-interactive",
    "timestamp": "2025-11-05T09:11:35.123Z"
  }
}
```

---

#### `get_agent_result(executionId)` ⭐ **NEW - Get Full Report**
**This is the tool to use to retrieve the complete agent report/findings after execution!**

Get the full result and report from a completed agent execution. This returns everything the agent produced including analysis, findings, recommendations, and metadata.

**Parameters:**
- `executionId` (string, required): The execution ID from execute_agent

**Example:**
```javascript
get_agent_result("exec_1762332529136_1b4sd3w7u")
```

**Returns (Full Security Scan Report):**
```json
{
  "executionId": "exec_1762332529136_1b4sd3w7u",
  "agentName": "pentaster",
  "task": "Analyze the GSC package.json for security vulnerabilities",
  "status": "completed",
  "startTime": 1762332529136,
  "endTime": 1762332593427,
  "duration": 64291,
  "result": {
    "agentName": "pentaster",
    "task": "Analyze the GSC package.json for security vulnerabilities",
    "response": {
      "status": "success",
      "result": "Security analysis completed. Found 2 potential concerns:\n\n1. @modelcontextprotocol/sdk (^1.20.2)\n   - Core dependency for MCP functionality\n   - Risk: Medium - foundational dependencies are subject to supply chain attacks\n   - Current Status: No known vulnerabilities\n   - Recommendation: Regular monitoring and updates\n\n2. zod (^4.1.12)\n   - Schema validation library\n   - Risk: Low - CVE-2023-4316 affects versions <3.22.3, current version safe\n   - Current Status: No known vulnerabilities\n   - Recommendation: Continue version monitoring",
      "reasoning": "Analyzed package.json dependencies using OWASP methodology and CVE databases. Checked for known vulnerabilities, outdated packages, and supply chain risks. Applied security scanning best practices from knowledge base.",
      "steps_completed": [
        "Analyzed task requirements and security focus areas",
        "Planned security scanning approach using OWASP Top 10 and CVE databases",
        "Executed dependency analysis on package.json",
        "Cross-referenced against known vulnerability databases",
        "Validated findings and assessed risk levels"
      ],
      "issues_encountered": [],
      "recommendations": [
        "Implement regular security audits using npm audit",
        "Consider using npm audit fix for automated patching",
        "Monitor for supply chain attacks on core dependencies",
        "Keep dependencies updated to latest stable versions",
        "Consider pinning exact versions for critical dependencies",
        "Use tools like Snyk or Dependabot for continuous monitoring"
      ],
      "metadata": {
        "execution_time": "~64 seconds",
        "confidence": "high",
        "completeness": "100"
      }
    },
    "executionMethod": "gemini-cli-non-interactive",
    "timestamp": "2025-11-05T08:36:33.427Z"
  }
}
```

**When to use:**
- ✅ After execute_agent completes (sync or async)
- ✅ To get full security scan findings
- ✅ To retrieve code review results
- ✅ To see complete analysis with recommendations
- ✅ Anytime you need the detailed report/output

---

#### `list_active_executions()`
List all currently running agent executions.

**Parameters:** None

**Example:**
```javascript
list_active_executions()
```

**Returns:**
```json
[
  {
    "executionId": "exec_123",
    "agentName": "pentaster",
    "status": "running",
    "startTime": 1762331431382
  },
  {
    "executionId": "exec_456",
    "agentName": "backend-developer",
    "status": "running",
    "startTime": 1762331445678
  }
]
```

---

### 3. **Logging and Debugging**

#### `get_logs(filters)`
Get GSC logs with optional filtering.

**Parameters:**
- `level` (string, optional): Filter by log level ("debug", "info", "warn", "error")
- `agentName` (string, optional): Filter by agent name
- `sessionId` (string, optional): Filter by session ID
- `limit` (number, optional): Maximum logs to return (default: 50)

**Example:**
```javascript
get_logs({
  level: "info",
  agentName: "pentaster",
  limit: 20
})
```

**Returns:**
```json
[
  {
    "timestamp": "2025-11-05T08:30:31.382Z",
    "level": "info",
    "message": "Agent execution started",
    "metadata": {
      "executionId": "exec_123",
      "agentName": "pentaster",
      "task": "Scan package.json..."
    }
  },
  {
    "timestamp": "2025-11-05T08:30:31.450Z",
    "level": "info",
    "message": "Agent knowledge loaded",
    "metadata": {
      "agentName": "pentaster",
      "knowledgeFileCount": 16,
      "knowledgeFiles": [
        "authorization_best_practices.md",
        "reporting_and_recommendations.md",
        "web_app_pentest_methodology.md",
        ...
      ],
      "systemPromptLength": 2847
    }
  },
  {
    "timestamp": "2025-11-05T08:31:35.123Z",
    "level": "info",
    "message": "Agent execution completed",
    "metadata": {
      "executionId": "exec_123",
      "agentName": "pentaster",
      "duration": 63741
    }
  }
]
```

---

#### `get_agent_execution_logs(executionId)`
Get detailed logs for a specific execution.

**Parameters:**
- `executionId` (string, required): Execution ID to get logs for

**Example:**
```javascript
get_agent_execution_logs("exec_1762331431382_enf4buq2q")
```

**Returns:**
```json
{
  "executionId": "exec_1762331431382_enf4buq2q",
  "logCount": 8,
  "logs": [
    {
      "timestamp": "2025-11-05T08:30:31.382Z",
      "level": "info",
      "message": "Agent execution started",
      "metadata": {...}
    },
    {
      "timestamp": "2025-11-05T08:30:31.450Z",
      "level": "info",
      "message": "Agent knowledge loaded",
      "metadata": {
        "knowledgeFileCount": 16,
        "knowledgeFiles": [...]
      }
    },
    ...
  ]
}
```

---

### 4. **Task Coordination**

#### `create_agent_task(sessionId, agentName, task, input, dependencies)`
Create a coordinated task with dependencies.

**Parameters:**
- `sessionId` (string, required): Session ID for grouping tasks
- `agentName` (string, required): Agent to execute the task
- `task` (string, required): Task description
- `input` (object, optional): Input data for the task
- `dependencies` (array, optional): Array of task IDs that must complete first

**Example:**
```javascript
// Create Task 1 (no dependencies)
create_agent_task(
  "session_001",
  "pentaster",
  "Security scan of codebase",
  {},
  []
)
// Returns: {id: "task_1", status: "pending"}

// Create Task 2 (depends on Task 1)
create_agent_task(
  "session_001",
  "backend-developer",
  "Fix security issues found in scan",
  {},
  ["task_1"]  // Won't run until task_1 completes
)
// Returns: {id: "task_2", status: "pending", dependencies: ["task_1"]}
```

---

#### `get_all_tasks(sessionId)`
Get all tasks in a session.

**Parameters:**
- `sessionId` (string, required): Session ID

**Example:**
```javascript
get_all_tasks("session_001")
```

**Returns:**
```json
[
  {
    "id": "task_1",
    "agentName": "pentaster",
    "status": "completed",
    "dependencies": [],
    "createdAt": "2025-11-05T08:30:00.000Z",
    "completedAt": "2025-11-05T08:35:00.000Z"
  },
  {
    "id": "task_2",
    "agentName": "backend-developer",
    "status": "pending",
    "dependencies": ["task_1"],
    "createdAt": "2025-11-05T08:30:05.000Z"
  }
]
```

---

#### `get_ready_tasks(sessionId)`
Get tasks that are ready to execute (all dependencies met).

**Parameters:**
- `sessionId` (string, required): Session ID

**Example:**
```javascript
get_ready_tasks("session_001")
```

**Returns:** Array of tasks with no pending dependencies.

---

#### `update_task_status(sessionId, taskId, status, result, error)`
Update task status and results.

**Parameters:**
- `sessionId` (string, required): Session ID
- `taskId` (string, required): Task ID to update
- `status` (string, required): New status ("pending", "in_progress", "completed", "failed")
- `result` (any, optional): Task result data
- `error` (string, optional): Error message if failed

**Example:**
```javascript
update_task_status(
  "session_001",
  "task_1",
  "completed",
  {
    findings: ["Issue 1", "Issue 2"],
    severity: "medium"
  }
)
```

---

### 5. **Context Management**

#### `store_context(sessionId, key, value)`
Store data in session context for sharing between agents.

**Parameters:**
- `sessionId` (string, required): Session ID
- `key` (string, required): Context key
- `value` (any, required): Data to store

**Example:**
```javascript
store_context(
  "session_001",
  "security_findings",
  {
    vulnerabilities: ["SQL Injection", "XSS"],
    priority: "high"
  }
)
```

---

#### `get_context(sessionId, key)`
Retrieve data from session context.

**Parameters:**
- `sessionId` (string, required): Session ID
- `key` (string, required): Context key

**Example:**
```javascript
get_context("session_001", "security_findings")
```

**Returns:** The stored value.

---

## 🤖 Available Agents

### Development Agents
- **backend-developer**: API development, server-side logic, database design
- **frontend-developer**: UI/UX implementation, React, TypeScript
- **automation-specialist**: Automation scripts, CI/CD, workflow optimization

### Infrastructure & Operations
- **devops-engineer**: CI/CD pipelines, deployment, infrastructure as code
- **cloud-architect**: Cloud architecture, AWS/Azure/GCP design
- **system-administrator**: System configuration, server management
- **network-engineer**: Network design, security, troubleshooting
- **database-admin**: Database design, optimization, administration

### Security
- **pentaster**: Penetration testing, vulnerability assessment, security audits
- **security-analyst**: Security analysis, threat modeling, compliance

### Process & Management
- **scrum-master**: Agile processes, sprint planning, team coordination
- **product-manager**: Requirements, roadmap, feature prioritization
- **qa-tester**: Test planning, quality assurance, bug reporting

### Specialized
- **ml-engineer**: Machine learning, model training, ML pipelines
- **data-analyst**: Data analysis, visualization, insights
- **ui-ux-designer**: Design systems, user experience, prototyping
- **system-architect**: System design, architecture patterns, scalability

### Tools & Utilities
- **agent-builder**: Create and manage new agents
- **github-manager**: GitHub operations, PR management, repo automation
- **content-creator**: Documentation, technical writing, content generation
- **tech-news**: Technology news aggregation and summaries

---

## 📋 Common Workflows

### Workflow 1: Security Scan with Full Report Retrieval ⭐
```javascript
// Step 1: Execute security scan (synchronous - waits for completion)
const execution = execute_agent(
  "pentaster",
  "Analyze package.json for security vulnerabilities"
);

// Step 2: Get the full report with all findings
const fullReport = get_agent_result(execution.executionId);

// Step 3: Parse and display findings
console.log(`Security Scan Results for ${fullReport.agentName}`);
console.log(`Status: ${fullReport.result.response.status}`);
console.log(`Findings: ${fullReport.result.response.result}`);
console.log(`Recommendations: ${JSON.stringify(fullReport.result.response.recommendations, null, 2)}`);
console.log(`Confidence: ${fullReport.result.response.metadata.confidence}`);

// Step 4: Store for later use or pass to another agent
store_context(
  "security_audit_001",
  "scan_results",
  fullReport.result.response
);
```

**Expected Output Flow:**
1. Agent executes and completes
2. get_agent_result retrieves full security report
3. Report includes: vulnerabilities found, risk levels, recommendations, confidence scores
4. Results can be presented to user or passed to fixing agent

---

### Workflow 2: Async Execution with Result Polling
```javascript
// Step 1: Start long-running task in background
const execution = execute_agent(
  "pentaster",
  "Comprehensive security audit of entire codebase",
  {async: true}  // Returns immediately
);

console.log(`Started async execution: ${execution.executionId}`);

// Step 2: Continue other work while agent runs
// ... do other things ...

// Step 3: Check status periodically
const status = get_execution_status(execution.executionId);
if (status.status === "completed") {
  // Step 4: Get full results when done
  const fullReport = get_agent_result(execution.executionId);
  console.log("Security audit completed!");
  console.log(JSON.stringify(fullReport.result.response, null, 2));
} else {
  console.log(`Still running... Status: ${status.status}`);
}
```

---

### Workflow 3: Parallel Code Review with Result Aggregation
```javascript
// Step 1: Start multiple agents in parallel
const exec1 = execute_agent(
  "backend-developer",
  "Review backend code quality",
  {async: true}
);

const exec2 = execute_agent(
  "security-analyst",
  "Review code for security issues",
  {async: true}
);

const exec3 = execute_agent(
  "qa-tester",
  "Review test coverage",
  {async: true}
);

// Step 2: Wait for all to complete (or poll periodically)
const checkCompletion = () => {
  const status1 = get_execution_status(exec1.executionId);
  const status2 = get_execution_status(exec2.executionId);
  const status3 = get_execution_status(exec3.executionId);
  
  return status1.status === "completed" &&
         status2.status === "completed" &&
         status3.status === "completed";
};

// Step 3: When all complete, get all results
if (checkCompletion()) {
  const backendReview = get_agent_result(exec1.executionId);
  const securityReview = get_agent_result(exec2.executionId);
  const testReview = get_agent_result(exec3.executionId);
  
  // Step 4: Aggregate results
  console.log("=== Complete Code Review Report ===\n");
  console.log("Backend Quality:");
  console.log(backendReview.result.response.result);
  console.log("\nSecurity Analysis:");
  console.log(securityReview.result.response.result);
  console.log("\nTest Coverage:");
  console.log(testReview.result.response.result);
}
```

---

### Workflow 5: Sequential Development Pipeline
```javascript
const sessionId = "feature_dev_001";

// Task 1: Design
create_agent_task(
  sessionId,
  "system-architect",
  "Design REST API for user management",
  {},
  []  // No dependencies
);

// Task 2: Backend implementation (depends on design)
create_agent_task(
  sessionId,
  "backend-developer",
  "Implement designed API",
  {},
  ["task_1"]
);

// Task 3: Frontend implementation (depends on backend)
create_agent_task(
  sessionId,
  "frontend-developer",
  "Build UI for user management",
  {},
  ["task_2"]
);

// Task 4: Testing (depends on both implementations)
create_agent_task(
  sessionId,
  "qa-tester",
  "Write and execute tests",
  {},
  ["task_2", "task_3"]
);

// Get tasks ready to execute
const readyTasks = get_ready_tasks(sessionId);
// Only task_1 is ready initially
```

---

## 🔍 Knowledge Base Loading

**How it works:**
1. GSC automatically loads ALL knowledge from `.gemini/agents/{agentName}/knowledge/`
2. All `.md` and `.txt` files are loaded
3. Full content is included in the agent prompt
4. Agent has complete access to its knowledge base

**Verification:**
```javascript
// Execute agent
const result = execute_agent("pentaster", "Scan package.json");

// Check logs to verify knowledge loading
const logs = get_logs({agentName: "pentaster", limit: 5});

// Look for log entry:
// {
//   "message": "Agent knowledge loaded",
//   "metadata": {
//     "knowledgeFileCount": 16,
//     "knowledgeFiles": ["file1.md", "file2.md", ...]
//   }
// }
```

**Knowledge is included in agent prompt as:**
```markdown
# KNOWLEDGE BASE
You have access to the following knowledge files:

## Knowledge File: authorization_best_practices.md
```
{full content of file}
```

## Knowledge File: reporting_and_recommendations.md
```
{full content of file}
```

... (all knowledge files)
```

---

## 📊 Reporting Agent Results

### Quick Reference - How to Get Results

**✅ CORRECT Way to Get Full Results:**
```javascript
// Step 1: Execute agent
const execution = execute_agent("pentaster", "Scan package.json");

// Step 2: Get full report/results ⭐
const fullReport = get_agent_result(execution.executionId);

// Now you have everything:
// - fullReport.result.response.result (main findings)
// - fullReport.result.response.reasoning (how agent thought)
// - fullReport.result.response.recommendations (what to do)
// - fullReport.result.response.steps_completed (what was done)
// - fullReport.result.response.metadata (confidence, completeness)
```

**❌ WRONG - Don't use get_execution_status for results:**
```javascript
// This only gives you status, NOT full results
const status = get_execution_status(executionId); // ❌ Incomplete
```

**❌ WRONG - Don't rely on logs for results:**
```javascript
// Logs show execution lifecycle, NOT agent findings
const logs = get_agent_execution_logs(executionId); // ❌ No findings here
```

---

### When Agent Completes - Report Format

**1. Summary Report:**
```
✅ Agent Execution Completed

Agent: {agentName}
Task: {task}
Status: {status}
Duration: {duration}ms
Execution Method: gemini-cli-non-interactive

Results:
{summarize key findings}

Recommendations:
{list recommendations}

Confidence: {high/medium/low}
Completeness: {percentage}
```

**2. How to Retrieve and Format Results:**
```javascript
// Execute agent
const execution = execute_agent("pentaster", "Analyze package.json");

// Get full result
const fullReport = get_agent_result(execution.executionId);

// Get execution logs to verify knowledge loading
const logs = get_agent_execution_logs(execution.executionId);

// Format comprehensive report
const report = `
📊 Detailed Execution Report

Execution ID: ${fullReport.executionId}
Agent: ${fullReport.agentName}
Task: ${fullReport.task}

Timeline:
- Started: ${new Date(fullReport.startTime).toISOString()}
- Completed: ${new Date(fullReport.endTime).toISOString()}
- Duration: ${fullReport.duration}ms

Knowledge Base:
${logs.logs.find(l => l.message === "Agent knowledge loaded")?.metadata?.knowledgeFileCount || 0} files loaded
${JSON.stringify(logs.logs.find(l => l.message === "Agent knowledge loaded")?.metadata?.knowledgeFiles || [], null, 2)}

Results:
${fullReport.result.response.result}

Reasoning:
${fullReport.result.response.reasoning}

Steps Completed:
${fullReport.result.response.steps_completed.map((s, i) => `${i+1}. ${s}`).join('\n')}

Issues Encountered:
${fullReport.result.response.issues_encountered?.join('\n') || 'None'}

Recommendations:
${fullReport.result.response.recommendations.map((r, i) => `${i+1}. ${r}`).join('\n')}

Metadata:
- Confidence: ${fullReport.result.response.metadata.confidence}
- Completeness: ${fullReport.result.response.metadata.completeness}%
- Execution Method: ${fullReport.result.executionMethod}
`;

console.log(report);
```

**3. Detailed Report Template:

Recommendations:
{list recommendations}

Logs Available: Use get_agent_execution_logs("{executionId}") for full details
```

---

### Example Complete Report
```
✅ Security Audit Completed

Agent: pentaster
Task: Analyze package.json for security vulnerabilities
Status: success
Duration: 64,291ms
Execution Method: gemini-cli-non-interactive

Knowledge Base: 16 files loaded
- authorization_best_practices.md
- reporting_and_recommendations.md
- web_app_pentest_methodology.md
- vulnerability_assessment_guide.md
- [12 more files...]

Results:
Found 2 potential security concerns:

1. @modelcontextprotocol/sdk
   - Foundational dependencies subject to supply chain attacks
   - Risk: Medium
   - Recommendation: Implement regular security audits

2. zod (version ^4.1.12)
   - Current version is safe (CVE-2023-4316 affects older versions)
   - Risk: Low
   - Recommendation: Continue monitoring for new vulnerabilities

Steps Completed:
✓ Step 1 - Analyzed task requirements
✓ Step 2 - Planned approach
✓ Step 3 - Executed analysis (read package.json, searched vulnerabilities)
✓ Step 4 - Verified and validated findings

Recommendations:
1. Implement regular security audits using `npm audit`
2. Keep dependencies updated to latest stable versions
3. Consider pinning exact versions for critical dependencies
4. Monitor for supply chain attacks
5. Use tools for compromised package detection

Confidence: High
Completeness: 100%

Full logs available: get_agent_execution_logs("exec_1762331274914_h6aj2y3wy")
```

---

## 🎯 Best Practices

### 1. **⭐ Always Get Full Results with get_agent_result**
```javascript
// ✅ CORRECT: Get complete agent output
const execution = execute_agent("pentaster", "Scan package.json");
const fullReport = get_agent_result(execution.executionId);
// Now you have all findings, recommendations, reasoning

// ❌ WRONG: get_execution_status doesn't give full results
const status = get_execution_status(execution.executionId); // Only status info

// ❌ WRONG: Logs don't contain agent findings
const logs = get_agent_execution_logs(execution.executionId); // Only lifecycle logs
```

### 2. **Use Async for Long Tasks**
```javascript
// ❌ Bad: Blocks main session
execute_agent("pentaster", "Scan entire codebase");

// ✅ Good: Run in background
const exec = execute_agent("pentaster", "Scan entire codebase", {async: true});
// Continue other work, then get results when done
const result = get_agent_result(exec.executionId);
```

### 3. **Always Verify Knowledge Loading**
```javascript
// After execution, check logs
const logs = get_logs({agentName: "pentaster", limit: 10});
// Verify "Agent knowledge loaded" log with file count
```

### 4. **Use Task Coordination for Dependencies**
```javascript
// ✅ Good: Create dependent tasks
create_agent_task(sessionId, "agent1", "task1", {}, []);
create_agent_task(sessionId, "agent2", "task2", {}, ["task_1"]);
// task2 won't run until task1 completes
```

### 4. **Store Results in Context**
```javascript
// ✅ Good: Share data between agents
const result = execute_agent("pentaster", "scan");
store_context(sessionId, "scan_results", result);

// Later, another agent can access it
const findings = get_context(sessionId, "scan_results");
```

### 5. **Store Results in Context for Multi-Agent Work**
```javascript
// ✅ Good: Share data between agents
const execution = execute_agent("pentaster", "scan");
const fullReport = get_agent_result(execution.executionId);

// Store full results for next agent
store_context(sessionId, "scan_results", fullReport.result.response);

// Later, another agent can access it
const findings = get_context(sessionId, "scan_results");
```

### 6. **Monitor Async Executions**
```javascript
// Start async execution
const exec = execute_agent("agent", "task", {async: true});

// Poll status
const checkStatus = () => {
  const status = get_execution_status(exec.executionId);
  if (status.status === "completed") {
    // Get full results when done
    const fullReport = get_agent_result(exec.executionId);
    console.log("Done!", fullReport.result.response);
  } else {
    setTimeout(checkStatus, 5000); // Check every 5 seconds
  }
};
checkStatus();
```

### 7. **Use Logging for Debugging**
```javascript
// Get error logs
const errors = get_logs({level: "error", limit: 20});

// Get execution-specific logs
const execLogs = get_agent_execution_logs("exec_123");
```

---

## 🐛 Troubleshooting

### Agent Not Found
```
Error: Agent pentaster not found
```
**Solution:** Check agent folder name matches exactly:
- Folder: `.gemini/agents/pentaster/` ✅
- Wrong: `.gemini/agents/pentester/` ❌

---

### Can't Find Agent Results ⭐ IMPORTANT
```
Execution completed but I can't see the findings/report
```
**Solution:** Use `get_agent_result(executionId)` NOT `get_execution_status()`

```javascript
// ✅ CORRECT - Get full results
const fullReport = get_agent_result(execution.executionId);
console.log(fullReport.result.response.result); // Agent's findings
console.log(fullReport.result.response.recommendations); // Agent's recommendations

// ❌ WRONG - Only gives status, not results
const status = get_execution_status(execution.executionId);
// status.result exists but may not have detailed findings

// ❌ WRONG - Logs don't contain agent output
const logs = get_agent_execution_logs(execution.executionId);
// Logs show execution lifecycle, NOT agent findings
```

**Quick Fix:**
```javascript
// If you have executionId, get results immediately:
const result = get_agent_result("exec_1762332529136_1b4sd3w7u");
console.log(JSON.stringify(result, null, 2));
```

---

### No Knowledge Loaded
```
Log shows: "knowledgeFileCount": 0
```
**Solution:** 
1. Check `.gemini/agents/{agentName}/knowledge/` exists
2. Ensure files are `.md` or `.txt` format
3. Verify files have content

---

### Async Execution Not Working
```
Execution returns immediately but status stays "running" forever
```
**Solution:**
1. Check logs: `get_agent_execution_logs(executionId)`
2. Look for errors in execution
3. Verify Gemini CLI is installed: `which gemini`
4. Check timeout settings (default: 2 minutes)

---

### Missing Dependencies
```
Error: Task task_2 cannot run, dependency task_1 not completed
```
**Solution:**
1. Check task status: `get_all_tasks(sessionId)`
2. Ensure dependency completed: `update_task_status(sessionId, "task_1", "completed")`
3. Verify dependency IDs match exactly

---

## 📚 Additional Resources

- **LOGGING_GUIDE.md** - Comprehensive logging and monitoring guide
- **TEST_GUIDE.md** - Manual testing scenarios and commands
- **PROMPT_IMPROVEMENTS.md** - OpenAI prompt engineering best practices applied
- **README.md** - GSC architecture and setup

---

## 🎓 Summary

**GSC provides:**
- ✅ Unified agent execution framework
- ✅ 23+ specialized development agents
- ✅ Full knowledge base integration
- ✅ Async/parallel execution
- ✅ Task coordination with dependencies
- ✅ Context sharing between agents
- ✅ Comprehensive logging
- ✅ Structured JSON outputs

**Use GSC when you need:**
- 🎯 Specialized expertise (security, backend, frontend, etc.)
- 🚀 Parallel work execution
- 🔄 Multi-step workflows with dependencies
- 📊 Detailed execution tracking
- 💾 Shared context between tasks
- 📝 Professional reporting

**Start simple:**
```javascript
// Execute agent and get results
const exec = execute_agent("pentaster", "Analyze this code for security issues");
const results = get_agent_result(exec.executionId);
console.log(results.result.response.result); // See findings
```

**Scale up:**
```javascript
// Multiple agents, async execution, full coordination
const session = "project_001";

// Start all in parallel
const exec1 = execute_agent("pentaster", "Security scan", {sessionId: session, async: true});
const exec2 = execute_agent("backend-developer", "Code review", {sessionId: session, async: true});
const exec3 = execute_agent("qa-tester", "Test coverage", {sessionId: session, async: true});

// Wait and get all results
const result1 = get_agent_result(exec1.executionId);
const result2 = get_agent_result(exec2.executionId);
const result3 = get_agent_result(exec3.executionId);
```

---

## 🔑 Key Reminder

**To get agent findings/reports, ALWAYS use:**
```javascript
get_agent_result(executionId)  // ✅ Returns full report
```

**NOT:**
```javascript
get_execution_status(executionId)  // ❌ Only status info
get_agent_execution_logs(executionId)  // ❌ Only lifecycle logs
```

---

**Ready to execute agents! 🚀**
