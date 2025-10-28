import type { SamplingConfig } from './index.js';

/**
 * Agent-specific sampling profiles based on task type
 */

export const SAMPLING_PROFILES: Record<string, SamplingConfig> = {
  // Creative tasks
  creative: {
    temperature: 0.9,
    maxTokens: 4096,
    topP: 0.95,
  },

  // Analytical tasks
  analytical: {
    temperature: 0.3,
    maxTokens: 2048,
    topP: 0.85,
  },

  // Code generation
  code: {
    temperature: 0.2,
    maxTokens: 8192,
    topP: 0.9,
    stopSequences: ['```'],
  },

  // Precision tasks
  precision: {
    temperature: 0.1,
    maxTokens: 1024,
    topP: 0.8,
  },

  // Balanced
  balanced: {
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.9,
  },
};

export function selectSamplingProfile(taskType: string): SamplingConfig {
  const typeMap: Record<string, string> = {
    design: 'creative',
    architecture: 'analytical',
    coding: 'code',
    implementation: 'code',
    testing: 'precision',
    documentation: 'balanced',
    orchestration: 'balanced',
  };

  const profileKey = typeMap[taskType.toLowerCase()] || 'balanced';
  return SAMPLING_PROFILES[profileKey];
}
