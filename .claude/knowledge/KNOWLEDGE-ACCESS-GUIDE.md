# Agent Knowledge Base Access Guide

## 📚 Knowledge Organization

All agent knowledge is now accessible in **two locations** for maximum discoverability:

### 1. Claude-Optimized Location (Symlinks)
```
.claude/knowledge/agents/[agent-name]/
```
- **Purpose**: Claude Code auto-discovers this location
- **Method**: Symlinks to actual knowledge files
- **Benefit**: Faster context loading

### 2. Original Location (Source Files)
```
agents/[agent-name]/knowledge/
```
- **Purpose**: Logical agent organization
- **Method**: Actual knowledge files
- **Benefit**: Easy maintenance and updates

## 🔗 How Symlinks Work

Each symlink in `.claude/knowledge/agents/` points to the actual knowledge in `agents/`:

```bash
.claude/knowledge/agents/backend-developer
    → ../../../agents/backend-developer/knowledge
```

**Benefits:**
- ✅ No file duplication
- ✅ Single source of truth
- ✅ Updates in one place reflect everywhere
- ✅ Claude Code can discover from `.claude/`
- ✅ Original structure preserved

## 📖 Agent Knowledge Access Pattern

### For Agents (Best Practice)

When an agent needs to access its knowledge, it should:

1. **Primary**: Reference `.claude/knowledge/agents/[agent-name]/`
2. **Fallback**: Reference `agents/[agent-name]/knowledge/`

**Example in agent.md:**
```markdown
## Knowledge Base

Access specialized knowledge from:
- `.claude/knowledge/agents/backend-developer/` (recommended)
- `agents/backend-developer/knowledge/` (fallback)

Available knowledge files:
- api-design-principles.md
- devops-cheatsheet.md
- database-best-practices.md
- ... [list all files]
```

### For Slash Commands

Global slash commands use **absolute paths**:
```markdown
Read: `/Users/rohirikman/.../dev-team/.claude/knowledge/agents/[agent-name]/`
```

Project slash commands use **relative paths**:
```markdown
Read: `.claude/knowledge/agents/[agent-name]/`
```

## 🎯 Knowledge Discovery Pattern

### Best Practice for Agents:

```markdown
1. **Load Agent Identity**
   - Read `agents/[agent-name]/agent.md`

2. **Access Specialized Knowledge**
   - List files in `.claude/knowledge/agents/[agent-name]/`
   - Read relevant files based on user request

3. **Use Shared Resources**
   - Access `agents/_shared/knowledge/` for common patterns
   - Access `agents/_shared/tools/` for shared tools

4. **Dynamic Loading**
   - Load only knowledge files relevant to the current request
   - Don't load all knowledge at once (efficiency)
```

## 📂 Directory Structure

```
.claude/knowledge/agents/
├── backend-developer/       → ../../../agents/backend-developer/knowledge
│   ├── api-design-principles.md
│   ├── devops-cheatsheet.md
│   └── ...
├── frontend-developer/      → ../../../agents/frontend-developer/knowledge
│   ├── react-best-practices.md
│   └── ...
├── security-analyst/        → ../../../agents/security-analyst/knowledge
│   ├── security_resources.md
│   └── ...
└── ... (all 20 agents)

agents/[agent-name]/knowledge/
└── [actual knowledge files - source of truth]
```

## ✅ Verification

Test that symlinks work:

```bash
# Check symlink
ls -la .claude/knowledge/agents/backend-developer

# Read through symlink
cat .claude/knowledge/agents/backend-developer/api-design-principles.md

# Both should work identically
cat agents/backend-developer/knowledge/api-design-principles.md
```

## 🔄 Updating Knowledge

**To add/update knowledge:**

1. Edit files in `agents/[agent-name]/knowledge/`
2. Changes automatically reflect in `.claude/knowledge/agents/[agent-name]/`
3. No need to update symlinks

**Example:**
```bash
# Edit the source
vim agents/backend-developer/knowledge/new-topic.md

# Accessible immediately via symlink
cat .claude/knowledge/agents/backend-developer/new-topic.md
```

## 🌐 Global vs Local Access

### Global Slash Commands (`~/.claude/commands/agents/`)
Use absolute paths:
```
/Users/rohirikman/Library/CloudStorage/.../dev-team/.claude/knowledge/agents/[agent-name]/
```

### Project Slash Commands (`.claude/commands/agents/`)
Use relative paths:
```
.claude/knowledge/agents/[agent-name]/
```

### Buddy AI (Orchestrator)
Can use either:
```
.claude/knowledge/agents/[agent-name]/  (recommended)
agents/[agent-name]/knowledge/          (fallback)
```

## 📋 Agent Knowledge Checklist

When creating or updating an agent, ensure:

- [ ] Knowledge files exist in `agents/[agent-name]/knowledge/`
- [ ] Symlink exists in `.claude/knowledge/agents/[agent-name]/`
- [ ] Agent.md lists all available knowledge files
- [ ] Slash command references correct knowledge path
- [ ] Knowledge is organized logically (categories if many files)
- [ ] Files use clear, descriptive names
- [ ] Markdown formatting is correct

## 🎨 Best Practices

### 1. Knowledge File Naming
```
✅ Good: api-design-principles.md
✅ Good: database-optimization-guide.md
❌ Bad: file1.md
❌ Bad: temp.md
```

### 2. Knowledge Organization
```
agents/backend-developer/knowledge/
├── api-design-principles.md      # APIs
├── database-best-practices.md    # Database
├── devops-cheatsheet.md         # DevOps
└── design-patterns.md           # Patterns
```

### 3. Knowledge in Agent.md
Always list available knowledge:
```markdown
## Knowledge Base

Available resources:
- api-design-principles.md - REST API best practices
- database-best-practices.md - Database integration
- devops-cheatsheet.md - Common DevOps commands
```

### 4. Dynamic Knowledge Loading
```markdown
## Workflow

1. **Understand** - What does the user need?
2. **Select Knowledge** - Which files are relevant?
3. **Load Specific Files** - Read only what's needed
4. **Apply Knowledge** - Use it to help the user
```

## 🔍 Knowledge Access Examples

### Example 1: Backend Developer

```markdown
User request: "How do I design a REST API?"

Agent workflow:
1. Read `.claude/knowledge/agents/backend-developer/api-design-principles.md`
2. Apply principles to user's scenario
3. Provide concrete examples
```

### Example 2: Security Analyst

```markdown
User request: "Review this code for security issues"

Agent workflow:
1. Read `.claude/knowledge/agents/security-analyst/core_function.md`
2. Read `.claude/knowledge/agents/security-analyst/security_resources.md`
3. Perform security analysis
4. Provide remediation recommendations
```

## 📊 Knowledge Metrics

Track knowledge effectiveness:
- **Coverage**: Do we have knowledge for common questions?
- **Accuracy**: Is the knowledge up-to-date?
- **Accessibility**: Can agents find knowledge quickly?
- **Usability**: Is knowledge well-organized?

## 🚀 Future Enhancements

Consider:
- [ ] Knowledge versioning
- [ ] Knowledge search/index
- [ ] Cross-agent knowledge sharing
- [ ] Knowledge validation tests
- [ ] Usage analytics

---

**Summary**: Knowledge is stored in `agents/[agent-name]/knowledge/` and symlinked to `.claude/knowledge/agents/[agent-name]/` for optimal Claude Code discovery and access.
