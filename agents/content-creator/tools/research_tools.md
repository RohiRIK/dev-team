# Content Creator Research Tools

This agent has access to the following research tools to assist with content creation:

## Google Web Search

The `google_web_search` tool can be used to search the web for information, identify trending topics, and gather data for content creation. The tool takes a single argument, `query`, which is the search query.

### Example Usage

```
print(default_api.google_web_search(query = "best practices for blog writing"))
```

## AnswerthePublic

(Conceptual Tool - Simulates functionality of AnswerthePublic)

This conceptual tool helps to gather questions and phrases people ask related to a keyword, aiding in content idea generation and trend monitoring. It can be simulated by using targeted `google_web_search` queries.

### Example Usage

```
print(default_api.google_web_search(query = "questions about content marketing"))
```

## Ubersuggest

(Conceptual Tool - Simulates functionality of Ubersuggest)

This conceptual tool offers keyword research, competitor analysis, and site audits. It can be simulated by using targeted `google_web_search` queries and analyzing search results.

### Example Usage

```
print(default_api.google_web_search(query = "keyword research for SEO"))
```

## Ahrefs

(Conceptual Tool - Simulates functionality of Ahrefs)

This conceptual tool provides SEO tools and resources for growing search traffic. It can be simulated by using targeted `google_web_search` queries and analyzing SEO-related articles.

### Example Usage

```
print(default_api.google_web_search(query = "how to improve website SEO"))
```
