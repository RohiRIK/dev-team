# Testing Tools

This agent has access to the following testing tools:

## Run Shell Command

The `run_shell_command` tool can be used to run shell commands. This can be used to run the `test-agent` script to validate the structure and content of an agent.

### Example Usage

```
print(default_api.run_shell_command(command = "bun run test-agent my-new-agent"))
```
