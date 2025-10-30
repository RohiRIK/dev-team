import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';
import type { ElicitedTaskDetails } from './src/elicitation/index.js';
import type { TaskOutcome } from './src/types.js';

async function runElicitationTests() {
  const transport = new StdioClientTransport();
  const client = new Client(transport);

  console.log('🧪 Testing Elicitation Tools...');

  try {
    // --- Test elicit_task_details ---
    console.log('  Testing elicit_task_details...');
    const simpleTask = 'Build a simple landing page';
    const simpleDetails = await client.callTool('elicit_task_details', { userInput: simpleTask }) as ElicitedTaskDetails;
    console.log('    Simple Task Details:', simpleDetails);
    z.object({
      mainGoal: z.string(),
      complexity: z.literal('simple'),
      subtasks: z.array(z.string()),
      requiredAgents: z.array(z.string()),
      estimatedDuration: z.string(),
    }).parse(simpleDetails);
    console.log('    Simple Task Details - PASSED');

    const complexTask = 'Design and implement a scalable microservices architecture with OAuth2 and integrate with existing legacy systems';
    const complexDetails = await client.callTool('elicit_task_details', { userInput: complexTask }) as ElicitedTaskDetails;
    console.log('    Complex Task Details:', complexDetails);
    z.object({
      mainGoal: z.string(),
      complexity: z.literal('complex'),
      subtasks: z.array(z.string()),
      requiredAgents: z.array(z.string()),
      estimatedDuration: z.string(),
    }).parse(complexDetails);
    console.log('    Complex Task Details - PASSED');

    // --- Test record_task_outcome and get_session_outcomes ---
    console.log('  Testing record_task_outcome and get_session_outcomes...');
    const testSessionId = 'test-session-elicitation';

    const outcome1: TaskOutcome = {
      sessionId: testSessionId,
      taskId: 'task-1',
      agentName: 'coder_agent',
      taskDescription: 'Implement login feature',
      success: true,
      durationMs: 120000,
      issues: [],
    };
    await client.callTool('record_task_outcome', { outcome: outcome1 });

    const outcome2: TaskOutcome = {
      sessionId: testSessionId,
      taskId: 'task-2',
      agentName: 'tester_agent',
      taskDescription: 'Write unit tests for login',
      success: false,
      durationMs: 60000,
      issues: ['Bug found in login logic'],
    };
    await client.callTool('record_task_outcome', { outcome: outcome2 });

    const outcomes = await client.callTool('get_session_outcomes', { sessionId: testSessionId }) as TaskOutcome[];
    console.log('    Session Outcomes:', outcomes);
    z.array(z.object({
      sessionId: z.string(),
      taskId: z.string(),
      agentName: z.string(),
      taskDescription: z.string(),
      success: z.boolean(),
      durationMs: z.number(),
      issues: z.array(z.string()).optional(),
    })).parse(outcomes);
    if (outcomes.length === 2 && outcomes[0].taskId === 'task-1' && outcomes[1].taskId === 'task-2') {
      console.log('    Record and Get Session Outcomes - PASSED');
    } else {
      throw new Error('Record and Get Session Outcomes - FAILED');
    }

    // --- Test analyze_task_performance ---
    console.log('  Testing analyze_task_performance...');
    const performance = await client.callTool('analyze_task_performance', { sessionId: testSessionId });
    console.log('    Task Performance:', performance);
    z.object({
      totalTasks: z.literal(2),
      successRate: z.literal(0.5),
      averageDuration: z.number(),
      mostUsedAgent: z.string(),
      commonIssues: z.array(z.string()),
    }).parse(performance);
    if (performance.mostUsedAgent === 'coder_agent' || performance.mostUsedAgent === 'tester_agent') {
        console.log('    Analyze Task Performance - PASSED');
    } else {
        throw new Error('Analyze Task Performance - FAILED: Most used agent incorrect');
    }

    // --- Test generate_recommendations ---
    console.log('  Testing generate_recommendations...');
    const recommendations = await client.callTool('generate_recommendations', { sessionId: testSessionId }) as string[];
    console.log('    Recommendations:', recommendations);
    z.array(z.string()).parse(recommendations);
    if (recommendations.length > 0) {
      console.log('    Generate Recommendations - PASSED');
    } else {
      throw new Error('Generate Recommendations - FAILED');
    }

    // --- Test find_similar_past_tasks ---
    console.log('  Testing find_similar_past_tasks...');
    const similarTasks = await client.callTool('find_similar_past_tasks', { taskDescription: 'Implement login feature', limit: 1 }) as TaskOutcome[];
    console.log('    Similar Tasks:', similarTasks);
    z.array(z.object({
      sessionId: z.string(),
      taskId: z.string(),
      agentName: z.string(),
      taskDescription: z.string(),
      success: z.boolean(),
      durationMs: z.number(),
      issues: z.array(z.string()).optional(),
    })).parse(similarTasks);
    if (similarTasks.length === 1 && similarTasks[0].taskId === 'task-1') {
      console.log('    Find Similar Past Tasks - PASSED');
    } else {
      throw new Error('Find Similar Past Tasks - FAILED');
    }

  } catch (error) {
    console.error('❌ Elicitation Tests FAILED:', error);
    process.exit(1);
  } finally {
    client.close();
    console.log('✅ Elicitation Tests Complete!');
  }
}

runElicitationTests();
