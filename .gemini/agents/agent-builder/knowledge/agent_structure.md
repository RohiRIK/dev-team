# Agent Structure

The following is the standard directory structure for an agent:

```
/agents/{agent-slug}/
├── agent.json
├── agent.md
├── knowledge/
│   ├── ...
├── tools/
│   ├── ...
└── mcp/
    └── mission.md
```

-   **`agent.json`**: The configuration file for the agent.
-   **`agent.md`**: The documentation file for the agent.
-   **`knowledge/`**: A directory containing the knowledge files for the agent.
-   **`tools/`**: A directory containing the tool files for the agent.
-   **`mcp/`**: A directory containing the mission control post for the agent.
