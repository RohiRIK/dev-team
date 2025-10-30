# Scrum Master Tools

This agent has access to the following tools to assist with Scrum Master responsibilities:

## Run Shell Command

The `run_shell_command` tool can be used to run shell commands. This can be used to interact with external systems like Jira or Confluence (e.g., via their APIs or CLI tools, if available) to perform tasks such as:

-   Updating Jira issues (e.g., changing status, assigning tasks, adding comments).
-   Generating reports from Jira (e.g., burndown charts, velocity reports).
-   Creating or updating Confluence pages (e.g., meeting minutes, sprint goals).

### Example Usage (Conceptual - actual commands would depend on specific CLI/API setup)

```
# Example: Update a Jira issue status
print(default_api.run_shell_command(command = "jira update ISSUE-123 --set status='In Progress'"))

# Example: Generate a burndown chart report (assuming a custom script)
print(default_api.run_shell_command(command = "python generate_burndown_report.py --sprint SPRINT-42"))

# Example: Create a Confluence page
print(default_api.run_shell_command(command = "confluence create-page --space 'SCRUM' --title 'Sprint 42 Retrospective' --content '...' "))
```
