# Agent Context Hub MCP Server

Shared context hub for multi-agent coordination using Model Context Protocol.

## Quick Start

```bash
cd ~/.gemini/mcp/agent-context-hub
bun install
bun run dev
```

## Features

- ✅ Automatic agent discovery from `~/.gemini/agents`
- ✅ Sequential task execution with dependencies
- ✅ Parallel agent execution when possible
- ✅ Shared context blackboard pattern
- ✅ Event-driven pub/sub notifications
- ✅ Real-time progress tracking
- ✅ MCP-compliant architecture

## Configuration

Set agents path in environment:

```bash
export AGENTS_PATH=~/.gemini/agents
```

Or configure in Gemini CLI settings.json.

## Architecture

Based on:
- [MCP Specification](https://modelcontextprotocol.io/docs/learn/architecture)
- [Multi-Agent Coordination Playbook](https://www.jeeva.ai/blog/multi-agent-coordination-playbook)

## Tools

- `create_agent_task`: Create task with dependencies
- `update_task_status`: Update progress and output
- `get_ready_tasks`: Find executable tasks
- `store_context` / `get_context`: Shared data
- `subscribe_to_topics`: Event subscriptions

## Resources

- `agent://registry`: All available agents
- `agent://{name}`: Agent configuration
- `context://session/{id}`: Session context
