/**
 * Layer 4: Logging - Agent Logger
 * 
 * Centralized logging system for all MCP operations
 */

import type { LogEntry } from '../types.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  error(message: string, metadata?: Record<string, any>): void;
}

export class MCPLogger implements Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs: number = 10000;
  private sessionId?: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId;
  }

  /**
   * Set session ID for all subsequent logs
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log('debug', 'system', message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log('info', 'system', message, metadata);
    console.error(`[INFO] ${message}`, metadata || '');
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log('warn', 'system', message, metadata);
    console.error(`[WARN] ${message}`, metadata || '');
  }

  /**
   * Log error message
   */
  error(message: string, metadata?: Record<string, any>): void {
    this.log('error', 'system', message, metadata);
    console.error(`[ERROR] ${message}`, metadata || '');
  }

  /**
   * Core logging function
   */
  private log(level: LogLevel, category: string, message: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      sessionId: this.sessionId,
      agentId: metadata?.agentId,
      taskId: metadata?.taskId,
      metadata
    };

    this.logs.push(entry);

    // Rotate logs if exceeds max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs by session
   */
  getLogsBySession(sessionId: string): LogEntry[] {
    return this.logs.filter(log => log.sessionId === sessionId);
  }

  /**
   * Get logs by agent
   */
  getLogsByAgent(agentId: string): LogEntry[] {
    return this.logs.filter(log => log.agentId === agentId);
  }

  /**
   * Get logs by task
   */
  getLogsByTask(taskId: string): LogEntry[] {
    return this.logs.filter(log => log.taskId === taskId);
  }

  /**
   * Get logs within time range
   */
  getLogsByTimeRange(start: Date, end: Date): LogEntry[] {
    return this.logs.filter(log => 
      log.timestamp >= start && log.timestamp <= end
    );
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

/**
 * Specialized logger for tracking agent activities
 */
export class AgentActivityLogger {
  private sessionId: string;
  private logger: MCPLogger;

  constructor(sessionId: string, logger: MCPLogger) {
    this.sessionId = sessionId;
    this.logger = logger;
    this.logger.setSessionId(sessionId);
  }

  logAgentStart(agentName: string, taskId: string, task: string): void {
    this.logger.info('Agent execution started', {
      event: 'agent_start',
      sessionId: this.sessionId,
      agentId: agentName,
      taskId,
      task,
      timestamp: new Date().toISOString(),
    });
  }

  logAgentProgress(agentName: string, taskId: string, progress: number): void {
    this.logger.debug('Agent progress update', {
      event: 'agent_progress',
      sessionId: this.sessionId,
      agentId: agentName,
      taskId,
      progress,
      timestamp: new Date().toISOString(),
    });
  }

  logAgentComplete(agentName: string, taskId: string, durationMs: number, success: boolean): void {
    this.logger.info('Agent execution completed', {
      event: 'agent_complete',
      sessionId: this.sessionId,
      agentId: agentName,
      taskId,
      durationMs,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  logAgentError(agentName: string, taskId: string, error: string): void {
    this.logger.error('Agent execution failed', {
      event: 'agent_error',
      sessionId: this.sessionId,
      agentId: agentName,
      taskId,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  logContextUpdate(key: string, operation: 'store' | 'retrieve'): void {
    this.logger.debug('Context operation', {
      event: 'context_update',
      sessionId: this.sessionId,
      key,
      operation,
      timestamp: new Date().toISOString(),
    });
  }

  logDependencyResolved(taskId: string, dependencyId: string): void {
    this.logger.debug('Task dependency resolved', {
      event: 'dependency_resolved',
      sessionId: this.sessionId,
      taskId,
      dependencyId,
      timestamp: new Date().toISOString(),
    });
  }

  logWorkflowStart(workflowId: string, workflowName: string): void {
    this.logger.info('Workflow execution started', {
      event: 'workflow_start',
      sessionId: this.sessionId,
      workflowId,
      workflowName,
      timestamp: new Date().toISOString(),
    });
  }

  logWorkflowStep(workflowId: string, stepId: string, stepName: string): void {
    this.logger.info('Workflow step executed', {
      event: 'workflow_step',
      sessionId: this.sessionId,
      workflowId,
      stepId,
      stepName,
      timestamp: new Date().toISOString(),
    });
  }

  logWorkflowComplete(workflowId: string, durationMs: number, success: boolean): void {
    this.logger.info('Workflow execution completed', {
      event: 'workflow_complete',
      sessionId: this.sessionId,
      workflowId,
      durationMs,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  logToolExecution(toolName: string, params: any, success: boolean): void {
    this.logger.info('Tool executed', {
      event: 'tool_execution',
      sessionId: this.sessionId,
      toolName,
      params,
      success,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const globalLogger = new MCPLogger();
