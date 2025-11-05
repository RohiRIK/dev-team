# GSC Logging and Monitoring Guide

## ✅ Verifying Agent Knowledge Loading

### Question 1: How to ensure sub-agent gets context and knowledge from folder?

**Answer:** GSC automatically loads ALL knowledge from `.gemini/agents/{agentName}/knowledge/` directory!

**Verification Steps:**

1. **Check what was loaded** - Use the new logging:
   ```
   Get logs for the pentaster execution to see what knowledge files were loaded
   ```

2. **Review the logs:**
   ```
   get_logs with agentName: "pentaster" and limit: 20
   ```

Expected log output:
```json
{
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
}
```

**Knowledge Loading Process:**
1. GSC reads `.gemini/agents/pentaster/agent.json` (config)
2. GSC reads `.gemini/agents/pentaster/agent.md` (system prompt)  
3. GSC scans `.gemini/agents/pentaster/knowledge/` directory
4. Loads ALL `.md` and `.txt` files
5. Includes ALL knowledge in the agent prompt sent to Gemini CLI
6. Logs what was loaded (count + filenames)

**The prompt sent to sub-agent includes:**
```markdown
# ROLE AND IDENTITY
You are "pentaster", a specialized AI agent...

# SYSTEM INSTRUCTIONS
{system prompt from agent.md}

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

# TASK SPECIFICATION
...
```

---

## 📊 Monitoring Async Agent Executions

### Question 2: How to see logs and check if async agents finished?

**New Tools Available:**

### 1. **Check Execution Status**
```
What's the status of execution exec_1762331431382_enf4buq2q?
```

GSC calls: `get_execution_status("exec_1762331431382_enf4buq2q")`

Returns:
```json
{
  "executionId": "exec_1762331431382_enf4buq2q",
  "agentName": "pentaster",
  "task": "Scan the entire codebase...",
  "status": "completed",  // or "running", "failed"
  "startTime": 1762331431382,
  "endTime": 1762331495123,
  "result": {
    "status": "success",
    "result": "findings here...",
    "reasoning": "...",
    "metadata": {
      "confidence": "high",
      "completeness": "100%"
    }
  }
}
```

### 2. **List All Active Executions**
```
Show me all currently running agent executions
```

GSC calls: `list_active_executions()`

Returns:
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

### 3. **Get Execution Logs**
```
Show me the detailed logs for execution exec_1762331431382_enf4buq2q
```

GSC calls: `get_agent_execution_logs("exec_1762331431382_enf4buq2q")`

Returns:
```json
{
  "executionId": "exec_1762331431382_enf4buq2q",
  "logCount": 8,
  "logs": [
    {
      "timestamp": "2025-11-05T08:30:31.382Z",
      "level": "info",
      "message": "Agent execution started",
      "metadata": {
        "executionId": "exec_1762331431382_enf4buq2q",
        "agentName": "pentaster",
        "task": "Scan the entire codebase..."
      }
    },
    {
      "timestamp": "2025-11-05T08:30:31.450Z",
      "level": "info",
      "message": "Agent knowledge loaded",
      "metadata": {
        "agentName": "pentaster",
        "knowledgeFileCount": 16,
        "knowledgeFiles": [...]
      }
    },
    {
      "timestamp": "2025-11-05T08:30:31.500Z",
      "level": "info",
      "message": "Executing agent via Gemini CLI",
      "metadata": {
        "agentName": "pentaster",
        "command": "gemini -p \"...\" --output-format json"
      }
    },
    {
      "timestamp": "2025-11-05T08:31:35.123Z",
      "level": "info",
      "message": "Background agent execution completed",
      "metadata": {
        "executionId": "exec_1762331431382_enf4buq2q",
        "agentName": "pentaster",
        "duration": 63741
      }
    }
  ]
}
```

### 4. **Get General Logs**
```
Show me the last 30 info logs
```

GSC calls: `get_logs({level: "info", limit: 30})`

**Filter options:**
- `level`: "debug", "info", "warn", "error"
- `agentName`: Filter by specific agent
- `sessionId`: Filter by session
- `limit`: Number of logs (default 50)

---

## 🎯 Complete Testing Workflow

### Step 1: Start Async Agent
```
Start pentaster scanning the codebase in background (async)
```

Response includes:
```json
{
  "executionId": "exec_123",
  "status": "running"
}
```

### Step 2: Continue Other Work
```
While pentaster runs, list the files in .gemini/agents/
```

Main session continues working!

### Step 3: Check Status
```
What's the status of execution exec_123?
```

### Step 4: View Detailed Logs
```
Show me logs for execution exec_123
```

### Step 5: Get Results
Once status is "completed":
```
Get the execution status for exec_123 to see results
```

---

## 📝 Example Commands for Gemini

### Verify Knowledge Loading
```
Execute pentaster to scan package.json, then show me the logs to verify what knowledge files were loaded
```

### Monitor Multiple Agents
```
1. Start pentaster scanning (async)
2. Start backend-developer reviewing code (async)
3. List all active executions
4. Check status of both periodically
```

### Debug Execution
```
Show me error logs for the last hour
```

```
Get all logs for agentName: "pentaster" with limit 50
```

---

## 🔍 Log Levels

- **debug**: Detailed technical information
- **info**: Normal operations, agent loading, executions
- **warn**: Warnings that don't stop execution
- **error**: Errors that caused failures

---

## ✅ Summary

### Verification Checklist:

**Knowledge Loading:**
- ✅ All .md and .txt files from knowledge/ folder are loaded
- ✅ Full content included in agent prompt
- ✅ Log shows: `"Agent knowledge loaded"` with file count and names
- ✅ systemPromptLength shows prompt was loaded

**Async Monitoring:**
- ✅ `get_execution_status(executionId)` - Check if done
- ✅ `list_active_executions()` - See all running agents
- ✅ `get_agent_execution_logs(executionId)` - Detailed logs
- ✅ `get_logs({filter})` - General GSC logs

**Log Information Includes:**
- ✅ Which knowledge files were loaded
- ✅ When execution started/completed
- ✅ Duration of execution
- ✅ Gemini CLI command that was run
- ✅ Any errors or warnings
- ✅ Final results and status

---

## 🚀 Quick Reference

| Task | Command |
|------|---------|
| Check async status | `get_execution_status("exec_id")` |
| List running agents | `list_active_executions()` |
| View execution logs | `get_agent_execution_logs("exec_id")` |
| Get general logs | `get_logs({level: "info", limit: 50})` |
| Filter by agent | `get_logs({agentName: "pentaster"})` |
| See errors only | `get_logs({level: "error"})` |

---

**Now you can:**
1. ✅ Verify agents load their knowledge correctly
2. ✅ Monitor async executions in real-time
3. ✅ View detailed logs for debugging
4. ✅ Track multiple agents simultaneously
5. ✅ See exactly what was loaded and when
