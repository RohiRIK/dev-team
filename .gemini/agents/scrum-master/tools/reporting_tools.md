# Scrum Master Reporting Tools

This agent has access to the following reporting tools to provide insights into team performance, project progress, and potential impediments, enabling data-driven decision-making and transparent communication with stakeholders.

## Jira's Native Reports (Conceptual Tool)

Jira offers a suite of built-in reports crucial for Scrum Masters, such as Sprint Reports, Burndown Charts, Velocity Charts, Epic Burndowns, and Release Burndowns. These reports help track sprint progress, identify scope creep, and provide insights into team performance.

### Example Usage (Conceptual)

```
# Simulate generating a Velocity Chart in Jira
print(default_api.run_shell_command(command = "jira_generate_report --report_type VelocityChart --project_id PROJ"))

# Simulate viewing a Sprint Report
print(default_api.run_shell_command(command = "jira_view_report --report_type SprintReport --sprint_id SPRINT-456"))
```

## eazyBI Reports and Charts for Jira (Conceptual Tool)

eazyBI allows for the creation of custom reports and charts from Jira data using a drag-and-drop interface. It provides valuable insights into agile sprint overviews, project forecasting, and team performance.

### Example Usage (Conceptual)

```
# Simulate creating a custom Cumulative Flow Diagram
print(default_api.run_shell_command(command = "eazybi_create_report --report_type CumulativeFlowDiagram --project_id PROJ --measures \"Issues in Progress\",\"Issues Done\""))
```

## Zoho Sprints (Conceptual Tool)

Zoho Sprints is an agile project management tool that provides features for sprint planning, backlog management, task tracking, and real-time reports such as Velocity, Burndown, and Burnup charts.

### Example Usage (Conceptual)

```
# Simulate generating a Burnup Chart in Zoho Sprints
print(default_api.run_shell_command(command = "zoho_sprints_generate_chart --chart_type BurnupChart --sprint_id SPRINT-789"))
```

## Axify (Conceptual Tool)

Axify is a tool focused on tracking metrics like DORA, cycle time, and work in progress, offering in-depth, real-time insights and actionable reports.

### Example Usage (Conceptual)

```
# Simulate generating a Cycle Time report
print(default_api.run_shell_command(command = "axify_generate_report --report_type CycleTime --project_id PROJ"))
```

## Easy Project / Easy Redmine (Conceptual Tool)

These tools offer dedicated dashboards for Scrum Masters with features like current sprint status, velocity, and story point tracking.

### Example Usage (Conceptual)

```
# Simulate viewing a Scrum Master dashboard
print(default_api.run_shell_command(command = "easy_project_view_dashboard --dashboard_name \"ScrumMasterOverview\" --sprint_id SPRINT-101"))
```
