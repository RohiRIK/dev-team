# Tutorial: Getting Started with the Multi-Agent AI System

This tutorial will guide you through the process of setting up and using the multi-agent AI system.

## Prerequisites

Before you begin, make sure you have the following installed:

*   [Node.js](https://nodejs.org/)
*   [Bun](https://bun.sh/)
*   [Python](https://www.python.org/)
*   [uv](https://github.com/astral-sh/uv)
*   [Homebrew](https://brew.sh/) (for macOS)

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-repo/multi-agent-ai-system.git
    ```

2.  Install the dependencies:

    ```bash
    bun install
    uv pip install -r requirements.txt
    ```

## Running the System

To start the system, run the following command:

```bash
bun run start
```

This will start the main orchestrator, Buddy. You can then interact with Buddy through the command line.

## Interacting with Buddy

Once the system is running, you can interact with Buddy by typing commands in the terminal. Here are a few examples:

*   `/help`: Show a list of available commands.
*   `/list-agents`: List all the available agents.
*   `/switch-agent <agent_name>`: Switch to a specific agent.

## Next Steps

Now that you have the system up and running, you can start exploring its capabilities. Try asking Buddy to perform a task, or switch to a specialist agent to get help with a specific domain.
