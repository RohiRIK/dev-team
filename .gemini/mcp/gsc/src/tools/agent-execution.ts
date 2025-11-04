/**
 * Layer 6: Tools - Agent Execution
 * 
 * Execute agents with task coordination and result tracking
 */

import type { LoadedAgent, ToolExecutionResult } from '../types.js';
import { AgentRegistry } from '../resources/agent-registry.js';
import { globalLogger } from '../logging/index.js';
import { samplingController } from '../sampling/index.js';
import { contextStore } from '../resources/index.js';

interface ExecutionRequest {
  agentName: string;
  task: string;
  context?: Record<string, any>;
  sessionId?: string;
  taskId?: string;
  samplingStrategy?: 'deterministic' | 'balanced' | 'creative';
}

interface ExecutionResult {
  executionId: string;
  agentName: string;
  task: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: number;
  endTime?: number;
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export class AgentExecutor {
  private agentRegistry: AgentRegistry;
  private activeExecutions: Map<string, ExecutionResult> = new Map();

  constructor() {
    this.agentRegistry = new AgentRegistry();
  }

  /**
   * Execute agent in background (fire and forget)
   */
  private async executeInBackground(execution: ExecutionResult, request: ExecutionRequest): Promise<void> {
    try {
      // Load agent configuration
      const agent = await this.agentRegistry.getAgent(request.agentName);
      if (!agent) {
        throw new Error(`Agent ${request.agentName} not found`);
      }

      // Get sampling configuration
      const samplingConfig = request.samplingStrategy
        ? samplingController.getConfigForAgentType(request.agentName)
        : samplingController.getConfig();

      // Prepare execution context
      const executionContext = {
        agent,
        task: request.task,
        context: request.context || {},
        samplingConfig,
        sessionId: request.sessionId,
        taskId: request.taskId
      };

      // Execute agent
      const result = await this.executeAgentTask(executionContext);

      // Update execution result
      execution.status = 'completed';
      execution.endTime = Date.now();
      execution.result = result;

      globalLogger.info('Background agent execution completed', {
        executionId: execution.executionId,
        agentName: request.agentName,
        duration: execution.endTime - execution.startTime
      });

      // Store result in context if session is provided
      if (request.sessionId && request.taskId) {
        contextStore.storeData(request.sessionId, `task_${request.taskId}_result`, result);
      }
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = Date.now();
      execution.error = error instanceof Error ? error.message : String(error);

      globalLogger.error('Background agent execution failed', {
        executionId: execution.executionId,
        agentName: request.agentName,
        error: execution.error
      });
    }
  }

  /**
   * Execute an agent with the given task
   * @param request.async - If true, returns immediately with executionId. Use getExecutionStatus() to check progress.
   */
  async execute(request: ExecutionRequest & { async?: boolean }): Promise<ExecutionResult> {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const execution: ExecutionResult = {
      executionId,
      agentName: request.agentName,
      task: request.task,
      status: 'running',
      startTime,
      metadata: {
        sessionId: request.sessionId,
        taskId: request.taskId
      }
    };

    this.activeExecutions.set(executionId, execution);

    // If async mode, start execution in background and return immediately
    if (request.async) {
      this.executeInBackground(execution, request);
      globalLogger.info('Agent execution started in background', {
        executionId,
        agentName: request.agentName,
        task: request.task
      });
      return execution; // Return immediately with status 'running'
    }

    globalLogger.info('Agent execution started', {
      executionId,
      agentName: request.agentName,
      task: request.task,
      sessionId: request.sessionId,
      taskId: request.taskId
    });

    try {
      // Load agent configuration
      const agent = await this.agentRegistry.getAgent(request.agentName);
      if (!agent) {
        throw new Error(`Agent ${request.agentName} not found`);
      }

      // Get sampling configuration
      const samplingConfig = request.samplingStrategy
        ? samplingController.getConfigForAgentType(request.agentName)
        : samplingController.getConfig();

      // Prepare execution context
      const executionContext = {
        agent,
        task: request.task,
        context: request.context || {},
        samplingConfig,
        sessionId: request.sessionId,
        taskId: request.taskId
      };

      // Execute agent (this is where we'd call Gemini API or agent loader)
      const result = await this.executeAgentTask(executionContext);

      // Update execution result
      execution.status = 'completed';
      execution.endTime = Date.now();
      execution.result = result;

      globalLogger.info('Agent execution completed', {
        executionId,
        agentName: request.agentName,
        duration: execution.endTime - execution.startTime,
        success: true
      });

      // Store result in context if session is provided
      if (request.sessionId && request.taskId) {
        contextStore.storeData(request.sessionId, `task_${request.taskId}_result`, result);
      }

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = Date.now();
      execution.error = error instanceof Error ? error.message : String(error);

      globalLogger.error('Agent execution failed', {
        executionId,
        agentName: request.agentName,
        error: execution.error,
        duration: execution.endTime - execution.startTime
      });

      return execution;
    }
  }

  /**
   * Execute the agent task using Gemini CLI non-interactive mode
   */
  private async executeAgentTask(context: {
    agent: LoadedAgent;
    task: string;
    context: Record<string, any>;
    samplingConfig: any;
    sessionId?: string;
    taskId?: string;
  }): Promise<any> {
    // Import child_process for running Gemini CLI
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      // Build the prompt for the agent
      const agentPrompt = `
You are ${context.agent.name}.

${context.agent.systemPrompt}

Task: ${context.task}

Context: ${JSON.stringify(context.context, null, 2)}

Execute this task and provide a detailed response.
`;

      // Execute Gemini CLI in non-interactive mode with JSON output
      const command = `gemini -p ${JSON.stringify(agentPrompt)} --output-format json`;
      
      globalLogger.info('Executing agent via Gemini CLI', {
        agentName: context.agent.name,
        command: command.substring(0, 100) + '...'
      });

      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000, // 2 minute timeout
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      if (stderr) {
        globalLogger.warn('Gemini CLI stderr', { stderr });
      }

      // Parse JSON response
      const result = JSON.parse(stdout);

      return {
        agentName: context.agent.name,
        task: context.task,
        response: result,
        executionMethod: 'gemini-cli-non-interactive',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      globalLogger.error('Agent execution via Gemini CLI failed', {
        agentName: context.agent.name,
        error: error instanceof Error ? error.message : String(error)
      });

      // Fallback: return agent context for manual execution
      return {
        message: `Agent ${context.agent.name} ready for execution (CLI execution failed)`,
        error: error instanceof Error ? error.message : String(error),
        agentConfig: context.agent.config,
        systemPrompt: context.agent.systemPrompt,
        knowledge: Array.from(context.agent.knowledge.entries()),
        tools: context.agent.tools,
        task: context.task,
        context: context.context,
        samplingConfig: context.samplingConfig,
        instruction: `Execute task with agent ${context.agent.name}: ${context.task}`
      };
    }
  }

  /**
   * Get execution status
   */
  getExecutionStatus(executionId: string): ExecutionResult | undefined {
    return this.activeExecutions.get(executionId);
  }

  /**
   * Cancel execution
   */
  cancelExecution(executionId: string): boolean {
    const execution = this.activeExecutions.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'cancelled';
      execution.endTime = Date.now();

      globalLogger.warn('Agent execution cancelled', {
        executionId,
        agentName: execution.agentName
      });

      return true;
    }
    return false;
  }

  /**
   * Get all active executions
   */
  getActiveExecutions(): ExecutionResult[] {
    return Array.from(this.activeExecutions.values())
      .filter(e => e.status === 'running');
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit?: number): ExecutionResult[] {
    const history = Array.from(this.activeExecutions.values())
      .sort((a, b) => b.startTime - a.startTime);

    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Clear completed executions older than retention period
   */
  clearOldExecutions(retentionMs: number = 3600000): number {
    const now = Date.now();
    let cleared = 0;

    for (const [id, execution] of this.activeExecutions.entries()) {
      if (execution.endTime && (now - execution.endTime) > retentionMs) {
        this.activeExecutions.delete(id);
        cleared++;
      }
    }

    if (cleared > 0) {
      globalLogger.info('Cleared old executions', { count: cleared });
    }

    return cleared;
  }
}

// Export singleton instance
export const agentExecutor = new AgentExecutor();
