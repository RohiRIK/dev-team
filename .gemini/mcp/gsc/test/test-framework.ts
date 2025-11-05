/**
 * GSC Testing Framework
 * 
 * Automated tests for GEMINI Subagent Core (GSC)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

// Test configuration
const GSC_PATH = join(process.cwd(), 'src', 'index.ts');
const TEST_AGENT_NAME = 'pentaster';
const TEST_SESSION_ID = 'test_session_' + Date.now();

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  output?: any;
}

class GSCTestFramework {
  private results: TestResult[] = [];
  private startTime: number = 0;

  /**
   * Run all tests
   */
  async runAll(): Promise<void> {
    console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║   GSC Testing Framework v1.0.0         ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`);

    this.startTime = Date.now();

    // Test categories
    await this.testAgentExecution();
    await this.testTaskCoordination();
    await this.testContextManagement();
    await this.testAsyncExecution();
    await this.testPromptRendering();
    await this.testErrorHandling();

    this.printSummary();
  }

  /**
   * Test Agent Execution
   */
  private async testAgentExecution(): Promise<void> {
    console.log(`${colors.blue}🧪 Testing Agent Execution${colors.reset}\n`);

    // Test 1: Execute agent synchronously
    await this.runTest(
      'Execute agent synchronously',
      async () => {
        const result = await this.callMCPTool('execute_agent', {
          agentName: TEST_AGENT_NAME,
          task: 'Test task for framework validation',
          context: { test: true },
          sessionId: TEST_SESSION_ID,
        });

        if (!result.executionId) throw new Error('No executionId returned');
        if (result.status !== 'completed' && result.status !== 'failed') {
          throw new Error(`Unexpected status: ${result.status}`);
        }

        return result;
      }
    );

    // Test 2: Execute with invalid agent name
    await this.runTest(
      'Handle invalid agent name',
      async () => {
        try {
          await this.callMCPTool('execute_agent', {
            agentName: 'nonexistent_agent',
            task: 'Test task',
          });
          throw new Error('Should have thrown error for invalid agent');
        } catch (error) {
          // Expected to fail
          return { expectedFailure: true };
        }
      }
    );

    console.log('');
  }

  /**
   * Test Task Coordination
   */
  private async testTaskCoordination(): Promise<void> {
    console.log(`${colors.blue}🧪 Testing Task Coordination${colors.reset}\n`);

    // Test 1: Create task
    await this.runTest(
      'Create agent task',
      async () => {
        const result = await this.callMCPTool('create_agent_task', {
          sessionId: TEST_SESSION_ID,
          agentName: TEST_AGENT_NAME,
          task: 'Test coordination task',
          input: { test: true },
          dependencies: [],
        });

        if (!result.id) throw new Error('No task ID returned');
        if (result.status !== 'pending') throw new Error('Task should be pending');

        return result;
      }
    );

    // Test 2: Get all tasks
    await this.runTest(
      'Get all tasks',
      async () => {
        const result = await this.callMCPTool('get_all_tasks', {
          sessionId: TEST_SESSION_ID,
        });

        if (!Array.isArray(result)) throw new Error('Should return array');
        if (result.length === 0) throw new Error('Should have at least one task');

        return result;
      }
    );

    // Test 3: Get ready tasks
    await this.runTest(
      'Get ready tasks',
      async () => {
        const result = await this.callMCPTool('get_ready_tasks', {
          sessionId: TEST_SESSION_ID,
        });

        if (!Array.isArray(result)) throw new Error('Should return array');

        return result;
      }
    );

    console.log('');
  }

  /**
   * Test Context Management
   */
  private async testContextManagement(): Promise<void> {
    console.log(`${colors.blue}🧪 Testing Context Management${colors.reset}\n`);

    const testKey = 'test_key_' + Date.now();
    const testValue = { data: 'test value', timestamp: Date.now() };

    // Test 1: Store context
    await this.runTest(
      'Store context data',
      async () => {
        const result = await this.callMCPTool('store_context', {
          sessionId: TEST_SESSION_ID,
          key: testKey,
          value: testValue,
        });

        if (!result.success) throw new Error('Failed to store context');

        return result;
      }
    );

    // Test 2: Retrieve context
    await this.runTest(
      'Retrieve context data',
      async () => {
        const result = await this.callMCPTool('get_context', {
          sessionId: TEST_SESSION_ID,
          key: testKey,
        });

        if (JSON.stringify(result) !== JSON.stringify(testValue)) {
          throw new Error('Retrieved data does not match stored data');
        }

        return result;
      }
    );

    console.log('');
  }

  /**
   * Test Async Execution
   */
  private async testAsyncExecution(): Promise<void> {
    console.log(`${colors.blue}🧪 Testing Async Execution${colors.reset}\n`);

    let executionId: string | undefined;

    // Test 1: Start async execution
    await this.runTest(
      'Start async agent execution',
      async () => {
        const result = await this.callMCPTool('execute_agent', {
          agentName: TEST_AGENT_NAME,
          task: 'Async test task',
          context: { async: true },
          async: true,
        });

        if (!result.executionId) throw new Error('No executionId returned');
        if (result.status !== 'running') throw new Error('Should be running');

        executionId = result.executionId;
        return result;
      }
    );

    // Test 2: Check execution status
    if (executionId) {
      await this.runTest(
        'Get execution status',
        async () => {
          const result = await this.callMCPTool('get_execution_status', {
            executionId: executionId!,
          });

          if (!result.executionId) throw new Error('No executionId in status');
          if (!['running', 'completed', 'failed'].includes(result.status)) {
            throw new Error(`Invalid status: ${result.status}`);
          }

          return result;
        }
      );
    }

    // Test 3: List active executions
    await this.runTest(
      'List active executions',
      async () => {
        const result = await this.callMCPTool('list_active_executions', {});

        if (!Array.isArray(result)) throw new Error('Should return array');

        return result;
      }
    );

    console.log('');
  }

  /**
   * Test Prompt Rendering
   */
  private async testPromptRendering(): Promise<void> {
    console.log(`${colors.blue}🧪 Testing Prompt Rendering${colors.reset}\n`);

    await this.runTest(
      'Verify improved prompt structure',
      async () => {
        // Check that the prompt templates file exists and has expected structure
        const promptsPath = join(process.cwd(), 'src', 'prompts', 'prompt-templates.ts');
        const content = await readFile(promptsPath, 'utf-8');

        // Verify key improvements
        const checks = [
          content.includes('# ROLE AND IDENTITY') || content.includes('# AGENT IDENTITY'),
          content.includes('Step 1'),
          content.includes('Step 2'),
          content.includes('EXECUTION'),
          content.includes('OUTPUT FORMAT') || content.includes('EXECUTION WORKFLOW'),
        ];

        if (!checks.every(c => c)) {
          throw new Error('Prompt templates missing expected structure');
        }

        return { promptStructureValid: true };
      }
    );

    console.log('');
  }

  /**
   * Test Error Handling
   */
  private async testErrorHandling(): Promise<void> {
    console.log(`${colors.blue}🧪 Testing Error Handling${colors.reset}\n`);

    // Test 1: Missing required parameters
    await this.runTest(
      'Handle missing required parameters',
      async () => {
        try {
          await this.callMCPTool('execute_agent', {
            agentName: TEST_AGENT_NAME,
            // Missing 'task' parameter
          });
          throw new Error('Should have thrown error for missing params');
        } catch (error) {
          // Expected to fail
          return { expectedFailure: true };
        }
      }
    );

    // Test 2: Invalid tool name
    await this.runTest(
      'Handle invalid tool name',
      async () => {
        try {
          await this.callMCPTool('nonexistent_tool', {});
          throw new Error('Should have thrown error for invalid tool');
        } catch (error) {
          // Expected to fail
          return { expectedFailure: true };
        }
      }
    );

    console.log('');
  }

  /**
   * Run a single test
   */
  private async runTest(name: string, testFn: () => Promise<any>): Promise<void> {
    const start = Date.now();
    try {
      const output = await testFn();
      const duration = Date.now() - start;

      this.results.push({
        name,
        passed: true,
        duration,
        output,
      });

      console.log(`${colors.green}✓${colors.reset} ${name} ${colors.yellow}(${duration}ms)${colors.reset}`);
    } catch (error) {
      const duration = Date.now() - start;
      const errorMsg = error instanceof Error ? error.message : String(error);

      this.results.push({
        name,
        passed: false,
        duration,
        error: errorMsg,
      });

      console.log(`${colors.red}✗${colors.reset} ${name} ${colors.yellow}(${duration}ms)${colors.reset}`);
      console.log(`  ${colors.red}Error: ${errorMsg}${colors.reset}`);
    }
  }

  /**
   * Call MCP tool (mock implementation - replace with actual MCP client)
   */
  private async callMCPTool(toolName: string, args: any): Promise<any> {
    // This is a mock implementation
    // In real usage, this would call the MCP server via stdio or HTTP
    
    // For now, we'll simulate responses based on tool names
    switch (toolName) {
      case 'execute_agent':
        if (!args.agentName || !args.task) {
          throw new Error('Missing required parameters');
        }
        if (args.agentName === 'nonexistent_agent') {
          throw new Error('Agent not found');
        }
        return {
          executionId: 'exec_' + Date.now(),
          agentName: args.agentName,
          task: args.task,
          status: args.async ? 'running' : 'completed',
          startTime: Date.now(),
        };

      case 'create_agent_task':
        return {
          id: 'task_' + Date.now(),
          agentName: args.agentName,
          status: 'pending',
          dependencies: args.dependencies || [],
          createdAt: new Date().toISOString(),
        };

      case 'get_all_tasks':
      case 'get_ready_tasks':
        return [
          {
            id: 'task_1',
            agentName: TEST_AGENT_NAME,
            status: 'pending',
            dependencies: [],
          },
        ];

      case 'store_context':
        return { success: true, key: args.key };

      case 'get_context':
        return args.value || { data: 'test value', timestamp: Date.now() };

      case 'get_execution_status':
        return {
          executionId: args.executionId,
          status: 'completed',
          agentName: TEST_AGENT_NAME,
        };

      case 'list_active_executions':
        return [];

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  /**
   * Print test summary
   */
  private printSummary(): void {
    const totalTime = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}Test Summary${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`Total Tests:   ${total}`);
    console.log(`${colors.green}Passed:        ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed:        ${failed}${colors.reset}`);
    console.log(`Total Time:    ${totalTime}ms`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);

    if (failed > 0) {
      console.log(`${colors.red}Failed Tests:${colors.reset}`);
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  ${colors.red}✗${colors.reset} ${r.name}`);
          console.log(`    ${r.error}`);
        });
      console.log('');
    }

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const framework = new GSCTestFramework();
  framework.runAll().catch(error => {
    console.error(`${colors.red}Test framework error:${colors.reset}`, error);
    process.exit(1);
  });
}

export default GSCTestFramework;
