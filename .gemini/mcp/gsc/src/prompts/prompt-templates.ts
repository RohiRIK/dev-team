/**
 * Layer 2: Prompts - Prompt Templates
 * 
 * Centralized prompt templates for agent interactions
 */

import type { PromptTemplate, PromptContext } from '../types.js';

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  // Instruction Prompts
  default_instruction: {
    id: 'default_instruction',
    name: 'Default Agent Instruction',
    description: 'Standard instruction template for GEMINI sub-agents',
    category: 'instruction',
    template: `You are a GEMINI sub-agent managed by the MCP framework.

Agent Name: {{agentName}}
Session ID: {{sessionId}}
Task ID: {{taskId}}

Core Principles:
- Follow context hierarchy and maintain structured reasoning
- Report progress clearly and frequently
- Request clarification when needed
- Log all significant actions and decisions

Current Task:
{{taskDescription}}

Available Context:
{{context}}`,
    variables: ['agentName', 'sessionId', 'taskId', 'taskDescription', 'context']
  },

  // Error Handling Prompts
  error_handling: {
    id: 'error_handling',
    name: 'Error Handling Template',
    description: 'Template for handling errors and requesting clarification',
    category: 'error',
    template: `Action Failed: {{actionName}}

Error Details:
{{errorMessage}}

Context at Time of Failure:
{{failureContext}}

Next Steps:
1. Log the error with full context
2. Determine if retry is appropriate
3. Request clarification if needed
4. Propose alternative approach if possible

Do not proceed without addressing this error.`,
    variables: ['actionName', 'errorMessage', 'failureContext']
  },

  // Clarification Prompts
  clarification_request: {
    id: 'clarification_request',
    name: 'Clarification Request',
    description: 'Request additional information or clarification',
    category: 'clarification',
    template: `Clarification Needed for Task: {{taskId}}

Agent: {{agentName}}
Current Progress: {{progress}}%

Unclear Aspects:
{{unclearPoints}}

Specific Questions:
{{questions}}

Impact if Not Clarified:
{{impact}}

Please provide clarification to proceed.`,
    variables: ['taskId', 'agentName', 'progress', 'unclearPoints', 'questions', 'impact']
  },

  // Execution Prompts
  execution_start: {
    id: 'execution_start',
    name: 'Execution Start',
    description: 'Template for starting task execution',
    category: 'execution',
    template: `Starting Execution of Task: {{taskId}}

Agent: {{agentName}}
Task Description: {{taskDescription}}
Dependencies Met: {{dependenciesMet}}

Available Resources:
{{resources}}

Available Tools:
{{tools}}

Execution Plan:
{{executionPlan}}

Beginning execution now...`,
    variables: ['taskId', 'agentName', 'taskDescription', 'dependenciesMet', 'resources', 'tools', 'executionPlan']
  },

  // Orchestration Prompts
  agent_coordination: {
    id: 'agent_coordination',
    name: 'Agent Coordination',
    description: 'Coordinate multiple agents working together',
    category: 'instruction',
    template: `Multi-Agent Coordination Task

Orchestrator: GEMINI MCP Framework
Session: {{sessionId}}

Participating Agents:
{{agentList}}

Coordination Strategy: {{strategy}}

Task Flow:
{{taskFlow}}

Shared Context Access:
- All agents can read/write to session context
- Use pub/sub for event notifications
- Respect task dependencies

Communication Protocol:
- Update task status regularly
- Publish events on significant milestones
- Store results in shared context with clear keys`,
    variables: ['sessionId', 'agentList', 'strategy', 'taskFlow']
  },

  // Workflow Prompts
  workflow_execution: {
    id: 'workflow_execution',
    name: 'Workflow Execution',
    description: 'Execute a predefined workflow',
    category: 'execution',
    template: `Executing Workflow: {{workflowName}}

Workflow ID: {{workflowId}}
Session: {{sessionId}}
Trigger: {{trigger}}

Workflow Definition:
{{workflowDefinition}}

Current Step: {{currentStep}} of {{totalSteps}}

Step Details:
{{stepDetails}}

Available Context:
{{context}}

Proceed with execution...`,
    variables: ['workflowName', 'workflowId', 'sessionId', 'trigger', 'workflowDefinition', 'currentStep', 'totalSteps', 'stepDetails', 'context']
  }
};

/**
 * Orchestration Patterns
 */
export const ORCHESTRATION_PATTERNS = {
  sequential: {
    name: 'Sequential Execution',
    description: 'Execute agents one after another using dependencies',
    example: `
// Create chain: architect → coder → tester
create_agent_task({ agentName: "architect_agent", dependencies: [] })
create_agent_task({ agentName: "coder_agent", dependencies: ["task_1"] })
create_agent_task({ agentName: "tester_agent", dependencies: ["task_2"] })
    `,
  },
  parallel: {
    name: 'Parallel Execution',
    description: 'Execute multiple agents simultaneously',
    example: `
// Both can run at same time (no dependencies)
create_agent_task({ agentName: "coder_agent_api", dependencies: [] })
create_agent_task({ agentName: "coder_agent_ui", dependencies: [] })
    `,
  },
  pipeline: {
    name: 'Pipeline Pattern',
    description: 'Chain agents where each output feeds the next input',
    example: `
// Each agent reads previous output from context
1. architect_agent stores "api_spec"
2. coder_agent reads "api_spec", stores "code"
3. tester_agent reads "code", stores "test_results"
    `,
  },
  fanout_fanin: {
    name: 'Fan-Out/Fan-In',
    description: 'Split work across agents, then merge results',
    example: `
// Fan-out: Multiple agents work in parallel
create_agent_task({ agentName: "coder_1", dependencies: ["design"] })
create_agent_task({ agentName: "coder_2", dependencies: ["design"] })

// Fan-in: Aggregator waits for all
create_agent_task({ 
  agentName: "merger", 
  dependencies: ["coder_1", "coder_2"] 
})
    `,
  },
};

/**
 * Render a prompt template with variables
 */
export function renderPrompt(templateId: string, context: PromptContext): string {
  const template = PROMPT_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  let rendered = template.template;

  // Replace all variables
  for (const [key, value] of Object.entries(context.variables)) {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value));
  }

  return rendered;
}

/**
 * Get template by ID
 */
export function getTemplate(templateId: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES[templateId];
}

/**
 * Get all templates by category
 */
export function getTemplatesByCategory(category: PromptTemplate['category']): PromptTemplate[] {
  return Object.values(PROMPT_TEMPLATES).filter(t => t.category === category);
}
