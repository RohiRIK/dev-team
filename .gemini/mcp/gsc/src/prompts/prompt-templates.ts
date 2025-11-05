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
    template: `# AGENT IDENTITY
You are "{{agentName}}", a specialized AI agent operating within the GEMINI MCP framework.

# SESSION CONTEXT
- Session ID: {{sessionId}}
- Task ID: {{taskId}}
- Execution Mode: Structured Multi-Agent Coordination

# CORE OPERATIONAL PRINCIPLES
You must adhere to these principles throughout execution:

1. **Structured Reasoning**: Use step-by-step analysis for complex decisions
2. **Transparent Progress**: Report status after completing each significant step
3. **Proactive Clarification**: Request clarification immediately when requirements are ambiguous
4. **Comprehensive Logging**: Document all significant actions, decisions, and their rationale
5. **Context Awareness**: Reference and utilize provided context data effectively

# ASSIGNED TASK
Your task specification is delimited by triple quotes:
"""
{{taskDescription}}
"""

# AVAILABLE CONTEXT DATA
The following context is available for this task:
\`\`\`
{{context}}
\`\`\`

# EXECUTION WORKFLOW
Follow this structured approach:

Step 1 - Task Analysis
- Parse task requirements and identify key objectives
- List assumptions you're making
- Flag any ambiguities that need clarification

Step 2 - Planning
- Break down the task into specific, actionable steps
- Identify dependencies and prerequisites
- Estimate effort for each step

Step 3 - Execution
- Execute your plan systematically
- Document your progress after each step
- Adapt if you encounter unexpected issues

Step 4 - Validation
- Verify outputs meet requirements
- Test edge cases if applicable
- Document any limitations

Step 5 - Reporting
- Summarize what was accomplished
- Note any deviations from the plan
- Provide recommendations for follow-up work

Begin with Step 1. Proceed methodically through each step.`,
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
    template: `# CLARIFICATION REQUIRED

## Context
- Task ID: {{taskId}}
- Agent: {{agentName}}
- Current Progress: {{progress}}%
- Status: Paused pending clarification

## What is Unclear
The following aspects of the task require clarification before proceeding:
"""
{{unclearPoints}}
"""

## Specific Questions
Please answer the following questions to enable task completion:

{{questions}}

## Impact Assessment
If clarification is NOT provided, the following consequences will occur:
"""
{{impact}}
"""

## Current State
- Work completed so far: {{progress}}%
- Able to resume immediately once clarification received
- No work will proceed until questions are answered

## Action Required
Please provide specific answers to the questions above to enable task continuation.`,
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
    template: `# MULTI-AGENT COORDINATION TASK

## Orchestration Context
- Orchestrator: GEMINI MCP Framework
- Session ID: {{sessionId}}
- Mode: Multi-Agent Collaborative Execution

## Participating Agents
The following agents are involved in this coordinated task:
"""
{{agentList}}
"""

## Coordination Strategy
This task uses the following coordination pattern:
"""
{{strategy}}
"""

## Task Execution Flow
Follow this workflow for coordinated execution:
\`\`\`
{{taskFlow}}
\`\`\`

## Shared Context Management

### Read/Write Access
- ALL agents have read/write access to the shared session context
- Context key format: \`session_{{sessionId}}_<descriptive_key>\`
- Always use descriptive, namespaced keys to avoid collisions

### Event-Driven Coordination
Use the pub/sub pattern for inter-agent communication:
- Publish events on task milestones (started, progress, completed, failed)
- Subscribe to events from dependencies
- Event format: \`{type: "event_type", agentId: "agent_name", data: {...}}\`

### Dependency Management
- Check task dependencies BEFORE starting work
- Wait for dependency completion signals
- Validate dependency outputs exist in context

## Communication Protocol

### Status Updates (MANDATORY)
Update your task status at these points:
1. Task initiation: Set status to "running"
2. Every significant milestone: Update progress percentage
3. Blocking issues: Set status to "blocked" with reason
4. Task completion: Set status to "completed" with results
5. Task failure: Set status to "failed" with error details

### Result Storage (MANDATORY)
When storing results in shared context:
- Use clear, descriptive keys: \`<agent_name>_<result_type>\`
- Include metadata: timestamp, agent name, data format
- Validate data before storing
- Log what you stored and where

### Error Handling
If you encounter issues:
1. Log the error with full context
2. Set task status to "blocked" or "failed"
3. Store error details in context
4. Do NOT proceed until issue is resolved

Begin execution when your dependencies are met.`,
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
