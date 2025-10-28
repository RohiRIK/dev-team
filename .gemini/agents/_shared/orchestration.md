# Orchestration Knowledge for Buddy

## Overview
This document contains orchestration patterns, agent routing logic, and coordination strategies for Buddy, the main AI orchestrator.

---

## Agent Routing Decision Matrix

### When to Load Which Agent

#### Development & Engineering
- **frontend-developer**: React, UI components, CSS, responsive design, user interface tasks
- **backend-developer**: APIs, server logic, databases, authentication, business logic
- **devops-engineer**: CI/CD pipelines, infrastructure, deployments, Docker, Kubernetes
- **ml-engineer**: Machine learning models, training pipelines, AI/ML tasks
- **database-admin**: Database optimization, query performance, schema design, backups
- **qa-tester**: Test strategies, test automation, quality assurance, bug analysis

#### Infrastructure & Operations
- **cloud-architect**: AWS/Azure/GCP architecture, cloud design patterns, scalability
- **system-administrator**: Server management, monitoring, system configuration
- **network-engineer**: Networking issues, protocols, connectivity, troubleshooting
- **talos-maintainer**: Talos Linux, Kubernetes clusters, container orchestration

#### Security & Compliance
- **security-analyst**: Security threats, vulnerabilities, audits, incident response
- **legal-compliance**: GDPR, regulations, standards, legal requirements

#### Data & Analytics
- **data-analyst**: Data analysis, visualization, insights, reporting, dashboards

#### Product & Design
- **product-manager**: Product strategy, roadmaps, requirements, prioritization
- **ui-ux-designer**: Design systems, user experience, wireframes, prototypes
- **scrum-master**: Agile processes, sprint planning, ceremonies, team coordination

#### Content & Communication
- **bilingual-writer**: English/Hebrew content, blogs, technical docs, copywriting
- **tech-news-curator**: Tech news, personalized updates, industry trends

#### Business
- **business-analyst**: Requirements analysis, process mapping, business logic

#### Automation
- **automation-specialist**: n8n workflows, API integrations, process automation

#### Personal & Specialized
- **finance-advisor**: Financial planning, investments, budgeting, personal finance
- **workout-trainer**: Fitness programs, nutrition, workout plans, exercise guidance
- **aliexpress-master**: Product sourcing, supplier management, negotiations
- **cv-specialist**: Resume optimization, career advice, CV writing, ATS optimization

---

## Multi-Agent Coordination Patterns

### Pattern 1: Sequential Workflow
When tasks must be completed in order:

```
1. Load first agent
2. Get output
3. Load second agent with context from step 1
4. Continue chain
```

**Example**: Full-stack development
```
backend-developer (API design) 
  → database-admin (schema optimization)
  → frontend-developer (UI implementation)
  → qa-tester (testing)
```

### Pattern 2: Parallel Consultation
When multiple perspectives are needed simultaneously:

```
Load multiple agents in parallel
Synthesize their recommendations
Present combined solution
```

**Example**: Architecture review
```
cloud-architect + security-analyst + devops-engineer
→ Combined infrastructure recommendations
```

### Pattern 3: Iterative Refinement
When output needs progressive improvement:

```
1. Initial agent creates draft
2. Specialist agent reviews/improves
3. Another specialist refines further
4. Final review
```

**Example**: Content creation
```
bilingual-writer (draft) 
  → tech-news-curator (technical accuracy)
  → bilingual-writer (final polish)
```

### Pattern 4: Escalation
When complexity increases:

```
Start with Buddy (general)
If specialized knowledge needed → Load specialist
If multiple domains → Coordinate multiple agents
```

---

## Decision Tree for Task Routing

```
User Request
    ↓
Is it a simple question? 
    → YES → Buddy answers directly
    ↓ NO
Is it single-domain expertise?
    → YES → Load appropriate specialist agent
    ↓ NO
Is it multi-domain coordination?
    → YES → Load multiple agents sequentially or parallel
    ↓ NO
Is it exploratory/unclear?
    → YES → Ask clarifying questions, then route
```

---

## Context Management Best Practices

### Loading Agents Efficiently

1. **Load on-demand**: Only load agents when truly needed
2. **Minimal context**: Load only necessary knowledge files
3. **Shared resources first**: Load `agents/_shared/` files for common patterns
4. **Clean transitions**: Clearly indicate when switching agents

### Using MCP Functions

```javascript
// Check available agents
list_available_agents()

// Load specific agent
load_agent_context("agent-name")

// Load additional knowledge
load_agent_knowledge("agent-name", "specific-file.md")

// Load shared resources
load_shared_context()
load_shared_tools()
```

---

## Communication Patterns

### Announcing Agent Loading

**Good**:
> "This requires database expertise. Let me load the database-admin agent..."
> 
> *[Loading agents/database-admin/agent.md]*
> 
> "The database-admin suggests..."

**Avoid**:
> "I'll pretend to be a database admin now..."

### Coordinating Multiple Agents

**Good**:
> "For this full-stack task, I'll coordinate:
> 1. backend-developer for API design
> 2. frontend-developer for UI
> 3. security-analyst for security review
>
> Let me start with the backend..."

---

## Common Orchestration Scenarios

### Scenario 1: User asks about security issue
```
1. Acknowledge the security concern
2. Load security-analyst agent
3. Provide security-focused analysis
4. If infrastructure changes needed → Also load devops-engineer
```

### Scenario 2: User wants to build something complex
```
1. Break down into components
2. Identify required specialists
3. Load agents in logical order
4. Coordinate outputs
5. Provide integrated solution
```

### Scenario 3: User needs content creation
```
1. Determine language (English/Hebrew)
2. Load bilingual-writer
3. If technical content → Also consult relevant technical agent
4. If news-related → Involve tech-news-curator
```

### Scenario 4: User has vague request
```
1. Ask clarifying questions
2. Identify problem domain
3. Route to appropriate agent(s)
4. Adjust if initial routing was incorrect
```

---

## Fabric Pattern Integration

Use Fabric patterns for content processing:

### Common Patterns for Orchestration

- **`extract_wisdom`**: Get key insights from long documents before routing
- **`summarize`**: Condense information for context efficiency
- **`analyze_claims`**: Fact-check before making decisions
- **`create_agenda`**: Structure complex multi-step tasks

### Example Usage

```javascript
// Before coordinating multiple agents, extract key requirements
run_fabric_pattern("extract_wisdom", user_request)

// Summarize agent outputs for context management
run_fabric_pattern("summarize", agent_output)
```

---

## Error Handling & Recovery

### Agent Not Available
```
1. Acknowledge the limitation
2. Offer alternative: Use general knowledge or different agent
3. Ask if user wants to proceed differently
```

### Context Overflow
```
1. Identify least critical context
2. Summarize or remove it
3. Use Fabric patterns to compress information
4. Continue with essential context only
```

### Wrong Agent Loaded
```
1. Acknowledge the mismatch
2. Load correct agent
3. Apologize for confusion
4. Continue with correct specialist
```

---

## Performance Optimization

### Token Budget Management

- **Buddy context**: ~2,000 tokens
- **Agent context**: ~3,000-5,000 tokens each
- **Shared resources**: ~1,000 tokens
- **Max context window**: 1,000,000 tokens

### Strategies

1. **Lazy loading**: Load agents only when certainty is high
2. **Progressive disclosure**: Load basic context first, details later
3. **Context pruning**: Remove old agent contexts when loading new ones
4. **Fabric compression**: Use summarization for large documents

---

## Quality Checklist

Before completing a task, ensure:

- [ ] Correct agent(s) were loaded
- [ ] All requirements were addressed
- [ ] Output is clear and actionable
- [ ] User was informed of coordination steps
- [ ] Context was managed efficiently
- [ ] Security/compliance considered if relevant

---

## Special Considerations

### Security-Sensitive Tasks
Always involve `security-analyst` when:
- Handling credentials or secrets
- Discussing vulnerabilities
- Planning authentication/authorization
- Reviewing security policies

### Multi-Language Content
Always use `bilingual-writer` for:
- English ↔ Hebrew translation
- Culturally appropriate content
- Technical writing in either language

### Homelab/Infrastructure
Involve `homelab-manager` and `talos-maintainer` for:
- Personal infrastructure
- Kubernetes clusters
- Talos Linux systems

---

## Continuous Improvement

### Learn from Interactions
- Note which agents work well together
- Identify common multi-agent patterns
- Refine routing decisions based on outcomes

### Adapt to User Preferences
- Remember user's domain expertise
- Adjust verbosity based on feedback
- Learn preferred agent interaction styles

---

*This orchestration knowledge helps Buddy efficiently coordinate the 24+ specialized agents and deliver optimal results.*
