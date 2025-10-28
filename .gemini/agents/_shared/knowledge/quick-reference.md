# Quick Reference Cheat Sheet

## Commands

```bash
# Agent Management
/list-agents                    # Show all agents
/switch-agent <name>            # Switch to agent
/switch-agent buddy             # Back to Buddy
/fabric <pattern>               # Run fabric pattern

# System
bun run agent-flywheel          # Dashboard
bun run test-agent <name>       # Test agent
bun run create-agent            # Create agent
bun install                     # Install deps

# Package Management
bun install / bun add pkg       # JavaScript/TypeScript
uv pip install pkg / uv venv    # Python
brew install pkg / brew update  # System

# MCP (auto-start with Gemini CLI)
cd mcp/agent-loader && bun run dev
cd mcp/fabric-integration && bun run dev
```

## Agent Quick Reference

| Domain | Agent | Use For |
|--------|-------|---------|
| **Frontend** | frontend-developer | React, UI/UX, components |
| **Backend** | backend-developer | APIs, databases, servers |
| **DevOps** | devops-engineer | CI/CD, deployments |
| **Security** | security-analyst | Threats, audits |
| **Cloud** | cloud-architect | AWS, Azure, GCP |
| **Database** | database-admin | SQL, optimization |
| **ML** | ml-engineer | Models, pipelines |
| **QA** | qa-tester | Testing, automation |
| **Writing** | bilingual-writer | Content (EN/HE) |
| **Finance** | finance-advisor | Budgets, investing |
| **Fitness** | workout-trainer | Exercise, nutrition |

## Top Fabric Patterns

```bash
/fabric extract_wisdom     # Extract insights from content
/fabric summarize          # Create concise summary
/fabric improve_writing    # Enhance text quality
/fabric analyze_claims     # Fact-check content
/fabric explain_code       # Code explanations
/fabric create_quiz        # Generate questions
```

## MCP Functions

```bash
# Agent Loader
list_available_agents()
load_agent_context("name")
load_agent_knowledge("name", "file")

# Fabric
list_fabric_patterns()
run_fabric_pattern("pattern", input)
run_fabric_pipeline(["pattern1", "pattern2"], input)
```
