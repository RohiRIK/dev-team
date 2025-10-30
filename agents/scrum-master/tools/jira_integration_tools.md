# Scrum Master Jira Integration Tools

This agent has access to the following Jira integration tools to enhance agile practices, improve reporting, and streamline team collaboration.

## Jira's Native Reports (Conceptual Tool)

Jira itself offers a suite of built-in reports crucial for Scrum Masters, such as Sprint Reports, Burndown Charts, Velocity Charts, Epic Burndowns, and Release Burndowns. These reports help track sprint progress, identify scope creep, and provide insights into team performance.

### Example Usage (Conceptual)

```python
# Simulate generating a Sprint Report in Jira
print(default_api.run_shell_command(command = "jira_generate_report --report_type SprintReport --sprint_id SPRINT-123"))

# Simulate viewing a Burndown Chart
print(default_api.run_shell_command(command = "jira_view_chart --chart_type BurndownChart --sprint_id SPRINT-123"))
```

## ScriptRunner for Jira (Conceptual Tool)

ScriptRunner for Jira is a powerful plugin that enables advanced workflow automation, dynamic field control, scripted fields, enhanced JQL functions, and bulk operations. It helps automate routine tasks that can otherwise slow down agile teams.

### Example Usage (Conceptual)

```python
# Simulate automating a workflow transition based on a condition
print(default_api.run_shell_command(command = "scriptrunner_execute_script --script_name \"AutoTransitionIssue\" --issue_id ISSUE-456 --condition \"all subtasks resolved\""))
```

## Easy Agile TeamRhythm for Jira (Conceptual Tool)

Easy Agile TeamRhythm for Jira (including Easy Agile User Story Maps) aids in planning, collaborating, and tracking user stories. It supports both Scrum and Kanban frameworks and provides visual roadmaps and story maps, making it easier to visualize progress and align teams.

### Example Usage (Conceptual)

```python
# Simulate creating a user story map
print(default_api.run_shell_command(command = "easy_agile_create_story_map --project_id PROJ --epic_id EPIC-789 --user_stories \"story1,story2\""))
```

## BigPicture (Conceptual Tool)

BigPicture offers advanced planning, tracking, and reporting features, including Gantt charts, roadmaps, and resource management plans. It supports various methodologies, including SAFe®, and helps visualize project timelines and manage dependencies across teams.

### Example Usage (Conceptual)

```python
# Simulate generating a Gantt chart for a project
print(default_api.run_shell_command(command = "bigpicture_generate_gantt --project_id PROJ --start_date 2024-01-01 --end_date 2024-03-31"))
```

## eazyBI Reports and Charts for Jira (Conceptual Tool)

eazyBI allows for the creation of custom reports and charts from Jira data using a drag-and-drop interface. It provides valuable insights into agile sprint overviews, project forecasting, and team performance.

### Example Usage (Conceptual)

```python
# Simulate creating a custom velocity chart
print(default_api.run_shell_command(command = "eazybi_create_report --report_type VelocityChart --project_id PROJ --measures \"Story Points Completed\""))
```
