# Research Tools

This agent has access to the following research tools:

## Google Web Search

The `google_web_search` tool can be used to search the web for information. The tool takes a single argument, `query`, which is the search query.

### Example Usage

```
print(default_api.google_web_search(query = "how to create a new agent"))
```

## GitHub Repo Loader

The `github_repo_loader` tool can be used to gather data from a GitHub repository. The tool takes a single argument, `repo_name`, which is the name of the repository in the format `owner/repo`.

### Example Usage

```
print(default_api.github_repo_loader(repo_name = "facebook/react"))
```

## Web Fetch

The `web_fetch` tool can be used to fetch the content of a URL. The tool takes a single argument, `url`, which is the URL to fetch.

### Example Usage

```
print(default_api.web_fetch(url = "https://example.com"))
```

## Context7 Library Loader

The `context7_library_loader` tool can be used to load the documentation for a library from Context7. The tool takes a single argument, `library_id`, which is the ID of the library.

### Example Usage

```
print(default_api.context7_library_loader(library_id = "/mongodb/docs"))
```
