# Research Cache

This folder contains cached research results to avoid redundant research work.

## 🚨 MANDATORY: Always Check Cache Before Research

Before conducting ANY deep research, you MUST check this folder first.

## Folder Structure

Research is organized by date:

```
.gemini/_research_cache/
├── 2025-10-27/
│   ├── oauth2-implementation.md
│   └── react-hooks-best-practices.md
├── 2025-10-20/
│   └── api-rate-limiting-strategies.md
└── README.md
```

## How to Use

1. **Before researching:** Search this folder for similar topics
2. **Check freshness:** 
   - < 7 days = **REUSE**
   - 7-30 days = **REVIEW & UPDATE**
   - \> 30 days = **REFRESH**
3. **After researching:** Save results here for future reuse

### Commands for Finding Research

```bash
# Check if today's folder exists
ls -la .gemini/_research_cache/ | grep $(date +%Y-%m-%d)

# Create today's folder if needed
mkdir -p .gemini/_research_cache/$(date +%Y-%m-%d)

# Search for specific topics
grep -r "oauth" .gemini/_research_cache/

# List research from specific date
ls -la .gemini/_research_cache/2025-10-27/

# Find recent research (last 7 days)
find .gemini/_research_cache/ -type f -name "*.md" -mtime -7

# List all date folders
ls -d .gemini/_research_cache/*/
```

## Recent Research (Last 30 Days)

| Date | Topic | Researcher | Relevant For | Status |
|------|-------|------------|--------------|--------|
| (No research yet) | | | | |

## Research by Category

### Authentication & Security
(No research yet)

### Performance
(No research yet)

### Database
(No research yet)

### Frontend
(No research yet)

### Backend
(No research yet)

### Testing
(No research yet)

### Architecture
(No research yet)

## Cache Statistics

**Total Research Items:** 0
**Active (< 30 days):** 0
**Archived:** 0

**Time Saved (estimated):** 0 hours

**Top Researchers:**
(Statistics will appear as research is added)

## Guidelines

- Research older than 30 days should be reviewed before reuse
- Always check technology versions match your needs
- Update existing research rather than duplicate
- Credit reused research in task summaries
- Save ALL research here - even "simple" research saves time later

## File Naming Convention

```
.gemini/_research_cache/YYYY-MM-DD/topic-name.md
```

**Examples:**
- `.gemini/_research_cache/2025-10-27/oauth2-implementation.md`
- `.gemini/_research_cache/2025-10-27/react-hooks-best-practices.md`
- `.gemini/_research_cache/2025-10-27/api-rate-limiting-strategies.md`
