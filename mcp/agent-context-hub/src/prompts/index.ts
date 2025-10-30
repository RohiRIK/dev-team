import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListPromptsRequestSchema, GetPromptRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { AgentLoader } from '../agent-loader.js';
import { LoadedAgent } from '../types.js';

export async function registerPrompts(server: Server, logger: any, agentLoader: AgentLoader) {
  
  // List all available prompts (MCP Primitive)
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: 'orchestrator_system',
          description: 'System prompt for the orchestrator agent (Buddy)',
          arguments: [
            {
              name: 'taskDescription',
              description: 'The high-level task to orchestrate',
              required: true,
            },
            {
              name: 'availableAgents',
              description: 'List of available specialized agents',
              required: false,
            },
          ],
        },
        {
          name: 'agent_execution',
          description: 'Execution prompt template for individual agents',
          arguments: [
            {
              name: 'agentName',
              description: 'Name of the agent',
              required: true,
            },
            {
              name: 'task',
              description: 'Specific task for the agent',
              required: true,
            },
            {
              name: 'context',
              description: 'Relevant context data from shared context',
              required: false,
            },
          ],
        },
      ],
    };
  });

  // Get specific prompt (MCP Primitive)
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'orchestrator_system') {
      const agents = await agentLoader.getAllAgents();
      const agentList = args?.availableAgents || agents.map((a: LoadedAgent) => 
        `- ${a.name}: ${a.config.description}`
      ).join('\n');

      return {
        description: 'Orchestrator system prompt',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `You are the Lead Orchestrator Agent managing a team of specialized agents.

**YOUR TASK**: ${args?.taskDescription || 'Not specified'}

**AVAILABLE AGENTS VIA MCP**:
${agentList}

**AVAILABLE MCP TOOLS**:
- \`create_agent_task\`: Create tasks with dependencies for sequential execution
- \`get_ready_tasks\`: Find tasks ready to execute (dependencies satisfied)
- \`update_task_status\`: Mark progress and store results
- \`store_context\`: Save data to shared context blackboard
- \`get_context\`: Retrieve shared data from blackboard
- \`subscribe_to_topics\`: Subscribe to event notifications
- \`publish_event\`: Publish events to subscribed agents

**SEQUENTIAL EXECUTION WORKFLOW**:
1. Break down the task into ordered subtasks
2. Create tasks using \`create_agent_task\` with \`dependencies\` array
3. Use \`get_ready_tasks\` to see which tasks can run next
4. Execute ready tasks (agents will mark completion)
5. Use \`store_context\` to save intermediate results
6. Repeat until all tasks complete
7. Aggregate results into final response

**EXAMPLE WORKFLOW**:
\`\`\`javascript
// Step 1: Create architect task (no dependencies)
create_agent_task({
  sessionId: "session_123",
  agentName: "architect_agent",
  task: "Design REST API architecture",
  input: { requirements: "OAuth2 + JWT authentication" },
  dependencies: []  // Can start immediately
}) → returns taskId: "task_1"

// Step 2: Create coder task (depends on task_1)
create_agent_task({
  sessionId: "session_123",
  agentName: "coder_agent",
  task: "Implement API endpoints",
  input: { language: "typescript" },
  dependencies: ["task_1"]  // Wait for architect
}) → returns taskId: "task_2"

// Step 3: Check ready tasks
get_ready_tasks({ sessionId: "session_123" })
→ Returns only task_1 (no dependencies)

// Step 4: After task_1 completes, task_2 becomes ready
get_ready_tasks({ sessionId: "session_123" })
→ Returns task_2 (dependencies satisfied)
\`\`\`

**PARALLEL EXECUTION**:
When multiple tasks have no dependencies or the same dependencies, they can run in parallel.

**REMEMBER**:
- Always use dependencies to ensure correct execution order
- Store important data in shared context for other agents
- Monitor task status before creating dependent tasks
- Aggregate all results into a comprehensive response`,
            },
          },
        ],
      };
    }

    if (name === 'agent_execution') {
      const agentName = args?.agentName || 'unknown_agent';
      const agent = await agentLoader.getAgent(agentName);

      return {
        description: 'Agent execution prompt',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `You are ${agentName}${agent ? ` - ${agent.config.description}` : ''}.

**YOUR TASK**: ${args?.task || 'No task specified'}

${args?.context ? `**CONTEXT FROM SHARED BLACKBOARD**:\n\`\`\`json\n${JSON.stringify(args.context, null, 2)}\n\`\`\`\n` : ''}

**YOUR PROCESS**:
1. Use \`update_task_status\` to mark status as "in_progress"
2. Execute your specialized task
3. Use \`store_context\` to save important data for other agents
4. Use \`update_task_status\` to mark "completed" with your output

**EXAMPLE**:
\`\`\`javascript
// Mark start
update_task_status({
  sessionId: "session_123",
  taskId: "task_1",
  status: "in_progress",
  progress: 0
})

// Do your work...
const result = await doYourWork();

// Store for others
store_context({
  sessionId: "session_123",
  key: "architecture_task_1",
  value: result
})

// Mark complete
update_task_status({
  sessionId: "session_123",
  taskId: "task_1",
  status: "completed",
  output: result,
  progress: 100
})
\`\`\``,
            },
          },
        ],
      };
    }

    throw new Error(`Unknown prompt: ${name}`);
  });

  logger.info('Prompts registered');
}
