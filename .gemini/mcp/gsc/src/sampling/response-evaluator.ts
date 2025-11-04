/**
 * Layer 3: Sampling - Response Evaluator
 * 
 * Evaluates response quality and determines if retry is needed
 */

import type { ResponseEvaluation } from '../types.js';

export class ResponseEvaluator {
  /**
   * Evaluate response quality
   */
  evaluate(response: string, context?: {
    expectedLength?: number;
    requiredKeywords?: string[];
    taskComplexity?: 'low' | 'medium' | 'high';
  }): ResponseEvaluation {
    let score = 100;
    let confidence = 1.0;
    const issues: string[] = [];

    // Check response length
    if (response.length < 10) {
      score -= 50;
      confidence -= 0.5;
      issues.push('Response too short');
    }

    // Check for error indicators
    const errorPatterns = [
      /error:/i,
      /failed/i,
      /cannot/i,
      /unable to/i,
      /not found/i
    ];

    for (const pattern of errorPatterns) {
      if (pattern.test(response)) {
        score -= 20;
        confidence -= 0.2;
        issues.push(`Potential error detected: ${pattern}`);
      }
    }

    // Check for incomplete responses
    if (response.trim().endsWith('...') || response.includes('TODO') || response.includes('TBD')) {
      score -= 15;
      confidence -= 0.15;
      issues.push('Response appears incomplete');
    }

    // Check expected length if provided
    if (context?.expectedLength) {
      const lengthRatio = response.length / context.expectedLength;
      if (lengthRatio < 0.5) {
        score -= 25;
        confidence -= 0.25;
        issues.push('Response significantly shorter than expected');
      } else if (lengthRatio > 2) {
        score -= 10;
        confidence -= 0.1;
        issues.push('Response significantly longer than expected');
      }
    }

    // Check required keywords if provided
    if (context?.requiredKeywords) {
      const missingKeywords = context.requiredKeywords.filter(
        keyword => !response.toLowerCase().includes(keyword.toLowerCase())
      );

      if (missingKeywords.length > 0) {
        const penalty = Math.min(30, missingKeywords.length * 10);
        score -= penalty;
        confidence -= penalty / 100;
        issues.push(`Missing required keywords: ${missingKeywords.join(', ')}`);
      }
    }

    // Calculate final quality
    score = Math.max(0, Math.min(100, score));
    confidence = Math.max(0, Math.min(1, confidence));

    const quality: ResponseEvaluation['quality'] = 
      score >= 80 ? 'high' : 
      score >= 50 ? 'medium' : 
      'low';

    const shouldRetry = quality === 'low' || (quality === 'medium' && issues.length > 2);

    return {
      score,
      confidence,
      quality,
      shouldRetry,
      feedback: issues.length > 0 ? issues.join('; ') : undefined
    };
  }

  /**
   * Evaluate if response meets minimum quality threshold
   */
  meetsThreshold(response: string, minimumScore: number = 50): boolean {
    const evaluation = this.evaluate(response);
    return evaluation.score >= minimumScore;
  }

  /**
   * Evaluate multiple responses and select the best one
   */
  selectBest(responses: string[]): { response: string; index: number; evaluation: ResponseEvaluation } {
    if (responses.length === 0) {
      throw new Error('No responses to evaluate');
    }

    let bestIndex = 0;
    let bestEvaluation = this.evaluate(responses[0]);

    for (let i = 1; i < responses.length; i++) {
      const evaluation = this.evaluate(responses[i]);
      if (evaluation.score > bestEvaluation.score) {
        bestIndex = i;
        bestEvaluation = evaluation;
      }
    }

    return {
      response: responses[bestIndex],
      index: bestIndex,
      evaluation: bestEvaluation
    };
  }

  /**
   * Evaluate task completion based on output
   */
  evaluateTaskCompletion(output: any, criteria: {
    requiredFields?: string[];
    outputType?: 'string' | 'object' | 'array';
    minimumLength?: number;
  }): ResponseEvaluation {
    let score = 100;
    let confidence = 1.0;
    const issues: string[] = [];

    // Check output exists
    if (!output) {
      return {
        score: 0,
        confidence: 0,
        quality: 'low',
        shouldRetry: true,
        feedback: 'No output provided'
      };
    }

    // Check output type
    if (criteria.outputType) {
      const actualType = Array.isArray(output) ? 'array' : typeof output;
      if (actualType !== criteria.outputType) {
        score -= 30;
        confidence -= 0.3;
        issues.push(`Expected ${criteria.outputType} but got ${actualType}`);
      }
    }

    // Check required fields for objects
    if (criteria.requiredFields && typeof output === 'object') {
      const missingFields = criteria.requiredFields.filter(field => !(field in output));
      if (missingFields.length > 0) {
        const penalty = Math.min(40, missingFields.length * 15);
        score -= penalty;
        confidence -= penalty / 100;
        issues.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
    }

    // Check minimum length for strings
    if (criteria.minimumLength && typeof output === 'string') {
      if (output.length < criteria.minimumLength) {
        score -= 25;
        confidence -= 0.25;
        issues.push(`Output length ${output.length} below minimum ${criteria.minimumLength}`);
      }
    }

    score = Math.max(0, Math.min(100, score));
    confidence = Math.max(0, Math.min(1, confidence));

    const quality: ResponseEvaluation['quality'] = 
      score >= 80 ? 'high' : 
      score >= 50 ? 'medium' : 
      'low';

    return {
      score,
      confidence,
      quality,
      shouldRetry: quality === 'low',
      feedback: issues.length > 0 ? issues.join('; ') : undefined
    };
  }
}

// Export singleton instance
export const responseEvaluator = new ResponseEvaluator();
