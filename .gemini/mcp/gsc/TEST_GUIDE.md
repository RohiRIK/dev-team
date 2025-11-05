# GSC Manual Testing Guide

## 🎯 Quick Test with Gemini CLI

### Prerequisites
1. GSC is configured in `.gemini/settings.json`
2. Agents exist in `.gemini/agents/` directory
3. Gemini CLI is installed

---

## 📝 Test Scenarios

### Test 1: Basic Agent Execution (Synchronous)

**What to test:** Agent executes and returns structured results

**Steps:**
1. Start Gemini CLI:
   ```bash
   gemini
   ```

2. Say this in Gemini:
   ```
   Use the pentaster agent to analyze the GSC package.json file for security vulnerabilities
   ```

**Expected Result:**
- GSC calls `execute_agent("pentaster", "analyze package.json...")`
- Gemini CLI spawns non-interactive session with pentaster
- Returns structured JSON with:
  ```json
  {
    "status": "success|partial|failed",
    "result": "findings here",
    "reasoning": "approach explanation",
    "steps_completed": [...],
    "metadata": {
      "confidence": "high|medium|low",
      "completeness": "0-100"
    }
  }
  ```

**Success Criteria:**
- ✅ Agent executes without errors
- ✅ Returns structured JSON output
- ✅ Includes reasoning and metadata
- ✅ Results are relevant to the task

---

### Test 2: Async Agent Execution

**What to test:** Agent runs in background while main session continues

**Steps:**
1. In Gemini, say:
   ```
   Start the pentaster agent to scan the entire .gemini/mcp/gsc codebase for security issues (run async in background). While it runs, list all the files in the .gemini/agents/ directory.
   ```

**Expected Result:**
- GSC calls `execute_agent("pentaster", "scan codebase", {async: true})`
- Returns immediately with `{executionId: "exec_123", status: "running"}`
- Main Gemini session continues and lists files
- Later can check status with `get_execution_status("exec_123")`

**Success Criteria:**
- ✅ Returns immediately (doesn't wait)
- ✅ Main session can do other work
- ✅ Can check execution status later
- ✅ Eventually completes with results

---

### Test 3: Multiple Agents in Parallel

**What to test:** Multiple agents execute simultaneously

**Steps:**
1. In Gemini, say:
   ```
   Run two agents in parallel: 
   1. pentaster to scan package.json 
   2. backend-developer to review the agent-execution.ts file
   
   Both async. Then show me the status of both.
   ```

**Expected Result:**
- Two `execute_agent()` calls with `async: true`
- Both return immediately with different executionIds
- Can monitor both with `list_active_executions()`
- Both complete independently

**Success Criteria:**
- ✅ Both agents start simultaneously
- ✅ Each has unique executionId
- ✅ Can list all active executions
- ✅ Both complete successfully

---

### Test 4: Task Coordination

**What to test:** Tasks with dependencies execute in correct order

**Steps:**
1. In Gemini, say:
   ```
   Create a task sequence:
   1. Task A: pentaster analyzes security
   2. Task B: backend-developer fixes issues (depends on Task A)
   
   Create both tasks and show me the task list.
   ```

**Expected Result:**
- `create_agent_task()` called twice
- Task B has Task A as dependency
- `get_all_tasks()` shows both tasks
- `get_ready_tasks()` shows only Task A initially

**Success Criteria:**
- ✅ Tasks created with dependencies
- ✅ Only ready tasks (no deps) are executable
- ✅ Can query task status
- ✅ Task flow respects dependencies

---

### Test 5: Context Storage

**What to test:** Agents can share data via context

**Steps:**
1. In Gemini, say:
   ```
   Store this data in the session context:
   Key: "test_data"
   Value: {"name": "GSC Test", "version": "1.0"}
   
   Then retrieve it back.
   ```

**Expected Result:**
- `store_context()` stores data
- `get_context()` retrieves same data
- Data persists in session

**Success Criteria:**
- ✅ Data stored successfully
- ✅ Retrieved data matches stored data
- ✅ Can be used across multiple tool calls

---

### Test 6: Improved Prompts

**What to test:** Agents respond with better structure

**Steps:**
1. In Gemini, say:
   ```
   Execute pentaster to analyze this code snippet for SQL injection:
   
   const query = "SELECT * FROM users WHERE id = " + userId;
   ```

**Expected Result:**
- Agent receives structured prompt with:
  - Clear role definition
  - Step-by-step workflow
  - Output format specification
- Returns structured JSON with reasoning

**Success Criteria:**
- ✅ Response follows JSON structure
- ✅ Includes step-by-step reasoning
- ✅ Has confidence/completeness metrics
- ✅ Analysis is thorough and detailed

---

### Test 7: Error Handling

**What to test:** Graceful error handling

**Steps:**
1. In Gemini, say:
   ```
   Execute a non-existent agent called "fake-agent"
   ```

**Expected Result:**
- GSC returns error: "Agent fake-agent not found"
- Doesn't crash
- Provides clear error message

**Success Criteria:**
- ✅ Error message is clear
- ✅ System continues working
- ✅ Can execute valid agents after error

---

## 🔍 Verification Checklist

After testing, verify:

### Agent Execution
- [ ] Agents execute via non-interactive Gemini CLI
- [ ] Structured JSON output received
- [ ] Reasoning included in responses
- [ ] Metadata (confidence, completeness) present

### Async Features
- [ ] Async execution returns immediately
- [ ] Can monitor execution status
- [ ] Can list active executions
- [ ] Multiple agents run in parallel

### Task Coordination
- [ ] Tasks can be created with dependencies
- [ ] Only ready tasks are executable
- [ ] Task status updates correctly

### Context Management
- [ ] Data persists in session
- [ ] Multiple agents can share context
- [ ] Context retrieval works correctly

### Prompt Improvements
- [ ] Responses are more structured
- [ ] Better reasoning quality
- [ ] Clear step-by-step thinking
- [ ] Confidence metrics included

### Error Handling
- [ ] Invalid agents handled gracefully
- [ ] Missing parameters detected
- [ ] Clear error messages
- [ ] System recovers from errors

---

## 🐛 Common Issues

### Issue: Agent not found
**Solution:** Check agent folder name matches exactly (e.g., "pentaster" not "pentester")

### Issue: Gemini not loading GSC
**Solution:** 
```bash
# Check settings.json has GSC configured
cat .gemini/settings.json | grep gsc

# Restart Gemini CLI
pkill -f gemini
gemini
```

### Issue: Async execution doesn't work
**Solution:** Make sure to pass `{async: true}` parameter

### Issue: No structured output
**Solution:** GSC prompts updated - may need to restart Gemini to load changes

---

## 📊 Expected Performance

- **Simple agent execution:** 2-10 seconds
- **Async start:** < 100ms (returns immediately)
- **Context operations:** < 50ms
- **Task creation:** < 100ms
- **Status checks:** < 50ms

---

## 🎓 Test Commands Cheat Sheet

```javascript
// Execute agent (sync)
execute_agent("pentaster", "scan this file")

// Execute agent (async)
execute_agent("pentaster", "scan codebase", {async: true})

// Check status
get_execution_status("exec_123")

// List active
list_active_executions()

// Create task
create_agent_task("session_1", "pentaster", "task desc", {data: "..."}, [])

// Get tasks
get_all_tasks("session_1")
get_ready_tasks("session_1")

// Context
store_context("session_1", "key", {value: "data"})
get_context("session_1", "key")
```

---

## ✅ Success Criteria

All tests pass if:
1. Agents execute and return structured results
2. Async execution works without blocking
3. Tasks respect dependencies
4. Context persists across calls
5. Errors are handled gracefully
6. Responses include reasoning and metadata
7. Performance is acceptable (< 10s for simple tasks)

---

## 📝 Report Results

After testing, note:
- Which tests passed/failed
- Any error messages
- Performance observations
- Suggestions for improvements
