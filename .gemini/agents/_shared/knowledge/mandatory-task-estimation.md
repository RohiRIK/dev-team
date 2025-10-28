# Mandatory Task Estimation & Time Tracking

🚨 **CRITICAL: Estimation and tracking are MANDATORY - NOT optional** 🚨

## Task Estimation (MANDATORY for ALL Task Breakdowns)

Every task and sub-task MUST include an effort estimate.

### Estimation Scale (MANDATORY)

Use this scale for EVERY task:

- **XS (Extra Small):** < 30 minutes
  - Examples: Update config value, fix typo, add comment, simple style change
  
- **S (Small):** 30 minutes - 2 hours
  - Examples: Simple function, basic component, straightforward bug fix
  
- **M (Medium):** 2-8 hours
  - Examples: Complex component, API endpoint, feature with testing
  
- **L (Large):** 1-3 days
  - Examples: Multiple related features, complex refactoring, integration work
  
- **XL (Extra Large):** 3+ days
  - Examples: Major feature, architecture change, system integration
  - **⚠️ XL tasks MUST be broken down into smaller tasks**

### Estimation Format (MANDATORY)

```markdown
- [ ] [Agent-Name] Task description [Estimate: S]
	- [ ] [Agent-Name] Sub-task 1 [Estimate: XS]
	- [ ] [Agent-Name] Sub-task 2 [Estimate: M]
```

**Real Example:**
```markdown
- [ ] Implement OAuth2 Authentication [Estimate: L]
	- [ ] [Backend-Developer] Create auth endpoints [Estimate: M]
	- [ ] [Backend-Developer] Implement JWT token generation [Estimate: S]
	- [ ] [Backend-Developer] Add refresh token logic [Estimate: S]
	- [ ] [Frontend-Developer] Create login form [Estimate: S]
	- [ ] [Frontend-Developer] Add auth state management [Estimate: M]
	- [ ] [QA-Tester] Test auth flows [Estimate: S]
```

---

## Time Tracking (MANDATORY in Task Summaries)

Every task summary MUST include actual time spent.

### Time Tracking Format (MANDATORY)

```markdown
## Time Tracking

**Estimated Time:** [Original estimate]
**Actual Time:** [Time actually spent]
**Variance:** [Difference and why]

### Time Breakdown:
- Research: [X hours]
- Implementation: [X hours]
- Testing: [X hours]
- Documentation: [X hours]
- Debugging/Fixes: [X hours]

**Lessons Learned:**
- [What took longer than expected and why]
- [What was faster than expected and why]
- [How to improve estimates for similar tasks]
```

---

## Estimation Accuracy Tracking

### Track Your Estimates

After completing tasks, note:

```markdown
## Estimation Accuracy

| Task Type | Estimated | Actual | Accuracy |
|-----------|-----------|--------|----------|
| API Endpoint | M (4h) | 6h | -50% (underestimated) |
| React Component | S (1h) | 45min | +25% (overestimated) |
| Bug Fix | XS (20min) | 2h | -500% (major underestimate) |

**Patterns Identified:**
- Integration tasks consistently take 50% longer than estimated
- UI components usually faster than estimated
- Bug fixes highly variable - need better debugging process
```

---

## Required Time Estimates for Different Work Types

### Code Implementation (MANDATORY)
- Include time for: Writing + Testing + Documentation + Review

### Research Tasks (MANDATORY)
- Include time for: All 6 MCP tool research + Analysis + Documentation

### Bug Fixes (MANDATORY)
- Include time for: Diagnosis + Fix + Testing + Verification + Documentation

### Features (MANDATORY)
- Include time for: Research + Design + Implementation + Testing + Documentation

---

## Breaking Down Large Estimates (MANDATORY)

**If any task is estimated as L or XL, you MUST break it down further.**

### Breaking Down Process:

1. **Identify sub-components** - What are the distinct pieces?
2. **Estimate each piece** - Give each a separate estimate
3. **Add buffer** - Add 20% for integration and unexpected issues
4. **Validate total** - Does sum of parts equal whole?

**Example:**
```markdown
❌ WRONG:
- [ ] Build user dashboard [Estimate: XL]

✅ CORRECT:
- [ ] Build user dashboard [Total Estimate: L - breakdown below]
	- [ ] [Backend-Developer] Create dashboard API [Estimate: M]
	- [ ] [Frontend-Developer] Build dashboard layout [Estimate: S]
	- [ ] [Frontend-Developer] Add user widgets [Estimate: M]
	- [ ] [Frontend-Developer] Implement data visualization [Estimate: M]
	- [ ] [QA-Tester] Test dashboard functionality [Estimate: S]
	- [ ] [UI-UX-Designer] Review and refine UX [Estimate: S]
```

---

## Learning Loop (MANDATORY)

At end of EVERY task summary, include:

```markdown
## Estimation Learning

**What I learned about estimating this type of work:**
- [Specific insight about time needed]
- [Factors that affected duration]
- [How to estimate better next time]

**Adjustment for future similar tasks:**
- [Concrete change to estimation approach]
```

---

## No Work Without Estimates

**Every task breakdown MUST include estimates.**

**Every task summary MUST include actual time tracking.**

This is **NON-NEGOTIABLE** for all agents.
