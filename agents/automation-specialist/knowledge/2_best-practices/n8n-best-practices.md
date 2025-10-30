# n8n Best Practices

## Architecture & Design

### Workflow Organization
- **Single Responsibility**: Each workflow should do one thing well
- **Modular Design**: Break complex processes into smaller, reusable workflows
- **Clear Naming**: Use descriptive names for workflows and nodes
- **Documentation**: Add notes to complex nodes explaining logic

### Error Handling
```
Main Workflow
    ↓
[Error Trigger] → Log Error → Notify Team → Retry/Fallback
```

**Best Practices:**
- Always add Error Trigger for production workflows
- Log errors to external system (database, monitoring tool)
- Set up notifications (email, Slack, PagerDuty)
- Implement retry logic for transient failures
- Use fallback workflows for critical processes

### Performance Optimization

**Do:**
- ✅ Use `Item Lists` mode when processing multiple items
- ✅ Batch API calls when possible
- ✅ Set appropriate timeout values
- ✅ Use `NoOp` nodes for development/debugging only
- ✅ Limit workflow execution time with timeouts

**Don't:**
- ❌ Loop over items one-by-one (use batch operations)
- ❌ Make unnecessary API calls
- ❌ Load large files into memory
- ❌ Use `Wait` nodes for long delays (use Schedule Trigger instead)

## Security

### Credentials Management
- **Never hardcode**: Store all sensitive data in n8n credentials
- **Use Environment Variables**: For configuration that changes per environment
- **Rotate Regularly**: Update API keys and secrets periodically
- **Least Privilege**: Give workflows minimum required permissions

### Input Validation
```javascript
// In Code node
const input = $json.userInput;

// Validate and sanitize
if (!input || typeof input !== 'string') {
  throw new Error('Invalid input');
}

const sanitized = input
  .trim()
  .replace(/[<>]/g, ''); // Basic XSS prevention
```

### Webhook Security
- Use authentication (API key, OAuth, JWT)
- Validate webhook signatures
- Rate limit incoming requests
- Log all webhook calls
- Use HTTPS only

## Development Workflow

### Testing Strategy
1. **Unit Test**: Test individual nodes with sample data
2. **Integration Test**: Test full workflow end-to-end
3. **Edge Cases**: Test error conditions and edge cases
4. **Load Test**: Test with realistic data volumes

### Version Control
- Export workflows regularly
- Store in Git repository
- Use meaningful commit messages
- Tag production releases
- Document breaking changes

### Deployment Process
1. Develop in development environment
2. Test with real data in staging
3. Review and approve changes
4. Deploy to production during low-traffic period
5. Monitor for errors

## Common Patterns

### Pattern 1: API Polling
```
Schedule Trigger (every 5 min)
    ↓
HTTP Request (Get Data)
    ↓
Filter (New Items Only)
    ↓
Process Items
    ↓
Update Last Sync Time
```

### Pattern 2: Webhook + Database
```
Webhook (Receive Data)
    ↓
Validate Input
    ↓
If (Is Valid?)
    ├─ Yes → Save to Database → Return Success
    └─ No → Return Error
```

### Pattern 3: Data Transformation Pipeline
```
Trigger
    ↓
Extract Data
    ↓
Transform (Code Node)
    ↓
Validate Results
    ↓
Load to Destination
    ↓
Send Notification
```

### Pattern 4: Retry with Backoff
```
Main Workflow
    ↓
Try API Call
    ↓ (on error)
Error Trigger
    ↓
Wait (exponential: 1s, 2s, 4s, 8s)
    ↓
Retry API Call (max 3 attempts)
    ↓
If Still Fails → Notify Admin
```

## Monitoring & Debugging

### Logging Strategy
- Log workflow start/end
- Log key decision points
- Log all API calls (request/response)
- Log errors with full context
- Use structured logging (JSON)

### Debugging Techniques
1. **Use NoOp Nodes**: Add breakpoints to inspect data
2. **Enable Execute Previous**: Test nodes without re-running entire workflow
3. **Check Execution Data**: View input/output of each node
4. **Use console.log**: In Code nodes (logs appear in n8n logs)
5. **Test with Sample Data**: Use Set node to inject test data

### Monitoring Metrics
- **Execution Time**: Track workflow duration
- **Success Rate**: % of successful executions
- **Error Rate**: Track failures by type
- **API Usage**: Monitor rate limits
- **Resource Usage**: CPU, memory, storage

## Code Node Best Practices

### JavaScript Tips
```javascript
// Use modern JavaScript
const items = $input.all();

// Handle errors gracefully
try {
  const result = processData($json);
  return result;
} catch (error) {
  throw new Error(`Processing failed: ${error.message}`);
}

// Return proper structure
return {
  json: {
    result: processedData,
    timestamp: new Date().toISOString()
  }
};
```

### Performance in Code Nodes
- Minimize external library imports
- Cache expensive computations
- Use built-in JavaScript methods
- Avoid blocking operations
- Process in batches

## API Integration Best Practices

### Rate Limiting
```javascript
// Implement rate limiting in Code node
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (const item of items) {
  await makeAPICall(item);
  await delay(100); // 10 requests per second
}
```

### Pagination
```javascript
let allData = [];
let page = 1;
let hasMore = true;

while (hasMore) {
  const response = await fetch(`/api/data?page=${page}`);
  const data = await response.json();
  
  allData = [...allData, ...data.results];
  hasMore = data.hasMore;
  page++;
}

return allData;
```

### Error Handling for APIs
- Handle 4xx errors (client errors) differently from 5xx (server errors)
- Implement exponential backoff for retries
- Log failed requests with full details
- Set reasonable timeouts
- Handle rate limit responses (429)

## Maintenance

### Regular Tasks
- **Weekly**: Review failed executions
- **Monthly**: Update credentials and secrets
- **Quarterly**: Review and optimize slow workflows
- **Annually**: Audit security and permissions

### Documentation
- Keep workflow README updated
- Document environment variables
- List required credentials
- Note API rate limits and quotas
- Document known limitations

## Quick Decision Matrix

| Scenario | Best Approach |
|----------|--------------|
| Process 1000+ items | Use Item Lists mode, batch operations |
| Long-running task (>5 min) | Split into multiple workflows |
| Need to retry on failure | Use Error Trigger + retry logic |
| External API call | Add timeout, error handling, rate limiting |
| Sensitive data | Use credentials, never hardcode |
| Complex logic | Use Code node with proper error handling |
| Need to wait hours | Use Schedule Trigger, not Wait node |
| Multiple conditions | Use Switch node, not nested If nodes |
