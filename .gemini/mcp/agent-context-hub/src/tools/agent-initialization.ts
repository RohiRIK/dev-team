import type { AgentLoader } from '../agent-loader.js';
import type { LoadedAgent } from '../types.js';

export interface InitializeAgentParams {
  sessionId: string;
  agentName: string;
  clearPreviousContext?: boolean;
}

export interface InitializeAgentResult {
  agentContext: {
    name: string;
    role?: string;
    capabilities?: string[];
    tools: string[];
    mcpServers: Record<string, any>;
    knowledgeFiles: string[];
    systemPrompt: string;
  };
  ready: boolean;
  message: string;
}

export async function initializeAgent(
  params: InitializeAgentParams,
  agentLoader: AgentLoader
): Promise<InitializeAgentResult> {
  const { sessionId, agentName, clearPreviousContext = true } = params;

  // Load complete agent context (config, prompts, knowledge, tools)
  const loadedAgent: LoadedAgent | undefined = agentLoader.getAgent(agentName);

  if (!loadedAgent) {
    throw new Error(`Agent '${agentName}' not found in agent registry`);
  }

  // Clear previous context if requested
  if (clearPreviousContext) {
    console.log(
      `Initializing fresh context for ${agentName} in session ${sessionId}`
    );
  }

  // Convert knowledge Map to array of file paths
  const knowledgeFiles = Array.from(loadedAgent.knowledge.keys());

  return {
    agentContext: {
      name: loadedAgent.name,
      role: loadedAgent.config.role,
      capabilities: loadedAgent.config.capabilities,
      tools: loadedAgent.tools,
      mcpServers: loadedAgent.mcpConfig,
      knowledgeFiles,
      systemPrompt: loadedAgent.systemPrompt,
    },
    ready: true,
    message: `Agent '${agentName}' initialized and ready for execution`,
  };
}
