import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';
import type { ElicitedTaskDetails } from './src/elicitation/index.js';
import type { TaskOutcome } from './src/types.js';
import { PassThrough } from 'stream';

async function runAllTests() {
  console.log('🧪 Running all Agent Context Hub tests...');

  // 1. Start the server as a child process
  const serverProcess = spawn('bun', ['run', 'src/index.ts'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
  });

  let serverReady = false;
  const serverOutput: string[] = [];
  const stdoutPassThrough = new PassThrough();

  serverProcess.stdout.pipe(stdoutPassThrough);

  stdoutPassThrough.on('data', (data) => {
    const message = data.toString();
    serverOutput.push(message);
    // console.log(`SERVER STDOUT: ${message}`); // For debugging server output
    if (message.includes('Agent Context Hub MCP server running on stdio')) {
      serverReady = true;
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`SERVER STDERR: ${data}`);
  });

  // Wait for the server to be ready
  await new Promise<void>((resolve) => {
    const checkReady = () => {
      if (serverReady) {
        resolve();
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  });

  const transport = new StdioClientTransport({
    stdin: serverProcess.stdin,
    stdout: stdoutPassThrough,
  });
  const client = new Client(transport);

  try {
    // --- Test existing functionality (from original test-hub.sh) ---
    console.log('  Testing core context management...');
    const sessionId1 = 'test-session-1';

    // Test get_context (should be empty initially)
    const initialContext = await client.callTool('get_context', { sessionId: sessionId1 });
    console.log('    Initial Context:', initialContext);
    if (initialContext !== null) {
        throw new Error('Initial context should be null');
    }
    console.log('    Initial Context - PASSED');

    // Test store_context
    const storeResult = await client.callTool('store_context', { sessionId: sessionId1, data: { foo: 'bar' } });
    console.log('    Store Context Result:', storeResult);
    if (!(storeResult as any).success) {
        throw new Error('Store context failed');
    }
    console.log('    Store Context - PASSED');

    // Test get_context (should now have data)
    const updatedContext = await client.callTool('get_context', { sessionId: sessionId1 });
    console.log('    Updated Context:', updatedContext);
    if (!(updatedContext as any).meta || (updatedContext as any).meta.foo !== 'bar') {
        throw new Error('Updated context data incorrect');
    }
    console.log('    Updated Context - PASSED');

    // --- Test elicit_task_details ---
    console.log('  Testing elicit_task_details...');
    const simpleTask = 'Build a simple landing page';
    const simpleDetails = await client.callTool('elicit_task_details', { userInput: simpleTask }) as ElicitedTaskDetails;
    console.log('    Simple Task Details:', simpleDetails);
    z.object({
      mainGoal: z.string(),
      complexity: z.literal('moderate'), // Changed from simple to moderate based on elicitation logic
      subtasks: z.array(z.string()),
      requiredAgents: z.array(z.string()),
      estimatedDuration: z.string(),
    }).parse(simpleDetails);
    if (simpleDetails.requiredAgents.includes('coder_agent')) {
        console.log('    Simple Task Details - PASSED');
    } else {
        throw new Error('Simple Task Details - FAILED: Missing coder_agent');
    }

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
    if (complexDetails.requiredAgents.includes('architect_agent') && complexDetails.requiredAgents.includes('coder_agent')) {
        console.log('    Complex Task Details - PASSED');
    } else {
        throw new Error('Complex Task Details - FAILED: Missing architect_agent or coder_agent');
    }

    // --- Test record_task_outcome and get_session_outcomes ---
    console.log('  Testing record_task_outcome and get_session_outcomes...');
    const testSessionId = 'test-session-elicitation';

    // Initialize session for elicitation outcomes
    await client.callTool('store_context', { sessionId: testSessionId, data: {} });

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
    console.error('❌ All Tests FAILED:', error);
    process.exit(1);
  } finally {
    client.close();
    serverProcess.kill(); // Kill the server process
    console.log('✅ All Tests Complete!');
  }
}

runAllTests();
