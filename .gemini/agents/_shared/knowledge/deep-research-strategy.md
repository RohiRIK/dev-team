# Deep Research Strategy Implementation for AI Agents

## Overview

This document outlines industry best practices for implementing deep research capabilities in AI agents through advanced prompting techniques. Based on research from Anthropic, OpenAI, and academic papers (particularly the ReAct framework).

**🚨 CRITICAL: Complete Each Step Before Moving Forward**

The ReAct framework requires that each cycle (Thought → Action → Observation) be FULLY COMPLETED and COMMITTED before moving to the next step. Never skip ahead or rush through steps.

**📚 See `react-framework-tips.md` for detailed practical tips and step-by-step guidance.**

## Core Research Frameworks

### 1. ReAct Framework (Reasoning + Acting)

**Source:** [Yao et al., 2022 - "ReAct: Synergizing Reasoning and Acting in Language Models"](https://arxiv.org/abs/2210.03629)

**Key Concept:** Interleave reasoning traces with actions for better research outcomes.

**Structure:**
```
Thought → Action → Observation → Thought → Action → Observation → ...
```

**Example Application:**
```
Question: What is the elevation range for the area that the eastern sector 
of the Colorado orogeny extends into?

Thought 1: I need to search Colorado orogeny, find the area that the eastern 
           sector extends into, then find the elevation range

Action 1: Search[Colorado orogeny]

Observation 1: The Colorado orogeny was an episode of mountain building in 
               Colorado and surrounding areas.

Thought 2: It doesn't mention the eastern sector. I need to look up eastern sector.

Action 2: Lookup[eastern sector]

Observation 2: The eastern sector extends into the High Plains and is called 
               the Central Plains orogeny.

Thought 3: The eastern sector extends into the High Plains. I need to search 
           High Plains and find its elevation range.

Action 3: Search[High Plains (United States)]

Observation 3: The High Plains rise in elevation from around 1,800 to 7,000 ft 
               (550 to 2,130 m).

Thought 4: High Plains rise from 1,800 to 7,000 ft, so the answer is 
           1,800 to 7,000 ft.

Action 4: Finish[1,800 to 7,000 ft]
```

**Benefits:**
- ✅ Reduces hallucination by verifying with external sources
- ✅ Handles exceptions and updates plans dynamically
- ✅ More interpretable than pure reasoning
- ✅ Outperforms both pure reasoning (CoT) and pure acting on complex tasks

### 2. Chain-of-Thought (CoT) Prompting

**Source:** [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)

**Key Concept:** Let the agent think step-by-step before answering.

**Implementation:**
```markdown
Before providing your answer, think through the problem step by step:

1. What information do I need?
2. Where can I find this information?
3. How do I validate the information?
4. What is the logical conclusion?

<thinking>
[Agent's reasoning process here]
</thinking>

<answer>
[Final answer based on reasoning]
</answer>
```

**Best Practices:**
- Use XML tags to separate thinking from output
- Encourage explicit reasoning steps
- Combine with ReAct for tool-using agents

### 3. Prompt Chaining

**Source:** [Anthropic Prompt Engineering - Chain Complex Prompts](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-prompts)

**Key Concept:** Break complex research into sequential sub-tasks.

**Structure:**
```
Task 1: Initial Research
  ↓ (pass results to)
Task 2: Deep Dive Analysis
  ↓ (pass results to)
Task 3: Synthesis & Validation
  ↓ (pass results to)
Task 4: Final Report
```

**Example:**
```markdown
## Chain 1: Information Gathering
Prompt: "Research OAuth2 authentication. List key concepts, security 
        considerations, and implementation patterns."
Output: [Concepts list]

## Chain 2: Technical Analysis
Prompt: "Given these OAuth2 concepts: {concepts}, analyze implementation 
        approaches for a Node.js backend."
Output: [Technical analysis]

## Chain 3: Security Review
Prompt: "Review this OAuth2 implementation approach: {analysis}. 
        Identify security risks and mitigation strategies."
Output: [Security assessment]

## Chain 4: Final Synthesis
Prompt: "Synthesize: {concepts} + {analysis} + {security} into 
        implementation plan with sub-tasks."
Output: [Complete implementation plan]
```

## Implementing Research Strategy in Our Agents

### Step 1: Define Research Phases

```markdown
## Phase 1: Strategic Planning (Sequential Thinking)
**Goal:** Understand what we need to research

Prompt Template:
```
Before starting research on "{feature}", think through:

<strategic_planning>
1. Core Question: What exactly are we trying to understand?
2. Key Components: What are the main parts of this feature?
3. Dependencies: What existing knowledge/systems does this depend on?
4. Risks: What could go wrong or be overlooked?
5. Success Criteria: How do we know when research is complete?
</strategic_planning>
```

### Step 2: Multi-Source Information Gathering (ReAct Pattern)

```markdown
## Phase 2: Information Gathering
**Goal:** Collect comprehensive information from multiple sources

Prompt Template:
```
Research "{topic}" using the following ReAct pattern:

<research_loop>
Thought: What do I need to know next?
Action: Use MCP tool (Context7/DeepWiki/Fetch/etc.)
Observation: Review and analyze results
Thought: What did I learn? What's missing?
Action: Use next MCP tool
Observation: Compare with previous findings
...continue until comprehensive
</research_loop>

Required Tools to Use:
1. Context7 - Check past implementations
2. DeepWiki - Technical depth and concepts
3. Fetch - Current documentation
4. Agent Context Hub - Team knowledge
5. Agent Loader - Expert insights
```

### Step 3: Analysis and Validation (Chain-of-Thought)

```markdown
## Phase 3: Deep Analysis
**Goal:** Analyze gathered information critically

Prompt Template:
```
Analyze the research findings for "{feature}":

<analysis>
1. Information Quality Assessment:
   - What sources are most credible?
   - Where do sources agree/disagree?
   - What information is missing?

2. Technical Feasibility:
   - Is this technically possible?
   - What are the constraints?
   - What are alternative approaches?

3. Risk Assessment:
   - What are the main risks?
   - How likely are they?
   - How can they be mitigated?

4. Effort Estimation:
   - How complex is this really?
   - What's the realistic timeline?
   - What resources are needed?
</analysis>
```

### Step 4: Synthesis and Decision (Prompt Chaining)

```markdown
## Phase 4: Synthesis
**Goal:** Create actionable recommendations

Prompt Template:
```
Synthesize all research into actionable plan:

<synthesis>
1. Summary of Findings:
   - Key insights from each source
   - Validated facts vs assumptions
   - Recommended approach

2. Implementation Strategy:
   - Chosen technical approach with justification
   - Required components and dependencies
   - Step-by-step implementation order

3. Risk Mitigation:
   - Identified risks with likelihood/impact
   - Mitigation strategies for each risk
   - Monitoring and validation approach

4. Resource Requirements:
   - Agents/roles needed
   - Estimated effort per agent
   - Dependencies and blockers
</synthesis>
```

## Complete Prompt Template for Deep Research

```markdown
# Deep Research Task: {FEATURE_NAME}

## Instructions
You are conducting comprehensive research to inform task breakdown. Follow the
ReAct framework: Think → Act → Observe → Repeat.

---

## Phase 1: Strategic Planning
<strategic_thinking>
Before using any tools, think through:

1. **Core Question:** {What are we trying to understand?}

2. **Scope Definition:**
   - What's included in this research?
   - What's explicitly out of scope?
   - What's the acceptable depth level?

3. **Information Needs:**
   - What facts do we need?
   - What technical details are critical?
   - What past experiences are relevant?
   - What external documentation exists?

4. **Research Strategy:**
   - Which MCP tools will be most valuable?
   - In what order should we use them?
   - What agents should we consult?
   - How will we validate findings?

5. **Success Criteria:**
   - What information is sufficient?
   - What decisions need to be made?
   - What output format is needed?
</strategic_thinking>

**Output:** Research strategy with tool sequence

---

## Phase 2: Multi-Source Research (ReAct Loop)

### Iteration 1: Historical Context
<thought>
What have we done before that's similar? What lessons were learned?
</thought>

<action>
Tool: Context7 MCP
Search: "{feature} implementation", "past {technology} projects", 
        "{pattern} lessons learned"
</action>

<observation>
Document findings:
- Similar implementations found
- Past problems encountered
- Reusable solutions available
- Team recommendations
</observation>

### Iteration 2: Technical Knowledge
<thought>
What are the technical concepts and best practices?
</thought>

<action>
Tool: DeepWiki MCP
Research: Core technologies, architectural patterns, security practices,
          performance considerations
</action>

<observation>
Document findings:
- Technical definitions and concepts
- Architectural patterns available
- Industry best practices
- Known limitations and constraints
</observation>

### Iteration 3: Current Documentation
<thought>
What's the latest official guidance and community recommendations?
</thought>

<action>
Tool: Fetch MCP
URLs: Official documentation, API references, migration guides,
      community best practices
</action>

<observation>
Document findings:
- Latest API/framework versions
- Current recommendations
- Deprecation notices
- Browser/platform support
</observation>

### Iteration 4: Team Knowledge
<thought>
What does our team already know? What components exist?
</thought>

<action>
Tool: Agent Context Hub MCP
Query: Relevant past tasks, shared components, known issues,
       documented solutions
</action>

<observation>
Document findings:
- Existing reusable components
- Team-specific patterns
- Known infrastructure constraints
- Previous similar implementations
</observation>

### Iteration 5: Expert Validation
<thought>
What do the expert agents think about feasibility and approach?
</thought>

<action>
Tool: Agent Loader MCP
Load: {relevant agents - backend-developer, frontend-developer, etc.}
Ask: Technical feasibility, implementation approach, effort estimate,
     risks and concerns
</action>

<observation>
Document findings:
- Agent A: {technical assessment}
- Agent B: {security concerns}
- Agent C: {implementation approach}
- Agent D: {testing strategy}
</observation>

---

## Phase 3: Critical Analysis

<analysis>
### 3.1 Information Synthesis
Cross-reference all sources:
- Where do sources agree? (High confidence)
- Where do sources conflict? (Needs resolution)
- What gaps remain? (Additional research needed)

### 3.2 Feasibility Assessment
Based on research:
- Technical Feasibility: {High/Medium/Low} - Why?
- Timeline Feasibility: {Realistic/Tight/Unrealistic} - Why?
- Resource Feasibility: {Available/Constrained/Blocked} - Why?

### 3.3 Risk Analysis
Identified risks with mitigation:
1. **Risk:** {description}
   **Likelihood:** {High/Medium/Low}
   **Impact:** {High/Medium/Low}
   **Mitigation:** {strategy}

2. **Risk:** {description}
   ...

### 3.4 Alternative Approaches
Compare options:
| Approach | Pros | Cons | Effort | Recommendation |
|----------|------|------|--------|----------------|
| Option A | ...  | ...  | ...    | ⭐ Recommended  |
| Option B | ...  | ...  | ...    | Fallback       |
| Option C | ...  | ...  | ...    | Not recommended|
</analysis>

---

## Phase 4: Actionable Synthesis

<final_synthesis>
### 4.1 Research Summary
**Feature:** {name}
**Research Duration:** {time spent}
**Sources Consulted:** {list of MCPs and agents}
**Confidence Level:** {High/Medium/Low}

### 4.2 Recommended Approach
**Technical Stack:** {technologies}
**Architectural Pattern:** {pattern with justification}
**Key Components:** {list}
**External Dependencies:** {list}

### 4.3 Implementation Plan
**Phase:** {phase name}
- [ ] {Task} - Assigned to: [{Agent}] - Effort: {days}
- [ ] {Task} - Assigned to: [{Agent}] - Effort: {days}
...

### 4.4 Success Criteria
- {Measurable criterion 1}
- {Measurable criterion 2}
- {Measurable criterion 3}

### 4.5 Risk Register
| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| ... | ... | ... | ... | ... |

### 4.6 Effort Estimate
**Total Development Effort:** {X} developer-days
**Breakdown:**
- Backend: {Y} days
- Frontend: {Z} days
- DevOps: {A} days
- QA: {B} days
- Security: {C} days

**Can be parallelized:** {Yes/Partially/No}
**Critical Path:** {description}
</final_synthesis>

---

## Research Validation Checklist

Before proceeding to task creation, verify:

- [ ] Used Sequential Thinking for strategic planning
- [ ] Searched Context7 for historical context
- [ ] Researched DeepWiki for technical depth
- [ ] Fetched current documentation
- [ ] Checked Agent Context Hub for team knowledge
- [ ] Loaded and consulted relevant expert agents
- [ ] Cross-validated information from multiple sources
- [ ] Identified and assessed all major risks
- [ ] Estimated effort with agent validation
- [ ] Documented assumptions and constraints
- [ ] Created clear success criteria

**Research Complete:** ✅/❌
**Ready for Task Breakdown:** ✅/❌
```

## Best Practices for Deep Research

### 1. Always Follow the ReAct Pattern
```
✅ DO: Think → Act → Observe → Think → Act → Observe
❌ DON'T: Act → Act → Act → Then try to make sense of it
```

### 2. Use Multiple Information Sources
```
✅ DO: Context7 + DeepWiki + Fetch + Agents = Comprehensive view
❌ DON'T: Rely on single source or skip steps to save time
```

### 3. Document Reasoning Explicitly
```
✅ DO: Show your thinking in <thought> tags
❌ DON'T: Jump to conclusions without visible reasoning
```

### 4. Validate with Experts
```
✅ DO: Load relevant agents and get their assessment
❌ DON'T: Assume you know without consulting domain experts
```

### 5. Identify What You Don't Know
```
✅ DO: Explicitly list information gaps and uncertainties
❌ DON'T: Pretend to have complete information
```

### 6. Compare and Contrast Sources
```
✅ DO: "Source A says X, Source B says Y, we choose X because..."
❌ DON'T: Take first answer without validation
```

### 7. Think About What Could Go Wrong
```
✅ DO: Proactive risk identification with mitigation
❌ DON'T: Optimistic planning without considering risks
```

## Implementation in Agent Prompts

### For Scrum Master:
```markdown
Before breaking down any story into tasks, you MUST complete the full 
research process:

1. Use Sequential Thinking to plan your research
2. Use Context7 to find similar past implementations
3. Use DeepWiki to understand technical concepts
4. Use Fetch to get current documentation
5. Use Agent Context Hub to check team knowledge
6. Use Agent Loader to consult expert agents

Only after completing ALL steps should you create the task breakdown.
```

### For Product Manager:
```markdown
Before defining any feature requirements, you MUST conduct deep research:

Follow the ReAct framework:
- Thought: What do I need to know?
- Action: Use appropriate MCP tool
- Observation: Analyze results
- Thought: What did I learn? What's next?
- Action: Use next tool
- ...continue until comprehensive

Document your research process and findings before creating requirements.
```

## Measuring Research Quality

### Good Research Indicators:
✅ Multiple sources consulted (5+ MCP tools used)
✅ Expert agents validated approach
✅ Risks identified with mitigation
✅ Alternatives considered
✅ Effort estimates from domain experts
✅ Clear success criteria defined
✅ Assumptions and constraints documented

### Poor Research Indicators:
❌ Single source used
❌ No expert validation
❌ No risk analysis
❌ One approach considered without alternatives
❌ Gut-feel estimates
❌ Vague success criteria
❌ Undocumented assumptions

## Summary

**Key Principle:** 
> Deep research uses the ReAct framework (Reasoning + Acting) with multiple 
> information sources, explicit reasoning, and expert validation.

**Research Formula:**
```
Strategic Thinking → Multi-Source Research (ReAct) → 
Critical Analysis → Expert Validation → Actionable Synthesis
```

**Time Investment:**
- 30-60 minutes of research can save days of rework
- Complex features may need 2-4 hours of research
- The investment always pays off in better outcomes

**Remember:** 
Research is not optional - it's the foundation of successful implementation! 🎯
