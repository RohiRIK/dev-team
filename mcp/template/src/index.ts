import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Create MCP server
const server = new McpServer({
  name: 'template-mcp',
  version: '1.0.0'
});

/**
 * Example tool - replace with your own
 */
server.registerTool(
  'example_tool',
  {
    title: 'Example Tool',
    description: 'An example tool template',
    inputSchema: z.object({
      input: z.string().describe('Input parameter')
    }).shape
  },
  async ({ input }: { input: string }) => {
    try {
      // Your logic here
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Processed: ${input}` 
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

// Start the MCP server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Template MCP server running');
