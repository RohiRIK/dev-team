# Content Creator SEO Tools

This agent has access to the following SEO tools to assist with optimizing content for search engines and enhancing online visibility.

## Google Web Search (for Keyword Research & Trend Identification)

The `google_web_search` tool can be used for initial keyword research, identifying trending topics, and understanding search intent. By analyzing search results, the agent can infer popular queries and content gaps.

### Example Usage

```python
print(default_api.google_web_search(query = "best content marketing strategies 2024"))
print(default_api.google_web_search(query = "what do people ask about AI writing tools"))
```

## Semrush (Conceptual Tool)

Semrush is a powerful all-in-one SEO toolkit providing features for keyword research, competitor analysis, and content optimization. Its SEO Writing Assistant uses AI to analyze content for SEO, readability, tone, and originality, offering suggestions for improvement. This tool can be conceptually used for comprehensive SEO analysis and content optimization.

### Example Usage (Conceptual)

```python
# Simulate Semrush keyword research
print(default_api.run_shell_command(command = "semrush_keyword_research --topic \"AI content generation\" --country US"))

# Simulate Semrush SEO Writing Assistant
print(default_api.run_shell_command(command = "semrush_seo_assistant --content_draft \"...\" --target_keyword \"AI writing tools\""))
```

## Ahrefs (Conceptual Tool)

Ahrefs is known for its robust backlink analysis and keyword research capabilities. It also includes an AI Content Helper that guides creators on subtopics to cover based on top-ranking pages for a target keyword. This tool can be conceptually used for in-depth keyword and competitor analysis.

### Example Usage (Conceptual)

```python
# Simulate Ahrefs keyword analysis
print(default_api.run_shell_command(command = "ahrefs_keyword_analysis --keyword \"content marketing trends\""))

# Simulate Ahrefs content helper for subtopic generation
print(default_api.run_shell_command(command = "ahrefs_content_helper --target_keyword \"blog post SEO\""))
```

## Surfer SEO (Conceptual Tool)

Surfer SEO specializes in on-page optimization, providing a content editor that offers real-time SEO suggestions as you write. It analyzes top search results for a target keyword and suggests terms to include, ideal word counts, and heading structures. This tool can be conceptually used for real-time content optimization during writing.

### Example Usage (Conceptual)

```python
# Simulate Surfer SEO content editor suggestions
print(default_api.run_shell_command(command = "surfer_seo_editor --content_draft \"...\" --target_keyword \"effective content writing\""))
```

## Also Asked (Conceptual Tool)

Also Asked helps content creators find frequently asked questions related to a topic, which can be valuable for content structuring and addressing user intent. This tool can be conceptually used for generating FAQ sections and understanding user queries.

### Example Usage (Conceptual)

```python
# Simulate Also Asked for related questions
print(default_api.run_shell_command(command = "also_asked_questions --topic \"social media content\""))
```
