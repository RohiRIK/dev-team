// Agent Task with dependency tracking
export interface AgentTask {
  id: string;
  agentName: string;
  task: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  input: any;
  output?: any;
  dependencies: string[];
  createdAt: Date;
  completedAt?: Date;
  progress: number;
  error?: string;
}

// Shared context per session (Blackboard pattern)
export interface SharedContext {
  sessionId: string;
  tasks: Map<string, AgentTask>;
  results: Map<string, any>;
  meta: Record<string, any>;
  subscriptions: Map<string, string[]>; // agentId -> topics[]
  createdAt: Date;
  updatedAt: Date;
}

// Agent configuration from agent.json
export interface AgentConfig {
  name: string;
  description: string;
  version: string;
  role?: string;
  capabilities: string[];
  requiredInputs: string[];
  outputFormat: string;
  tools?: string[];
  mcpServers?: Record<string, any>;
}

// Loaded agent with all metadata
export interface LoadedAgent {
  name: string;
  config: AgentConfig;
  systemPrompt: string;
  knowledge: Map<string, string>;
  tools: string[];
  mcpConfig: Record<string, any>;
  path: string;
}

// Task outcome for retrospective learning
export interface TaskOutcome {
  sessionId: string;
  taskId: string;
  taskDescription: string;
  agentName: string;
  approachTaken: string;
  success: boolean;
  durationMs: number;
  issues: string[];
  timestamp: Date;
}

// Agent capability definition
export interface AgentCapability {
  name: string;
  description: string;
  requiredInputs: string[];
  outputFormat: string;
  tools: string[];
}