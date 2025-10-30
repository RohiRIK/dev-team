# n8n Quick Reference Cheat Sheet

## Core Nodes

### Data Manipulation
- **Edit Fields (Set)** - Modify/add/remove data fields
- **Code** - Custom JavaScript/Python logic
- **Item Lists** - Split/aggregate items
- **Merge** - Combine data from multiple nodes

### Flow Control
- **If** - Conditional branching (simple)
- **Switch** - Multiple condition routing
- **Filter** - Include/exclude items
- **Loop Over Items** - Iterate through data
- **Wait** - Pause execution

### Triggers
- **Webhook** - HTTP endpoint trigger
- **Schedule** - Cron-based timing
- **Email Trigger** - Email-based activation
- **Manual Trigger** - Run on-demand

### HTTP & APIs
- **HTTP Request** - Call external APIs
- **Respond to Webhook** - Return data to webhook caller

### Error Handling
- **Error Trigger** - Catch workflow errors
- **NoOp** - Placeholder/documentation node
- **Stop And Error** - Halt with custom error

## Common Patterns

### Pattern: API to Database
```
Webhook → HTTP Request → Edit Fields → Database (Insert)
```

### Pattern: Data Transform Pipeline
```
Trigger → Get Data → Code (Transform) → Filter → Send Result
```

### Pattern: Error Handling
```
Main Workflow
    ↓ (on error)
Error Trigger → Log Error → Notify Admin
```

### Pattern: Conditional Processing
```
Trigger → Get Data → If (condition)
                      ├─ True → Action A
                      └─ False → Action B
```

## Essential JavaScript Expressions

```javascript
// Access input data
$json.fieldName
$json["field-with-dashes"]

// Access all items
$input.all()

// Get item by index
$input.item.json.fieldName

// Date formatting
$now.toISO()
$now.format('yyyy-MM-dd')

// String operations
$json.text.toLowerCase()
$json.text.split(',')
$json.text.replace('old', 'new')

// Array operations
$json.array.map(item => item.id)
$json.array.filter(item => item.status === 'active')
```

## Best Practices

### Performance
- Use **Item Lists** instead of looping when possible
- Batch operations in Code nodes
- Set appropriate timeout values
- Limit API calls with rate limiting

### Error Handling
- Always add Error Trigger for production workflows
- Use Try/Catch in Code nodes
- Set meaningful error messages
- Log errors to external system

### Debugging
- Use **NoOp** nodes for breakpoints
- Enable "Execute previous" in dev
- Check execution data panel
- Use `console.log()` in Code nodes (visible in logs)

### Security
- Store credentials in n8n credentials system
- Never hardcode API keys
- Use environment variables for config
- Validate webhook inputs

## Quick Commands

```bash
# Start n8n
n8n start

# Start with custom URL
n8n start --tunnel

# Export workflow
n8n export:workflow --id=<id>

# Import workflow
n8n import:workflow --input=file.json
```

## Common HTTP Request Settings

```javascript
// GET with query params
URL: https://api.example.com/data
Method: GET
Query Parameters:
  - key: value

// POST with JSON body
URL: https://api.example.com/create
Method: POST
Body Content Type: JSON
Body: {{ $json }}

// Auth Bearer Token
Authentication: Generic Credential Type
Credential Type: Header Auth
Name: Authorization
Value: Bearer {{$credentials.token}}
```
