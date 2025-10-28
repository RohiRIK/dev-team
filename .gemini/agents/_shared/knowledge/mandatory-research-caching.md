# Mandatory Research Result Caching

🚨 **CRITICAL: Research caching is MANDATORY to avoid redundant work** 🚨

## Always Check Cache Before Research

Before conducting deep research, **ALWAYS check if similar research was done recently.**

Avoid wasting time on duplicate research.

---

## Research Cache Location (MANDATORY)

All research results MUST be saved in:

```
.gemini/_research_cache/
├── 2025-10-27/
│   ├── oauth2-implementation.md
│   └── react-performance-optimization.md
├── 2025-10-20/
│   └── postgresql-indexing-strategies.md
└── README.md
```

---

## Cache Check Protocol (MANDATORY)

### Before Starting Research

1. **Check .gemini/_research_cache folder:**
   ```bash
   ls -la .gemini/_research_cache/
   ```

2. **Search for related topics:**
   ```bash
   grep -r "keyword" .gemini/_research_cache/
   ```

3. **Read recent research:**
   - If found research < 7 days old on same topic → **REUSE IT**
   - If found research 7-30 days old → **REVIEW AND UPDATE** if needed
   - If found research > 30 days old → **CONDUCT NEW RESEARCH**
   - If no related research found → **CONDUCT NEW RESEARCH**

### Reuse Decision Matrix

| Age | Same Topic | Related Topic | Action |
|-----|------------|---------------|--------|
| < 7 days | ✅ | ✅ | **Reuse** - Reference existing research |
| 7-30 days | ⚠️ | ⚠️ | **Review** - Update if technology changed |
| > 30 days | 🔄 | 🔄 | **Refresh** - Conduct new research |
| Any age | ❌ Different | ❌ Different | **New** - Conduct fresh research |

---

## Research Cache Format (MANDATORY)

### File Naming Convention

```
.gemini/_research_cache/YYYY-MM-DD/kebab-case-topic.md
```

**Examples:**
- `.gemini/_research_cache/2025-10-27/oauth2-implementation.md`
- `.gemini/_research_cache/2025-10-25/react-performance-optimization.md`
- `.gemini/_research_cache/2025-10-20/postgresql-indexing-strategies.md`

### Research Cache Template (MANDATORY)

```markdown
# Research: [Topic Name]

**Date:** October 27, 2025
**Researcher:** [Agent Name]
**Research Duration:** [Time spent]
**Valid Until:** [Date + 30 days]

---

## Research Question

[Clear statement of what was being researched]

---

## Research Process

### Tools Used
- ✅ Sequential Thinking MCP - [Key findings]
- ✅ Context7 MCP - [Key findings]
- ✅ DeepWiki MCP - [Key findings]
- ✅ Fetch MCP - [Key findings]
- ✅ Agent Context Hub - [Key findings]
- ✅ Agent Loader - [Key findings]

### Key Sources
- [Source 1 with link]
- [Source 2 with link]
- [Source 3 with link]

---

## Findings

### Summary
[2-3 paragraph summary of key findings]

### Detailed Findings

#### 1. [Finding Category]
**What:** [Description]
**Why it matters:** [Significance]
**How to use:** [Application]
**Trade-offs:** [Pros and cons]

#### 2. [Finding Category]
[Same structure]

#### 3. [Finding Category]
[Same structure]

---

## Recommendations

### Approach to Use
[Recommended approach with justification]

### Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Things to Avoid
- ❌ [Anti-pattern 1]
- ❌ [Anti-pattern 2]

### Estimated Effort
[XS/S/M/L/XL with breakdown]

---

## Code Examples

### Example 1: [Description]
```javascript
// Clear, commented example
```

### Example 2: [Description]
```javascript
// Another example
```

---

**Related Research:**

**See also:**
- `.gemini/_research_cache/2025-10-15/related-topic.md`
- `.gemini/_research_cache/2025-10-10/another-related-topic.md`

**Supersedes:**
- `.gemini/_research_cache/2025-09-20/old-version.md` (outdated)

---

## Updates Log

| Date | Agent | Change |
|------|-------|--------|
| 2025-10-27 | Scrum-Master | Initial research |

---

## Reusability

**This research is applicable for:**
- [ ] Similar features in other modules
- [ ] Related technical decisions
- [ ] Future projects with similar requirements

**Technology versions researched:**
- React: 18.x
- Node.js: 20.x
- PostgreSQL: 15.x

**May need refresh if:**
- Major version updates occur
- New alternatives emerge
- Requirements significantly change
```

---

## Creating Research Cache (MANDATORY)

After completing ANY deep research, you MUST:

1. **Check if today's folder exists:**
   ```bash
   ls -la .gemini/_research_cache/ | grep $(date +%Y-%m-%d)
   ```

2. **Create folder if needed:**
   ```bash
   mkdir -p .gemini/_research_cache/$(date +%Y-%m-%d)
   ```

3. **Create cache file:**
   ```bash
   # File name format: topic-name.md (in today's folder)
   .gemini/_research_cache/2025-10-27/oauth2-implementation.md
   ```

4. **Fill in template completely**
   - All sections are MANDATORY
   - Include all 6 MCP tool findings
   - Document sources with links
   - Provide code examples
   - Set expiration date (Date + 30 days)

5. **Update .gemini/_research_cache/README.md:**
   - Add to "Recent Research" list
   - Tag with relevant agents
   - Note key topics

6. **Share via Agent Context Hub:**
   ```markdown
   📚 New research available: OAuth2 Implementation
   File: .gemini/_research_cache/2025-10-27/oauth2-implementation.md
   Relevant for: @Backend-Developer @Frontend-Developer @Pentester
   Key finding: Use PKCE flow for better security
   ```

---

## Referencing Cached Research (MANDATORY)

When reusing research, you MUST:

1. **Reference the source:**
   ```markdown
   Based on research from `.gemini/_research_cache/2025-10-27/oauth2-implementation.md`:
   - [Key point 1]
   - [Key point 2]
   ```

2. **Validate freshness:**
   - Check "Valid Until" date
   - Verify technology versions match
   - Confirm no major changes since research

3. **Update if needed:**
   - If minor updates needed, add to "Updates Log"
   - If major updates needed, create new research file

4. **Credit in task summary:**
   ```markdown
   ## Research Sources
   - Reused research: `.gemini/_research_cache/2025-10-27/oauth2-implementation.md`
   - Time saved: ~4 hours (avoided duplicate research)
   ```

---

## Cache Maintenance (MANDATORY)

### Monthly Review

At end of each month, agents MUST review cache:

1. **Identify stale research:**
   - Research > 30 days old
   - Technology versions outdated
   - Superseded by newer research

2. **Archive or update:**
   - Move stale research to `.gemini/_research_cache/archive/`
   - Update if still relevant
   - Delete if no longer useful

3. **Update README:**
   - Remove archived items from recent list
   - Update statistics

### Cache Statistics

Track in `.gemini/_research_cache/README.md`:

```markdown
## Cache Statistics

**Total Research Items:** 45
**Active (< 30 days):** 12
**Archived:** 33

**Most Referenced:**
1. OAuth2 Implementation (referenced 8 times)
2. React Performance (referenced 6 times)
3. PostgreSQL Indexing (referenced 5 times)

**Time Saved (estimated):**
- Total research hours: 180
- Reuse instances: 35
- Time saved: ~140 hours

**Top Researchers:**
- Scrum-Master: 15 research docs
- Backend-Developer: 12 research docs
- Product-Manager: 10 research docs
```

---

## _research_cache/README.md Template

```markdown
## .gemini/_research_cache/README.md Template

```markdown
# Research Cache

This folder contains cached research results to avoid redundant research work.

## How to Use

1. **Before researching:** Check if topic already researched
2. **Check freshness:** Research < 7 days = reuse, 7-30 days = review, > 30 days = refresh
3. **After researching:** Save results here for future reuse

## Recent Research (Last 30 Days)

| Date | Topic | Researcher | Relevant For |
|------|-------|------------|--------------|
| 2025-10-27 | OAuth2 Implementation | Scrum-Master | Backend, Frontend, Pentester |
| 2025-10-25 | React Performance | Frontend-Developer | Frontend, UI-UX |
| 2025-10-23 | PostgreSQL Indexing | Backend-Developer | Backend, Database |

## Research by Category

### Authentication & Security
- `.gemini/_research_cache/2025-10-27/oauth2-implementation.md`
- `2025-10-15/jwt-token-management.md`

### Performance
- `2025-10-25/react-performance-optimization.md`
- `2025-10-18/api-caching-strategies.md`

### Database
- `2025-10-23/postgresql-indexing-strategies.md`
- `2025-10-10/database-normalization.md`

## Cache Statistics
[Statistics from above]

## Guidelines

- Research older than 30 days should be reviewed before reuse
- Always check technology versions
- Update existing research rather than duplicate
- Credit reused research in task summaries
```

---

## Research Reuse in Task Breakdown (MANDATORY)

When breaking down tasks, reference cached research:

```markdown
✅ CORRECT:

## Research Conducted

**Reused research:**
- `.gemini/_research_cache/2025-10-27/oauth2-implementation.md`
  - Recommends PKCE flow
  - Provides implementation examples
  - Time saved: ~4 hours

**New research needed:**
- Specific integration with our auth service (30 min)

## Task Breakdown
[Tasks based on research]
```

---

## Benefits of Research Caching

**Time Saved:**
- Avoid 3-6 hours of duplicate research
- Faster task breakdowns
- Quicker implementation decisions

**Knowledge Sharing:**
- All agents benefit from each other's research
- Consistent approaches across team
- Accumulated expertise

**Quality Improvement:**
- Research builds on previous findings
- Better decisions from collective knowledge
- Fewer redundant mistakes

---

## No Duplicate Research

**Research caching is MANDATORY.**

Before conducting ANY deep research:
1. Check `.gemini/_research_cache`
2. Reuse if fresh
3. Update if needed
4. Create new only if necessary

**Duplicate research = wasted time.**

Always save your research for future reuse.
- Fewer redundant mistakes

---

## No Duplicate Research

**Research caching is MANDATORY.**

Before conducting ANY deep research:
1. Check _research_cache
2. Reuse if fresh
3. Update if needed
4. Create new only if necessary

**Duplicate research = wasted time.**

Always save your research for future reuse.
