import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

const AGENTS_DIR = process.env.AGENTS_DIR || '.gemini/agents';

// Create MCP server
const server = new McpServer({
  name: 'agent-loader',
  version: '1.0.0'
});

/**
 * List all available agents in the project
 */
server.registerTool(
  'list_available_agents',
  {
    title: 'List Available Agents',
    description: 'Get a list of all available agents in the project',
    inputSchema: z.object({}).shape
  },
  async () => {
    try {
      const dirs = await readdir(AGENTS_DIR);
      const agents: string[] = [];
      
      for (const dir of dirs) {
        if (!dir.startsWith('_')) {
          agents.push(dir);
        }
      }
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: JSON.stringify({ agents }, null, 2)
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

/**
 * Load agent context (agent.md)
 */
server.registerTool(
  'load_agent_context',
  {
    title: 'Load Agent Context',
    description: 'Load agent.md context file for a specific agent',
    inputSchema: z.object({
      agent_name: z.string().describe('Name of the agent to load')
    }).shape
  },
  async ({ agent_name }: { agent_name: string }) => {
    try {
      const contextPath = join(AGENTS_DIR, agent_name, 'agent.md');
      const content = await readFile(contextPath, 'utf-8');
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: content 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error: Agent '${agent_name}' not found or agent.md does not exist` 
        }],
        isError: true
      };
    }
  }
);

/**
 * Load agent configuration (agent.json)
 */
server.registerTool(
  'load_agent_config',
  {
    title: 'Load Agent Configuration',
    description: 'Load agent.json configuration for a specific agent',
    inputSchema: z.object({
      agent_name: z.string().describe('Name of the agent')
    }).shape
  },
  async ({ agent_name }: { agent_name: string }) => {
    try {
      const configPath = join(AGENTS_DIR, agent_name, 'agent.json');
      const content = await readFile(configPath, 'utf-8');
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: content 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error: Configuration for '${agent_name}' not found` 
        }],
        isError: true
      };
    }
  }
);

/**
 * Load specific knowledge file for an agent
 */
server.registerTool(
  'load_agent_knowledge',
  {
    title: 'Load Agent Knowledge',
    description: 'Load a specific knowledge file for an agent',
    inputSchema: z.object({
      agent_name: z.string().describe('Name of the agent'),
      knowledge_file: z.string().describe('Name of the knowledge file (e.g., security-rules.md)')
    }).shape
  },
  async ({ agent_name, knowledge_file }: { agent_name: string; knowledge_file: string }) => {
    try {
      const knowledgePath = join(AGENTS_DIR, agent_name, 'knowledge', knowledge_file);
      const content = await readFile(knowledgePath, 'utf-8');
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: content 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error: Knowledge file '${knowledge_file}' not found for agent '${agent_name}'` 
        }],
        isError: true
      };
    }
  }
);

/**
 * Load shared context from _shared folder
 */
server.registerTool(
  'load_shared_context',
  {
    title: 'Load Shared Context',
    description: 'Load shared context from _shared folder',
    inputSchema: z.object({}).shape
  },
  async () => {
    try {
      const contextPath = join(AGENTS_DIR, '_shared', 'context.md');
      const content = await readFile(contextPath, 'utf-8');
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: content 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: 'Shared context not found' 
        }],
        isError: true
      };
    }
  }
);

/**
 * Load shared tools documentation
 */
server.registerTool(
  'load_shared_tools',
  {
    title: 'Load Shared Tools',
    description: 'Load shared tools documentation from _shared folder',
    inputSchema: z.object({}).shape
  },
  async () => {
    try {
      const toolsPath = join(AGENTS_DIR, '_shared', 'tools.md');
      const content = await readFile(toolsPath, 'utf-8');
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: content 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: 'Shared tools documentation not found' 
        }],
        isError: true
      };
    }
  }
);

// Start the MCP server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Agent Loader MCP server running on stdio');
