# Buddy AI Setup & Usage Guide

## What is Buddy AI?

Buddy AI is your **global orchestrator** for the entire dev-team multi-agent system. Think of Buddy as:
- Your **single entry point** to all 20+ specialized agents
- A **smart router** that knows which agent to call for any task
- A **coordinator** that can chain multiple agents for complex workflows
- A **companion** that can handle simple tasks directly without delegation

## Architecture Overview

```
You → Buddy AI (Orchestrator)
        ↓
        ├─→ backend-developer
        ├─→ frontend-developer
        ├─→ security-analyst
        ├─→ devops-engineer
        ├─→ data-analyst
        ├─→ cloud-architect
        ├─→ automation-specialist
        └─→ ... (20+ specialized agents)
```

## Global Access - How It Works

Buddy AI is **automatically available** from any folder in the project because:

1. **Configuration Location**: `.gemini/settings.json` at project root
2. **Agent Definition**: `.gemini/agent.md` (Buddy's identity and capabilities)
3. **Agent Config**: `.gemini/agent.json` (Buddy's configuration)
4. **Auto-Loading**: Gemini CLI automatically finds and loads `agent.md` files

This means when you run Gemini CLI anywhere in the project, Buddy is already there!

## Quick Start

### 1. Verify Installation

```bash
# Navigate to project root
cd /path/to/dev-team

# Check Buddy's configuration exists
ls -la .gemini/agent.md .gemini/agent.json

# Check MCP servers are configured
cat .gemini/settings.json | grep -A 5 "mcpServers"
```

### 2. Start Buddy AI

```bash
# Option 1: Using the Rust launcher (recommended)
./buddy

# Option 2: Using the shell alias (after installation)
buddy

# Option 3: Direct Gemini CLI
gemini
```

When Buddy starts, it will:
- Load all MCP servers (agent-context-hub, fabric, workflow-loader)
- Initialize the orchestration system
- Be ready to route tasks to any specialized agent

### 3. Verify Buddy is Active

Once in the Gemini CLI interface, try:

```
> Hello Buddy, what can you help me with?
```

Buddy should respond with information about its capabilities and available agents.

## Using Buddy AI

### Simple Tasks (Direct Handling)

For general questions or simple tasks, Buddy handles them directly:

```
> What's the best practice for REST API design?

> Explain the difference between Docker and Kubernetes

> How do I set up environment variables in Bun?
```

Buddy will answer these directly without loading specialized agents.

### Single-Agent Tasks

When you need specialized expertise:

```
> I need help optimizing my PostgreSQL database queries

Buddy will respond:
"This requires database expertise. Let me load the database-admin agent..."
[Loads database-admin]
"The database-admin suggests..."
```

### Multi-Agent Workflows

For complex projects requiring multiple specialists:

```
> I want to build a secure web app with React frontend and Node.js backend

Buddy will coordinate:
1. backend-developer (API design)
2. database-admin (schema design)
3. frontend-developer (React UI)
4. security-analyst (security review)
5. qa-tester (testing)
```

### Using MCP Tools

Buddy has access to powerful MCP tools:

```
> Can you summarize this long document using Fabric patterns?
[Buddy uses fabric MCP server]

> Create a multi-agent task for code review
[Buddy uses agent-context-hub MCP server]

> Search for existing n8n workflows related to user authentication
[Buddy uses workflow-loader MCP server]
```

## Understanding Agent Routing

### When Buddy Loads Agents

Buddy loads specialized agents when:
- ✅ Task requires domain-specific expertise
- ✅ User explicitly requests a specific agent
- ✅ Complex workflow needs coordination
- ✅ Current context is insufficient

### When Buddy Handles Directly

Buddy answers directly when:
- ✅ Simple general knowledge questions
- ✅ System-level operations (file operations, git, etc.)
- ✅ Navigation and guidance tasks
- ✅ Tool usage (Bun, shell commands, etc.)

## Available Specialized Agents

Buddy can route to any of these 20+ agents:

**Development:**
- `backend-developer` - APIs, Node.js, Python, TypeScript
- `frontend-developer` - React, UI components, CSS
- `ml-engineer` - Machine learning, AI/ML
- `database-admin` - Database optimization, SQL

**Infrastructure:**
- `devops-engineer` - CI/CD, Docker, Kubernetes
- `cloud-architect` - AWS/Azure/GCP architecture
- `system-administrator` - Server management
- `network-engineer` - Networking, protocols
- `system-architect` - System design patterns

**Security:**
- `security-analyst` - Threat detection, incident response
- `pentaster` - Penetration testing

**Product & Design:**
- `product-manager` - Product strategy, roadmaps
- `scrum-master` - Agile processes, sprint planning
- `ui-ux-designer` - UX design, wireframes
- `qa-tester` - Testing strategies, test automation

**Data & Content:**
- `data-analyst` - Data analysis, visualization
- `content-creator` - Technical writing, documentation

**Automation & Tools:**
- `automation-specialist` - n8n workflows, API integrations
- `github-manager` - Repository management, Git operations

**Meta:**
- `agent-builder` - Create new agents

## Advanced Usage

### Explicit Agent Selection

If you want to bypass Buddy's routing and go directly to an agent:

```
> @backend-developer Design a REST API for user management
```

The `@agent-name` syntax (if supported) can direct requests to specific agents.

### Session Management

For complex multi-step projects, use sessions:

```
> Start a new project session called "ecommerce-platform"

> In this session, I need:
  1. Database schema design
  2. API architecture
  3. Frontend components
  4. Security review

Buddy will create a coordinated workflow using agent-context-hub.
```

### Fabric Pattern Usage

Ask Buddy to use specific Fabric patterns:

```
> Extract wisdom from this article using Fabric
> Summarize this documentation
> Analyze the claims in this blog post
> Create an agenda for this project description
```

### Workflow Discovery

Check for pre-existing workflows:

```
> Do we have any workflows for code review?
> Show me available automation workflows
> Load the deployment workflow template
```

## Configuration Files

### Buddy's Core Files

```
.gemini/
├── agent.md          # Buddy's identity and capabilities
├── agent.json        # Buddy's configuration
└── settings.json     # System-wide settings and MCP servers
```

### Agent Files

```
agents/
├── _shared/
│   ├── knowledge/    # Shared knowledge (orchestration, etc.)
│   └── tools/        # Shared tools
├── backend-developer/
│   ├── agent.md      # Agent definition
│   ├── knowledge/    # Specialized knowledge
│   └── tools/        # Specialized tools
├── [other agents...]
```

### MCP Servers

```
mcp/
├── agent-context-hub/    # Multi-agent coordination
├── fabric-integration/   # AI patterns (50+ patterns)
├── workflow-loader/      # n8n workflow access
└── template/            # MCP server template
```

## Troubleshooting

### Buddy Not Responding

1. Check Gemini CLI is running
2. Verify `.gemini/agent.md` exists
3. Check MCP servers are running: Look for startup messages

### Agent Not Loading

```
> List available agents

Buddy should show all 20+ agents. If an agent is missing:
1. Check the agent directory exists in `agents/`
2. Verify `agent.md` file exists in the agent directory
3. Check agent name spelling
```

### MCP Server Issues

```bash
# Check MCP server status
cd mcp/agent-context-hub
bun run dev

# Should start without errors
```

### Context Issues

If Buddy seems to have forgotten context:
- Context window: 1,000,000 tokens
- Auto-compression at 800,000 tokens
- Ask Buddy to summarize and compress if needed

## Best Practices

### 1. Let Buddy Route

Trust Buddy's routing decisions. It knows which agent is best for each task.

**Good:**
```
> I need help with Kubernetes deployment
[Buddy loads devops-engineer]
```

**Less Optimal:**
```
> Load the devops engineer and help me with Kubernetes
[Unnecessary explicit instruction]
```

### 2. Provide Context

Give Buddy enough information to route correctly:

**Good:**
```
> I'm building a React app and need help with state management using Redux
[Clear: frontend-developer will be loaded]
```

**Vague:**
```
> Help with state management
[Unclear: Backend state? Frontend state? Database state?]
```

### 3. Use Sessions for Projects

For multi-step projects, establish a session:

```
> Create a new session "mobile-app-backend"
> In this session, first design the API
> Then set up the database
> Then configure CI/CD
```

### 4. Check for Existing Resources

Before creating new things:

```
> Do we have any existing workflows for deployment?
> Are there any agents that specialize in GraphQL?
> Check if we have knowledge about Azure best practices
```

## Integration with Development Workflow

### Code Review Workflow

```
> Review this code for security issues and best practices

Buddy coordinates:
1. security-analyst (security review)
2. backend-developer (code quality)
3. qa-tester (testing recommendations)
```

### New Feature Development

```
> I want to add user authentication to my app

Buddy coordinates:
1. backend-developer (API design)
2. database-admin (user schema)
3. security-analyst (security requirements)
4. frontend-developer (login UI)
5. qa-tester (test plan)
```

### Infrastructure Setup

```
> Set up a production environment on AWS

Buddy coordinates:
1. cloud-architect (AWS architecture)
2. devops-engineer (CI/CD pipeline)
3. security-analyst (security configuration)
4. network-engineer (networking setup)
```

## Getting Help

### Ask Buddy About Itself

```
> What agents are available?
> How does agent routing work?
> What MCP tools do you have access to?
> Explain how to use the agent-context-hub
```

### Check Documentation

- `CLAUDE.md` - Development guide for Claude Code
- `README.md` - Project overview
- `agents/_shared/orchestration.md` - Routing decision matrix
- `mcp/MCP-GUIDE.md` - MCP server development guide

### Test Agent Access

```
> Load the database-admin agent and verify it works
> Test the fabric integration with a summarize command
> Show me the agent-context-hub capabilities
```

## Summary

**Buddy AI is your global orchestrator** - one interface to all 20+ specialized agents:

✅ **Automatically available** from any project directory
✅ **Smart routing** to the right agent for every task
✅ **Multi-agent coordination** for complex workflows
✅ **Direct handling** for simple tasks
✅ **MCP integration** for advanced capabilities
✅ **Context-aware** with intelligent memory management

**Just start a conversation with Buddy and let the orchestration magic happen!**

---

*Buddy AI - Because everyone needs somebody to coordinate their multi-agent team*
