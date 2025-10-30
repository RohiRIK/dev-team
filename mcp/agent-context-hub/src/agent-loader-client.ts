import { McpClient } from '@modelcontextprotocol/sdk/client/index.js';
import { AgentLoader } from '../agent-loader.js'; // Assuming this path and export for the interface
import { LoadedAgent } from '../types.js'; // Assuming this path and export for the interface

export class AgentLoaderClient implements AgentLoader {
  private client: McpClient;

  constructor(agentLoaderServerUrl: string) {
    this.client = new McpClient(agentLoaderServerUrl);
  }

  async getAllAgents(): Promise<LoadedAgent[]> {
    const response = await this.client.callTool('list_available_agents', {});
    // Assuming the response content is a JSON string with an 'agents' array
    const agentsData = JSON.parse(response.content[0].text);
    // This part needs to be refined based on the actual structure returned by list_available_agents
    // and how LoadedAgent is constructed. For now, a simplified mapping.
    return agentsData.agents.map((agentName: string) => ({
      name: agentName,
      description: '', // Placeholder
      config: { name: agentName, version: '1.0' }, // Placeholder
      systemPrompt: '', // Placeholder
      knowledge: new Map(), // Placeholder
      tools: [], // Placeholder
      mcpConfig: {}, // Placeholder
      path: `/agents/${agentName}`, // Placeholder
    }));
  }

  async getAgent(name: string): Promise<LoadedAgent | undefined> {
    try {
      const configResponse = await this.client.callTool('load_agent_config', { agent_name: name });
      const config = JSON.parse(configResponse.content[0].text);

      const contextResponse = await this.client.callTool('load_agent_context', { agent_name: name });
      const systemPrompt = contextResponse.content[0].text;

      // This is a simplified version. A real implementation would also load knowledge files and tools.
      return {
        name: name,
        description: config.description || '',
        config: config,
        systemPrompt: systemPrompt,
        knowledge: new Map(), // TODO: Load real knowledge
        tools: [], // TODO: Load real tools
        mcpConfig: {}, // TODO: Load real MCP config
        path: `/agents/${name}`,
      };
    } catch (error) {
      console.error(`Error loading agent ${name}:`, error);
      return undefined;
    }
  }
}
