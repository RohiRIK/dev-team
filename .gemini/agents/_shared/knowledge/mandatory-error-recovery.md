# Mandatory Error Recovery & Resilience

🚨 **CRITICAL: Error handling is MANDATORY - NOT optional** 🚨

## When MCP Tools Fail (MANDATORY Response)

If ANY MCP tool fails, you MUST follow this protocol:

### 1. Immediate Retry (MANDATORY)
- **First failure:** Retry immediately (tool may have transient issue)
- **Log the attempt:** Note what failed and why

### 2. Wait and Retry with Backoff (MANDATORY)
- **Second failure:** Wait 5 seconds, retry
- **Third failure:** Wait 10 seconds, retry
- **Document pattern:** Note if specific tool consistently fails

### 3. Use Alternative Tools (MANDATORY)
If tool still fails after 3 attempts, use alternatives:

**Research Tools Fallback Chain:**
1. Primary: Sequential Thinking MCP → Context7 MCP → DeepWiki MCP → Fetch MCP
2. If MCP fails: Use grep_search and semantic_search on local codebase
3. If all fail: Use file_search and read_file to manually research
4. Last resort: Ask user for specific guidance

**Browser/Testing Tools Fallback:**
1. Primary: Playwright MCP
2. If fails: Document manual testing steps needed
3. Alternative: Request user to test manually

**Agent Execution Fallback:**
1. Primary: execute_agent from Agent Execution Hub
2. If fails: Retry 3 times with 5-second intervals
3. If still fails: Document blocker and ask user for help

### 4. Document Blocker (MANDATORY)
If ALL fallbacks fail, you MUST:
- Create blocker note in task summary
- Explain what was attempted
- Describe the error messages
- Suggest potential solutions
- Ask user for guidance

---

## Error Handling in Code (MANDATORY)

When writing ANY code, you MUST include:

### Try-Catch Blocks (MANDATORY)
```javascript
try {
  // Main logic
} catch (error) {
  console.error('Specific error description:', error);
  // Fallback logic or graceful degradation
  // Log for debugging
}
```

### Input Validation (MANDATORY)
```javascript
function processData(input) {
  // MANDATORY: Validate inputs
  if (!input || typeof input !== 'expected_type') {
    throw new Error('Invalid input: expected [description]');
  }
  // Process
}
```

### Edge Case Handling (MANDATORY)
Consider and handle:
- Null/undefined values
- Empty arrays/objects
- Network failures
- File not found
- Permission denied
- Timeout scenarios
- Invalid user input

---

## Retry Strategy Template (MANDATORY)

```javascript
async function executeWithRetry(operation, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      // Exponential backoff
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

---

## Blocker Documentation Format (MANDATORY)

When documenting blockers in task summaries:

```markdown
## ⚠️ BLOCKERS ENCOUNTERED

### Blocker #1: [Tool/System Name] Failed
**What Failed:** [Specific tool or operation]
**Error Message:** `[Exact error message]`
**Attempts Made:**
1. Initial attempt: [Result]
2. Retry with backoff: [Result]
3. Alternative approach: [Result]

**Impact:** [What can't be completed without this]
**Suggested Solution:** [Potential fixes]
**User Action Needed:** [What user should do]
```

---

## No Exceptions

Error recovery is **MANDATORY** for:
- ✅ All MCP tool usage
- ✅ All code written by agents
- ✅ All external API calls
- ✅ All file operations
- ✅ All agent executions
- ✅ All user input processing

**Failure to implement error recovery = incomplete work.**
