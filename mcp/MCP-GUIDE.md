# MCP Servers - Quick Reference

All MCP servers in this project follow the same pattern for maximum consistency.

## Working MCP Servers

1. **agent-loader** - Loads agent contexts dynamically
2. **fabric-integration** - Executes Fabric AI patterns
3. **workflow-loader** - Loads n8n workflows and documentation
4. **template** - Template for creating new MCP servers

## Critical Pattern: Using Zod with MCP SDK

### ✅ CORRECT Way (Always use `.shape`)

```typescript
import { z } from 'zod';

server.registerTool(
  'tool_name',
  {
    title: 'Tool Title',
    description: 'What it does',
    inputSchema: z.object({
      param: z.string().describe('Description')
    }).shape  // ← CRITICAL: Add .shape!
  },
  async ({ param }) => {
    // Your logic
  }
);
```

### ❌ WRONG Ways (Don't use these)

```typescript
// Wrong #1: Missing .shape
inputSchema: z.object({
  param: z.string()
})

// Wrong #2: Using 'as any' hack
inputSchema: z.object({
  param: z.string()
}) as any

// Wrong #3: Using raw JSON Schema
inputSchema: {
  type: 'object',
  properties: { ... }
}
```

## Why `.shape` is Required

The MCP SDK expects a specific TypeScript type that matches Zod's internal structure. The `.shape` property extracts the correct format that the SDK can work with.

Without `.shape`:
- TypeScript compilation errors
- Runtime validation issues
- MCP server may fail to register tools

## Creating a New MCP Server

1. **Copy template:**
   ```bash
   cp -r mcp/template mcp/your-server-name
   ```

2. **Update package.json:**
   - Change name
   - Update description

3. **Install dependencies:**
   ```bash
   cd mcp/your-server-name
   bun install
   ```

4. **Implement your tools in src/index.ts**

5. **Register in `settings.json` (project root):**
   ```json
   {
     "mcpServers": {
       "your-server-name": {
         "command": "bun",
         "args": ["mcp/your-server-name/src/index.ts"]
       }
     }
   }
   ```

## Common Zod Patterns

### String Parameter
```typescript
inputSchema: z.object({
  text: z.string().describe('Input text')
}).shape
```

### Optional Parameter
```typescript
inputSchema: z.object({
  text: z.string().describe('Required text'),
  optional: z.string().optional().describe('Optional text')
}).shape
```

### With Default Value
```typescript
inputSchema: z.object({
  limit: z.number().optional().default(10).describe('Max results')
}).shape
```

### No Parameters
```typescript
inputSchema: z.object({}).shape
```

### Multiple Types
```typescript
inputSchema: z.object({
  name: z.string().describe('Name'),
  age: z.number().describe('Age'),
  active: z.boolean().describe('Is active'),
  tags: z.array(z.string()).describe('Tags')
}).shape
```

## All MCP Servers Have

### Required Files
- `package.json` - With dependencies
- `src/index.ts` - Server implementation
- `tsconfig.json` - TypeScript config
- `README.md` - Documentation

### Required Dependencies
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.11.0",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "bun-types": "latest",
    "typescript": "^5.3.0"
  }
}
```

### Server Structure
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'server-name',
  version: '1.0.0'
});

// Register tools here

const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Server name running');
```

## Testing Your MCP Server

```bash
# Test standalone
cd mcp/your-server-name
bun run dev

# Test with Gemini CLI
# 1. Add to settings.json
# 2. Restart Gemini CLI
# 3. Use /mcp status to check connection
```

## Troubleshooting

### "Type X is not assignable to type ZodRawShape"
**Solution:** Add `.shape` after `z.object({})`

### "Cannot find module 'zod'"
**Solution:** Run `bun install` in the MCP server directory

### MCP Server Not Connecting
**Check:**
1. Server path in `settings.json` is correct
2. Server starts without errors: `bun run dev`
3. Dependencies installed: `bun install`
4. Restart Gemini CLI

### Tool Not Being Called
**Check:**
1. Tool name matches agent's `mcp_tools` array
2. Tool description is clear
3. `inputSchema` is correct with `.shape`

## Examples to Reference

Look at these working servers for examples:

- **agent-loader/src/index.ts** - Simple file operations
- **fabric-integration/src/index.ts** - Shell command execution
- **workflow-loader/src/index.ts** - Complex JSON file searching

All follow the same `.shape` pattern!

---

**Remember:** Always use `.shape` after `z.object({...})` - it's the key to making MCP servers work correctly! ✨