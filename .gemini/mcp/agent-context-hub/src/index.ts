import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initLogger } from './logging/index.js';
import { registerResources } from './resources/index.js';
import { registerPrompts } from './prompts/index.js';
import { registerTools } from './tools/index.js';
import { FileSystemAgentLoader } from './file-system-agent-loader.js';

// --- MCP Server Setup ---
const server = new Server(
  {
    name: 'agent-context-hub',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: { listChanged: true },
      resources: { listChanged: true, subscribe: true },
      prompts: { listChanged: true },
      logging: { listChanged: true },
    }
  }
);

// --- Initialize Logger ---
const logger = initLogger(server);

// --- Real AgentLoader ---
const agentLoader = new FileSystemAgentLoader();

// --- Server Connection ---
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
    logger.info('Agent Context Hub MCP server running on stdio');
    // --- Tool Registration ---
    registerTools(server, logger, agentLoader);
    // --- Resource Registration ---
    registerResources(server, logger, agentLoader);
    // --- Prompt Registration ---
    registerPrompts(server, logger, agentLoader);
}).catch(error => {
    logger.error('Server connection failed', { error: error.message });
    process.exit(1);
});