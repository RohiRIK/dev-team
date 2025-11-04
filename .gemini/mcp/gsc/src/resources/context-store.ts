/**
 * Layer 1: Resources - Context Store
 * 
 * Manages shared context using the Blackboard pattern
 * for multi-agent coordination
 */

import type { SharedContext, AgentTask } from '../types.js';

// In-memory store for contexts (can be extended to use Redis/DB later)
const contexts = new Map<string, SharedContext>();

export class ContextStore {
  /**
   * Get or create a session context
   */
  getOrCreateSession(sessionId: string): SharedContext {
    let context = contexts.get(sessionId);
    if (!context) {
      context = {
        sessionId,
        tasks: new Map(),
        results: new Map(),
        meta: {},
        subscriptions: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      contexts.set(sessionId, context);
    }
    return context;
  }

  /**
   * Get session context (returns undefined if not exists)
   */
  getSession(sessionId: string): SharedContext | undefined {
    return contexts.get(sessionId);
  }

  /**
   * Store arbitrary data in session context
   */
  storeData(sessionId: string, key: string, value: any): void {
    const context = this.getOrCreateSession(sessionId);
    context.results.set(key, value);
    context.updatedAt = new Date();
  }

  /**
   * Retrieve data from session context
   */
  getData(sessionId: string, key: string): any | undefined {
    const context = contexts.get(sessionId);
    return context?.results.get(key);
  }

  /**
   * Store metadata in session
   */
  storeMeta(sessionId: string, metadata: Record<string, any>): void {
    const context = this.getOrCreateSession(sessionId);
    context.meta = { ...context.meta, ...metadata };
    context.updatedAt = new Date();
  }

  /**
   * Get all metadata from session
   */
  getMeta(sessionId: string): Record<string, any> {
    const context = contexts.get(sessionId);
    return context?.meta || {};
  }

  /**
   * Add a task to the session
   */
  addTask(sessionId: string, task: AgentTask): void {
    const context = this.getOrCreateSession(sessionId);
    context.tasks.set(task.id, task);
    context.updatedAt = new Date();
  }

  /**
   * Get a specific task
   */
  getTask(sessionId: string, taskId: string): AgentTask | undefined {
    const context = contexts.get(sessionId);
    return context?.tasks.get(taskId);
  }

  /**
   * Update task status
   */
  updateTask(sessionId: string, taskId: string, updates: Partial<AgentTask>): void {
    const context = contexts.get(sessionId);
    if (!context) return;

    const task = context.tasks.get(taskId);
    if (!task) return;

    Object.assign(task, updates);
    context.updatedAt = new Date();
  }

  /**
   * Get all tasks for a session
   */
  getAllTasks(sessionId: string): AgentTask[] {
    const context = contexts.get(sessionId);
    return context ? Array.from(context.tasks.values()) : [];
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(sessionId: string, status: AgentTask['status']): AgentTask[] {
    return this.getAllTasks(sessionId).filter(task => task.status === status);
  }

  /**
   * Get ready tasks (pending with no unmet dependencies)
   */
  getReadyTasks(sessionId: string): AgentTask[] {
    const context = contexts.get(sessionId);
    if (!context) return [];

    const tasks = Array.from(context.tasks.values());
    return tasks.filter(task => {
      if (task.status !== 'pending') return false;
      
      // Check if all dependencies are completed
      return task.dependencies.every(depId => {
        const depTask = context.tasks.get(depId);
        return depTask?.status === 'completed';
      });
    });
  }

  /**
   * Subscribe an agent to topics
   */
  subscribe(sessionId: string, agentId: string, topics: string[]): void {
    const context = this.getOrCreateSession(sessionId);
    const currentTopics = context.subscriptions.get(agentId) || [];
    context.subscriptions.set(agentId, [...new Set([...currentTopics, ...topics])]);
    context.updatedAt = new Date();
  }

  /**
   * Get subscriptions for an agent
   */
  getSubscriptions(sessionId: string, agentId: string): string[] {
    const context = contexts.get(sessionId);
    return context?.subscriptions.get(agentId) || [];
  }

  /**
   * Publish event to subscribers
   */
  publish(sessionId: string, topic: string, data: any): string[] {
    const context = contexts.get(sessionId);
    if (!context) return [];

    const notifiedAgents: string[] = [];
    for (const [agentId, topics] of context.subscriptions.entries()) {
      if (topics.includes(topic)) {
        // Store notification in results
        const notificationKey = `notification:${agentId}:${topic}:${Date.now()}`;
        context.results.set(notificationKey, data);
        notifiedAgents.push(agentId);
      }
    }

    context.updatedAt = new Date();
    return notifiedAgents;
  }

  /**
   * Clear a session
   */
  clearSession(sessionId: string): void {
    contexts.delete(sessionId);
  }

  /**
   * Get all active sessions
   */
  getAllSessions(): string[] {
    return Array.from(contexts.keys());
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string): {
    totalTasks: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
    duration: number;
  } | undefined {
    const context = contexts.get(sessionId);
    if (!context) return undefined;

    const tasks = Array.from(context.tasks.values());
    const now = new Date().getTime();
    const created = context.createdAt.getTime();

    return {
      totalTasks: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
      duration: now - created,
    };
  }
}

// Export singleton instance
export const contextStore = new ContextStore();
