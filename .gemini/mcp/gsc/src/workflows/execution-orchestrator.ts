/**
 * Layer 7: Workflows - Execution Orchestrator
 * 
 * Coordinates complex multi-agent workflows with parallel and conditional execution
 */

import type { WorkflowDefinition, WorkflowExecution, AgentTask } from '../types.js';
import { workflowEngine } from './workflow-engine.js';
import { createAgentTask, updateTaskStatus, getReadyTasks } from '../tools/agent-coordination.js';
import { agentExecutor } from '../tools/agent-execution.js';
import { globalLogger } from '../logging/index.js';
import { contextStore } from '../resources/index.js';

export class ExecutionOrchestrator {
  /**
   * Execute workflow with sequential strategy
   */
  async executeSequential(
    workflowId: string,
    sessionId: string,
    variables?: Record<string, any>
  ): Promise<WorkflowExecution> {
    globalLogger.info('Executing workflow sequentially', {
      workflowId,
      sessionId
    });

    return workflowEngine.executeWorkflow(workflowId, sessionId, variables);
  }

  /**
   * Execute workflow with parallel strategy
   */
  async executeParallel(
    workflowId: string,
    sessionId: string,
    variables?: Record<string, any>
  ): Promise<WorkflowExecution> {
    const workflow = workflowEngine.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    globalLogger.info('Executing workflow in parallel', {
      workflowId,
      sessionId
    });

    const execution: WorkflowExecution = {
      workflowId,
      sessionId,
      status: 'running',
      currentStep: 0,
      totalSteps: workflow.actions.length,
      results: new Map(),
      startTime: new Date()
    };

    try {
      // Group actions by dependency level
      const levels = this.groupActionsByDependencyLevel(workflow.actions);

      for (const level of levels) {
        // Execute all actions in this level in parallel
        const promises = level.map(action => 
          this.executeWorkflowAction(action, sessionId, variables, execution.results)
        );

        const results = await Promise.allSettled(promises);

        // Store results and check for failures
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const action = level[i];

          if (result.status === 'fulfilled') {
            execution.results.set(action.id, result.value);
          } else {
            execution.results.set(action.id, { error: result.reason });
            execution.status = 'failed';
            execution.endTime = new Date();
            return execution;
          }
        }

        execution.currentStep += level.length;
      }

      execution.status = 'completed';
      execution.endTime = new Date();

      globalLogger.info('Parallel workflow execution completed', {
        workflowId,
        sessionId,
        duration: execution.endTime.getTime() - execution.startTime.getTime()
      });

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();

      globalLogger.error('Parallel workflow execution failed', {
        workflowId,
        sessionId,
        error: error instanceof Error ? error.message : String(error)
      });

      return execution;
    }
  }

  /**
   * Execute workflow with conditional strategy
   */
  async executeConditional(
    workflowId: string,
    sessionId: string,
    variables?: Record<string, any>,
    conditions?: Record<string, boolean>
  ): Promise<WorkflowExecution> {
    const workflow = workflowEngine.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    globalLogger.info('Executing workflow conditionally', {
      workflowId,
      sessionId,
      conditions
    });

    const execution: WorkflowExecution = {
      workflowId,
      sessionId,
      status: 'running',
      currentStep: 0,
      totalSteps: workflow.actions.length,
      results: new Map(),
      startTime: new Date()
    };

    try {
      for (const action of workflow.actions) {
        // Check if action should be executed based on conditions
        if (conditions && conditions[action.id] === false) {
          globalLogger.info('Skipping action due to condition', {
            actionId: action.id,
            workflowId
          });
          continue;
        }

        const result = await this.executeWorkflowAction(action, sessionId, variables, execution.results);
        execution.results.set(action.id, result);
        execution.currentStep++;
      }

      execution.status = 'completed';
      execution.endTime = new Date();

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();

      globalLogger.error('Conditional workflow execution failed', {
        workflowId,
        error: error instanceof Error ? error.message : String(error)
      });

      return execution;
    }
  }

  /**
   * Orchestrate multi-agent task execution
   */
  async orchestrateAgents(
    sessionId: string,
    tasks: Array<{
      agentName: string;
      task: string;
      input: any;
      dependencies?: string[];
    }>
  ): Promise<void> {
    globalLogger.info('Orchestrating multi-agent execution', {
      sessionId,
      taskCount: tasks.length
    });

    // Create all tasks
    const taskIds: string[] = [];
    for (const taskDef of tasks) {
      const task = createAgentTask(
        sessionId,
        taskDef.agentName,
        taskDef.task,
        taskDef.input,
        taskDef.dependencies || []
      );
      taskIds.push(task.id);
    }

    // Execute tasks as they become ready
    while (true) {
      const readyTasks = getReadyTasks(sessionId);
      
      if (readyTasks.length === 0) {
        // Check if all tasks are complete
        const allTasks = contextStore.getAllTasks(sessionId);
        const allComplete = allTasks.every(t => 
          t.status === 'completed' || t.status === 'failed'
        );

        if (allComplete) break;
        
        // Wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      // Execute ready tasks in parallel
      const executions = readyTasks.map(task => this.executeAgentTask(task, sessionId));
      await Promise.allSettled(executions);
    }

    globalLogger.info('Multi-agent orchestration completed', {
      sessionId,
      taskCount: tasks.length
    });
  }

  /**
   * Execute an agent task
   */
  private async executeAgentTask(task: AgentTask, sessionId: string): Promise<void> {
    updateTaskStatus(sessionId, task.id, 'in_progress');

    try {
      const result = await agentExecutor.execute({
        agentName: task.agentName,
        task: task.task,
        context: task.input,
        sessionId,
        taskId: task.id
      });

      if (result.status === 'completed') {
        updateTaskStatus(sessionId, task.id, 'completed', result.result, 100);
      } else {
        updateTaskStatus(sessionId, task.id, 'failed', undefined, undefined, result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      updateTaskStatus(sessionId, task.id, 'failed', undefined, undefined, errorMessage);
    }
  }

  /**
   * Execute a single workflow action
   */
  private async executeWorkflowAction(
    action: any,
    sessionId: string,
    variables?: Record<string, any>,
    previousResults?: Map<string, any>
  ): Promise<any> {
    // This would delegate to the workflow engine's action executor
    // For now, return a simple result
    return {
      actionId: action.id,
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Group actions by dependency level for parallel execution
   */
  private groupActionsByDependencyLevel(actions: any[]): any[][] {
    const levels: any[][] = [];
    const processed = new Set<string>();

    while (processed.size < actions.length) {
      const currentLevel = actions.filter(action => {
        if (processed.has(action.id)) return false;
        
        if (!action.dependencies || action.dependencies.length === 0) return true;
        
        return action.dependencies.every((depId: string) => processed.has(depId));
      });

      if (currentLevel.length === 0) {
        throw new Error('Circular dependency or unsatisfiable dependencies detected');
      }

      levels.push(currentLevel);
      currentLevel.forEach(action => processed.add(action.id));
    }

    return levels;
  }
}

// Export singleton instance
export const executionOrchestrator = new ExecutionOrchestrator();
