import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { SharedContext, AgentTask } from '../types.js';
import type { AgentLoader } from '../agent-loader.js';
import { initializeAgent } from './agent-initialization.js';
import { WorkflowEngine } from '../workflows/workflow-engine.js';
import path from 'path';

// Global context store (Blackboard pattern)
const contextStore = new Map<string, SharedContext>();

export async function registerTools(server: Server, logger: any, agentLoader: AgentLoader) {
  
  // List all available tools (MCP Primitive)
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'create_agent_task',
          description: 'Creates a new agent task in the coordination system. Use this to assign work to a specific agent. You can specify dependencies on other tasks to create sequential or parallel workflows. Returns a task ID that can be used to track progress and update status.',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'Unique session ID for this workflow',
              },
              agentName: {
                type: 'string',
                description: 'Name of the agent to execute (e.g., buddy, architect_agent, coder_agent)',
              },
              task: {
                type: 'string',
                description: 'Clear description of what the agent should do',
              },
              input: {
                type: 'object',
                description: 'Input data for the agent',
              },
              dependencies: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of task IDs that must complete before this task can start',
              },
            },
            required: ['sessionId', 'agentName', 'task', 'input'],
          },
        },
        {
          name: 'update_task_status',
          description: 'Updates the status, progress, and output of an existing task. Use this to mark tasks as in_progress, completed, or failed. Can include partial results, progress percentage (0-100), and error messages. Other agents waiting on this task will be notified when it completes.',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              taskId: { type: 'string' },
              status: {
                type: 'string',
                enum: ['pending', 'in_progress', 'completed', 'failed'],
              },
              output: {
                type: 'object',
                description: 'Output data from the agent',
              },
              progress: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'Progress percentage',
              },
              error: {
                type: 'string',
                description: 'Error message if status is failed',
              },
            },
            required: ['sessionId', 'taskId', 'status'],
          },
        },
        {
          name: 'get_task_status',
          description: 'Retrieves the current status of one or all tasks in a session. Returns detailed information including status (pending/in_progress/completed/failed), progress percentage, output data, dependencies, and timing. Omit taskId to get all tasks in the session.',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              taskId: {
                type: 'string',
                description: 'Optional specific task ID. If not provided, returns all tasks.',
              },
            },
            required: ['sessionId'],
          },
        },
        {
          name: 'get_ready_tasks',
          description: 'Returns a list of tasks that are ready to be executed (status=pending and all dependencies completed). Use this to find which tasks an agent can start working on. Essential for implementing the blackboard pattern where agents poll for available work.',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
            },
            required: ['sessionId'],
          },
        },
        {
          name: 'store_context',
          description: 'Stores data in the shared context (blackboard) where all agents can access it. Use this to share outputs, intermediate results, design decisions, or any data other agents need. Stored data persists for the session lifetime. Key should be descriptive (e.g., "api_design", "security_requirements").',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              key: { type: 'string' },
              value: {
                type: 'object',
                description: 'Any JSON-serializable data',
              },
            },
            required: ['sessionId', 'key', 'value'],
          },
        },
        {
          name: 'get_context',
          description: 'Retrieves data from the shared context (blackboard) that was stored by other agents. Use this to read outputs from other agents, access shared design decisions, or get any data stored with store_context. Omit key to get all context data for the session.',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              key: {
                type: 'string',
                description: 'Optional specific key. If not provided, returns all context.',
              },
            },
            required: ['sessionId'],
          },
        },
        {
          name: 'subscribe_to_topics',
          description: 'Subscribes an agent to specific event topics so they receive notifications when events are published. Use this for event-driven coordination where agents react to other agents\' actions. Topics can be custom strings like "build_complete", "design_approved", or "data_updated".',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              agentId: { type: 'string' },
              topics: {
                type: 'array',
                items: { type: 'string' },
                description: 'Topics to subscribe to (e.g., "task_complete", "data_updated")',
              },
            },
            required: ['sessionId', 'agentId', 'topics'],
          },
        },
        {
          name: 'publish_event',
          description: 'Publishes an event to all agents subscribed to a specific topic. Use this to notify other agents of important milestones, state changes, or completed work. Subscribed agents receive the event data as a notification and can react accordingly.',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              topic: { type: 'string' },
              data: { type: 'object' },
            },
            required: ['sessionId', 'topic', 'data'],
          },
        },
        {
          name: 'initialize_agent',
          description: 'Loads an agent\'s complete configuration including system prompts, knowledge files, capabilities, tools, and MCP server settings. Use this before executing any agent task to ensure the agent has fresh context and all required resources loaded. Returns the agent context object ready for execution.',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string', description: 'Session ID for tracking' },
              agentName: { type: 'string', description: 'Name of the agent to initialize' },
              clearPreviousContext: { 
                type: 'boolean', 
                description: 'Whether to clear previous agent context (default: true)'
              },
            },
            required: ['sessionId', 'agentName'],
          },
        },
        {
          name: 'execute_workflow',
          description: 'Executes a predefined workflow template by name (e.g., "agent-execution"). Workflows are multi-step sequences that automate common patterns like agent initialization → task creation → execution → status updates. Variables are substituted into the workflow steps (sessionId, agentName, task, etc.). Returns detailed results for each step.',
          inputSchema: {
            type: 'object',
            properties: {
              workflowTemplate: { 
                type: 'string', 
                description: 'Name of the workflow template (e.g., "agent-execution")' 
              },
              variables: { 
                type: 'object', 
                description: 'Variables to substitute in the workflow (e.g., sessionId, agentName, task)' 
              },
            },
            required: ['workflowTemplate', 'variables'],
          },
        },
      ],
    };
  });

  // Handle tool calls (MCP Primitive)
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'create_agent_task':
          return await handleCreateTask(args, logger, server);
        case 'update_task_status':
          return await handleUpdateStatus(args, logger, server);
        case 'get_task_status':
          return await handleGetTaskStatus(args);
        case 'get_ready_tasks':
          return await handleGetReadyTasks(args);
        case 'store_context':
          return await handleStoreContext(args, logger);
        case 'get_context':
          return await handleGetContext(args);
        case 'subscribe_to_topics':
          return await handleSubscribe(args, logger);
        case 'publish_event':
          return await handlePublish(args, logger, server);
        case 'initialize_agent':
          return await handleInitializeAgent(args, agentLoader, logger);
        case 'execute_workflow':
          return await handleExecuteWorkflow(args, logger);
          return await handleGetContext(args);
        case 'subscribe_to_topics':
          return await handleSubscribe(args, logger);
        case 'publish_event':
          return await handlePublishEvent(args, logger, server);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error: any) {
      logger.error('Tool execution failed', {
        tool: name,
        error: error.message,
        args,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message, success: false }),
          },
        ],
        isError: true,
      };
    }
  });

  logger.info('Tools registered', { count: 8 });
}

// Tool Handlers

async function handleCreateTask(args: any, logger: any, server: Server) {
  const { sessionId, agentName, task, input, dependencies = [] } = args;

  // Initialize session if needed
  if (!contextStore.has(sessionId)) {
    contextStore.set(sessionId, {
      sessionId,
      tasks: new Map(),
      results: new Map(),
      meta: {},
      subscriptions: new Map(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const context = contextStore.get(sessionId)!;
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const agentTask: AgentTask = {
    id: taskId,
    agentName,
    task,
    input,
    status: 'pending',
    dependencies,
    createdAt: new Date(),
    progress: 0,
  };

  context.tasks.set(taskId, agentTask);
  context.updatedAt = new Date();

  logger.info('Task created', {
    sessionId,
    taskId,
    agentName,
    hasDependencies: dependencies.length > 0,
  });

  await server.notification({
    method: 'notifications/resources/updated',
    params: {
      uri: `queue://tasks/${sessionId}`,
    },
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          taskId,
          agentName,
          status: 'pending',
          dependencies,
        }),
      },
    ],
  };
}

async function handleUpdateStatus(args: any, logger: any, server: Server) {
  const { sessionId, taskId, status, output, progress, error } = args;

  const context = contextStore.get(sessionId);
  if (!context) throw new Error(`Session ${sessionId} not found`);

  const task = context.tasks.get(taskId);
  if (!task) throw new Error(`Task ${taskId} not found in session ${sessionId}`);

  // Update task
  task.status = status;
  if (output !== undefined) {
    task.output = output;
    context.results.set(taskId, output);
  }
  if (progress !== undefined) task.progress = progress;
  if (error) task.error = error;
  if (status === 'completed' || status === 'failed') {
    task.completedAt = new Date();
  }

  context.updatedAt = new Date();

  logger.info('Task status updated', {
    sessionId,
    taskId,
    status,
    progress: task.progress,
  });

  // Send progress notification
  if (progress !== undefined) {
    await server.notification({
      method: 'notifications/progress',
      params: {
        progressToken: taskId,
        progress,
        total: 100,
      },
    });
  }

  // Send resource update notification
  await server.notification({
    method: 'notifications/resources/updated',
    params: {
      uri: `queue://tasks/${sessionId}`,
    },
  });

  // Publish completion event
  if (status === 'completed') {
    await publishToSubscribers(context, 'task_complete', {
      taskId,
      agentName: task.agentName,
      output: task.output,
    }, server);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          taskId,
          status,
          progress: task.progress,
        }),
      },
    ],
  };
}

async function handleGetTaskStatus(args: any) {
  const { sessionId, taskId } = args;

  const context = contextStore.get(sessionId);
  if (!context) throw new Error(`Session ${sessionId} not found`);

  if (taskId) {
    const task = context.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            task: {
              id: task.id,
              agentName: task.agentName,
              status: task.status,
              progress: task.progress,
              createdAt: task.createdAt,
              completedAt: task.completedAt,
              dependencies: task.dependencies,
              error: task.error,
            },
          }),
        },
      ],
    };
  }

  // Return all tasks
  const allTasks = Array.from(context.tasks.values()).map(t => ({
    id: t.id,
    agentName: t.agentName,
    status: t.status,
    progress: t.progress,
    dependencies: t.dependencies,
  }));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          sessionId,
          totalTasks: allTasks.length,
          tasks: allTasks,
        }),
      },
    ],
  };
}

async function handleGetReadyTasks(args: any) {
  const { sessionId } = args;

  const context = contextStore.get(sessionId);
  if (!context) throw new Error(`Session ${sessionId} not found`);

  // Find tasks that are pending and have all dependencies satisfied
  const readyTasks = Array.from(context.tasks.values()).filter((task) => {
    if (task.status !== 'pending') return false;

    if (task.dependencies.length > 0) {
      return task.dependencies.every((depId) => {
        const depTask = context.tasks.get(depId);
        return depTask?.status === 'completed';
      });
    }

    return true;
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          sessionId,
          readyCount: readyTasks.length,
          readyTasks: readyTasks.map((t) => ({
            taskId: t.id,
            agentName: t.agentName,
            task: t.task,
            input: t.input,
            dependencies: t.dependencies,
          })),
        }),
      },
    ],
  };
}

async function handleStoreContext(args: any, logger: any) {
  const { sessionId, key, value } = args;

  const context = contextStore.get(sessionId);
  if (!context) throw new Error(`Session ${sessionId} not found`);

  context.meta[key] = value;
  context.updatedAt = new Date();

  logger.debug('Context stored', { sessionId, key });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ success: true, key }),
      },
    ],
  };
}

async function handleGetContext(args: any) {
  const { sessionId, key } = args;

  const context = contextStore.get(sessionId);
  if (!context) throw new Error(`Session ${sessionId} not found`);

  const data = key ? context.meta[key] : context.meta;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data),
      },
    ],
  };
}

async function handleSubscribe(args: any, logger: any) {
  const { sessionId, agentId, topics } = args;

  const context = contextStore.get(sessionId);
  if (!context) throw new Error(`Session ${sessionId} not found`);

  if (!context.subscriptions.has(agentId)) {
    context.subscriptions.set(agentId, []);
  }

  const currentTopics = context.subscriptions.get(agentId)!;
  topics.forEach((topic: string) => {
    if (!currentTopics.includes(topic)) {
      currentTopics.push(topic);
    }
  });

  logger.info('Agent subscribed', { sessionId, agentId, topics });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          agentId,
          subscribedTopics: currentTopics,
        }),
      },
    ],
  };
}

async function handlePublishEvent(args: any, logger: any, server: Server) {
  const { sessionId, topic, data } = args;

  const context = contextStore.get(sessionId);
  if (!context) throw new Error(`Session ${sessionId} not found`);

  await publishToSubscribers(context, topic, data, server);

  logger.info('Event published', { sessionId, topic });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ success: true, topic }),
      },
    ],
  };
}

// Helper function for pub/sub
async function publishToSubscribers(
  context: SharedContext,
  topic: string,
  content: any,
  server: Server
) {
  for (const [agentId, topics] of context.subscriptions.entries()) {
    if (topics.includes(topic)) {
      await server.notification({
        method: 'notifications/message',
        params: {
          level: 'info',
          logger: 'agent-context-hub',
          data: {
            topic,
            content,
            targetAgent: agentId,
          },
        },
      });
    }
  }
}

// Handler for initialize_agent tool
async function handleInitializeAgent(args: any, agentLoader: AgentLoader, logger: any) {
  const result = await initializeAgent(args, agentLoader);
  
  logger.info('Agent initialized', {
    agentName: args.agentName,
    sessionId: args.sessionId,
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

// Handler for execute_workflow tool
async function handleExecuteWorkflow(args: any, logger: any) {
  const { workflowTemplate, variables } = args;
  
  const workflowsDir = path.join(process.cwd(), 'workflows');
  const engine = new WorkflowEngine(workflowsDir);

  logger.info('Executing workflow', {
    template: workflowTemplate,
    variables: Object.keys(variables),
  });

  // Tool executor function - this would call the actual MCP tools
  // For now, it's a placeholder that needs to be implemented
  const toolExecutor = async (server: string, tool: string, params: any) => {
    // TODO: Implement actual tool execution across MCP servers
    logger.debug('Tool execution', { server, tool, params });
    throw new Error('Tool executor not yet implemented - needs MCP client integration');
  };

  const result = await engine.executeWorkflow(
    workflowTemplate,
    variables,
    toolExecutor
  );

  logger.info('Workflow completed', {
    template: workflowTemplate,
    success: result.success,
    duration: result.totalDuration,
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

// Handler alias for publish_event
async function handlePublish(args: any, logger: any, server: Server) {
  return await handlePublishEvent(args, logger, server);
}
