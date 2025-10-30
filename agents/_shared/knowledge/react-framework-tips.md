# ReAct Framework Best Practices and Tips

## Overview

ReAct (Reasoning + Acting) is a powerful framework for AI agents to conduct systematic research and problem-solving. This guide provides practical tips for proper implementation.

## Core Principle: Complete Each Step Before Moving Forward

### 🚨 CRITICAL RULE: Never Skip Steps or Jump Ahead

**The Golden Rule:**
> Each step (Thought → Action → Observation) must be FULLY COMPLETED and COMMITTED before moving to the next step.

### Why This Matters

❌ **BAD - Rushing Through Steps:**
```
Thought: I need to research OAuth2
Action: Search Context7, Search DeepWiki, Search Fetch (all at once)
Observation: ...some results...
Thought: I think I have enough, let me create tasks
```
**Problems:**
- Information overload
- Can't process results properly
- Miss important details
- Can't adjust strategy based on findings

✅ **GOOD - Complete Each Step:**
```
Thought 1: I need to understand what OAuth2 implementations we've done before
Action 1: Search Context7 for "OAuth2 implementation"
Observation 1: Found 3 past projects:
  - Project A used Passport.js successfully
  - Project B had token refresh issues (solved with Redis)
  - Team preference documented: PKCE flow for security
  
[COMMIT THIS STEP - ANALYZE WHAT WE LEARNED]

Thought 2: Based on finding that team prefers PKCE, I need to understand PKCE technical details
Action 2: Search DeepWiki for "OAuth2 PKCE flow security"
Observation 2: PKCE (Proof Key for Code Exchange):
  - Prevents authorization code interception
  - Required for mobile/SPA applications
  - Uses code_challenge and code_verifier
  
[COMMIT THIS STEP - UNDERSTAND THE TECHNICAL CONCEPT]

Thought 3: Now that I understand PKCE, what's the current best practice implementation?
Action 3: Fetch "https://oauth.net/2/pkce/" official documentation
Observation 3: Latest spec shows...
```

## The ReAct Loop - Step by Step

### Step 1: Thought (Reasoning)

**What to do:**
- State clearly what you need to know
- Explain WHY you need this information
- Reference what you learned from previous steps
- Define what success looks like for this step

**Template:**
```
Thought [N]: Based on [previous findings], I now need to [specific goal].
This will help me [how it contributes to overall task].
Success criteria: I need to find [specific information].
```

**Example:**
```
Thought 3: Based on learning that our team uses Passport.js (Context7) and 
that PKCE is required for security (DeepWiki), I now need to check if 
Passport.js supports PKCE flow. This will help me validate our technical 
approach. Success criteria: Confirm PKCE support in Passport.js v0.6+.
```

### Step 2: Action (Acting)

**What to do:**
- Use ONE MCP tool or agent
- Be specific about what you're searching for
- Use the right tool for the job

**Tool Selection Guide:**
- **Context7** → Past team projects, lessons learned
- **DeepWiki** → Technical concepts, architecture patterns
- **Fetch** → Current documentation, official specs
- **Agent Context Hub** → Shared team resources, components
- **Agent Loader** → Expert validation, effort estimates
- **Sequential Thinking** → Strategic planning, risk analysis

**Template:**
```
Action [N]: Use [specific tool] to search/fetch/load [specific query/resource].
```

**Example:**
```
Action 3: Use Fetch MCP to retrieve Passport.js documentation from 
"https://www.passportjs.org/packages/passport-oauth2/" focusing on PKCE support.
```

### Step 3: Observation (Reflecting)

**What to do:**
- Document what you found (be specific)
- Note what's relevant vs. not relevant
- Identify gaps or contradictions
- Determine if you have enough information

**Template:**
```
Observation [N]: 
Key Findings:
- [Finding 1]
- [Finding 2]
- [Finding 3]

Relevant to our task: [What matters]
Not relevant: [What doesn't matter]
Gaps identified: [What's still missing]
Confidence level: [High/Medium/Low]
```

**Example:**
```
Observation 3:
Key Findings:
- Passport.js v0.6.0 has built-in PKCE support
- Requires setting 'pkce: true' in strategy options
- Code verifier automatically generated and stored
- Works with passport-oauth2 package

Relevant to our task: Confirms technical feasibility with our chosen library
Not relevant: OAuth1 legacy support (we're using OAuth2)
Gaps identified: Still need to understand token storage strategy
Confidence level: High - official documentation confirms capability
```

### Step 4: Commit the Step

**🚨 MANDATORY: Before moving to next thought, COMMIT this cycle:**

**What to commit:**
```
[STEP [N] COMPLETE ✅]

What I learned: [Brief summary]
How it helps: [Connection to overall goal]
Next focus: [What to investigate next]
```

**Example:**
```
[STEP 3 COMPLETE ✅]

What I learned: Passport.js v0.6+ fully supports PKCE flow with simple configuration
How it helps: Validates our technical stack choice - no need to evaluate alternatives
Next focus: Need to research token storage strategy (Redis vs database)
```

## Common Mistakes and Fixes

### Mistake 1: Skipping Steps
❌ **Wrong:**
```
Thought: I need OAuth2 info
Action: Search everything everywhere
Observation: Got lots of results
Done!
```

✅ **Right:**
```
Thought 1: Need to understand past OAuth2 implementations
Action 1: Context7 search "OAuth2"
Observation 1: [Specific findings]
[COMMIT]

Thought 2: Now need technical details on PKCE
Action 2: DeepWiki search "PKCE"
Observation 2: [Specific findings]
[COMMIT]
```

### Mistake 2: Vague Actions
❌ **Wrong:**
```
Action: Search for authentication stuff
```

✅ **Right:**
```
Action: Use Context7 to search "OAuth2 token refresh implementation" 
in past projects from last 2 years
```

### Mistake 3: Not Using Observations
❌ **Wrong:**
```
Observation: Found some docs
Thought: Let me search something else
```

✅ **Right:**
```
Observation: Found Passport.js supports PKCE since v0.6
[COMMIT]

Thought: Based on confirming PKCE support, now I need to verify 
our current Passport.js version is v0.6+
```

### Mistake 4: Jumping to Conclusions
❌ **Wrong:**
```
Thought: I need OAuth2 info
Action: Quick search
Observation: Found something
Done! Here are the tasks...
```

✅ **Right:**
```
Complete ALL 6 research steps:
1. Context7 (past implementations)
2. DeepWiki (technical concepts)
3. Fetch (current docs)
4. Agent Context Hub (team knowledge)
5. Agent Loader (expert validation)
6. Synthesis (combine all learnings)

Only after ALL steps → Create tasks
```

## Practical Tips for Each MCP Tool

### Context7 (Historical Learning)
```
Thought: What have we done before that's similar?
Action: Context7 search "feature_name implementation"
Observation: Document:
  - What worked well
  - What problems occurred
  - What solutions were found
  - What components are reusable
[COMMIT] Before moving to technical research
```

### DeepWiki (Technical Knowledge)
```
Thought: What are the technical concepts I need to understand?
Action: DeepWiki search "technical_concept architecture_pattern"
Observation: Document:
  - Core concepts and definitions
  - Architectural patterns
  - Best practices
  - Known limitations
[COMMIT] Before searching current documentation
```

### Fetch (Current Documentation)
```
Thought: What's the latest official guidance?
Action: Fetch "official_documentation_url"
Observation: Document:
  - Current API/library version
  - Latest recommendations
  - Breaking changes
  - Browser/platform support
[COMMIT] Before checking team knowledge
```

### Agent Context Hub (Team Resources)
```
Thought: What does our team already have?
Action: Agent Context Hub query "related_components"
Observation: Document:
  - Existing components
  - Team patterns
  - Infrastructure constraints
  - Known issues
[COMMIT] Before consulting experts
```

### Agent Loader (Expert Validation)
```
Thought: I have technical approach, need expert validation
Action: Load backend-developer, frontend-developer, security-analyst
Observation: Document each agent's:
  - Technical assessment
  - Concerns or risks
  - Effort estimate
  - Recommendations
[COMMIT] Before final synthesis
```

### Sequential Thinking (Strategic Planning)
```
Thought: Need to plan overall research strategy
Action: Use Sequential Thinking to map out:
  - What questions need answering
  - What tools to use in what order
  - What dependencies exist
  - What risks to investigate
Observation: Document:
  - Research plan
  - Tool sequence
  - Expected outcomes
[COMMIT] Before executing research
```

## The Complete ReAct Cycle Template

```markdown
## ReAct Research: [Feature/Task Name]

### Cycle 1: Historical Context
Thought 1: [What I need to know and why]
Action 1: [Specific MCP tool + specific query]
Observation 1: [Detailed findings with bullet points]
[COMMIT CYCLE 1 ✅]
Key Takeaway: [One sentence summary]
Next Focus: [What to investigate next]

### Cycle 2: Technical Understanding  
Thought 2: [Building on Cycle 1, what I need to know next]
Action 2: [Specific MCP tool + specific query]
Observation 2: [Detailed findings with bullet points]
[COMMIT CYCLE 2 ✅]
Key Takeaway: [One sentence summary]
Next Focus: [What to investigate next]

### Cycle 3: Current Best Practices
Thought 3: [Building on Cycles 1-2, what I need to know next]
Action 3: [Specific MCP tool + specific query]
Observation 3: [Detailed findings with bullet points]
[COMMIT CYCLE 3 ✅]
Key Takeaway: [One sentence summary]
Next Focus: [What to investigate next]

### Cycle 4: Team Resources
Thought 4: [Building on Cycles 1-3, what I need to know next]
Action 4: [Specific MCP tool + specific query]
Observation 4: [Detailed findings with bullet points]
[COMMIT CYCLE 4 ✅]
Key Takeaway: [One sentence summary]
Next Focus: [What to investigate next]

### Cycle 5: Expert Validation
Thought 5: [Building on Cycles 1-4, need expert confirmation]
Action 5: [Load specific expert agents]
Observation 5: [Each agent's feedback documented]
[COMMIT CYCLE 5 ✅]
Key Takeaway: [Consensus or concerns]
Next Focus: [Final synthesis]

### Cycle 6: Synthesis
Thought 6: [Combining all learnings to form complete picture]
Action 6: [Synthesize findings + validate completeness]
Observation 6: [Integrated understanding with all sources]
[COMMIT CYCLE 6 ✅]
Key Takeaway: [Complete validated understanding]
Ready for: [Task creation / Decision making]

---

## Final Research Summary
- Sources consulted: [List all 5-6 MCP tools used]
- Key findings: [Top 3-5 insights]
- Validated approach: [Chosen solution]
- Confidence level: [High/Medium/Low with reasoning]
- Ready to proceed: [Yes/No]
```

## Quality Checklist

Before considering research complete, verify:

- [ ] Each Thought clearly states what I need and why
- [ ] Each Action uses a specific tool with specific query
- [ ] Each Observation documents detailed findings
- [ ] Each cycle is COMMITTED before moving to next
- [ ] Each cycle builds on previous findings
- [ ] No jumps or skipped steps
- [ ] All 5-6 MCP tools were used appropriately
- [ ] Expert agents were consulted for validation
- [ ] Findings are synthesized and cross-validated
- [ ] Gaps and uncertainties are documented
- [ ] Confidence level is assessed
- [ ] Ready to create actionable outputs

## Summary: The ReAct Mindset

**Remember:**
1. 🎯 **One step at a time** - Complete each cycle fully
2. 📝 **Document everything** - Write down what you learn
3. 🔗 **Build on previous** - Each step informs the next
4. ✅ **Commit the step** - Confirm completion before moving
5. 🤔 **Think before acting** - Plan each action deliberately
6. 👁️ **Observe carefully** - Extract insights from results
7. 🔄 **Iterate systematically** - Follow the pattern consistently

**The goal is not speed - it's thoroughness and accuracy!**

> "30 minutes of systematic ReAct research saves days of rework from incomplete understanding" 🎯
