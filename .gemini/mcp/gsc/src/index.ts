#!/usr/bin/env node
/**
 * GEMINI Subagent Core (GSC) - Main Entry Point
 * 
 * Unified MCP server for managing all GEMINI sub-agents
 * with complete coordination, execution, and workflow capabilities
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

// Import all layers
import { AgentRegistry, contextStore, resourceManager } from './resources/index.js';
import { PROMPT_TEMPLATES, ORCHESTRATION_PATTERNS, renderPrompt } from './prompts/index.js';
import { samplingController, responseEvaluator } from './sampling/index.js';
import { globalLogger, AgentActivityLogger, auditTracker } from './logging/index.js';
import { taskAnalyzer, clarificationEngine, contextEnrichment } from './elicitation/index.js';
import {
  createAgentTask,
  updateTaskStatus,
  getReadyTasks,
  getAllTasks,
  getTask,
  shellExecutor,
  agentExecutor,
  apiConnector
} from './tools/index.js';
import { workflowEngine, workflowLoader, executionOrchestrator } from './workflows/index.js';

/**
 * Initialize GSC Server
 */
const server = new Server(
  {
    name: 'gsc',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: { subscribe: true },
      prompts: {},
      logging: {}
    }
  }
);

// Initialize agent registry
const agentRegistry = new AgentRegistry();

/**
 * Tool Definitions
 */
const tools = [
  // Agent Coordination Tools
  {
    name: 'create_agent_task',
    description: 'Create a new agent task with dependencies',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string', description: 'Session ID' },
        agentName: { type: 'string', description: 'Name of the agent to execute' },
        task: { type: 'string', description: 'Task description' },
        input: { type: 'object', description: 'Input data for the task' },
        dependencies: { type: 'array', items: { type: 'string' }, description: 'Task IDs this task depends on' }
      },
      required: ['sessionId', 'agentName', 'task', 'input']
    }
  },
  {
    name: 'update_task_status',
    description: 'Update the status of an agent task',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' },
        taskId: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'failed'] },
        output: { type: 'object', description: 'Task output (optional)' },
        progress: { type: 'number', description: 'Progress percentage (optional)' },
        error: { type: 'string', description: 'Error message (optional)' }
      },
      required: ['sessionId', 'taskId', 'status']
    }
  },
  {
    name: 'get_ready_tasks',
    description: 'Get tasks that are ready to execute (no unmet dependencies)',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' }
      },
      required: ['sessionId']
    }
  },
  {
    name: 'get_all_tasks',
    description: 'Get all tasks for a session',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' }
      },
      required: ['sessionId']
    }
  },
  // Context Management
  {
    name: 'store_context',
    description: 'Store data in session context',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' },
        key: { type: 'string' },
        value: { type: 'object' }
      },
      required: ['sessionId', 'key', 'value']
    }
  },
  {
    name: 'get_context',
    description: 'Retrieve data from session context',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' },
        key: { type: 'string' }
      },
      required: ['sessionId', 'key']
    }
  },
  // Agent Execution
  {
    name: 'execute_agent',
    description: 'Execute an agent with a specific task. Set async=true to run in background while you continue other work.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: { type: 'string', description: 'Name of the agent to execute' },
        task: { type: 'string', description: 'Task description for the agent' },
        context: { type: 'object', description: 'Additional context data for the task' },
        sessionId: { type: 'string', description: 'Session ID for task tracking' },
        taskId: { type: 'string', description: 'Task ID for result storage' },
        async: { type: 'boolean', description: 'If true, runs in background and returns immediately with executionId. Use get_execution_status to check progress.' }
      },
      required: ['agentName', 'task']
    }
  },
  // Shell Execution
  {
    name: 'execute_shell_command',
    description: 'Execute a shell command',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string' },
        args: { type: 'array', items: { type: 'string' } },
        cwd: { type: 'string' },
        timeout: { type: 'number' }
      },
      required: ['command', 'args']
    }
  },
  // Workflow Execution
  {
    name: 'execute_workflow',
    description: 'Execute a predefined workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        sessionId: { type: 'string' },
        variables: { type: 'object' }
      },
      required: ['workflowId', 'sessionId']
    }
  },
  {
    name: 'list_workflows',
    description: 'List all available workflows',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  // Task Analysis
  {
    name: 'analyze_task',
    description: 'Analyze task complexity and requirements',
    inputSchema: {
      type: 'object',
      properties: {
        taskDescription: { type: 'string' }
      },
      required: ['taskDescription']
    }
  },
  // Agent Execution Status
  {
    name: 'get_execution_status',
    description: 'Get the status of a background agent execution',
    inputSchema: {
      type: 'object',
      properties: {
        executionId: { type: 'string', description: 'Execution ID returned from async execute_agent call' }
      },
      required: ['executionId']
    }
  },
  {
    name: 'list_active_executions',
    description: 'List all currently running agent executions',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

/**
 * List Tools Handler
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Call Tool Handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('Tool arguments are required');
  }

  try {
    let result: any;

    switch (name) {
      // Agent Coordination
      case 'create_agent_task':
        result = createAgentTask(
          args.sessionId as string,
          args.agentName as string,
          args.task as string,
          args.input,
          (args.dependencies as string[]) || []
        );
        break;

      case 'update_task_status':
        result = updateTaskStatus(
          args.sessionId as string,
          args.taskId as string,
          args.status as any,
          args.output,
          args.progress as number,
          args.error as string
        );
        break;

      case 'get_ready_tasks':
        result = getReadyTasks(args.sessionId as string);
        break;

      case 'get_all_tasks':
        result = getAllTasks(args.sessionId as string);
        break;

      // Context Management
      case 'store_context':
        contextStore.storeData(args.sessionId as string, args.key as string, args.value);
        result = { success: true, key: args.key };
        break;

      case 'get_context':
        result = contextStore.getData(args.sessionId as string, args.key as string);
        break;

      // Agent Execution
      case 'execute_agent':
        result = await agentExecutor.execute(args as any);
        break;

      // Shell Execution
      case 'execute_shell_command':
        result = await shellExecutor.execute(args as any);
        break;

      // Workflow Execution
      case 'execute_workflow':
        result = await workflowEngine.executeWorkflow(
          args.workflowId as string,
          args.sessionId as string,
          args.variables as any
        );
        break;

      case 'list_workflows':
        result = workflowEngine.getAllWorkflows().map(w => ({
          id: w.id,
          name: w.name,
          description: w.description
        }));
        break;

      // Agent Execution Status
      case 'get_execution_status':
        result = agentExecutor.getExecutionStatus(args.executionId as string);
        if (!result) {
          throw new Error(`Execution ${args.executionId} not found`);
        }
        break;

      case 'list_active_executions':
        result = agentExecutor.getActiveExecutions();
        break;

      // Task Analysis
      case 'analyze_task':
        const availableAgents = (await agentRegistry.getAllAgents()).map(a => a.name);
        result = taskAnalyzer.analyzeTask(args.taskDescription as string, availableAgents);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    globalLogger.error(`Tool execution failed: ${name}`, { error: errorMessage });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2)
        }
      ],
      isError: true
    };
  }
});

/**
 * List Resources Handler
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const agents = await agentRegistry.getAllAgents();

  return {
    resources: [
      {
        uri: 'gsc://registry',
        name: 'Agent Registry',
        description: 'All available agents',
        mimeType: 'application/json'
      },
      ...agents.map(agent => ({
        uri: `gsc://agent/${agent.name}`,
        name: agent.name,
        description: agent.description || agent.config.description,
        mimeType: 'application/json'
      }))
    ]
  };
});

/**
 * Read Resource Handler
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'gsc://registry') {
    const agents = await agentRegistry.getAllAgents();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(agents.map(a => ({
            name: a.name,
            description: a.description,
            capabilities: a.config.capabilities
          })), null, 2)
        }
      ]
    };
  }

  if (uri.startsWith('gsc://agent/')) {
    const agentName = uri.replace('gsc://agent/', '');
    const agent = await agentRegistry.getAgent(agentName);

    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(agent, null, 2)
        }
      ]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

/**
 * List Prompts Handler
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: Object.values(PROMPT_TEMPLATES).map(template => ({
      name: template.id,
      description: template.description,
      arguments: template.variables.map(v => ({
        name: v,
        description: `Variable: ${v}`,
        required: true
      }))
    }))
  };
});

/**
 * Get Prompt Handler
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const rendered = renderPrompt(name, {
    variables: args || {}
  });

  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: rendered
        }
      }
    ]
  };
});

/**
 * Initialize and Start Server
 */
async function main() {
  // Load workflows
  await workflowLoader.registerAllWorkflows();

  // Initialize audit trail
  globalLogger.info('GSC Server initializing', {
    version: '1.0.0',
    capabilities: ['tools', 'resources', 'prompts', 'logging']
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  globalLogger.info('GSC Server running on stdio');
  console.error('🚀 GEMINI Subagent Core (GSC) v1.0.0 - Ready');
}

main().catch((error) => {
  globalLogger.error('Fatal error', { error: error.message });
  console.error('❌ GSC Server failed to start:', error);
  process.exit(1);
});
