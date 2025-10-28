import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  SubscribeRequestSchema,
  UnsubscribeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { AgentLoader } from '../agent-loader.js';
import { LoadedAgent } from '../types.js';
import { getSessionContext, getTaskQueue, getAgentRegistry } from './context-store.js';

export async function registerResources(server: Server, logger: any, agentLoader: AgentLoader) {
  
  // List all available resources (MCP Primitive)
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const agents = agentLoader.getAllAgents();
    const resources = [
      {
        uri: 'agent://registry',
        name: 'Agent Registry',
        description: 'List of all available agents with their capabilities',
        mimeType: 'application/json',
      },
      {
        uri: 'context://session/{sessionId}',
        name: 'Session Context',
        description: 'Shared context and metadata for a specific session',
        mimeType: 'application/json',
      },
      {
        uri: 'queue://tasks/{sessionId}',
        name: 'Task Queue',
        description: 'All tasks in a session with their current status',
        mimeType: 'application/json',
      },
    ];

    // Add resources for each loaded agent
    for (const agent of agents) {
      resources.push({
        uri: `agent://${agent.name}`,
        name: `${agent.config.name} Configuration`,
        description: agent.config.description,
        mimeType: 'application/json',
      });

      // Add knowledge file resources
      for (const [fileName] of agent.knowledge.entries()) {
        resources.push({
          uri: `agent://${agent.name}/knowledge/${fileName}`,
          name: `${agent.name} - ${fileName}`,
          description: `Knowledge file for ${agent.name}`,
          mimeType: 'text/plain',
        });
      }
    }

    return { resources };
  });

  // Read resource content (MCP Primitive)
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    // Agent registry
    if (uri === 'agent://registry') {
      const registry = getAgentRegistry(agentLoader);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(registry, null, 2),
          },
        ],
      };
    }

    // Specific agent configuration
    if (uri.startsWith('agent://')) {
      const parts = uri.replace('agent://', '').split('/');
      const agentName = parts[0];
      const agent = agentLoader.getAgent(agentName);

      if (!agent) throw new Error(`Agent ${agentName} not found`);

      // Full agent info
      if (parts.length === 1) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  name: agent.name,
                  config: agent.config,
                  systemPrompt: agent.systemPrompt,
                  tools: agent.tools,
                  knowledgeFiles: Array.from(agent.knowledge.keys()),
                  mcpServers: Object.keys(agent.mcpConfig),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Knowledge file
      if (parts[1] === 'knowledge' && parts[2]) {
        const fileName = parts[2];
        const content = agent.knowledge.get(fileName);

        if (!content) {
          throw new Error(`Knowledge file ${fileName} not found for agent ${agentName}`);
        }

        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: content,
            },
          ],
        };
      }
    }

    // Session context
    if (uri.startsWith('context://session/')) {
      const sessionId = uri.split('/').pop()!;
      const context = getSessionContext(sessionId);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(context, null, 2),
          },
        ],
      };
    }

    // Task queue
    if (uri.startsWith('queue://tasks/')) {
      const sessionId = uri.split('/').pop()!;
      const queue = getTaskQueue(sessionId);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(queue, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource URI: ${uri}`);
  });

  // Subscribe to resource updates
  server.setRequestHandler(SubscribeRequestSchema, async (request) => {
    const { uri } = request.params;
    logger.info('Client subscribed to resource', { uri });
    return {};
  });

  // Unsubscribe from resource updates
  server.setRequestHandler(UnsubscribeRequestSchema, async (request) => {
    const { uri } = request.params;
    logger.info('Client unsubscribed from resource', { uri });
    return {};
  });

  logger.info('Resources registered');
}
