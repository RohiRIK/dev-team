/**
 * Layer 5: Elicitation - Task Analyzer
 * 
 * Analyzes tasks for complexity, dependencies, and optimal execution strategy
 */

import type { TaskAnalysis, AgentTask, TaskOutcome } from '../types.js';
import { contextStore } from '../resources/index.js';

export class TaskAnalyzer {
  /**
   * Analyze task complexity and requirements
   */
  analyzeTask(taskDescription: string, availableAgents: string[]): TaskAnalysis {
    const complexity = this.assessComplexity(taskDescription);
    const requiredAgents = this.identifyRequiredAgents(taskDescription, availableAgents);
    const estimatedSteps = this.estimateSteps(taskDescription, complexity);
    const dependencies = this.identifyDependencies(taskDescription);
    const risks = this.identifyRisks(taskDescription, complexity);

    return {
      complexity,
      requiredAgents,
      estimatedSteps,
      dependencies,
      risks
    };
  }

  /**
   * Assess task complexity
   */
  private assessComplexity(taskDescription: string): 'low' | 'medium' | 'high' {
    const indicators = {
      high: ['multiple', 'complex', 'integrate', 'coordinate', 'across', 'system'],
      medium: ['create', 'implement', 'develop', 'design', 'refactor'],
      low: ['fix', 'update', 'simple', 'small', 'quick']
    };

    const lowerDesc = taskDescription.toLowerCase();
    
    const highScore = indicators.high.filter(word => lowerDesc.includes(word)).length;
    const mediumScore = indicators.medium.filter(word => lowerDesc.includes(word)).length;
    const lowScore = indicators.low.filter(word => lowerDesc.includes(word)).length;

    // Also consider length
    const wordCount = taskDescription.split(' ').length;
    if (wordCount > 50 || highScore >= 2) return 'high';
    if (wordCount > 20 || mediumScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Identify required agents based on task description
   */
  private identifyRequiredAgents(taskDescription: string, availableAgents: string[]): string[] {
    const agentKeywords: Record<string, string[]> = {
      'architect': ['design', 'architecture', 'system', 'plan', 'structure'],
      'coder': ['code', 'implement', 'develop', 'program', 'write'],
      'tester': ['test', 'verify', 'validate', 'qa', 'quality'],
      'security': ['security', 'secure', 'vulnerability', 'auth', 'encryption'],
      'frontend': ['ui', 'interface', 'frontend', 'react', 'vue', 'angular'],
      'backend': ['api', 'backend', 'server', 'database', 'endpoint'],
      'devops': ['deploy', 'ci/cd', 'pipeline', 'docker', 'kubernetes']
    };

    const lowerDesc = taskDescription.toLowerCase();
    const required: string[] = [];

    for (const [agentType, keywords] of Object.entries(agentKeywords)) {
      const matches = keywords.filter(keyword => lowerDesc.includes(keyword)).length;
      if (matches > 0) {
        // Find matching available agent
        const matchingAgent = availableAgents.find(agent => 
          agent.toLowerCase().includes(agentType)
        );
        if (matchingAgent) {
          required.push(matchingAgent);
        }
      }
    }

    return Array.from(new Set(required));
  }

  /**
   * Estimate number of steps
   */
  private estimateSteps(taskDescription: string, complexity: 'low' | 'medium' | 'high'): number {
    const baseSteps = {
      low: 3,
      medium: 5,
      high: 8
    };

    // Adjust based on task description
    const actionWords = taskDescription.toLowerCase().match(/\b(and|then|after|before|also)\b/g);
    const additionalSteps = actionWords ? actionWords.length : 0;

    return baseSteps[complexity] + additionalSteps;
  }

  /**
   * Identify task dependencies
   */
  private identifyDependencies(taskDescription: string): string[] {
    const dependencies: string[] = [];
    const lowerDesc = taskDescription.toLowerCase();

    if (lowerDesc.includes('before') || lowerDesc.includes('first')) {
      dependencies.push('prerequisite_task');
    }

    if (lowerDesc.includes('after') || lowerDesc.includes('then')) {
      dependencies.push('prior_task_completion');
    }

    if (lowerDesc.includes('depends on') || lowerDesc.includes('requires')) {
      dependencies.push('external_dependency');
    }

    return dependencies;
  }

  /**
   * Identify potential risks
   */
  private identifyRisks(taskDescription: string, complexity: 'low' | 'medium' | 'high'): string[] {
    const risks: string[] = [];
    const lowerDesc = taskDescription.toLowerCase();

    if (complexity === 'high') {
      risks.push('High complexity may require additional time and coordination');
    }

    if (lowerDesc.includes('critical') || lowerDesc.includes('production')) {
      risks.push('Critical task requires careful validation');
    }

    if (lowerDesc.includes('database') || lowerDesc.includes('data')) {
      risks.push('Data operations require backup and rollback plan');
    }

    if (lowerDesc.includes('security') || lowerDesc.includes('auth')) {
      risks.push('Security-related changes need thorough review');
    }

    if (lowerDesc.includes('integrate') || lowerDesc.includes('external')) {
      risks.push('External integration may have compatibility issues');
    }

    return risks;
  }

  /**
   * Record task outcome for retrospective learning
   */
  recordOutcome(outcome: TaskOutcome): void {
    const context = contextStore.getOrCreateSession(outcome.sessionId);
    if (!context.meta.taskOutcomes) {
      context.meta.taskOutcomes = [];
    }
    context.meta.taskOutcomes.push(outcome);
  }

  /**
   * Get outcomes for a session
   */
  getSessionOutcomes(sessionId: string): TaskOutcome[] {
    const context = contextStore.getSession(sessionId);
    return (context?.meta?.taskOutcomes as TaskOutcome[]) || [];
  }

  /**
   * Find similar past tasks
   */
  findSimilarPastTasks(taskDescription: string, sessionId: string, limit: number = 5): TaskOutcome[] {
    const outcomes = this.getSessionOutcomes(sessionId);
    const keywords = taskDescription.toLowerCase().split(' ').filter(w => w.length > 3);

    const scored = outcomes.map(outcome => {
      const outcomeText = outcome.taskDescription.toLowerCase();
      const matches = keywords.filter(k => outcomeText.includes(k)).length;
      return { outcome, score: matches };
    });

    return scored
      .filter(s => s.outcome.success)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.outcome);
  }

  /**
   * Analyze task performance for a session
   */
  analyzePerformance(sessionId: string): {
    totalTasks: number;
    successRate: number;
    averageDuration: number;
    mostUsedAgent: string;
    commonIssues: string[];
  } {
    const outcomes = this.getSessionOutcomes(sessionId);

    if (outcomes.length === 0) {
      return {
        totalTasks: 0,
        successRate: 0,
        averageDuration: 0,
        mostUsedAgent: 'none',
        commonIssues: []
      };
    }

    const successCount = outcomes.filter(o => o.success).length;
    const successRate = successCount / outcomes.length;
    const averageDuration = outcomes.reduce((sum, o) => sum + o.durationMs, 0) / outcomes.length;

    // Find most used agent
    const agentCounts = outcomes.reduce((acc, o) => {
      acc[o.agentName] = (acc[o.agentName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedAgents = Object.entries(agentCounts).sort((a, b) => b[1] - a[1]);
    const mostUsedAgent = sortedAgents.length > 0 ? sortedAgents[0][0] : 'none';

    // Extract common issues
    const allIssues = outcomes.flatMap(o => o.issues || []);
    const issueFrequency = allIssues.reduce((acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonIssues = Object.entries(issueFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue]) => issue);

    return {
      totalTasks: outcomes.length,
      successRate,
      averageDuration,
      mostUsedAgent,
      commonIssues
    };
  }

  /**
   * Generate recommendations based on performance
   */
  generateRecommendations(sessionId: string): string[] {
    const performance = this.analyzePerformance(sessionId);
    const recommendations: string[] = [];

    if (performance.successRate < 0.8) {
      recommendations.push('Consider breaking down complex tasks into smaller subtasks');
    }

    if (performance.averageDuration > 300000) {
      recommendations.push('Look for opportunities to parallelize independent tasks');
    }

    if (performance.commonIssues.length > 0) {
      recommendations.push(`Address common issues: ${performance.commonIssues.slice(0, 2).join(', ')}`);
    }

    if (performance.totalTasks > 10 && performance.successRate > 0.9) {
      recommendations.push('Excellent performance! Consider documenting successful patterns');
    }

    return recommendations;
  }
}

// Export singleton instance
export const taskAnalyzer = new TaskAnalyzer();
