/**
 * Layer 5: Elicitation - Clarification Engine
 * 
 * Multi-turn clarification and query refinement
 */

import type { ElicitationContext, ClarificationExchange } from '../types.js';
import { renderPrompt } from '../prompts/index.js';

export class ClarificationEngine {
  private contexts: Map<string, ElicitationContext> = new Map();

  /**
   * Start a clarification session
   */
  startClarification(taskId: string, agentName: string, query: string, currentContext: Record<string, any>): ElicitationContext {
    const context: ElicitationContext = {
      taskId,
      agentName,
      query,
      currentContext,
      clarificationHistory: []
    };

    this.contexts.set(taskId, context);
    return context;
  }

  /**
   * Add a clarification exchange
   */
  addExchange(taskId: string, question: string, answer: string): void {
    const context = this.contexts.get(taskId);
    if (!context) {
      throw new Error(`No clarification context found for task ${taskId}`);
    }

    const exchange: ClarificationExchange = {
      timestamp: new Date(),
      question,
      answer,
      refinementLevel: context.clarificationHistory.length + 1
    };

    context.clarificationHistory.push(exchange);
  }

  /**
   * Get clarification context
   */
  getContext(taskId: string): ElicitationContext | undefined {
    return this.contexts.get(taskId);
  }

  /**
   * Generate clarification questions based on missing information
   */
  generateClarificationQuestions(
    taskDescription: string,
    missingInfo: string[]
  ): string[] {
    const questions: string[] = [];

    for (const info of missingInfo) {
      const question = this.formulateQuestion(info, taskDescription);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  /**
   * Formulate a clarification question
   */
  private formulateQuestion(missingInfo: string, context: string): string {
    const questionTemplates: Record<string, string> = {
      'input_format': 'What format should the input data be in?',
      'output_format': 'What format do you expect for the output?',
      'dependencies': 'Are there any dependencies or prerequisites for this task?',
      'constraints': 'Are there any constraints or limitations to consider?',
      'timeline': 'What is the expected timeline for completion?',
      'priority': 'What is the priority level of this task?',
      'validation': 'How should the results be validated?',
      'error_handling': 'How should errors or failures be handled?'
    };

    return questionTemplates[missingInfo] || `Can you provide more details about: ${missingInfo}?`;
  }

  /**
   * Analyze if enough information has been gathered
   */
  isInformationComplete(taskId: string, requiredInfo: string[]): {
    complete: boolean;
    missing: string[];
    confidence: number;
  } {
    const context = this.contexts.get(taskId);
    if (!context) {
      return {
        complete: false,
        missing: requiredInfo,
        confidence: 0
      };
    }

    const gatheredInfo = new Set<string>();
    const contextKeys = Object.keys(context.currentContext);

    // Check which required info has been gathered
    for (const info of requiredInfo) {
      if (contextKeys.some(key => key.toLowerCase().includes(info.toLowerCase()))) {
        gatheredInfo.add(info);
      }

      // Also check clarification history
      for (const exchange of context.clarificationHistory) {
        if (exchange.question.toLowerCase().includes(info.toLowerCase()) && exchange.answer) {
          gatheredInfo.add(info);
        }
      }
    }

    const missing = requiredInfo.filter(info => !gatheredInfo.has(info));
    const confidence = gatheredInfo.size / requiredInfo.length;

    return {
      complete: missing.length === 0,
      missing,
      confidence
    };
  }

  /**
   * Generate a clarification request prompt
   */
  generateClarificationPrompt(taskId: string, unclearPoints: string[]): string {
    const context = this.contexts.get(taskId);
    if (!context) {
      throw new Error(`No clarification context found for task ${taskId}`);
    }

    const questions = this.generateClarificationQuestions(context.query, unclearPoints);

    return renderPrompt('clarification_request', {
      variables: {
        taskId,
        agentName: context.agentName,
        progress: this.calculateProgress(context),
        unclearPoints: unclearPoints.join('\n- '),
        questions: questions.join('\n'),
        impact: this.assessImpact(unclearPoints)
      }
    });
  }

  /**
   * Calculate clarification progress
   */
  private calculateProgress(context: ElicitationContext): number {
    // Progress based on number of clarification rounds
    const maxRounds = 5;
    const progress = Math.min(100, (context.clarificationHistory.length / maxRounds) * 100);
    return Math.round(progress);
  }

  /**
   * Assess impact of unclear points
   */
  private assessImpact(unclearPoints: string[]): string {
    if (unclearPoints.length === 0) {
      return 'No impact - all information is clear';
    }

    const highImpactPoints = ['security', 'data', 'production', 'critical'];
    const hasHighImpact = unclearPoints.some(point =>
      highImpactPoints.some(high => point.toLowerCase().includes(high))
    );

    if (hasHighImpact) {
      return 'HIGH IMPACT - Critical information missing that could affect system integrity';
    }

    if (unclearPoints.length > 3) {
      return 'MEDIUM IMPACT - Multiple unclear points may lead to incorrect implementation';
    }

    return 'LOW IMPACT - Minor clarifications needed for optimal execution';
  }

  /**
   * Refine query based on clarification history
   */
  refineQuery(taskId: string): string {
    const context = this.contexts.get(taskId);
    if (!context) {
      return '';
    }

    let refinedQuery = context.query;

    // Append clarifications
    if (context.clarificationHistory.length > 0) {
      refinedQuery += '\n\nClarifications:\n';
      for (const exchange of context.clarificationHistory) {
        refinedQuery += `\nQ: ${exchange.question}\nA: ${exchange.answer}`;
      }
    }

    // Add context information
    if (Object.keys(context.currentContext).length > 0) {
      refinedQuery += '\n\nAdditional Context:\n';
      for (const [key, value] of Object.entries(context.currentContext)) {
        refinedQuery += `\n${key}: ${JSON.stringify(value)}`;
      }
    }

    return refinedQuery;
  }

  /**
   * Complete clarification session
   */
  completeClarification(taskId: string): string {
    const refined = this.refineQuery(taskId);
    this.contexts.delete(taskId);
    return refined;
  }

  /**
   * Get all active clarification sessions
   */
  getActiveSessions(): string[] {
    return Array.from(this.contexts.keys());
  }
}

// Export singleton instance
export const clarificationEngine = new ClarificationEngine();
