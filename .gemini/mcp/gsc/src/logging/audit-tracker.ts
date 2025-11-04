/**
 * Layer 4: Logging - Audit Tracker
 * 
 * Provides complete traceability and audit trails for all MCP operations
 */

import type { AuditTrail, LogEntry } from '../types.js';

export class AuditTracker {
  private trails: Map<string, AuditTrail> = new Map();

  /**
   * Start a new audit trail for a session
   */
  startTrail(sessionId: string): AuditTrail {
    const trail: AuditTrail = {
      id: `audit_${sessionId}_${Date.now()}`,
      sessionId,
      events: [],
      startTime: new Date()
    };

    this.trails.set(sessionId, trail);
    return trail;
  }

  /**
   * Add event to audit trail
   */
  addEvent(sessionId: string, event: LogEntry): void {
    const trail = this.trails.get(sessionId);
    if (trail) {
      trail.events.push(event);
    }
  }

  /**
   * Complete audit trail
   */
  completeTrail(sessionId: string, summary?: string): void {
    const trail = this.trails.get(sessionId);
    if (trail) {
      trail.endTime = new Date();
      trail.summary = summary || this.generateSummary(trail);
    }
  }

  /**
   * Get audit trail for session
   */
  getTrail(sessionId: string): AuditTrail | undefined {
    return this.trails.get(sessionId);
  }

  /**
   * Get all audit trails
   */
  getAllTrails(): AuditTrail[] {
    return Array.from(this.trails.values());
  }

  /**
   * Generate summary from events
   */
  private generateSummary(trail: AuditTrail): string {
    const duration = trail.endTime 
      ? trail.endTime.getTime() - trail.startTime.getTime()
      : 0;

    const eventCounts = {
      info: trail.events.filter(e => e.level === 'info').length,
      warn: trail.events.filter(e => e.level === 'warn').length,
      error: trail.events.filter(e => e.level === 'error').length,
      debug: trail.events.filter(e => e.level === 'debug').length,
    };

    return `Session ${trail.sessionId} completed in ${duration}ms with ${trail.events.length} events ` +
           `(${eventCounts.info} info, ${eventCounts.warn} warnings, ${eventCounts.error} errors)`;
  }

  /**
   * Export audit trail as JSON
   */
  exportTrail(sessionId: string): string | undefined {
    const trail = this.trails.get(sessionId);
    return trail ? JSON.stringify(trail, null, 2) : undefined;
  }

  /**
   * Get trails within time range
   */
  getTrailsByTimeRange(start: Date, end: Date): AuditTrail[] {
    return Array.from(this.trails.values()).filter(trail =>
      trail.startTime >= start && 
      (!trail.endTime || trail.endTime <= end)
    );
  }

  /**
   * Get trails with errors
   */
  getTrailsWithErrors(): AuditTrail[] {
    return Array.from(this.trails.values()).filter(trail =>
      trail.events.some(event => event.level === 'error')
    );
  }

  /**
   * Get trail statistics
   */
  getTrailStats(sessionId: string): {
    totalEvents: number;
    duration: number;
    eventsByLevel: Record<string, number>;
    agentsInvolved: string[];
    tasksExecuted: string[];
  } | undefined {
    const trail = this.trails.get(sessionId);
    if (!trail) return undefined;

    const duration = trail.endTime
      ? trail.endTime.getTime() - trail.startTime.getTime()
      : Date.now() - trail.startTime.getTime();

    const eventsByLevel = {
      debug: trail.events.filter(e => e.level === 'debug').length,
      info: trail.events.filter(e => e.level === 'info').length,
      warn: trail.events.filter(e => e.level === 'warn').length,
      error: trail.events.filter(e => e.level === 'error').length,
    };

    const agentsInvolved = Array.from(new Set(
      trail.events
        .filter(e => e.agentId)
        .map(e => e.agentId!)
    ));

    const tasksExecuted = Array.from(new Set(
      trail.events
        .filter(e => e.taskId)
        .map(e => e.taskId!)
    ));

    return {
      totalEvents: trail.events.length,
      duration,
      eventsByLevel,
      agentsInvolved,
      tasksExecuted
    };
  }

  /**
   * Clear old audit trails (older than retention period)
   */
  clearOldTrails(retentionDays: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    let clearedCount = 0;
    for (const [sessionId, trail] of this.trails.entries()) {
      if (trail.startTime < cutoffDate) {
        this.trails.delete(sessionId);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /**
   * Clear all audit trails
   */
  clearAllTrails(): void {
    this.trails.clear();
  }
}

// Export singleton instance
export const auditTracker = new AuditTracker();
