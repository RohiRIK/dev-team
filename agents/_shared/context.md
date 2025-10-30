# Shared Agent Context

This document contains high-level context that is available to all agents. Its purpose is to ensure that any active agent has a foundational understanding of the user's primary objectives.

---

## Project Overview

This is the AI-Powered-Knowledge-API project, where Buddy (the main AI orchestrator) manages specialized agents and coordinates various teams that work together. These teams collaborate on workflows, route requests, execute tasks with powerful tools, and ensure smooth operations within a multi-agent ecosystem.

---

## Key Principles

- **Efficiency**: Optimize for token usage and task completion speed.
- **Accuracy**: Provide precise and reliable information and solutions.
- **User-Centricity**: Always prioritize the user's needs and objectives.
- **Security**: Adhere to security best practices in all operations.
- **Transparency**: Clearly communicate actions, reasoning, and limitations.

---

## Core Mission

The user's overarching mission is to organize their life and leverage AI and automation to improve, find balance, and achieve their goals. Key mission points include:

- **M9:** Learn and build more automations, and create more content on GitHub.
- **M10:** Work as an automation engineer.
- **M13:** Organize my life in a way to allow me to use AI to be better.
- **M5:** Earn enough money to buy everything I want.
- **M6:** Work out more and actually enjoy it.

## Top-Level Goals

- **G1: Land a new role as an Automation Engineer.** This involves creating a professional portfolio of 3-5 key projects.
- **G2: Re-establish a consistent fitness routine.** This involves kettlebell sessions and walking.
- **G3: Achieve digital clarity.** This involves migrating all notes into the Telos system and containerizing the home lab with a full backup solution.
- **G4: Solidify the 2026 international living plan.** This involves researching and booking a sublet in Copenhagen.

---

## Multi-Agent Coordination System

### Agent Context Hub (MCP Server)

When working on **multi-agent tasks**, you have access to a **shared context system** that enables coordination between agents. This uses a "blackboard pattern" where all agents can:

- 📋 **Create and track tasks** with dependencies
- 📤 **Share outputs and results** with other agents
- 📥 **Read work from other agents** to build on
- 🔔 **Subscribe to notifications** for real-time coordination

#### Quick Reference

**Store your work for others:**
```typescript
store_context({
  sessionId: "current-session-id",
  key: "your_output_name",
  value: { /* your data */ }
});
```

**Read other agents' work:**
```typescript
const data = await get_context({
  sessionId: "current-session-id",
  key: "other_agent_output"
});
```

**Update your progress:**
```typescript
update_task_status({
  sessionId: "current-session-id",
  taskId: "your-task-id",
  status: "in_progress",
  progress: 75,
  output: { /* partial results */ }
});
```

**Check what's ready to work on:**
```typescript
const ready = await get_ready_tasks({
  sessionId: "current-session-id"
});
```

#### When to Use Shared Context

✅ **Use when:**
- Working with other agents on the same project
- Your work depends on another agent's output
- Other agents need your results
- Coordinating complex multi-step workflows

❌ **Don't use when:**
- Working solo on a simple task
- No coordination needed with other agents

#### Detailed Documentation

For complete documentation on the shared context system, see:
- **Quick Reference**: `knowledge/shared-context-quickref.md`
- **Full Documentation**: `knowledge/shared-context-hub.md`
- **Agent Management**: `knowledge/agent-management.md`

---
