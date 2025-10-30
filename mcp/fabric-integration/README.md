# Fabric Integration MCP Server

MCP server for fabric-ai pattern integration with Gemini CLI, powered by Bun.

## Prerequisites

```bash
# Install fabric (Go version) via Homebrew
brew install fabric

# Verify fabric installation
fabric --version

# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
```

## Installation

```bash
cd mcp/fabric-integration
bun install
```

## Development

```bash
# Run directly (no build step needed with Bun)
bun run dev

# Type checking
bun run typecheck
```

## Bun Advantages

- **Direct TypeScript execution**: No compilation step
- **Fast startup**: Near-instant MCP server launch
- **Hot reload**: Automatic reload on file changes (during `bun run dev`)
- **Built-in testing**: `bun test` included

## Available Tools

This MCP server exposes the following tools to the Gemini CLI:

### 1. `list_fabric_patterns`
Lists all available fabric patterns installed on your system.

**Returns:** JSON array of pattern names and count.

### 2. `run_fabric_pattern`
Executes a specific fabric pattern on input text.

**Parameters:**
- `pattern` (string): Pattern name (e.g., "extract_wisdom", "summarize")
- `input` (string): Text to process

**Returns:** Processed output from the pattern.

### 3. `get_fabric_pattern_info`
Gets detailed information and usage instructions for a specific pattern.

**Parameters:**
- `pattern` (string): Pattern name

**Returns:** Pattern description and usage.

### 4. `run_fabric_pipeline`
Runs multiple patterns in sequence, using the output of one as input to the next.

**Parameters:**
- `patterns` (string[]): Array of pattern names to run in sequence
- `input` (string): Initial input text

**Returns:** JSON object with pipeline, results for each step, and final output.

## Usage with Gemini CLI

This MCP server is automatically started by the `scripts/start_gemini.sh` script when you launch the Gemini CLI.

The configuration for this server in `settings.json` should look like this:

```json
{
  "mcpServers": {
    "fabric": {
      "command": "bun",
      "args": [
        "run",
        "mcp/fabric-integration/src/index.ts"
      ],
      "cwd": ".",
      "env": {
        "FABRIC_HOME": "$HOME/.config/fabric"
      }
    }
  }
}
```

## Examples

```
gemini

> List all fabric patterns
> Use extract_wisdom on this article: "..."
> Get info for summarize pattern
```

## Common Fabric Patterns

- **extract_wisdom**: Extract insights and quotes
- **summarize**: Create concise summaries
- **analyze_claims**: Fact-check content
- **improve_writing**: Enhance text quality
- **explain_code**: Code explanations
- **create_quiz**: Generate quiz questions
- **rate_content**: Evaluate content quality