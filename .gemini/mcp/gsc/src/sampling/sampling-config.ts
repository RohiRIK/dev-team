/**
 * Layer 3: Sampling - Sampling Configuration
 * 
 * Controls response generation parameters and strategies
 */

import type { SamplingConfig } from '../types.js';

/**
 * Predefined sampling strategies
 */
export const SAMPLING_STRATEGIES: Record<string, SamplingConfig> = {
  deterministic: {
    temperature: 0.1,
    top_p: 0.9,
    max_tokens: 2048,
    retry_limit: 3,
    strategy: 'deterministic'
  },
  balanced: {
    temperature: 0.4,
    top_p: 0.85,
    max_tokens: 2048,
    retry_limit: 3,
    strategy: 'balanced'
  },
  creative: {
    temperature: 0.8,
    top_p: 0.95,
    max_tokens: 4096,
    retry_limit: 2,
    strategy: 'creative'
  }
};

/**
 * Sampling Controller
 */
export class SamplingController {
  private currentConfig: SamplingConfig;
  private taskConfigs: Map<string, SamplingConfig> = new Map();

  constructor(defaultStrategy: keyof typeof SAMPLING_STRATEGIES = 'balanced') {
    this.currentConfig = SAMPLING_STRATEGIES[defaultStrategy];
  }

  /**
   * Get current sampling configuration
   */
  getConfig(): SamplingConfig {
    return { ...this.currentConfig };
  }

  /**
   * Set sampling strategy by name
   */
  setStrategy(strategy: keyof typeof SAMPLING_STRATEGIES): void {
    this.currentConfig = SAMPLING_STRATEGIES[strategy];
  }

  /**
   * Set custom sampling configuration
   */
  setCustomConfig(config: Partial<SamplingConfig>): void {
    this.currentConfig = {
      ...this.currentConfig,
      ...config
    };
  }

  /**
   * Set sampling config for specific task
   */
  setTaskConfig(taskId: string, config: SamplingConfig): void {
    this.taskConfigs.set(taskId, config);
  }

  /**
   * Get sampling config for specific task (falls back to default)
   */
  getTaskConfig(taskId: string): SamplingConfig {
    return this.taskConfigs.get(taskId) || this.currentConfig;
  }

  /**
   * Adjust sampling based on task complexity
   */
  adjustForComplexity(complexity: 'low' | 'medium' | 'high'): SamplingConfig {
    const base = this.currentConfig;

    switch (complexity) {
      case 'low':
        // More deterministic for simple tasks
        return {
          ...base,
          temperature: Math.max(0.1, base.temperature - 0.2),
          top_p: Math.max(0.8, base.top_p - 0.05)
        };
      
      case 'medium':
        // Keep balanced
        return base;
      
      case 'high':
        // Allow more creativity for complex tasks
        return {
          ...base,
          temperature: Math.min(0.9, base.temperature + 0.2),
          top_p: Math.min(0.95, base.top_p + 0.05),
          max_tokens: Math.max(base.max_tokens, 4096)
        };
      
      default:
        return base;
    }
  }

  /**
   * Adjust sampling for retry attempts
   */
  adjustForRetry(attempt: number, maxAttempts: number): SamplingConfig {
    const base = this.currentConfig;
    const adjustmentFactor = attempt / maxAttempts;

    // Gradually increase temperature for retries to get different responses
    return {
      ...base,
      temperature: Math.min(0.9, base.temperature + (adjustmentFactor * 0.3)),
      top_p: Math.min(0.95, base.top_p + (adjustmentFactor * 0.1))
    };
  }

  /**
   * Get recommended config for agent type
   */
  getConfigForAgentType(agentType: string): SamplingConfig {
    const recommendations: Record<string, keyof typeof SAMPLING_STRATEGIES> = {
      'architect': 'balanced',
      'coder': 'deterministic',
      'tester': 'deterministic',
      'designer': 'creative',
      'writer': 'creative',
      'analyst': 'deterministic',
      'orchestrator': 'balanced'
    };

    const strategy = recommendations[agentType.toLowerCase()] || 'balanced';
    return SAMPLING_STRATEGIES[strategy];
  }

  /**
   * Validate sampling configuration
   */
  validateConfig(config: SamplingConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.temperature < 0 || config.temperature > 2) {
      errors.push('Temperature must be between 0 and 2');
    }

    if (config.top_p < 0 || config.top_p > 1) {
      errors.push('top_p must be between 0 and 1');
    }

    if (config.max_tokens < 1 || config.max_tokens > 100000) {
      errors.push('max_tokens must be between 1 and 100000');
    }

    if (config.retry_limit < 0 || config.retry_limit > 10) {
      errors.push('retry_limit must be between 0 and 10');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.currentConfig = SAMPLING_STRATEGIES.balanced;
    this.taskConfigs.clear();
  }
}

// Export singleton instance
export const samplingController = new SamplingController();
