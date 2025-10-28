import type { Logger } from './index.js';

/**
 * Specialized logger for tracking agent activities
 */
export class AgentActivityLogger {
  private sessionId: string;
  private logger: Logger;

  constructor(sessionId: string, logger: Logger) {
    this.sessionId = sessionId;
    this.logger = logger;
  }

  logAgentStart(agentName: string, taskId: string, task: string) {
    this.logger.info('Agent execution started', {
      event: 'agent_start',
      sessionId: this.sessionId,
      agentName,
      taskId,
      task,
      timestamp: new Date().toISOString(),
    });
  }

  logAgentProgress(agentName: string, taskId: string, progress: number) {
    this.logger.debug('Agent progress update', {
      event: 'agent_progress',
      sessionId: this.sessionId,
      agentName,
      taskId,
      progress,
      timestamp: new Date().toISOString(),
    });
  }

  logAgentComplete(agentName: string, taskId: string, durationMs: number, success: boolean) {
    this.logger.info('Agent execution completed', {
      event: 'agent_complete',
      sessionId: this.sessionId,
      agentName,
      taskId,
      durationMs,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  logAgentError(agentName: string, taskId: string, error: string) {
    this.logger.error('Agent execution failed', {
      event: 'agent_error',
      sessionId: this.sessionId,
      agentName,
      taskId,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  logContextUpdate(key: string, operation: 'store' | 'retrieve') {
    this.logger.debug('Context operation', {
      event: 'context_update',
      sessionId: this.sessionId,
      key,
      operation,
      timestamp: new Date().toISOString(),
    });
  }

  logDependencyResolved(taskId: string, dependencyId: string) {
    this.logger.debug('Task dependency resolved', {
      event: 'dependency_resolved',
      sessionId: this.sessionId,
      taskId,
      dependencyId,
      timestamp: new Date().toISOString(),
    });
  }
}
