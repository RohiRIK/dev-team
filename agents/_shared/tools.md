# Shared Agent Tools

This document describes tools and conventions that are available to all agents.

---

## Built-in Tools

All agents have access to a core set of built-in tools for interacting with the local file system, running commands, and searching the web.

- **`read_file`**: To read the content of a specific file.
- **`write_file`**: To create or overwrite a file with new content.
- **`replace`**: To perform targeted, in-place modifications of a file.
- **`run_shell_command`**: To execute shell commands, such as `ls`, `cat`, `git`, or running scripts.
- **`google_web_search`**: To find information on the internet.

## Custom Tools & Conventions

This section is reserved for documenting any custom tools or project-specific conventions that are developed over time. For example, if we create a custom script for deploying a service, we would document its usage here.

## Troubleshooting MCP Servers

When an MCP server (like the Agent Loader) is not connecting or behaving as expected, consider the following troubleshooting steps:

1.  **Check Server Logs:** If the server is running in the background, check its log file (e.g., `server.log`) for any error messages. If running in the foreground, observe the console output directly.
2.  **Verify Dependencies:** Ensure all project dependencies are installed. For Bun projects, navigate to the server's directory and run `bun install`.
3.  **Run Typecheck:** For TypeScript projects, use the `typecheck` script (e.g., `bun run typecheck` or `npm run typecheck`) to identify any syntax or type errors that might prevent the server from starting correctly.
4.  **Restart the Server:** After making any changes or installing dependencies, always restart the MCP server.
