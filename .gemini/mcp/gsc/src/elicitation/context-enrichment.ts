/**
 * Layer 5: Elicitation - Context Enrichment
 * 
 * Enriches task context with additional knowledge and metadata
 */

import { AgentRegistry } from '../resources/agent-registry.js';
import { resourceManager } from '../resources/index.js';

export class ContextEnrichment {
  private agentRegistry: AgentRegistry;

  constructor() {
    this.agentRegistry = new AgentRegistry();
  }

  /**
   * Enrich task context with relevant agent knowledge
   */
  async enrichWithAgentKnowledge(
    taskDescription: string,
    agentName: string
  ): Promise<Record<string, any>> {
    const enrichedContext: Record<string, any> = {
      taskDescription,
      agentName,
      timestamp: new Date().toISOString()
    };

    // Load agent configuration and knowledge
    const agent = await this.agentRegistry.getAgent(agentName);
    if (agent) {
      enrichedContext.agentCapabilities = agent.config.capabilities;
      enrichedContext.agentTools = agent.tools;
      
      // Extract relevant knowledge snippets
      const relevantKnowledge = this.extractRelevantKnowledge(
        taskDescription,
        agent.knowledge
      );
      
      if (relevantKnowledge.size > 0) {
        enrichedContext.relevantKnowledge = Object.fromEntries(relevantKnowledge);
      }
    }

    return enrichedContext;
  }

  /**
   * Extract relevant knowledge based on task description
   */
  private extractRelevantKnowledge(
    taskDescription: string,
    knowledge: Map<string, string>
  ): Map<string, string> {
    const relevant = new Map<string, string>();
    const keywords = this.extractKeywords(taskDescription);

    for (const [filename, content] of knowledge.entries()) {
      const contentLower = content.toLowerCase();
      const matchCount = keywords.filter(kw => contentLower.includes(kw)).length;
      
      // Include knowledge if it has at least 2 keyword matches
      if (matchCount >= 2) {
        relevant.set(filename, content);
      }
    }

    return relevant;
  }

  /**
   * Extract keywords from task description
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
  }

  /**
   * Enrich with resource metadata
   */
  enrichWithResources(
    taskDescription: string,
    requiredResourceTypes?: string[]
  ): Record<string, any> {
    const enrichedContext: Record<string, any> = {
      availableResources: {}
    };

    const types = requiredResourceTypes || ['config', 'repository', 'api'];
    
    for (const type of types) {
      const resources = resourceManager.getResourcesByType(type as any);
      if (resources.length > 0) {
        enrichedContext.availableResources[type] = resources.map(r => ({
          id: r.id,
          path: r.path,
          description: r.metadata.description
        }));
      }
    }

    return enrichedContext;
  }

  /**
   * Enrich with historical context
   */
  enrichWithHistory(
    sessionId: string,
    relatedTaskIds: string[]
  ): Record<string, any> {
    const enrichedContext: Record<string, any> = {
      sessionId,
      relatedTasks: relatedTaskIds,
      timestamp: new Date().toISOString()
    };

    // Could add more historical context here
    // e.g., past task outcomes, patterns, etc.

    return enrichedContext;
  }

  /**
   * Enrich with execution metadata
   */
  enrichWithExecutionMetadata(
    complexity: 'low' | 'medium' | 'high',
    estimatedSteps: number,
    dependencies: string[]
  ): Record<string, any> {
    return {
      complexity,
      estimatedSteps,
      dependencies,
      estimatedDuration: this.estimateDuration(complexity, estimatedSteps),
      recommendedParallelism: complexity === 'high' && dependencies.length === 0,
      retryStrategy: this.getRetryStrategy(complexity)
    };
  }

  /**
   * Estimate duration based on complexity
   */
  private estimateDuration(complexity: 'low' | 'medium' | 'high', steps: number): string {
    const baseTime = {
      low: 30,      // 30 seconds per step
      medium: 120,  // 2 minutes per step
      high: 300     // 5 minutes per step
    };

    const totalSeconds = baseTime[complexity] * steps;
    const minutes = Math.ceil(totalSeconds / 60);

    return `~${minutes} minutes`;
  }

  /**
   * Get retry strategy based on complexity
   */
  private getRetryStrategy(complexity: 'low' | 'medium' | 'high'): {
    maxRetries: number;
    backoffMultiplier: number;
    strategy: string;
  } {
    const strategies = {
      low: {
        maxRetries: 2,
        backoffMultiplier: 1.5,
        strategy: 'immediate'
      },
      medium: {
        maxRetries: 3,
        backoffMultiplier: 2,
        strategy: 'exponential'
      },
      high: {
        maxRetries: 5,
        backoffMultiplier: 2.5,
        strategy: 'exponential_with_jitter'
      }
    };

    return strategies[complexity];
  }

  /**
   * Enrich complete context for task execution
   */
  async enrichComplete(
    taskDescription: string,
    agentName: string,
    sessionId: string,
    additionalContext?: Record<string, any>
  ): Promise<Record<string, any>> {
    const agentContext = await this.enrichWithAgentKnowledge(taskDescription, agentName);
    const resourceContext = this.enrichWithResources(taskDescription);
    const historyContext = this.enrichWithHistory(sessionId, []);

    return {
      ...agentContext,
      ...resourceContext,
      ...historyContext,
      ...additionalContext
    };
  }
}

// Export singleton instance
export const contextEnrichment = new ContextEnrichment();
