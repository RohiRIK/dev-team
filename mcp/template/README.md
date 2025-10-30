# MCP Template

Template for creating new Model Context Protocol (MCP) servers for the Gemini CLI.

## Quick Start

1. **Copy this template:**
   ```bash
   cp -r mcp/template mcp/your-server-name
   cd mcp/your-server-name
   ```

2. **Update package.json:**
   - Change `name` to `your-server-name-mcp`
   - Update `description`

3. **Install dependencies:**
   ```bash
   bun install
   ```

4. **Implement your tools in `src/index.ts`:**
   ```typescript
   server.registerTool(
     'your_tool_name',
     {
       title: 'Your Tool Title',
       description: 'What your tool does',
       inputSchema: z.object({
         param: z.string().describe('Parameter description')
       }).shape  // Important: Add .shape!
     },
     async ({ param }: { param: string }) => {
       // Your logic here
       return {
         content: [{
           type: 'text' as const,
           text: 'Result'
         }]
       };
     }
   );
   ```

5. **Test your server:**
   ```bash
   bun run dev
   ```

6. **Register in Gemini CLI settings:**
   
   Edit `settings.json`:
   ```json
   {
     "mcpServers": {
       "your-server-name": {
         "command": "bun",
         "args": ["mcp/your-server-name/src/index.ts"],
         "cwd": "."
       }
     }
   }
   ```

## Tool Schema Pattern

**IMPORTANT:** Always use `.shape` after `z.object()`:

```typescript
// ✅ CORRECT
inputSchema: z.object({
  param: z.string().describe('Description')
}).shape

// ❌ WRONG
inputSchema: z.object({
  param: z.string().describe('Description')
})

// ❌ WRONG
inputSchema: z.object({
  param: z.string().describe('Description')
}) as any
```

## Common Patterns

### Tool with Optional Parameter

```typescript
server.registerTool(
  'tool_name',
  {
    title: 'Tool Name',
    description: 'Tool description',
    inputSchema: z.object({
      required_param: z.string().describe('Required parameter'),
      optional_param: z.string().optional().describe('Optional parameter'),
      with_default: z.number().optional().default(10).describe('With default value')
    }).shape
  },
  async ({ required_param, optional_param, with_default }) => {
    // Your logic
  }
);
```

### Tool with No Parameters

```typescript
server.registerTool(
  'tool_name',
  {
    title: 'Tool Name',
    description: 'Tool description',
    inputSchema: z.object({}).shape
  },
  async () => {
    // Your logic
  }
);
```

### Error Handling

```typescript
server.registerTool(
  'tool_name',
  {
    title: 'Tool Name',
    description: 'Tool description',
    inputSchema: z.object({
      param: z.string()
    }).shape
  },
  async ({ param }) => {
    try {
      // Your logic
      return {
        content: [{
          type: 'text' as const,
          text: 'Success result'
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{
          type: 'text' as const,
          text: `Error: ${errorMessage}`
        }],
        isError: true
      };
    }
  }
);
```

## Available Zod Types

```typescript
z.string()           // String
z.number()           // Number
z.boolean()          // Boolean
z.array(z.string())  // Array of strings
z.object({...})      // Nested object
z.enum(['a', 'b'])   // Enum

// Modifiers
.optional()          // Makes parameter optional
.default(value)      // Sets default value
.describe('text')    // Adds description for AI
```

## Testing Your MCP Server

```bash
# Run the server (it will wait for input)
bun run dev

# In another terminal, you can test by sending JSON-RPC commands
# Or just restart Gemini CLI to test integration
```

## Examples

See working examples:
- `mcp/agent-loader/` - Agent loading MCP
- `mcp/workflow-loader/` - Workflow and docs loading
- `mcp/fabric-integration/` - Fabric pattern execution

## Troubleshooting

**TypeScript errors about ZodRawShape:**
- Make sure you have `package.json` with correct dependencies
- Run `bun install` to install dependencies
- Add `.shape` after `z.object({...})`

**MCP server not connecting:**
- Check server path in `settings.json`
- Test server with `bun run dev`
- Check console for error messages
- Restart Gemini CLI

**Tool not being called:**
- Verify tool name in agent's `agent.json` mcp_tools array
- Check tool description is clear for AI
- Ensure inputSchema is correct

## Resources

- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Zod Documentation](https://zod.dev/)
- [Project MCP Servers](../) - See other servers for examples
