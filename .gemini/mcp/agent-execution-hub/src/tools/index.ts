import { z } from 'zod';
import type {
  AgentConfig,
  ExecutionRequest,
  ExecutionResult,
  LoadedAgent,
  GeminiRequest,
  GeminiResponse,
  ToolCallResult
} from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';

// In-memory execution tracking
const activeExecutions = new Map<string, ExecutionResult>();

/**
 * Load agent configuration from .gemini/agents directory
 */
async function loadAgentConfig(agentName: string): Promise<LoadedAgent> {
  // Try to get agents directory from environment, otherwise calculate from current working directory
  const agentsDir = process.env.AGENTS_DIR || path.join(process.cwd(), '../../../.gemini/agents');
  const agentDir = path.join(agentsDir, agentName);
  
  console.error(`Loading agent from: ${agentDir}`);
  
  // Load agent.json
  const agentJsonPath = path.join(agentDir, 'agent.json');
  const agentJsonContent = await fs.readFile(agentJsonPath, 'utf-8');
  const agentJson = JSON.parse(agentJsonContent);
  
  // Load agent.md (system prompt)
  const agentMdPath = path.join(agentDir, 'agent.md');
  const agentMdContent = await fs.readFile(agentMdPath, 'utf-8');
  
  // Load knowledge files
  let knowledgeContent = '';
  if (agentJson.knowledgeFiles && agentJson.knowledgeFiles.length > 0) {
    for (const kfPath of agentJson.knowledgeFiles) {
      const fullPath = path.join(agentDir, kfPath);
      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        knowledgeContent += `\n\n## ${kfPath}\n${content}`;
      } catch (error) {
        console.error(`Failed to load knowledge file ${kfPath}:`, error);
      }
    }
  }
  
  const config: AgentConfig = {
    name: agentJson.name,
    role: agentJson.role,
    systemPrompt: agentMdContent,
    capabilities: agentJson.capabilities || [],
    tools: agentJson.tools || [],
    mcpServers: agentJson.mcpServers || [],
    knowledgeFiles: agentJson.knowledgeFiles || []
  };
  
  return {
    config,
    geminiConfig: agentJson.geminiConfig || {},
    knowledgeContent
  };
}

/**
 * Execute an agent with specified task
 * Returns the agent context for Buddy to execute via agent-loader
 */
export async function executeAgent(request: ExecutionRequest): Promise<ExecutionResult> {
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  const execution: ExecutionResult = {
    executionId,
    agentName: request.agentName,
    task: request.task,
    status: 'running',
    startTime
  };
  
  activeExecutions.set(executionId, execution);
  
  try {
    // Load agent configuration
    const loadedAgent = await loadAgentConfig(request.agentName);
    
    // Mark as completed - Buddy will execute via agent-loader
    execution.status = 'completed';
    execution.endTime = Date.now();
    execution.result = {
      message: `Agent ${request.agentName} loaded and ready for execution`,
      agentContext: loadedAgent,
      task: request.task,
      context: request.context,
      instruction: `Use agent-loader MCP to load agent '${request.agentName}' and execute the task: ${request.task}`
    };
    
    // If coordinated with context hub, store result
    if (request.mcpContext?.coordinationHub && request.mcpContext?.taskId) {
      console.log('Agent ready for coordinated execution:', {
        taskId: request.mcpContext.taskId,
        agentName: request.agentName
      });
    }
    
    return execution;
  } catch (error) {
    execution.status = 'failed';
    execution.endTime = Date.now();
    execution.error = error instanceof Error ? error.message : String(error);
    return execution;
  }
}

/**
 * Get execution status
 */
export function getExecutionStatus(executionId: string): ExecutionResult | undefined {
  return activeExecutions.get(executionId);
}

/**
 * Cancel running execution
 */
export function cancelExecution(executionId: string): boolean {
  const execution = activeExecutions.get(executionId);
  if (execution && execution.status === 'running') {
    execution.status = 'cancelled';
    execution.endTime = Date.now();
    return true;
  }
  return false;
}

/**
 * List active executions
 */
export function listActiveExecutions(): ExecutionResult[] {
  return Array.from(activeExecutions.values()).filter(e => e.status === 'running');
}

/**
 * Register all execution tools
 */
export function registerTools() {
  return [
    {
      name: 'execute_agent',
      description: 'Prepare an agent for execution by loading its configuration (system prompt, knowledge, tools). Returns agent context that Buddy should use with agent-loader MCP to actually execute the agent. This prepares the agent but does NOT call Gemini API directly.',
      inputSchema: {
        type: 'object',
        properties: {
          agentName: {
            type: 'string',
            description: 'Name of the agent to execute (e.g., github-manager, security-scanner)'
          },
          task: {
            type: 'string',
            description: 'The task or question for the agent to process'
          },
          context: {
            type: 'object',
            description: 'Additional context to provide to the agent',
            additionalProperties: true
          },
          mcpContext: {
            type: 'object',
            description: 'MCP coordination context for integration with Agent Context Hub',
            properties: {
              taskId: {
                type: 'string',
                description: 'Task ID from Agent Context Hub'
              },
              coordinationHub: {
                type: 'string',
                description: 'URL of Agent Context Hub for result storage'
              }
            }
          }
        },
        required: ['agentName', 'task']
      }
    },
    {
      name: 'get_agent_config',
      description: 'Load and return agent configuration including system prompt, capabilities, tools, MCP servers, and knowledge files. Useful for inspecting agent configuration before execution.',
      inputSchema: {
        type: 'object',
        properties: {
          agentName: {
            type: 'string',
            description: 'Name of the agent to load configuration for'
          }
        },
        required: ['agentName']
      }
    },
    {
      name: 'get_execution_status',
      description: 'Get the status of a running or completed execution. Returns execution details including status, result, error (if any), start/end times, and tokens used.',
      inputSchema: {
        type: 'object',
        properties: {
          executionId: {
            type: 'string',
            description: 'The execution ID returned from execute_agent'
          }
        },
        required: ['executionId']
      }
    },
    {
      name: 'cancel_execution',
      description: 'Cancel a running execution. Returns true if execution was successfully cancelled, false if execution was not found or already completed.',
      inputSchema: {
        type: 'object',
        properties: {
          executionId: {
            type: 'string',
            description: 'The execution ID to cancel'
          }
        },
        required: ['executionId']
      }
    },
    {
      name: 'list_active_executions',
      description: 'List all currently running executions. Returns array of execution details for monitoring active agent tasks.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  ];
}

/**
 * Handle tool calls
 */
export async function handleToolCall(toolName: string, args: any): Promise<any> {
  switch (toolName) {
    case 'execute_agent':
      return await executeAgent(args as ExecutionRequest);
      
    case 'get_agent_config':
      return await loadAgentConfig(args.agentName);
      
    case 'get_execution_status':
      const status = getExecutionStatus(args.executionId);
      if (!status) {
        throw new Error(`Execution ${args.executionId} not found`);
      }
      return status;
      
    case 'cancel_execution':
      return { cancelled: cancelExecution(args.executionId) };
      
    case 'list_active_executions':
      return { executions: listActiveExecutions() };
      
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
