# Feature Breakdown and Research Guide

## Critical: Research-Driven Feature Planning

As a Product Manager, before breaking down any feature or epic into requirements and tasks, you MUST conduct thorough research using all available MCP tools. This ensures informed decisions, realistic scope, and successful delivery.

**📚 Complete Implementation Guide:** See `../../_shared/knowledge/deep-research-strategy.md` for industry best practices based on:
- **ReAct Framework** (Reasoning + Acting) - Yao et al., 2022
- **Chain-of-Thought Prompting** - Anthropic/OpenAI research
- **Prompt Chaining** - Multi-step research workflows

**🚨 CRITICAL: Follow ReAct Properly**
- Complete EACH step (Thought → Action → Observation) FULLY before next
- COMMIT each cycle - don't skip or rush
- Build systematically on previous findings
- **See `../../_shared/knowledge/react-framework-tips.md` for step-by-step guidance**

## The Research-First Approach

### Why Research Matters

❌ **Without Research:**
- Vague requirements that miss critical details
- Unrealistic timelines and scope
- Missing technical constraints
- Security and performance issues discovered late
- Rework and delays

✅ **With Thorough Research:**
- Precise, actionable requirements
- Realistic effort estimates
- Known technical constraints upfront
- Security and performance built-in
- Smooth execution and delivery

## Required Research Process

### 1. Sequential Thinking MCP
**Purpose:** Strategic planning and logical flow

**Use For:**
- Breaking down complex features into logical steps
- Identifying dependencies and sequencing
- Risk analysis and mitigation planning
- Exploring alternative approaches

**Example:**
```
Feature: Add real-time chat to application

Sequential Thinking Questions:
- What are the core components? (WebSocket server, UI, storage, notifications)
- What's the logical implementation order?
- What are the dependencies? (Authentication must exist first)
- What are the risks? (Scalability, data persistence, security)
- What alternatives exist? (WebSockets vs polling vs Server-Sent Events)
```

### 2. Context7 MCP
**Purpose:** Learn from past implementations

**Use For:**
- Finding similar features from past projects
- Learning from previous mistakes
- Discovering reusable components
- Understanding team patterns and preferences

**Example:**
```
Search Context7:
- "real-time chat implementation"
- "WebSocket performance issues"
- "chat scalability solutions"
- "message storage patterns"

Review:
- What worked well in previous chat implementations?
- What problems did teams encounter?
- Are there reusable components or libraries?
```

### 3. DeepWiki MCP
**Purpose:** Deep technical knowledge

**Use For:**
- Understanding technologies and protocols
- Researching architectural patterns
- Learning best practices
- Understanding security implications

**Example:**
```
Research in DeepWiki:
- WebSocket protocol specifications
- Real-time messaging patterns
- Message queue architectures
- Chat application security best practices
- Scalability patterns for real-time systems
```

### 4. Fetch MCP
**Purpose:** Current documentation and resources

**Use For:**
- Official documentation
- API references
- Migration guides
- Latest best practices
- Community recommendations

**Example:**
```
Fetch Resources:
- https://socket.io/docs/ (WebSocket library docs)
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- Framework-specific real-time guides
- Security best practices for WebSocket
- Performance optimization guides
```

### 5. Agent Context Hub MCP
**Purpose:** Team knowledge and shared context

**Use For:**
- Previous project outcomes
- Team learnings and documented solutions
- Known issues and workarounds
- Reusable components and patterns

**Example:**
```
Check Context Hub:
- Previous real-time features implemented
- Known WebSocket issues in our stack
- Performance benchmarks from past projects
- Reusable authentication middleware
```

### 6. Agent Loader MCP
**Purpose:** Expert agent insights

**Use For:**
- Technical feasibility assessment
- Effort estimation
- Implementation approaches
- Risk identification

**Example:**
```
Load Agent Context:
- backend-developer: WebSocket implementation approach
- frontend-developer: UI/UX considerations
- devops-engineer: Infrastructure and scaling needs
- security-analyst: Security requirements
- database-admin: Data storage strategy
- qa-tester: Testing approach and effort
```

## Complete Research Workflow Example

### Feature: Implement Real-Time Notifications System

#### Step 1: Sequential Thinking
```markdown
**Thinking Process:**
1. Core question: What type of notifications? (In-app, push, email?)
2. Technical approach: WebSocket, SSE, or polling?
3. Components needed:
   - Notification service
   - WebSocket/connection management
   - UI components
   - Storage/persistence
   - User preferences
4. Dependencies:
   - Requires user authentication
   - Needs permission system
   - May need mobile app support
5. Risks:
   - Connection stability
   - Scaling with many concurrent users
   - Battery drain on mobile
   - Notification spam
```

#### Step 2: Context7 Research
```markdown
**Searches:**
- "notification system implementation"
- "WebSocket notification service"
- "push notification integration"

**Findings:**
- Previous project used Firebase for push notifications
- Team had issues with WebSocket reconnection logic
- Reusable notification UI component exists
- Past performance issues with 1000+ concurrent connections
```

#### Step 3: DeepWiki Knowledge
```markdown
**Research Topics:**
- WebSocket vs Server-Sent Events vs Long Polling
- Push notification protocols (APNs, FCM)
- Notification permission APIs
- Real-time architecture patterns
- Message broker patterns (Redis Pub/Sub, RabbitMQ)

**Key Learnings:**
- SSE better for one-way notifications
- WebSocket needed only for bidirectional chat
- Redis Pub/Sub good for scaling
- Service Workers enable offline notifications
```

#### Step 4: Fetch Documentation
```markdown
**Resources Fetched:**
- https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
- https://firebase.google.com/docs/cloud-messaging
- Framework documentation for real-time features
- Browser support for Notification API

**Important Notes:**
- Safari has limited notification support
- Need HTTPS for notifications
- User permission required (UX consideration)
```

#### Step 5: Agent Context Hub
```markdown
**Shared Context:**
- Authentication system supports role-based permissions
- Existing Redis instance can be used for Pub/Sub
- UI design system has notification components
- Mobile app uses React Native (FCM integration possible)

**Known Issues:**
- WebSocket connections drop on iOS background
- Need reconnection strategy
- Previous notification spam complaints
```

#### Step 6: Agent Expertise
```markdown
**Backend Developer:**
- Recommends: Redis Pub/Sub + Server-Sent Events
- Effort: 3 days for core service
- Concerns: Need monitoring for connection health

**Frontend Developer:**
- Recommends: Service Workers for offline support
- Effort: 2 days for UI + 1 day for testing
- Concerns: Browser compatibility (Safari)

**DevOps Engineer:**
- Recommends: Separate notification microservice
- Effort: 1 day infrastructure + monitoring setup
- Concerns: Need load balancer sticky sessions

**Security Analyst:**
- Requires: User permission enforcement
- Requires: Rate limiting to prevent spam
- Requires: Encryption for sensitive notifications
- Effort: 1 day security review

**Database Admin:**
- Recommends: PostgreSQL for notification history
- Recommends: Redis for live connections
- Effort: 0.5 day schema + indexing
- Concerns: Retention policy needed

**QA Tester:**
- Needs: Test across browsers and devices
- Needs: Load testing for concurrent connections
- Effort: 2 days comprehensive testing
- Concerns: Edge cases (offline, reconnection)
```

### Final: Informed Feature Breakdown

**After completing ALL research, create detailed requirements:**

```markdown
## Feature: Real-Time Notification System

### Requirements (Based on Research)

#### Technical Architecture
- Server-Sent Events (SSE) for web notifications (simpler than WebSocket)
- Redis Pub/Sub for message distribution
- Separate notification microservice
- PostgreSQL for notification history (30 day retention)
- Firebase Cloud Messaging (FCM) for mobile push

#### User Story Breakdown

- [ ] Story: Backend Notification Service
	- [ ] [Backend-Developer] Design notification data model
		- [ ] Define notification types and schemas
		- [ ] Create database schema with indexes
		- [ ] Set up 30-day retention policy
	- [ ] [Backend-Developer] Implement notification service
		- [ ] Set up Redis Pub/Sub channels
		- [ ] Create SSE endpoint with connection management
		- [ ] Implement automatic reconnection logic
		- [ ] Add rate limiting (max 10/min per user)
	- [ ] [Backend-Developer] Create notification APIs
		- [ ] POST /notifications - Create notification
		- [ ] GET /notifications - Fetch history
		- [ ] PATCH /notifications/:id - Mark as read
		- [ ] DELETE /notifications/:id - Dismiss
	- [ ] [Security-Analyst] Security review
		- [ ] Verify permission checks
		- [ ] Test rate limiting
		- [ ] Review encryption for sensitive data

- [ ] Story: Frontend Notification UI
	- [ ] [Frontend-Developer] Implement SSE client
		- [ ] Set up EventSource connection
		- [ ] Handle reconnection on disconnect
		- [ ] Implement exponential backoff
	- [ ] [Frontend-Developer] Build notification components
		- [ ] Notification bell with badge counter
		- [ ] Notification dropdown/panel
		- [ ] Individual notification items
		- [ ] Empty state design
	- [ ] [Frontend-Developer] Request user permissions
		- [ ] Show permission prompt at appropriate time
		- [ ] Handle denied permissions gracefully
		- [ ] Respect browser notification settings
	- [ ] [UI-UX-Designer] Design notification UX flows
		- [ ] Notification display patterns
		- [ ] Permission request UX
		- [ ] Settings/preferences UI

- [ ] Story: Mobile Push Notifications
	- [ ] [Backend-Developer] Integrate FCM
		- [ ] Set up FCM project
		- [ ] Implement device token storage
		- [ ] Create FCM message sender
	- [ ] [Frontend-Developer] Mobile app integration
		- [ ] Add FCM SDK to React Native app
		- [ ] Handle push notification permissions
		- [ ] Implement notification tap handling

- [ ] Story: Infrastructure and Monitoring
	- [ ] [DevOps-Engineer] Deploy notification service
		- [ ] Create Docker container
		- [ ] Set up load balancer with sticky sessions
		- [ ] Configure Redis for high availability
	- [ ] [DevOps-Engineer] Set up monitoring
		- [ ] Track active SSE connections
		- [ ] Monitor Redis Pub/Sub latency
		- [ ] Alert on connection failures
		- [ ] Track notification delivery rate

- [ ] Story: Testing and Validation
	- [ ] [QA-Tester] Functional testing
		- [ ] Test notification creation and delivery
		- [ ] Test across browsers (Chrome, Firefox, Safari)
		- [ ] Test mobile push (iOS and Android)
		- [ ] Test reconnection scenarios
	- [ ] [QA-Tester] Performance testing
		- [ ] Load test with 1000 concurrent connections
		- [ ] Measure notification latency
		- [ ] Test under poor network conditions
	- [ ] [QA-Tester] Edge case testing
		- [ ] Test offline scenarios
		- [ ] Test permission denied handling
		- [ ] Test notification spam prevention

### Effort Estimate (Based on Agent Input)
- Backend: 4 days
- Frontend: 3 days  
- DevOps: 1.5 days
- Security: 1 day
- QA: 2 days
**Total: ~12 developer days** (can be parallelized)

### Success Criteria
- Notifications delivered within 500ms
- Support 1000+ concurrent connections
- 99.9% delivery rate
- Works on Chrome, Firefox, Safari (with limitations noted)
- Mobile push on iOS and Android

### Known Limitations (From Research)
- Safari has limited notification support
- iOS drops connections when app backgrounded
- Need user permission (conversion rate ~40%)
- 30-day history limit for performance

### Risks and Mitigation
- **Risk:** Connection drops
  **Mitigation:** Auto-reconnect with exponential backoff
- **Risk:** Notification spam
  **Mitigation:** Rate limiting + user preferences
- **Risk:** Scaling issues
  **Mitigation:** Separate microservice + Redis Pub/Sub
```

## Key Principles

### 1. Research BEFORE Breaking Down
Never create task breakdowns without thorough research. Uninformed breakdowns lead to:
- Missed requirements
- Poor estimates  
- Technical debt
- Project delays
- Team frustration

### 2. Use ALL Available MCP Tools
Each MCP provides unique insights:
- **Sequential Thinking:** Logic and strategy
- **Context7:** Historical learning
- **DeepWiki:** Technical depth
- **Fetch:** Current documentation
- **Context Hub:** Team knowledge
- **Agent Loader:** Expert insights

### 3. Validate with Expert Agents
Always load relevant agent contexts to validate:
- Technical feasibility
- Effort estimates
- Implementation approach
- Risk identification

### 4. Document Your Research
Include research findings in requirements:
```markdown
## Research Summary
- **Technical Approach:** SSE chosen over WebSocket (simpler for one-way)
- **Past Learnings:** Previous team had WebSocket reconnection issues
- **Agent Estimates:** 12 dev days total
- **Key Risks:** Safari limitations, connection drops, scaling
- **Mitigation:** Redis Pub/Sub, auto-reconnect, rate limiting
```

### 5. Iterate Based on Findings
If research reveals complexity, adjust scope:
```markdown
## Original Scope: Real-time notifications
## After Research: 
- Phase 1: In-app notifications via SSE (MVP)
- Phase 2: Mobile push notifications  
- Phase 3: Email digest notifications
**Reason:** Research showed mobile push adds significant complexity
```

## Template: Research Checklist

Use this checklist for every feature breakdown:

```markdown
## Feature: [Feature Name]

### Pre-Breakdown Research Checklist

- [ ] **Sequential Thinking**
  - [ ] Identified core components
  - [ ] Mapped dependencies
  - [ ] Analyzed risks
  - [ ] Explored alternatives

- [ ] **Context7 Search**
  - [ ] Searched for similar implementations
  - [ ] Reviewed past learnings
  - [ ] Found reusable components
  - [ ] Identified known issues

- [ ] **DeepWiki Research**
  - [ ] Researched technical concepts
  - [ ] Studied architectural patterns
  - [ ] Reviewed best practices
  - [ ] Understood security implications

- [ ] **Fetch Documentation**
  - [ ] Retrieved official docs
  - [ ] Got API references
  - [ ] Read migration guides
  - [ ] Checked browser support

- [ ] **Context Hub Review**
  - [ ] Checked previous outcomes
  - [ ] Reviewed team learnings
  - [ ] Found known issues
  - [ ] Located reusable code

- [ ] **Agent Expertise**
  - [ ] Loaded backend-developer
  - [ ] Loaded frontend-developer
  - [ ] Loaded devops-engineer
  - [ ] Loaded security-analyst
  - [ ] Loaded database-admin
  - [ ] Loaded qa-tester
  - [ ] Got effort estimates
  - [ ] Validated approach

### Research Complete ✅
**Only after checking ALL boxes above, proceed with feature breakdown**
```

## Summary

**The Golden Rule:** 
> Never break down a feature without completing thorough research across ALL available MCP tools and expert agent contexts.

**Why It Matters:**
- Better requirements
- Realistic estimates
- Fewer surprises
- Smoother execution
- Higher success rate

**Remember:** 30 minutes of research can save days of rework! 🎯
