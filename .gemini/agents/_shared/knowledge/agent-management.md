# Agent Management & Orchestration Guide

## Available Agents (24 Total)

### Development (6 agents)
- **frontend-developer**: React, Vue, UI/UX implementation, responsive design
- **backend-developer**: APIs, databases, server-side logic, Node.js/Python
- **devops-engineer**: CI/CD, infrastructure, deployments, automation
- **ml-engineer**: Machine learning, AI models, data pipelines
- **database-admin**: Database optimization, migrations, backups, performance
- **qa-tester**: Testing strategies, automation, quality assurance

### Infrastructure (4 agents)
- **cloud-architect**: AWS, Azure, GCP architecture design
- **system-administrator**: Server management, monitoring, maintenance
- **network-engineer**: Network protocols, troubleshooting, security
- **talos-maintainer**: Talos Linux, Kubernetes, container orchestration

### Security & Compliance (2 agents)
- **security-analyst**: Threat detection, incident response, security audits
- **legal-compliance**: GDPR, regulations, security standards

### Data & Analytics (1 agent)
- **data-analyst**: Data analysis, visualization, insights, reporting

### Product & Design (3 agents)
- **product-manager**: Product strategy, roadmaps, requirements
- **ui-ux-designer**: Design principles, user flows, prototypes
- **scrum-master**: Agile practices, sprint planning, team coordination

### Content (2 agents)
- **bilingual-writer**: English/Hebrew content, blogging, technical writing
- **tech-news-curator**: Personalized tech news aggregation and summaries

### Business (1 agent)
- **business-analyst**: Requirements gathering, process mapping, documentation

### Automation (1 agent)
- **automation-specialist**: n8n workflows, API integrations, process automation

### Personal & Specialized (4 agents)
- **finance-advisor**: Investment strategies, budgeting, financial planning
- **workout-trainer**: Fitness programs, nutrition, exercise routines
- **aliexpress-master**: Product sourcing, supplier management, e-commerce
- **cv-specialist**: Resume optimization, career advice, interview prep

---

## Routing Decision Matrix

### Handle Directly (Buddy)
- General questions or guidance
- System operations (install, configure, troubleshoot)
- Multi-agent coordination
- Tool usage help (Bun, uv, brew, shell)
- Exploratory requests
- MCP server management

### Route to Specialist
- Deep domain expertise required
- Extended single-domain conversation
- Specific technical implementation
- Specialized knowledge needed
- Domain-specific troubleshooting

---

## Orchestration Patterns

### 1. Single Agent
**Use when**: Task fits one domain perfectly
**Example**: "Write a React component" → frontend-developer

### 2. Sequential Multi-Agent
**Use when**: Tasks have dependencies
**Example**: "Build and deploy API"
1. backend-developer → Build API
2. qa-tester → Test API
3. devops-engineer → Deploy

### 3. Parallel Multi-Agent
**Use when**: Independent tasks can run simultaneously
**Example**: "Build full-stack app"
- backend-developer + frontend-developer (parallel)
- Then qa-tester (sequential)

### 4. Iterative Multi-Agent
**Use when**: Requires multiple rounds of refinement
**Example**: "Design and implement secure system"
1. cloud-architect → Design
2. security-analyst → Review
3. cloud-architect → Refine
4. devops-engineer → Implement

---

## Agent Loading Commands

```bash
# Load agent context
load_agent_context("agent-name")

# Load agent configuration
load_agent_config("agent-name")

# Load specific knowledge
load_agent_knowledge("agent-name", "file.md")

# List all agents
list_available_agents()
```

---

## Shared Context Hub (MCP Server)

**🔗 See detailed documentation**: `shared-context-hub.md`

The Agent Context Hub is an MCP server that enables multi-agent coordination through a **blackboard pattern**. All agents can:

- ✅ **Create and track tasks** with dependencies
- ✅ **Share context and results** across agents
- ✅ **Subscribe to events** for coordination
- ✅ **Learn from past outcomes** to improve

### Quick Start Tools

```typescript
// Create a task for an agent
create_agent_task({
  sessionId: "my-workflow-123",
  agentName: "backend-developer",
  task: "Build REST API",
  input: { endpoints: ["/users", "/posts"] },
  dependencies: [] // Task IDs this depends on
});

// Store shared context
store_context({
  sessionId: "my-workflow-123",
  key: "architecture",
  value: { type: "microservices", database: "PostgreSQL" }
});

// Get context (any agent can read this)
get_context({
  sessionId: "my-workflow-123",
  key: "architecture"
});

// Check task status
get_task_status({
  sessionId: "my-workflow-123",
  taskId: "task_xxx"
});

// Get tasks ready to execute
get_ready_tasks({
  sessionId: "my-workflow-123"
});
```

### MCP Configuration

Add to `.geminirc`:
```json
{
  "mcpServers": {
    "agent-context-hub": {
      "command": "bun",
      "args": ["run", "/path/to/.gemini/mcp/agent-context-hub/src/index.ts"]
    }
  }
}
```

---

## Workflow Coordination

### Task Analysis
1. **Understand** the request fully
2. **Identify** required expertise domains
3. **Determine** if single or multi-agent
4. **Plan** execution sequence (sequential/parallel)
5. **Create session** in Agent Context Hub (if multi-agent)
6. **Execute** with appropriate agents using shared context
7. **Verify** quality and completeness

### Result Aggregation
- Use **shared context** to store intermediate results
- Track **task dependencies** for proper sequencing
- Collect outputs from all agents via `get_task_status`
- Ensure consistency across deliverables
- Resolve conflicts or overlaps
- Present unified result to user
