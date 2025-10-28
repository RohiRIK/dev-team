# Task Breakdown Format Guide

## Overview

When breaking down user stories or epics into sub-tasks, use clean, hierarchical markdown formatting with proper indentation. This creates clear, readable task lists that are easy to track and manage.

## CRITICAL: Research Before Breaking Down Tasks

**Before creating any task breakdown, you MUST research thoroughly using all available MCP tools to ensure accurate, informed task creation.**

**🚨 IMPORTANT: Follow ReAct Framework Properly**
- Complete EACH step (Thought → Action → Observation) FULLY before moving to next
- COMMIT each cycle before proceeding
- Never skip steps or rush through research
- Build each step on previous findings

**📚 Complete Guides:**
- `../../_shared/knowledge/deep-research-strategy.md` - Overall research strategy (ReAct framework, CoT, Prompt Chaining)
- `../../_shared/knowledge/react-framework-tips.md` - **Step-by-step ReAct tips and best practices**

**See `../../_shared/knowledge/react-framework-tips.md` for complete implementation guide based on industry best practices (ReAct framework, Chain-of-Thought, Prompt Chaining).**

### Required Research Process

1. **Use Sequential Thinking MCP** - Plan the breakdown strategy
   ```
   Think through: What are the logical steps? What dependencies exist? 
   What could go wrong? What's the optimal order?
   ```

2. **Use Context7 MCP** - Search for similar past implementations
   ```
   Search for: Previous similar features, past solutions, lessons learned,
   common patterns, architectural decisions
   ```

3. **Use DeepWiki MCP** - Get comprehensive technical knowledge
   ```
   Research: Technical concepts, best practices, framework documentation,
   architecture patterns, security considerations
   ```

4. **Use Fetch MCP** - Get latest documentation and resources
   ```
   Fetch: Official documentation, API references, migration guides,
   current best practices, community recommendations
   ```

5. **Use Agent Context Hub MCP** - Check shared knowledge
   ```
   Review: Previous task outcomes, team learnings, known issues,
   documented solutions, reusable components
   ```

6. **Use Agent Loader MCP** - Load relevant agent expertise
   ```
   Load context from: Backend-developer, frontend-developer, devops-engineer,
   security-analyst, database-admin, etc. - whoever is relevant to the task
   ```

### Research Workflow Example

**USER REQUEST:**
```
"Can you break down the 'Implement OAuth2 Authentication' feature into sub-tasks?"
```

**YOUR RESPONSE (MANDATORY):**
```
I'll conduct deep research first using all available MCP tools to ensure an accurate, 
well-informed task breakdown. This will take a few minutes...

[Research Phase - Execute ALL steps]:

1. Sequential Thinking: Planning OAuth2 implementation strategy...
   ✓ Identified: Authorization flow, token management, security, deployment
   ✓ Dependencies: User system must exist, HTTPS required
   ✓ Risks: Token security, session management, mobile compatibility

2. Context7 Search: Checking past OAuth2 implementations...
   ✓ Found: Previous project used Passport.js successfully
   ✓ Issues: Had problems with token refresh, resolved with Redis
   ✓ Recommendation: Team prefers OAuth2 with PKCE flow

3. DeepWiki Research: OAuth2 technical knowledge...
   ✓ Protocol: Authorization Code Flow with PKCE for security
   ✓ Best Practice: JWT tokens with RS256 signing
   ✓ Security: Must implement refresh token rotation

4. Fetch Documentation: Latest OAuth2 guides...
   ✓ Retrieved: oauth.net specifications
   ✓ Retrieved: Passport.js v0.6.0 docs (latest)
   ✓ Note: Browser notification permission UX considerations

5. Agent Context Hub: Team knowledge...
   ✓ Redis infrastructure available for token storage
   ✓ Existing user authentication system (email/password)
   ✓ HTTPS already configured in production

6. Agent Loader: Expert validation...
   ✓ Backend-Developer: Recommends Passport.js + JWT, estimates 3-4 days
   ✓ Security-Analyst: Requires PKCE flow + token rotation, needs 1 day review
   ✓ Frontend-Developer: UI flows 2 days, token storage 1 day
   ✓ DevOps-Engineer: Infrastructure setup 1 day, monitoring 0.5 day
   ✓ QA-Tester: Comprehensive testing 2 days

[Research Complete ✅]

Based on comprehensive research, here's the task breakdown:

- [ ] Story: Implement OAuth2 Authentication with PKCE
	- [ ] [Backend-Developer] Research and select OAuth2 library
		- Compare Passport.js vs Auth0 vs custom
		- Verify PKCE support and community activity
		- Document choice with justification
	- [ ] [Backend-Developer] Implement authorization server
		- Set up Passport.js with OAuth2 strategy
		- Configure JWT token generation (RS256)
		- Implement PKCE challenge/verifier
		- Add refresh token rotation for security
		- Set token expiration (access: 15min, refresh: 7days)
	- [ ] [Backend-Developer] Create protected API endpoints
		- Add JWT validation middleware
		- Implement role-based access control
		- Add token refresh endpoint
	- [ ] [Frontend-Developer] Build OAuth2 login flow
		- Create authorization redirect with PKCE
		- Handle callback and token exchange
		- Implement secure token storage (httpOnly cookies)
		- Add automatic token refresh logic
		- Handle session timeout gracefully
	- [ ] [Security-Analyst] Security review
		- Review PKCE implementation
		- Test token security and rotation
		- Validate CSRF protection
		- Check HTTPS enforcement
	- [ ] [DevOps-Engineer] Infrastructure setup
		- Configure environment variables
		- Set up Redis for token storage
		- Configure CORS policies
		- Add monitoring and alerts
	- [ ] [QA-Tester] Comprehensive testing
		- Test full authorization flow
		- Test token refresh mechanism  
		- Test across browsers
		- Load test with 1000 concurrent users

Total Effort: ~10-12 developer days (can be partially parallelized)
```

**THIS IS MANDATORY** - Never skip research when user asks for task breakdown!

```markdown
## Example: Breaking Down "Implement OAuth2 Authentication"

### Step 1: Sequential Thinking
- Think through authentication flow
- Identify all components needed
- Map out dependencies
- Consider security implications

### Step 2: Context7 Search
- Search: "OAuth2 implementation past projects"
- Search: "authentication flow best practices"
- Review: Previous security implementations

### Step 3: DeepWiki Research
- Research: OAuth2 protocol specifications
- Research: JWT token management
- Research: Session handling patterns

### Step 4: Fetch Documentation
- Fetch: https://oauth.net/2/ (Official OAuth2 docs)
- Fetch: Framework-specific auth guides
- Fetch: Security best practices

### Step 5: Agent Context Hub
- Check: Previous auth implementations
- Review: Known security issues
- Get: Reusable auth components

### Step 6: Load Agent Expertise
- Load: backend-developer (API implementation)
- Load: frontend-developer (UI flows)
- Load: security-analyst (security review)
- Load: devops-engineer (deployment needs)

### Result: Well-Informed Task Breakdown
Only after completing ALL research steps above, create the task breakdown:

- [ ] Story: Implement OAuth2 Authentication
	- [ ] [Backend-Developer] Research and choose OAuth2 library
	- [ ] [Backend-Developer] Implement authorization server
		- [ ] Set up token generation
		- [ ] Implement token validation
		- [ ] Add refresh token logic
	- [ ] [Backend-Developer] Create protected API endpoints
	- [ ] [Frontend-Developer] Build OAuth2 login flow
		- [ ] Create authorization redirect
		- [ ] Handle callback and token exchange
		- [ ] Implement token storage
	- [ ] [Security-Analyst] Security review of implementation
		- [ ] Review token security
		- [ ] Test for common vulnerabilities
		- [ ] Validate HTTPS enforcement
	- [ ] [DevOps-Engineer] Configure OAuth2 in production
		- [ ] Set up environment variables
		- [ ] Configure CORS policies
		- [ ] Set up monitoring
	- [ ] [QA-Tester] Test complete authentication flow
```

### Why Research is Critical

❌ **Without Research:**
```markdown
- [ ] Story: Add authentication
	- [ ] [Backend-Developer] Make login work
	- [ ] [Frontend-Developer] Add login button
	- [ ] [QA-Tester] Test it
```
*Problems: Vague, missing critical steps, no security considerations, 
no deployment planning, likely to fail*

✅ **With Proper Research:**
```markdown
- [ ] Story: Implement OAuth2 Authentication with JWT tokens
	- [ ] [Backend-Developer] Research OAuth2 library (compare passport.js vs auth0)
	- [ ] [Backend-Developer] Implement authorization server with PKCE flow
		- [ ] Set up token generation with RS256 signing
		- [ ] Implement token validation middleware
		- [ ] Add refresh token rotation for security
		- [ ] Set token expiration (access: 15min, refresh: 7days)
	- [ ] [Backend-Developer] Create protected API endpoints with role-based access
	- [ ] [Frontend-Developer] Build OAuth2 login flow with PKCE
		- [ ] Create authorization redirect with state parameter
		- [ ] Handle callback and secure token exchange
		- [ ] Implement secure token storage (httpOnly cookies)
		- [ ] Add automatic token refresh logic
	- [ ] [Security-Analyst] Security review per OWASP guidelines
		- [ ] Review token security and CSRF protection
		- [ ] Test for XSS and injection vulnerabilities
		- [ ] Validate HTTPS enforcement and HSTS
		- [ ] Verify secure session management
	- [ ] [DevOps-Engineer] Configure OAuth2 infrastructure
		- [ ] Set up environment variables for secrets
		- [ ] Configure CORS policies for callbacks
		- [ ] Set up token signing keys rotation
		- [ ] Configure monitoring and alerting
	- [ ] [QA-Tester] Comprehensive authentication testing
		- [ ] Test authorization code flow
		- [ ] Test token refresh mechanism
		- [ ] Test session timeout handling
		- [ ] Test cross-device scenarios
```
*Result: Specific, actionable, secure, complete - much more likely to succeed!*

## Formatting Standards

### ✅ CORRECT Format - Use Indentation

Use tabs or 4 spaces for sub-tasks to create proper hierarchy:

```markdown
- [ ] Main Task: Implement OpenSearch Security
	- [ ] [System-Architect/DevOps-Engineer] Research OpenSearch Security Plugin Configuration
	- [ ] [System-Architect/DevOps-Engineer] Modify Docker Compose and OpenSearch Configuration to Enable Security Plugin
	- [ ] [Database-Admin] Initialize Security with an Admin User
	- [ ] [Database-Admin] Define and Implement Core Roles and Permissions
	- [ ] [Database-Admin] Create and Map Users to Roles
	- [ ] [System-Architect/DevOps-Engineer] Restrict Network Access to OpenSearch
	- [ ] [System-Architect/DevOps-Engineer] Update Dependent Services to Authenticate with OpenSearch
	- [ ] [Security-Analyst/QA-Tester] Verify Security Configuration
	- [ ] [Database-Admin/DevOps-Engineer] Implement Credential Rotation Policy
```

### ❌ INCORRECT Format - Don't Use Bold Prefixes

Avoid using "**Sub-task:**" or similar prefixes:

```markdown
- [ ] Main Task: Implement OpenSearch Security
    - [ ] **Sub-task:** [System-Architect/DevOps-Engineer] Research OpenSearch Security Plugin Configuration
    - [ ] **Sub-task:** [System-Architect/DevOps-Engineer] Modify Docker Compose...
```

The indentation alone shows the hierarchy - no need for explicit labels!

## Task Hierarchy Levels

### Level 1: Epic or Feature
```markdown
- [ ] Epic: User Authentication System
```

### Level 2: User Stories or Main Tasks
```markdown
- [ ] User Story: As a user, I want to log in securely
```

### Level 3: Sub-tasks (Indented)
```markdown
	- [ ] [Backend-Developer] Implement JWT authentication
	- [ ] [Frontend-Developer] Create login form component
	- [ ] [QA-Tester] Test authentication flow
```

### Level 4: Technical Steps (Double Indented)
```markdown
		- [ ] Set up JWT library
		- [ ] Create auth middleware
		- [ ] Add token validation
```

## Agent Assignment Format

Always include responsible agents in square brackets at the start of the task:

```markdown
- [ ] [Agent-Name] Task description
- [ ] [Agent1/Agent2] Shared responsibility task
- [ ] [Agent1/Agent2/Agent3] Multi-agent collaboration task
```

### Examples:

```markdown
- [ ] [Backend-Developer] Build REST API endpoints
- [ ] [Frontend-Developer/UI-UX-Designer] Design and implement dashboard
- [ ] [Security-Analyst/Pentester/QA-Tester] Security audit and testing
```

## Complete Example

Here's a full epic breakdown with proper formatting:

```markdown
- [ ] Epic: Implement Multi-Factor Authentication

- [ ] Story: Set up MFA infrastructure
	- [ ] [DevOps-Engineer] Configure authentication service
	- [ ] [Backend-Developer] Implement MFA token generation
		- [ ] Research TOTP libraries
		- [ ] Set up token storage
		- [ ] Create token validation endpoint
	- [ ] [Security-Analyst] Review security implementation
	
- [ ] Story: Build user-facing MFA features
	- [ ] [Frontend-Developer] Create MFA setup wizard
		- [ ] QR code generation component
		- [ ] Backup codes display
		- [ ] Verification input form
	- [ ] [UI-UX-Designer] Design MFA user flows
	- [ ] [QA-Tester] Test MFA user experience
		- [ ] Test setup flow
		- [ ] Test login with MFA
		- [ ] Test recovery flow

- [ ] Story: Documentation and rollout
	- [ ] [Tech-Writer/Content-Creator] Write user documentation
	- [ ] [Scrum-Master] Plan phased rollout
	- [ ] [DevOps-Engineer] Set up monitoring and alerts
```

## Best Practices

### 1. **Clear Agent Assignment**
Always specify which agent(s) are responsible:
```markdown
✅ - [ ] [Backend-Developer] Create API endpoint
❌ - [ ] Create API endpoint
```

### 2. **Actionable Descriptions**
Start with a verb and be specific:
```markdown
✅ - [ ] [QA-Tester] Test login flow with invalid credentials
❌ - [ ] [QA-Tester] Login testing
```

### 3. **Proper Indentation**
Use consistent indentation (tabs or 4 spaces):
```markdown
✅ - [ ] Main Task
	- [ ] Sub-task 1
		- [ ] Detail 1
		- [ ] Detail 2
	- [ ] Sub-task 2

❌ - [ ] Main Task
  - [ ] Sub-task 1 (2 spaces - inconsistent)
    - [ ] Detail 1 (4 spaces - inconsistent)
```

### 4. **Reasonable Granularity**
Break down tasks into 1-2 day chunks:
```markdown
✅ - [ ] [Backend-Developer] Implement user registration endpoint
	- [ ] Create database schema
	- [ ] Build validation logic
	- [ ] Add error handling
	- [ ] Write unit tests

❌ - [ ] [Backend-Developer] Build entire user management system
```

### 5. **Dependencies and Order**
List tasks in logical execution order:
```markdown
- [ ] Story: Deploy new feature
	- [ ] [Backend-Developer] Implement API
	- [ ] [Frontend-Developer] Build UI (depends on API)
	- [ ] [QA-Tester] Integration testing (depends on both)
	- [ ] [DevOps-Engineer] Deploy to production (depends on testing)
```

## Integration with MCP Tools

### Using Agent Context Hub
When creating tasks that use the Agent Context Hub:

```markdown
- [ ] Story: Complex multi-agent workflow
	- [ ] [Scrum-Master] Create coordination session
		- [ ] Initialize session with `create_agent_task()`
		- [ ] Set up dependencies
		- [ ] Store shared context
	- [ ] [Backend-Developer] Implement feature (uses shared context)
	- [ ] [Frontend-Developer] Build UI (uses shared context)
	- [ ] [QA-Tester] Verify integration (checks all contexts)
```

### Using Agent Execution Hub
For tasks that require agent execution:

```markdown
- [ ] Story: Automated testing pipeline
	- [ ] [Buddy] Execute QA test suite
		- [ ] `execute_agent("qa-tester", "Run regression tests")`
		- [ ] Store results in context hub
	- [ ] [Buddy] Review security if tests pass
		- [ ] `execute_agent("pentester", "Security scan")`
	- [ ] [Buddy] Deploy if all checks pass
		- [ ] `execute_agent("devops-engineer", "Deploy to staging")`
```

## Templates

### Sprint Planning Template
```markdown
## Sprint [Number] - [Sprint Name]

### Sprint Goal
[Clear, concise sprint goal]

### User Stories

- [ ] Story: [Story title]
	- [ ] [Agent] Task 1
	- [ ] [Agent] Task 2
	- [ ] [Agent] Task 3

- [ ] Story: [Story title]
	- [ ] [Agent] Task 1
	- [ ] [Agent] Task 2
```

### Daily Standup Template
```markdown
## Daily Standup - [Date]

### Completed Yesterday
- [x] [Agent] Task description
- [x] [Agent] Task description

### In Progress Today
- [ ] [Agent] Task description
- [ ] [Agent] Task description

### Blockers
- [ ] [Agent] Blocker description - needs [Solution/Help]
```

### Sprint Review Template
```markdown
## Sprint [Number] Review

### Completed Stories
- [x] Story: [Title]
	- [x] [Agent] Task 1 ✅
	- [x] [Agent] Task 2 ✅

### Incomplete Stories (Moved to next sprint)
- [ ] Story: [Title]
	- [x] [Agent] Task 1 ✅
	- [ ] [Agent] Task 2 (in progress)
	- [ ] [Agent] Task 3 (blocked)
```

## Summary

**Key Rules:**
1. ✅ Use indentation (tabs or 4 spaces) for hierarchy
2. ❌ Never use "**Sub-task:**" or similar prefixes
3. ✅ Always assign agent(s) in [square brackets]
4. ✅ Start tasks with action verbs
5. ✅ Keep consistent indentation throughout
6. ✅ Break down into manageable 1-2 day chunks
7. ✅ Order tasks logically based on dependencies

**Remember:** Clean, simple formatting makes tasks easier to read, track, and manage! 🎯
