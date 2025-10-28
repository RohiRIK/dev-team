# Scrum Master Confluence Integration Tools

This agent has access to the following Confluence integration tools to enhance agile practices, team collaboration, and documentation.

## Jira Integration (Conceptual Tool)

Confluence and Jira, both Atlassian products, are designed to work seamlessly together. This integration is crucial for Scrum Masters as it allows for:

-   **Linking Jira issues to Confluence pages:** Enables easy navigation between detailed documentation in Confluence and related tasks in Jira.
-   **Embedding Jira reports and dashboards:** Scrum Masters can display project roadmaps, sprint reports, and issue lists directly on Confluence pages, providing a centralized view of project progress.
-   **Creating Jira issues from Confluence pages:** Streamlines the process of turning discussions or documentation into actionable tasks.
-   **Scrum-specific documentation:** Confluence can host product backlogs, sprint plans, and meeting notes for various Scrum ceremonies, complementing Jira's task tracking.

### Example Usage (Conceptual)

```python
# Simulate linking a Confluence page to a Jira issue
print(default_api.run_shell_command(command = "confluence_link_jira_issue --page_id PAGE-123 --issue_id ISSUE-456"))

# Simulate embedding a Jira burndown chart on a Confluence page
print(default_api.run_shell_command(command = "confluence_embed_jira_report --page_id PAGE-123 --report_type BurndownChart --sprint_id SPRINT-789"))
```

## Agile Retrospectives for Confluence (Conceptual Tool)

This add-on allows teams to run engaging retrospective sessions directly within Confluence, providing templates for input, discussion, voting, and action item creation.

### Example Usage (Conceptual)

```python
# Simulate creating a retrospective page using a template
print(default_api.run_shell_command(command = "confluence_create_retrospective_page --space_id SCRUM --sprint_id SPRINT-789 --template \"MadGladSad\""))
```

## Draw.io Diagrams & Whiteboards (Conceptual Tool)

These plugins enable teams to create various diagrams (flowcharts, network diagrams, wireframes) directly within Confluence pages, enhancing documentation and knowledge sharing.

### Example Usage (Conceptual)

```python
# Simulate embedding a Draw.io diagram on a Confluence page
print(default_api.run_shell_command(command = "confluence_embed_diagram --page_id PAGE-123 --diagram_name \"WorkflowDiagram\""))
```

## Scrum Poker Estimates for Confluence (Conceptual Tool)

This tool is ideal for distributed agile teams to conduct planning poker sessions and estimate software development tasks, with integration to import backlogs from Jira.

### Example Usage (Conceptual)

```python
# Simulate starting a planning poker session
print(default_api.run_shell_command(command = "confluence_start_planning_poker --page_id PAGE-123 --jira_backlog_link \"JIRA-PROJ-BACKLOG\""))
```
