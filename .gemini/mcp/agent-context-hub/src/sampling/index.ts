/**
 * Sampling configuration for different agent types
 * 
 * Note: Sampling is handled by the MCP client (Gemini CLI),
 * but we can provide recommended settings per agent
 */

export interface SamplingConfig {
  temperature: number;
  maxTokens: number;
  topP?: number;
  stopSequences?: string[];
}

export const DEFAULT_SAMPLING: SamplingConfig = {
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.95,
};

export function getSamplingConfig(agentName: string): SamplingConfig {
  // Return agent-specific sampling configurations
  const configs: Record<string, SamplingConfig> = {
    buddy: {
      temperature: 0.7,
      maxTokens: 8192,
      topP: 0.9,
    },
    architect_agent: {
      temperature: 0.3,
      maxTokens: 4096,
      topP: 0.85,
      stopSequences: ['</architecture>'],
    },
    coder_agent: {
      temperature: 0.2,
      maxTokens: 8192,
      topP: 0.9,
      stopSequences: ['</code>'],
    },
    tester_agent: {
      temperature: 0.1,
      maxTokens: 2048,
      topP: 0.8,
    },
    docs_agent: {
      temperature: 0.5,
      maxTokens: 4096,
      topP: 0.9,
    },
  };

  return configs[agentName] || DEFAULT_SAMPLING;
}
