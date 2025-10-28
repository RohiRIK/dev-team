# Automation Specialist Tools

This document outlines the specialized tools available to the Automation Specialist agent for interacting with the n8n workflow and documentation knowledge base.

## Workflow Management Tools

These tools are provided by the `workflow-loader` MCP server and allow you to find and retrieve n8n workflows.

### `search_workflows(query: string, limit?: number) -> object`

Searches for n8n workflows based on a query. You can search by workflow name, description, or content.

- **query**: The search term. This can be a keyword, a name, or a description.
- **limit** (optional): The maximum number of results to return. Defaults to 10.

Returns an object containing the search results, including filename, name, description, and number of nodes.

### `get_workflow(filename: string) -> object`

Retrieves the full JSON content of a specific n8n workflow.

- **filename**: The exact filename of the workflow to retrieve (e.g., "my-workflow.json").

Returns the full JSON definition of the workflow.

### `list_workflows(limit?: number) -> object`

Lists all available n8n workflows with basic information.

- **limit** (optional): The maximum number of workflows to list. Defaults to 50.

Returns an object with the total count and a list of workflows, including filename, name, and node count.

## Documentation Tools

### `get_n8n_docs(topic: string) -> string`

Retrieves n8n documentation content for a specific topic. This tool searches through the agent's knowledge base, including core concepts and node guides.

- **topic**: The documentation topic you want to retrieve (e.g., "Code Node", "HTTP Request", "Webhook", "core concepts").

Returns the markdown content of the documentation file if a match is found. If no match is found, it will return a list of available topics.
