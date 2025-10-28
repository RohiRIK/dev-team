/**
 * Agent Execution Hub Types
 */

export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  capabilities: string[];
  tools: string[];
  mcpServers: string[];
  knowledgeFiles: string[];
}

export interface ExecutionRequest {
  agentName: string;
  task: string;
  context?: Record<string, any>;
  mcpContext?: {
    taskId?: string;
    coordinationHub?: string;
  };
}

export interface ExecutionResult {
  executionId: string;
  agentName: string;
  task: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  result?: any;
  error?: string;
  startTime: number;
  endTime?: number;
  tokensUsed?: number;
}

export interface ToolCall {
  toolName: string;
  mcpServer: string;
  arguments: Record<string, any>;
}

export interface ToolCallResult {
  success: boolean;
  result?: any;
  error?: string;
}

export interface AgentLoader {
  loadAgent(agentName: string): Promise<LoadedAgent>;
  listAgents(): Promise<string[]>;
}

export interface LoadedAgent {
  config: AgentConfig;
  geminiConfig: any;
  knowledgeContent: string;
}

export interface GeminiRequest {
  contents: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
  tools?: any[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string;
        functionCall?: {
          name: string;
          args: Record<string, any>;
        };
      }>;
      role: string;
    };
    finishReason: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}
