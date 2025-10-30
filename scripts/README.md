# Scripts

This directory contains utility scripts for managing the AI-Powered-Knowledge-API project.

## `start_gemini.sh`

This script automates the process of launching the Gemini CLI with all its associated Model Context Protocol (MCP) servers running in the background.

### What it Does:
1.  **Starts MCP Servers:** It reads the MCP server configurations from `.gemini/settings.json` and starts each configured server (e.g., `agent-loader`, `fabric`) in the background using `bun`.
2.  **Manages PIDs:** It keeps track of the Process IDs (PIDs) of the background MCP servers in a temporary file (`.mcp_pids`) in the project root.
3.  **Launches Gemini CLI:** After ensuring the MCP servers have a moment to start, it launches the Gemini CLI.
4.  **Cleans Up:** When the Gemini CLI exits, the script automatically kills all the MCP server processes that it started, ensuring a clean shutdown.

### Usage:

#### 1. Make the script executable:

```bash
chmod +x scripts/start_gemini.sh
```

#### 2. Add an alias to your shell configuration (e.g., `~/.zshrc`, `~/.bashrc`):

Open your shell configuration file and add the following line. Replace `[YOUR_PROJECT_ROOT]` with the absolute path to your AI-Powered-Knowledge-API project directory.

```bash
alias buddy="[YOUR_PROJECT_ROOT]/scripts/start_gemini.sh"
```

For example:

```bash
alias buddy="/Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/scripts/start_gemini.sh"
```

#### 3. Reload your shell configuration:

```bash
source ~/.zshrc # or source ~/.bashrc
```

Now, you can simply type `buddy` in your terminal to start your development environment.

## `generate-pdf.ts`

This TypeScript script is used by the `cv-specialist` agent to convert an HTML resume into a professional PDF document using Puppeteer.

### What it Does:
1.  **Launches Headless Browser:** Starts a headless Chromium browser instance.
2.  **Loads HTML:** Navigates to a specified HTML file (e.g., `agents/cv-specialist/output/temp/resume.html`).
3.  **Generates PDF:** Prints the loaded HTML page to a PDF file (e.g., `agents/cv-specialist/output/resume.pdf`).

### Usage (typically invoked by the `cv-specialist` agent):

```bash
bun run scripts/generate-pdf.ts
```