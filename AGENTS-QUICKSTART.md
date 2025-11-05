# Agent Slash Commands - Quick Start Guide

## ✅ All 20 Agents Now Available as Slash Commands!

You can now invoke any of the 20 specialized agents directly using slash commands from anywhere in Claude Code.

## 🚀 How to Use

Simply type `/agents/` followed by the agent name:

```
/agents/backend-developer
/agents/security-analyst
/agents/database-admin
... etc
```

## 📋 Complete Agent List

### Development & Engineering
```
/agents/backend-developer     - APIs, Node.js, Python, TypeScript, Bun
/agents/frontend-developer    - React, UI components, CSS, responsive design
/agents/ml-engineer          - Machine learning, training pipelines, MLOps
/agents/database-admin       - Database optimization, SQL, performance
/agents/qa-tester           - Testing strategies, automation, QA
```

### Infrastructure & Operations
```
/agents/cloud-architect        - AWS/Azure/GCP architecture, cost optimization
/agents/devops-engineer       - CI/CD, Docker, Kubernetes, Terraform
/agents/system-administrator  - Server management, monitoring, configuration
/agents/network-engineer      - Networking, protocols, troubleshooting
/agents/system-architect      - System design, architecture patterns
```

### Security
```
/agents/security-analyst  - Cloud security, threat detection, incident response
/agents/pentaster        - Penetration testing, vulnerability assessment
```

### Product & Design
```
/agents/product-manager  - Product strategy, roadmaps, requirements
/agents/scrum-master    - Agile processes, sprint planning, ceremonies
/agents/ui-ux-designer  - UX design, wireframes, accessibility
/agents/content-creator - Technical writing, documentation, blogs
```

### Data & Automation
```
/agents/data-analyst           - Data analysis, visualization, statistics
/agents/automation-specialist  - n8n workflows, API integrations
/agents/github-manager        - Repository management, Git operations
```

### Meta
```
/agents/agent-builder  - Create new agents for the system
```

## 💡 Usage Examples

### Example 1: Direct Agent Invocation

```
/agents/backend-developer

I need to design a REST API for a user authentication system.
The API should support:
- User registration
- Login/logout
- Password reset
- JWT token authentication
```

The backend-developer agent will respond with API design recommendations.

### Example 2: Security Review

```
/agents/security-analyst

Please review this authentication code for security vulnerabilities:
[paste code here]
```

The security-analyst will perform a security audit.

### Example 3: Database Help

```
/agents/database-admin

My PostgreSQL queries are slow. Here are the problematic queries:
SELECT * FROM users WHERE email LIKE '%@example.com%';
```

The database-admin will analyze and provide optimization recommendations.

### Example 4: UI/UX Design

```
/agents/ui-ux-designer

I need to design a user-friendly checkout flow for an e-commerce site.
The flow should handle:
- Shopping cart review
- Shipping information
- Payment details
- Order confirmation
```

The ui-ux-designer will provide wireframes and UX recommendations.

## 🆚 Slash Commands vs Buddy AI

### Use Slash Commands When:
- ✅ You know exactly which agent you need
- ✅ You want direct access to specific expertise
- ✅ Single-domain task
- ✅ You want that agent's specialized knowledge immediately

### Use Buddy AI (Default) When:
- ✅ You're not sure which agent to use
- ✅ Task requires multiple agents
- ✅ You want intelligent routing
- ✅ Complex multi-step workflows

**Buddy AI Example:**
```
(Just ask normally, no slash command)

Build a secure web application with user authentication,
React frontend, and Node.js backend.

Buddy will coordinate:
1. backend-developer (API design)
2. security-analyst (security review)
3. frontend-developer (React UI)
4. database-admin (database schema)
5. qa-tester (testing strategy)
```

## 🎯 Quick Reference

| Need | Use This Agent |
|------|---------------|
| API Development | `/agents/backend-developer` |
| React/UI Components | `/agents/frontend-developer` |
| Database Issues | `/agents/database-admin` |
| Security Review | `/agents/security-analyst` |
| Cloud Architecture | `/agents/cloud-architect` |
| CI/CD Pipeline | `/agents/devops-engineer` |
| Test Strategy | `/agents/qa-tester` |
| UX Design | `/agents/ui-ux-designer` |
| Data Analysis | `/agents/data-analyst` |
| Workflow Automation | `/agents/automation-specialist` |
| Network Issues | `/agents/network-engineer` |
| Product Planning | `/agents/product-manager` |
| Documentation | `/agents/content-creator` or `/agents/github-manager` |
| Create New Agent | `/agents/agent-builder` |

## 📂 File Structure

```
.claude/commands/agents/
├── README.md                    # Agent commands documentation
├── backend-developer.md         # Backend agent command
├── frontend-developer.md        # Frontend agent command
├── security-analyst.md          # Security agent command
├── database-admin.md            # Database agent command
├── devops-engineer.md          # DevOps agent command
├── cloud-architect.md          # Cloud agent command
├── automation-specialist.md    # Automation agent command
├── data-analyst.md             # Data agent command
├── qa-tester.md                # QA agent command
├── ui-ux-designer.md           # UI/UX agent command
├── product-manager.md          # Product agent command
├── scrum-master.md             # Scrum agent command
├── ml-engineer.md              # ML agent command
├── github-manager.md           # GitHub agent command
├── content-creator.md          # Content agent command
├── system-administrator.md     # SysAdmin agent command
├── system-architect.md         # Architecture agent command
├── network-engineer.md         # Network agent command
├── pentaster.md                # Pentest agent command
└── agent-builder.md            # Agent builder command
```

## 🔧 How It Works

Each slash command:
1. **Loads** the agent's `agents/[agent-name]/agent.md` definition
2. **Accesses** the agent's specialized knowledge from `agents/[agent-name]/knowledge/`
3. **Applies** the agent's communication style and workflow
4. **Responds** as that specialized agent with full context

## 🌐 Global Access

These commands work **globally** because:
- Located in `.claude/commands/agents/`
- Claude Code auto-discovers commands in this directory
- Works from any subdirectory in the project
- No configuration needed - just use them!

## 🎨 Customizing Agents

To modify an agent's behavior:

1. **Edit agent definition**: `agents/[agent-name]/agent.md`
2. **Update knowledge**: Add/edit files in `agents/[agent-name]/knowledge/`
3. **Changes apply immediately** - slash command uses the updated context

## 🆕 Creating New Agents

Use the agent-builder to create new specialized agents:

```
/agents/agent-builder

Create a new agent called "mobile-developer" specializing in:
- React Native
- Flutter
- iOS/Android best practices
- Mobile app architecture
```

The agent-builder will:
1. Research the domain
2. Create knowledge files
3. Generate agent.md and agent.json
4. Create tests
5. Add to the agent system

## ✅ Complete Setup Summary

**What was created:**
- ✅ 20 agent slash commands in `.claude/commands/agents/`
- ✅ Buddy AI orchestrator in `.gemini/agent.md`
- ✅ Agent Context Hub documentation
- ✅ Complete usage guides and documentation

**How to access:**
- **Individual agents**: `/agents/[agent-name]`
- **Buddy orchestrator**: Just chat normally (no command needed)
- **Agent Context Hub**: Via Buddy's MCP tools

## 🚦 Testing Your Setup

Try these test commands:

```
# Test 1: Check available agents
/agents/agent-builder
List all available agents in the system.

# Test 2: Backend development
/agents/backend-developer
What are the best practices for REST API design?

# Test 3: Security review
/agents/security-analyst
What security measures should I implement for user authentication?

# Test 4: Multi-agent (use Buddy)
(No slash command - just ask Buddy)
Help me build a full-stack application with authentication.
```

## 📚 Additional Resources

- `BUDDY-SETUP.md` - Buddy AI orchestrator guide
- `CLAUDE.md` - Development workflow documentation
- `.claude/commands/agents/README.md` - Agent commands reference
- `agents/_shared/orchestration.md` - Agent routing logic

---

## 🎉 You're All Set!

You now have **20 specialized AI agents** at your fingertips, accessible with simple slash commands!

**Start using them right away:**
```
/agents/backend-developer
/agents/security-analyst
/agents/database-admin
... and 17 more!
```

**Happy coding! 🚀**
