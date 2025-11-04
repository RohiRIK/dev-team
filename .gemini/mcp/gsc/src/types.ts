/**
 * GEMINI MCP Framework - Core Type Definitions
 * 
 * Unified type system for all 7 layers:
 * 1. Resources
 * 2. Prompts
 * 3. Sampling
 * 4. Logging
 * 5. Elicitation
 * 6. Tools
 * 7. Workflows
 */

// ============================================================================
// Layer 1: Resources Types
// ============================================================================

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

export interface LoadedAgent {
  name: string;
  description?: string;
  config: AgentConfig;
  systemPrompt: string;
  knowledge: Map<string, string>;
  tools: string[];
  mcpConfig: Record<string, any>;
  path: string;
}

export interface ResourceManifest {
  id: string;
  type: 'repository' | 'config' | 'api' | 'dataset' | 'log';
  path: string;
  metadata: Record<string, any>;
  accessPolicy?: string;
}

// ============================================================================
// Layer 2: Prompts Types
// ============================================================================

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: 'instruction' | 'error' | 'clarification' | 'execution';
}

export interface PromptContext {
  agentName?: string;
  taskId?: string;
  sessionId?: string;
  variables: Record<string, any>;
}

// ============================================================================
// Layer 3: Sampling Types
// ============================================================================

export interface SamplingConfig {
  temperature: number;
  top_p: number;
  max_tokens: number;
  retry_limit: number;
  strategy: 'deterministic' | 'balanced' | 'creative';
}

export interface ResponseEvaluation {
  score: number;
  confidence: number;
  quality: 'high' | 'medium' | 'low';
  shouldRetry: boolean;
  feedback?: string;
}

// ============================================================================
// Layer 4: Logging Types
// ============================================================================

export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: string;
  message: string;
  agentId?: string;
  taskId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface AuditTrail {
  id: string;
  sessionId: string;
  events: LogEntry[];
  startTime: Date;
  endTime?: Date;
  summary?: string;
}

// ============================================================================
// Layer 5: Elicitation Types
// ============================================================================

export interface ElicitationContext {
  taskId: string;
  agentName: string;
  query: string;
  currentContext: Record<string, any>;
  clarificationHistory: ClarificationExchange[];
}

export interface ClarificationExchange {
  timestamp: Date;
  question: string;
  answer: string;
  refinementLevel: number;
}

export interface TaskAnalysis {
  complexity: 'low' | 'medium' | 'high';
  requiredAgents: string[];
  estimatedSteps: number;
  dependencies: string[];
  risks: string[];
}

// ============================================================================
// Layer 6: Tools Types
// ============================================================================

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema?: any;
  executor: string;
  category: 'coordination' | 'execution' | 'shell' | 'api' | 'data';
}

export interface ToolExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  duration: number;
  metadata?: Record<string, any>;
}

export interface ShellCommand {
  command: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}

// ============================================================================
// Layer 7: Workflows Types
// ============================================================================

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: WorkflowAction[];
  executionMode: 'sequential' | 'parallel' | 'conditional';
}

export interface WorkflowAction {
  id: string;
  type: 'load_context' | 'invoke_agent' | 'execute_tool' | 'log_event' | 'export_results';
  params: Record<string, any>;
  dependencies?: string[];
}

export interface WorkflowExecution {
  workflowId: string;
  sessionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  results: Map<string, any>;
  startTime: Date;
  endTime?: Date;
}

// ============================================================================
// Core Agent Task Types (from agent-context-hub)
// ============================================================================

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

export interface SharedContext {
  sessionId: string;
  tasks: Map<string, AgentTask>;
  results: Map<string, any>;
  meta: Record<string, any>;
  subscriptions: Map<string, string[]>; // agentId -> topics[]
  createdAt: Date;
  updatedAt: Date;
}

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

// ============================================================================
// MCP Framework Config
// ============================================================================

export interface MCPConfig {
  id: string;
  version: string;
  description: string;
  author: string;
  capabilities: string[];
  structure: {
    resources: any;
    prompts: any;
    sampling: SamplingConfig;
    logging: any;
    elicitation: any;
    tools: any;
    workflows: any;
  };
}

// ============================================================================
// Agent Loader Interface
// ============================================================================

export interface AgentLoader {
  getAllAgents(): Promise<LoadedAgent[]>;
  getAgent(name: string): Promise<LoadedAgent | undefined>;
}
