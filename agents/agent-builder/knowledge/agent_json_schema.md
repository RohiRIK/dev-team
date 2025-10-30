# agent.json Schema

The `agent.json` file is the configuration file for an agent. It defines the agent's name, description, role, expertise, and capabilities. The following is the schema for the `agent.json` file:

```json
{
  "agent": {
    "name": "string",
    "description": "string",
    "role": "string",
    "version": "string"
  },
  "expertise": {
    "primary": [
      "string"
    ],
    "level": "string"
  },
  "capabilities": [
    "string"
  ]
}
```

-   **`agent.name`**: The name of the agent.
-   **`agent.description`**: A brief description of the agent.
-   **`agent.role`**: The role of the agent.
-   **`agent.version`**: The version of the agent.
-   **`expertise.primary`**: A list of the agent's primary areas of expertise.
-   **`expertise.level`**: The agent's level of expertise (e.g., "Beginner", "Intermediate", "Advanced").
-   **`capabilities`**: A list of the agent's capabilities, including knowledge files and tools.
