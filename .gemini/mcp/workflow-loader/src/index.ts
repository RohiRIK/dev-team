import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

const WORKFLOWS_DIR = path.join(process.cwd(), 'agents/automation-specialist/knowledge/workflows');

// Create MCP server
const server = new McpServer({
  name: 'workflow-loader',
  version: '1.0.0'
});

/**
 * Search workflows by query
 */
server.registerTool(
  'search_workflows',
  {
    title: 'Search Workflows',
    description: 'Search for n8n workflows by name, description, or content',
    inputSchema: z.object({
      query: z.string().describe('Search query (name, keyword, or description)'),
      limit: z.number().optional().default(10).describe('Maximum results to return')
    }).shape
  },
  async ({ query, limit }: { query: string; limit?: number }) => {
    try {
      const vibeDir = WORKFLOWS_DIR;
      const files = await fs.readdir(vibeDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      const results = [];
      const searchQuery = query.toLowerCase();
      const maxResults = limit || 10;
      
      for (const file of jsonFiles) {
        if (results.length >= maxResults) break;
        
        try {
          const content = await fs.readFile(path.join(vibeDir, file), 'utf-8');
          const workflow = JSON.parse(content);
          
          const nameMatch = workflow.name?.toLowerCase().includes(searchQuery);
          const descMatch = workflow.description?.toLowerCase().includes(searchQuery);
          const fileMatch = file.toLowerCase().includes(searchQuery);
          
          if (nameMatch || descMatch || fileMatch) {
            results.push({
              filename: file,
              name: workflow.name || 'Unnamed',
              description: workflow.description || 'No description',
              nodes: workflow.nodes?.length || 0
            });
          }
        } catch {
          continue;
        }
      }
      
      return {
        content: [{
          type: 'text' as const, 
          text: JSON.stringify({ query, count: results.length, results }, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{ type: 'text' as const, text: `Error: ${errorMessage}` }],
        isError: true
      };
    }
  }
);

/**
 * Get specific workflow
 */
server.registerTool(
  'get_workflow',
  {
    title: 'Get Workflow',
    description: 'Get a specific workflow by filename',
    inputSchema: z.object({
      filename: z.string().describe('Workflow filename (e.g., "my-workflow.json")')
    }).shape
  },
  async ({ filename }: { filename: string }) => {
    try {
      const vibeDir = WORKFLOWS_DIR;
      const filePath = path.join(vibeDir, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      const workflow = JSON.parse(content);
      
      return {
        content: [{
          type: 'text' as const, 
          text: JSON.stringify(workflow, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{ type: 'text' as const, text: `Error: ${errorMessage}` }],
        isError: true
      };
    }
  }
);

/**
 * List all workflows
 */
server.registerTool(
  'list_workflows',
  {
    title: 'List Workflows',
    description: 'List all available workflows with basic info',
    inputSchema: z.object({
      limit: z.number().optional().default(50).describe('Maximum workflows to list')
    }).shape
  },
  async ({ limit }: { limit?: number }) => {
    try {
      const vibeDir = WORKFLOWS_DIR;
      const files = await fs.readdir(vibeDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      const maxLimit = limit || 50;
      
      const workflows = await Promise.all(
        jsonFiles.slice(0, maxLimit).map(async (file) => {
          try {
            const content = await fs.readFile(path.join(vibeDir, file), 'utf-8');
            const workflow = JSON.parse(content);
            return {
              filename: file,
              name: workflow.name || 'Unnamed',
              nodes: workflow.nodes?.length || 0
            };
          } catch {
            return null;
          }
        })
      );
      
      const validWorkflows = workflows.filter(Boolean);
      
      return {
        content: [{
          type: 'text' as const, 
          text: JSON.stringify({
            total: jsonFiles.length, 
            showing: validWorkflows.length, 
            workflows: validWorkflows 
          }, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{ type: 'text' as const, text: `Error: ${errorMessage}` }],
        isError: true
      };
    }
  }
);

/**
 * Get n8n documentation
 */
server.registerTool(
  'get_n8n_docs',
  {
    title: 'Get n8n Documentation',
    description: 'Get n8n documentation by topic from docs and node-guides folders',
    inputSchema: z.object({
      topic: z.string().describe('Documentation topic (e.g., "Code Node", "HTTP Request", "Webhook", "core concepts")')
    }).shape
  },
  async ({ topic }: { topic: string }) => {
    try {
      const knowledgeDir = path.join(process.cwd(), 'agents/automation-specialist/knowledge');
      const docsDir = path.join(knowledgeDir, 'docs');
      const nodeGuidesDir = path.join(docsDir, 'node-guides');
      
      // Search in docs and node-guides folders
      const docFiles = await fs.readdir(docsDir);
      const nodeGuideFiles = await fs.readdir(nodeGuidesDir);
      
      const allFiles = [
        ...docFiles.filter(f => f.endsWith('.md')).map(f => ({ path: docsDir, file: f })),
        ...nodeGuideFiles.filter(f => f.endsWith('.md')).map(f => ({ path: nodeGuidesDir, file: f }))
      ];
      
      const matchingFile = allFiles.find(({ file }) => 
        file.toLowerCase().includes(topic.toLowerCase())
      );
      
      if (!matchingFile) {
        const availableTopics = allFiles
          .map(({ file }) => `- ${file.replace('.md', '')}`)
          .join('\n');
        
        return {
          content: [{
            type: 'text' as const, 
            text: `No documentation found for topic: ${topic}\n\nAvailable topics:\n${availableTopics.slice(0, 2000)}...`
          }]
        };
      }
      
      const content = await fs.readFile(path.join(matchingFile.path, matchingFile.file), 'utf-8');
      return {
        content: [{
          type: 'text' as const, 
          text: `# ${matchingFile.file}\n\n${content}`
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{ type: 'text' as const, text: `Error: ${errorMessage}` }],
        isError: true
      };
    }
  }
);

// Start the MCP server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Workflow Loader MCP server running');
