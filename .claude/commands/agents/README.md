# Dev-Team Agent Slash Commands

This directory contains **globally accessible slash commands** for all 20 specialized agents in the dev-team system.

## How to Use

From anywhere in Claude Code, you can invoke any agent using:

```
/agents/[agent-name]
```

Each command will load that agent's context, knowledge, and specialized capabilities.

## Available Agent Commands

### Development & Engineering (5 agents)

- `/agents/backend-developer` - Backend APIs, Node.js, Python, TypeScript, Bun
- `/agents/frontend-developer` - React, UI components, CSS, responsive design
- `/agents/ml-engineer` - Machine learning models, training pipelines, MLOps
- `/agents/database-admin` - Database optimization, SQL, performance tuning
- `/agents/qa-tester` - Test strategies, automation, quality assurance

### Infrastructure & Operations (5 agents)

- `/agents/cloud-architect` - AWS/Azure/GCP architecture, cost optimization
- `/agents/devops-engineer` - CI/CD, Docker, Kubernetes, Terraform
- `/agents/system-administrator` - Server management, monitoring, configuration
- `/agents/network-engineer` - Networking, protocols, troubleshooting
- `/agents/system-architect` - System design, architecture patterns, scalability

### Security (2 agents)

- `/agents/security-analyst` - Cloud security, threat detection, incident response
- `/agents/pentaster` - Penetration testing, vulnerability assessment

### Product & Design (4 agents)

- `/agents/product-manager` - Product strategy, roadmaps, requirements
- `/agents/scrum-master` - Agile processes, sprint planning, ceremonies
- `/agents/ui-ux-designer` - UX design, wireframes, accessibility
- `/agents/content-creator` - Technical writing, documentation, blog posts

### Data & Automation (3 agents)

- `/agents/data-analyst` - Data analysis, visualization, statistical analysis
- `/agents/automation-specialist` - n8n workflows, API integrations
- `/agents/github-manager` - Repository management, Git operations

### Meta (1 agent)

- `/agents/agent-builder` - Create new agents for the system

## Quick Examples

### Example 1: Get Backend Help
```
/agents/backend-developer

I need help designing a REST API for user authentication.
```

### Example 2: Security Review
```
/agents/security-analyst

Please review this code for security vulnerabilities.
```

### Example 3: Database Optimization
```
/agents/database-admin

My PostgreSQL queries are slow. Help me optimize them.
```

### Example 4: Multi-Agent Workflow
Instead of using individual agents, you can use **Buddy AI** to coordinate multiple agents:

```
(No slash command - just ask Buddy directly)

Build a secure e-commerce platform with React frontend and Node.js backend.

Buddy will automatically coordinate:
- backend-developer
- frontend-developer
- security-analyst
- database-admin
- qa-tester
```

## Agent vs Buddy AI

**Use Individual Agents When:**
- You need specific expertise
- You want direct access to an agent
- You know exactly which agent you need
- Single-domain task

**Use Buddy AI When:**
- Multi-agent coordination needed
- You're not sure which agent to use
- Complex workflows
- Let the system route intelligently

## How It Works

Each slash command:
1. Loads the agent's `agent.md` definition
2. Accesses the agent's specialized knowledge files
3. Applies the agent's communication style and workflow
4. Responds as that specialized agent

## Agent Structure

Each agent has:
```
agents/[agent-name]/
├── agent.md          # Agent definition and capabilities
├── knowledge/        # Specialized knowledge files
└── tools/           # Tool definitions (if applicable)
```

The slash commands automatically load this context for you.

## Customization

To modify an agent's behavior:
1. Edit `agents/[agent-name]/agent.md`
2. Add/edit knowledge files in `agents/[agent-name]/knowledge/`
3. The slash command will automatically use the updated context

## Creating New Agents

Use the agent-builder to create new agents:

```
/agents/agent-builder

Create a new agent called "mobile-developer" that specializes in React Native and Flutter.
```

## Troubleshooting

**Slash command not found?**
- Ensure you're in the dev-team project directory
- Check that `.claude/commands/agents/` exists
- Restart Claude Code if needed

**Agent not responding correctly?**
- Check that `agents/[agent-name]/agent.md` exists
- Verify the agent's knowledge files are present
- Review the agent's definition for correctness

## Global Access

These slash commands are **globally accessible** within the dev-team project because:
- They're located in `.claude/commands/agents/`
- Claude Code automatically discovers commands in this directory
- They work from any subdirectory in the project

---

**20 specialized agents, all accessible with simple slash commands! 🚀**
