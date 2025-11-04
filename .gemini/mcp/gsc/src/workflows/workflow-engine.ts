/**
 * Layer 7: Workflows - Workflow Engine
 * 
 * Execute predefined workflows with step coordination and dependency management
 */

import type { WorkflowDefinition, WorkflowAction, WorkflowExecution } from '../types.js';
import { globalLogger } from '../logging/index.js';
import { contextStore } from '../resources/index.js';
import { shellExecutor } from '../tools/shell-executor.js';
import { agentExecutor } from '../tools/agent-execution.js';

export class WorkflowEngine {
  private activeWorkflows: Map<string, WorkflowExecution> = new Map();
  private workflows: Map<string, WorkflowDefinition> = new Map();

  /**
   * Register a workflow definition
   */
  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
    globalLogger.info('Workflow registered', {
      workflowId: workflow.id,
      name: workflow.name
    });
  }

  /**
   * Get a workflow definition
   */
  getWorkflow(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all registered workflows
   */
  getAllWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    sessionId: string,
    variables?: Record<string, any>
  ): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const executionId = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const execution: WorkflowExecution = {
      workflowId,
      sessionId,
      status: 'running',
      currentStep: 0,
      totalSteps: workflow.actions.length,
      results: new Map(),
      startTime: new Date()
    };

    this.activeWorkflows.set(executionId, execution);

    globalLogger.info('Workflow execution started', {
      executionId,
      workflowId,
      sessionId,
      totalSteps: execution.totalSteps
    });

    try {
      const sortedActions = this.sortActionsByDependencies(workflow.actions);

      for (let i = 0; i < sortedActions.length; i++) {
        const action = sortedActions[i];
        execution.currentStep = i + 1;

        globalLogger.info('Executing workflow action', {
          executionId,
          workflowId,
          actionId: action.id,
          actionType: action.type,
          step: i + 1,
          totalSteps: sortedActions.length
        });

        try {
          const params = this.replaceVariables(action.params, variables || {}, execution.results);
          const result = await this.executeAction(action.type, params, sessionId);
          
          execution.results.set(action.id, result);

          globalLogger.info('Workflow action completed', {
            executionId,
            actionId: action.id,
            success: true
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          globalLogger.error('Workflow action failed', {
            executionId,
            actionId: action.id,
            error: errorMessage
          });

          execution.status = 'failed';
          execution.endTime = new Date();
          execution.results.set(action.id, { error: errorMessage });
          
          return execution;
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date();

      globalLogger.info('Workflow execution completed', {
        executionId,
        workflowId,
        duration: execution.endTime.getTime() - execution.startTime.getTime()
      });

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();

      globalLogger.error('Workflow execution failed', {
        executionId,
        workflowId,
        error: error instanceof Error ? error.message : String(error)
      });

      return execution;
    }
  }

  /**
   * Execute a workflow action
   */
  private async executeAction(
    type: WorkflowAction['type'],
    params: Record<string, any>,
    sessionId: string
  ): Promise<any> {
    switch (type) {
      case 'load_context':
        return this.loadContext(params.path);

      case 'invoke_agent':
        return this.invokeAgent(params.agentName, params.task, sessionId, params.context);

      case 'execute_tool':
        return this.executeTool(params.toolName, params.toolParams);

      case 'log_event':
        return this.logEvent(params.event, params.data, sessionId);

      case 'export_results':
        return this.exportResults(params.path, params.format, sessionId);

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  /**
   * Load context from file
   */
  private async loadContext(path: string): Promise<any> {
    const result = await shellExecutor.loadContext(path);
    if (!result.success) {
      throw new Error(`Failed to load context: ${result.error}`);
    }
    return JSON.parse(result.output as string);
  }

  /**
   * Invoke an agent
   */
  private async invokeAgent(
    agentName: string,
    task: string,
    sessionId: string,
    context?: Record<string, any>
  ): Promise<any> {
    const result = await agentExecutor.execute({
      agentName,
      task,
      context,
      sessionId
    });

    if (result.status === 'failed') {
      throw new Error(`Agent execution failed: ${result.error}`);
    }

    return result.result;
  }

  /**
   * Execute a tool
   */
  private async executeTool(toolName: string, toolParams: any): Promise<any> {
    // Tool execution logic
    globalLogger.info('Tool executed in workflow', {
      toolName,
      params: toolParams
    });

    return { success: true, toolName, params: toolParams };
  }

  /**
   * Log an event
   */
  private logEvent(event: string, data: any, sessionId: string): any {
    globalLogger.info(`Workflow event: ${event}`, {
      sessionId,
      data
    });

    return { event, data, timestamp: new Date().toISOString() };
  }

  /**
   * Export results
   */
  private async exportResults(path: string, format: string, sessionId: string): Promise<any> {
    const context = contextStore.getSession(sessionId);
    const results = context ? Object.fromEntries(context.results) : {};

    globalLogger.info('Exporting workflow results', {
      sessionId,
      path,
      format
    });

    return {
      exported: true,
      path,
      format,
      resultsCount: Object.keys(results).length
    };
  }

  /**
   * Sort actions by dependencies (topological sort)
   */
  private sortActionsByDependencies(actions: WorkflowAction[]): WorkflowAction[] {
    const sorted: WorkflowAction[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (action: WorkflowAction) => {
      if (visited.has(action.id)) return;
      if (visiting.has(action.id)) {
        throw new Error(`Circular dependency detected at action ${action.id}`);
      }

      visiting.add(action.id);

      if (action.dependencies) {
        for (const depId of action.dependencies) {
          const depAction = actions.find(a => a.id === depId);
          if (depAction) {
            visit(depAction);
          }
        }
      }

      visiting.delete(action.id);
      visited.add(action.id);
      sorted.push(action);
    };

    for (const action of actions) {
      visit(action);
    }

    return sorted;
  }

  /**
   * Replace variables in parameters
   */
  private replaceVariables(
    obj: any,
    variables: Record<string, any>,
    results: Map<string, any>
  ): any {
    if (typeof obj === 'string') {
      return obj.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        // Check variables first
        if (variables[key] !== undefined) {
          return variables[key];
        }
        // Check results
        if (results.has(key)) {
          return JSON.stringify(results.get(key));
        }
        return match;
      });
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceVariables(item, variables, results));
    }

    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceVariables(value, variables, results);
      }
      return result;
    }

    return obj;
  }

  /**
   * Get workflow execution status
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.activeWorkflows.get(executionId);
  }

  /**
   * Get all active workflow executions
   */
  getActiveExecutions(): WorkflowExecution[] {
    return Array.from(this.activeWorkflows.values())
      .filter(e => e.status === 'running');
  }

  /**
   * Cancel workflow execution
   */
  cancelExecution(executionId: string): boolean {
    const execution = this.activeWorkflows.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'failed';
      execution.endTime = new Date();

      globalLogger.warn('Workflow execution cancelled', { executionId });
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const workflowEngine = new WorkflowEngine();
