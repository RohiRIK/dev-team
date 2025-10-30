# Mandatory Inter-Agent Communication Protocol

🚨 **CRITICAL: Proper agent communication is MANDATORY - NOT optional** 🚨

## Context Handoff Format (MANDATORY)

When passing work between agents, you MUST provide complete context.

### Standard Handoff Format

```markdown
## Handoff to [Target Agent Name]

### Task Context
**What needs to be done:** [Clear description]
**Why it's needed:** [Business context]
**Dependencies completed:** [What's already done]
**Blockers/Constraints:** [Any limitations]

### Technical Context
**Related Files:** 
- `path/to/file1.js` - [Purpose/changes made]
- `path/to/file2.ts` - [Purpose/changes made]

**Relevant Functions/Components:**
- `functionName()` in `file.js` - [What it does]
- `ComponentName` in `file.tsx` - [What it does]

**Data Structures/APIs:**
- API endpoint: `POST /api/endpoint` - [Details]
- Data model: `User` - [Schema]

### Requirements
**Must have:**
- [ ] Requirement 1
- [ ] Requirement 2

**Should have:**
- [ ] Nice-to-have 1

**Must NOT:**
- ❌ Don't do X
- ❌ Avoid Y

### Acceptance Criteria
- [ ] Criterion 1 - [How to verify]
- [ ] Criterion 2 - [How to verify]

### Testing Requirements
- [ ] Unit tests for [specific functionality]
- [ ] Integration tests for [specific flow]
- [ ] Manual testing: [specific scenarios]

### Estimates
**Estimated Effort:** [XS/S/M/L/XL]
**Deadline:** [If applicable]

### Resources
**Documentation:** [Links to relevant docs]
**Examples:** [Links to similar implementations]
**Designs:** [Links to Figma/mockups if applicable]

### Point of Contact
**Handing off from:** [Your agent name]
**Questions?** Use Agent Context Hub or ask user
```

---

## Dependency Declarations (MANDATORY)

### When Your Work Depends on Another Agent

If you need output from another agent before you can proceed:

```markdown
## Dependency Declaration

**Agent:** [Your name]
**Task:** [Your task description]

**BLOCKED BY:**
- **Agent:** [Backend-Developer]
- **Task:** Create `/api/users` endpoint
- **Need from them:** 
  - API endpoint URL
  - Request/response format
  - Error codes
  - Authentication requirements
- **Can't proceed without:** API endpoint must be deployed and accessible

**BLOCKING:**
- [Frontend-Developer] - Waiting for my component before they can integrate
- [QA-Tester] - Waiting for my implementation before they can test

**Estimated Unblock Date:** [When you expect to be unblocked]
```

**MANDATORY: Document this in:**
1. Agent Context Hub (share with team)
2. Your task notes
3. User notification if blocking critical path

---

## Parallel Work Coordination (MANDATORY)

When multiple agents work on related tasks simultaneously:

### Coordination Protocol

```markdown
## Parallel Work Coordination

**Agents Involved:**
- [Agent 1]: [Their task]
- [Agent 2]: [Their task]
- [Agent 3]: [Their task]

**Shared Resources:**
- Files that multiple agents might touch
- Databases/APIs that multiple agents access
- Shared state or configuration

**Conflict Prevention:**
- **Agent 1 owns:** `src/api/` folder
- **Agent 2 owns:** `src/components/` folder
- **Agent 3 owns:** `src/utils/` folder
- **Shared:** `src/types/` (coordinate before changes)

**Integration Points:**
- Where Agent 1's work connects to Agent 2
- Data contracts between agents
- When integration will happen

**Communication Channel:**
- Use Agent Context Hub for updates
- Tag relevant agents in messages
- Update status every [frequency]

**Merge Strategy:**
- Agent 1 commits first (foundation)
- Agent 2 commits second (depends on Agent 1)
- Agent 3 commits last (depends on both)
```

---

## Conflict Resolution (MANDATORY)

When agents have competing approaches or conflicts:

### Conflict Resolution Protocol

```markdown
## Conflict Detected

**Conflict Type:** [Technical disagreement / Resource contention / Competing priorities]

**Agents Involved:**
- [Agent 1]: [Their position]
- [Agent 2]: [Their position]

**Specific Conflict:**
[Clear description of what's conflicting]

**Agent 1 Approach:**
**Pros:**
- [Advantage 1]
- [Advantage 2]
**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

**Agent 2 Approach:**
**Pros:**
- [Advantage 1]
- [Advantage 2]
**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

**Recommendation:**
[Objective analysis of which approach is better and why]

**Escalation:**
If agents can't resolve, escalate to user for decision.
```

**MANDATORY: Never proceed with conflicting approaches without resolution.**

---

## Progress Updates (MANDATORY)

### When to Update Other Agents

**MUST update when:**
- ✅ Starting work that others depend on
- ✅ Completing dependency that unblocks others
- ✅ Encountering blocker that affects others
- ✅ Changing approach that impacts interfaces
- ✅ Finishing work that others need
- ✅ Discovering issues with others' work

### Update Format

```markdown
## Progress Update: [Your Agent Name]

**Date:** [Date/Time]
**Task:** [Task name]
**Status:** [In Progress / Completed / Blocked]

**Progress:** [% complete or clear status]

**Completed:**
- [What's done]
- [What's available for others]

**In Progress:**
- [What you're working on now]

**Blocked By:**
- [Any blockers]

**Updates for Dependent Agents:**
- **[@Frontend-Developer]:** API endpoint ready at `/api/users` - see docs
- **[@QA-Tester]:** Feature deployed to staging - ready for testing
- **[@Backend-Developer]:** Found issue with data model - need discussion

**Next Steps:**
- [What you'll do next]

**ETA:** [When you expect to complete]
```

**Post updates to Agent Context Hub.**

---

## Knowledge Sharing (MANDATORY)

### When You Learn Something Important

If you discover something that other agents should know:

```markdown
## Knowledge Share: [Topic]

**From:** [Your agent name]
**Date:** [Date]
**Relevant to:** [Which agents should know]

**What I Learned:**
[Clear explanation]

**Why It Matters:**
[Impact on project/agents]

**Action Items:**
- **For [Agent 1]:** [What they should do with this info]
- **For [Agent 2]:** [What they should do with this info]

**Resources:**
- [Links to docs, examples, etc.]

**Questions?**
[How to get more info]
```

**Post to Agent Context Hub with appropriate tags.**

---

## Interface Contracts (MANDATORY)

When agents integrate their work, document the contract:

### API Contract Example

```markdown
## API Contract: User Management

**Provider:** [Backend-Developer]
**Consumers:** [Frontend-Developer, Mobile-Developer]

### Endpoint
```
POST /api/users
```

### Request Format
```json
{
  "email": "string (required, valid email)",
  "name": "string (required, 2-50 chars)",
  "password": "string (required, min 8 chars)"
}
```

### Success Response (201)
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "createdAt": "ISO 8601 datetime"
}
```

### Error Responses
- **400:** Validation failed
  ```json
  {
    "error": "Validation failed",
    "details": ["Email is invalid", "Password too short"]
  }
  ```
- **409:** Email already exists
- **500:** Server error

### Contract Guarantees
**Provider promises:**
- Response time < 200ms (95th percentile)
- Idempotent for duplicate requests
- Email uniqueness enforced
- Passwords hashed with bcrypt

**Consumers promise:**
- Send valid email format
- Include all required fields
- Handle all documented error cases

### Breaking Changes
**Provider MUST:**
- Give 2 weeks notice before breaking changes
- Maintain backward compatibility when possible
- Version API (`/api/v2/users`) for major changes

**Last Updated:** [Date]
**Version:** 1.0
```

---

## Communication Channels (MANDATORY)

### Use Appropriate Channel for Communication

| Channel | Use For | Format |
|---------|---------|--------|
| **Agent Context Hub** | Team-wide updates, progress, blockers | Structured updates |
| **Agent Loader** | Consulting expert agents | Specific questions |
| **Task Handoffs** | Passing work to another agent | Complete context package |
| **User Escalation** | Conflicts, major decisions, blockers | Clear problem statement |

---

## Response Time Expectations (MANDATORY)

When another agent requests information from you:

- **Urgent (blocking critical path):** Respond within 1 hour
- **High priority:** Respond within 4 hours
- **Normal:** Respond within 1 day
- **Low priority:** Respond within 2 days

**If you can't respond in time, acknowledge receipt and provide ETA.**

---

## Handoff Checklist (MANDATORY)

Before handing off work to another agent, verify:

- [ ] **Complete context provided** - All information needed
- [ ] **Files identified** - Specific paths and purposes
- [ ] **Requirements clear** - What needs to be done
- [ ] **Acceptance criteria defined** - How to verify success
- [ ] **Dependencies noted** - What must be done first
- [ ] **Blockers documented** - Any known issues
- [ ] **Estimates provided** - Time/effort estimates
- [ ] **Resources linked** - Docs, examples, designs
- [ ] **Point of contact clear** - How to ask questions

**Incomplete handoffs will be rejected.**

---

## No Solo Work on Integrated Features

When working on features that integrate with other agents' work:

**MANDATORY:**
- Communicate your approach before implementing
- Share interface designs/contracts
- Coordinate integration timing
- Test integration together
- Document the integration

**You CANNOT:**
- ❌ Make breaking changes without notice
- ❌ Change interfaces without coordinating
- ❌ Assume other agents will adapt to your changes
- ❌ Work in isolation on integrated features

---

## Communication is Not Optional

**Proper agent communication is MANDATORY.**

Agents working in isolation cause:
- Integration failures
- Duplicate work
- Conflicting implementations
- Missed dependencies
- Project delays

**Poor communication = incomplete work.**
