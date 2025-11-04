/**
 * Layer 6: Tools - Agent Coordination
 * 
 * Core tools for coordinating agent tasks and dependencies
 */

import type { AgentTask } from '../types.js';
import { contextStore } from '../resources/index.js';
import { globalLogger } from '../logging/index.js';

/**
 * Create a new agent task
 */
export function createAgentTask(
  sessionId: string,
  agentName: string,
  task: string,
  input: any,
  dependencies: string[] = []
): AgentTask {
  const context = contextStore.getOrCreateSession(sessionId);

  const taskId = `task_${context.tasks.size + 1}`;
  const newTask: AgentTask = {
    id: taskId,
    agentName,
    task,
    status: 'pending',
    input,
    dependencies,
    createdAt: new Date(),
    progress: 0,
  };

  context.tasks.set(taskId, newTask);
  contextStore.updateTask(sessionId, taskId, newTask);

  globalLogger.info('Agent task created', {
    sessionId,
    taskId,
    agentName,
    task,
    dependencies
  });

  return newTask;
}

/**
 * Update task status
 */
export function updateTaskStatus(
  sessionId: string,
  taskId: string,
  status: AgentTask['status'],
  output?: any,
  progress?: number,
  error?: string
): AgentTask {
  const task = contextStore.getTask(sessionId, taskId);
  if (!task) {
    throw new Error(`Task ${taskId} not found in session ${sessionId}`);
  }

  const updates: Partial<AgentTask> = { status };
  if (output !== undefined) updates.output = output;
  if (progress !== undefined) updates.progress = progress;
  if (error !== undefined) updates.error = error;
  if (status === 'completed' || status === 'failed') {
    updates.completedAt = new Date();
  }

  contextStore.updateTask(sessionId, taskId, updates);

  globalLogger.info('Task status updated', {
    sessionId,
    taskId,
    status,
    progress,
    error
  });

  return contextStore.getTask(sessionId, taskId)!;
}

/**
 * Get tasks that are ready to execute (pending with no unmet dependencies)
 */
export function getReadyTasks(sessionId: string): AgentTask[] {
  const readyTasks = contextStore.getReadyTasks(sessionId);

  globalLogger.debug('Retrieved ready tasks', {
    sessionId,
    count: readyTasks.length,
    taskIds: readyTasks.map(t => t.id)
  });

  return readyTasks;
}

/**
 * Get all tasks for a session
 */
export function getAllTasks(sessionId: string): AgentTask[] {
  return contextStore.getAllTasks(sessionId);
}

/**
 * Get task by ID
 */
export function getTask(sessionId: string, taskId: string): AgentTask | undefined {
  return contextStore.getTask(sessionId, taskId);
}

/**
 * Check if all dependencies are met for a task
 */
export function areDependenciesMet(sessionId: string, taskId: string): boolean {
  const task = contextStore.getTask(sessionId, taskId);
  if (!task) return false;

  return task.dependencies.every(depId => {
    const depTask = contextStore.getTask(sessionId, depId);
    return depTask?.status === 'completed';
  });
}

/**
 * Get dependency chain for a task
 */
export function getDependencyChain(sessionId: string, taskId: string): string[] {
  const visited = new Set<string>();
  const chain: string[] = [];

  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const task = contextStore.getTask(sessionId, id);
    if (!task) return;

    for (const depId of task.dependencies) {
      traverse(depId);
    }

    chain.push(id);
  }

  traverse(taskId);
  return chain;
}

/**
 * Cancel a task
 */
export function cancelTask(sessionId: string, taskId: string, reason?: string): void {
  updateTaskStatus(sessionId, taskId, 'failed', undefined, undefined, reason || 'Task cancelled');
  
  globalLogger.warn('Task cancelled', {
    sessionId,
    taskId,
    reason
  });
}

/**
 * Get tasks by agent
 */
export function getTasksByAgent(sessionId: string, agentName: string): AgentTask[] {
  return contextStore.getAllTasks(sessionId).filter(task => task.agentName === agentName);
}

/**
 * Get session statistics
 */
export function getSessionStats(sessionId: string) {
  return contextStore.getSessionStats(sessionId);
}
