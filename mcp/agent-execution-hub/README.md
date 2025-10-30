# Agent Execution Hub

MCP server for executing agents with Gemini API. Sister server to Agent Context Hub.

## Purpose

While Agent Context Hub coordinates tasks and manages shared context, Agent Execution Hub actually executes agents:
- Loads agent configuration (agent.md, knowledge files, tools)
- Invokes Gemini API with agent's system prompt
- Executes agent tasks and returns results
- Integrates with Agent Context Hub for coordination

## Installation

```bash
bun install
```

## Running

```bash
bun run dev
```

## Tools

- `execute_agent`: Execute an agent with specified task
- `get_agent_config`: Load agent configuration
- `call_agent_tool`: Call a specific MCP tool for an agent
- `get_execution_status`: Get status of running execution
- `cancel_execution`: Cancel a running execution

## Integration with Agent Context Hub

1. Agent Context Hub creates task with `create_agent_task`
2. Agent Execution Hub executes with `execute_agent`
3. Results stored back with `store_context`
4. Status updated with `update_task_status`
