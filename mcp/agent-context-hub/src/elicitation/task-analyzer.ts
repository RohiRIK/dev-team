import type { TaskOutcome, SharedContext } from '../types.js';
import { getSessionContext, storeContext } from '../resources/context-store.js';

/**
 * Task analyzer for retrospective learning
 */

// The outcomeStore will now be managed within the SharedContext

export async function recordTaskOutcome(outcome: TaskOutcome): Promise<void> {
  const context = await getSessionContext(outcome.sessionId);
  if (!context) {
    throw new Error(`Session ${outcome.sessionId} not found for recording outcome`);
  }

  if (!context.meta.taskOutcomes) {
    context.meta.taskOutcomes = [];
  }
  context.meta.taskOutcomes.push(outcome);
  await storeContext(outcome.sessionId, context.meta); // Store the updated meta
}

export async function getSessionOutcomes(sessionId: string): Promise<TaskOutcome[]> {
  const context = await getSessionContext(sessionId);
  return (context?.meta?.taskOutcomes as TaskOutcome[]) || [];
}

export async function findSimilarPastTasks(
  taskDescription: string,
  limit: number = 5
): Promise<TaskOutcome[]> {
  const allOutcomes: TaskOutcome[] = [];

  // This part needs to iterate through all sessions to find similar tasks
  // For now, we'll simulate by getting outcomes from a single session if available
  // In a real scenario, this would query a persistent store across all sessions
  // For demonstration, we'll assume a global view or pass a list of sessionIds
  // For now, let's just use the outcomes from the current session if available
  // This is a simplification and needs a proper global outcome store or iteration over all contexts

  // To properly implement this, we would need a way to get all session IDs
  // or a global store for all TaskOutcomes. For now, this function will be limited
  // to finding similar tasks within the outcomes it can access (e.g., from a single session if called with one).
  // A more robust solution would involve a dedicated global outcome store or iterating all contexts.

  // For now, let's assume we are looking for similar tasks within the current session's outcomes
  // This is a temporary workaround until a global outcome store is implemented.
  const sessionOutcomes = await getSessionOutcomes('default-session'); // Placeholder: needs actual session management
  allOutcomes.push(...sessionOutcomes);

  // Simple keyword matching (in production use embeddings)
  const keywords = taskDescription.toLowerCase().split(' ');
  
  const scored = allOutcomes.map(outcome => {
    const outcomeText = outcome.taskDescription.toLowerCase();
    const matches = keywords.filter(k => outcomeText.includes(k)).length;
    return { outcome, score: matches };
  });

  // Sort by score and return successful ones
  return scored
    .filter(s => s.outcome.success)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.outcome);
}

export async function analyzeTaskPerformance(sessionId: string): Promise<{
  totalTasks: number;
  successRate: number;
  averageDuration: number;
  mostUsedAgent: string;
  commonIssues: string[];
}> {
  const outcomes = await getSessionOutcomes(sessionId);

  if (outcomes.length === 0) {
    return {
      totalTasks: 0,
      successRate: 0,
      averageDuration: 0,
      mostUsedAgent: 'none',
      commonIssues: [],
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
    commonIssues,
  };
}

export async function generateRecommendations(sessionId: string): Promise<string[]> {
  const performance = await analyzeTaskPerformance(sessionId);
  const recommendations: string[] = [];

  if (performance.successRate < 0.8) {
    recommendations.push('Consider breaking down complex tasks into smaller subtasks');
  }

  if (performance.averageDuration > 300000) { // 5 minutes
    recommendations.push('Look for opportunities to parallelize independent tasks');
  }

  if (performance.commonIssues.length > 0) {
    recommendations.push(`Address common issues: ${performance.commonIssues.slice(0, 2).join(', ')}`);
  }

  return recommendations;
}
