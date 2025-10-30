/**
 * Task elicitation - extracting necessary details from user input
 */

export interface ElicitedTaskDetails {
  mainGoal: string;
  complexity: 'simple' | 'moderate' | 'complex';
  subtasks: string[];
  requiredAgents: string[];
  estimatedDuration?: string;
  dependencies?: Record<string, string[]>;
}

export function elicitTaskDetails(userInput: string): ElicitedTaskDetails {
  const complexity = determineComplexity(userInput);
  const requiredAgents = identifyRequiredAgents(userInput);
  const subtasks = extractSubtasks(userInput, complexity);

  return {
    mainGoal: userInput,
    complexity,
    subtasks,
    requiredAgents,
    estimatedDuration: estimateDuration(complexity, subtasks.length),
  };
}

function determineComplexity(task: string): 'simple' | 'moderate' | 'complex' {
  const words = task.split(' ').length;
  const hasMultipleRequirements = /and|with|including|also/gi.test(task);
  const hasComplexTerms = /architecture|infrastructure|system|integration/gi.test(task);

  if (words < 10 && !hasMultipleRequirements) return 'simple';
  if (words < 30 && !hasComplexTerms) return 'moderate';
  return 'complex';
}

function identifyRequiredAgents(task: string): string[] {
  const agents: string[] = [];
  const taskLower = task.toLowerCase();

  // Architecture keywords
  if (/design|architect|structure|api|database|schema/i.test(taskLower)) {
    agents.push('architect_agent');
  }

  // Code keywords
  if (/code|implement|build|develop|create|program/i.test(taskLower)) {
    agents.push('coder_agent');
  }

  // Testing keywords
  if (/test|validate|verify|qa|quality/i.test(taskLower)) {
    agents.push('tester_agent');
  }

  // Documentation keywords
  if (/document|readme|explain|guide|tutorial/i.test(taskLower)) {
    agents.push('docs_agent');
  }

  return agents.length > 0 ? agents : ['buddy'];
}

function extractSubtasks(task: string, complexity: 'simple' | 'moderate' | 'complex'): string[] {
  // Simple heuristic - in production this would use NLP
  const subtasks: string[] = [];

  if (complexity === 'simple') {
    subtasks.push(task);
  } else if (complexity === 'moderate') {
    subtasks.push(`Analyze requirements: ${task}`);
    subtasks.push(`Execute task: ${task}`);
  } else {
    subtasks.push(`Plan approach for: ${task}`);
    subtasks.push(`Design solution for: ${task}`);
    subtasks.push(`Implement: ${task}`);
    subtasks.push(`Validate and test: ${task}`);
  }

  return subtasks;
}

function estimateDuration(complexity: 'simple' | 'moderate' | 'complex', subtaskCount: number): string {
  const baseMinutes = { simple: 2, moderate: 5, complex: 10 };
  const estimated = baseMinutes[complexity] * subtaskCount;
  return `~${estimated} minutes`;
}
