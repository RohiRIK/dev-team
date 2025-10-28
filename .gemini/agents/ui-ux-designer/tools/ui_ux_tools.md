# UI/UX Designer Tools

This agent has access to the following tools to assist with UI/UX design tasks, including interacting with design software and generating design assets.

## Figma (Conceptual Tool)

Figma is a leading cloud-based design tool for UI/UX, offering real-time collaboration, integrated prototyping, and robust features for creating design systems. It allows designers to create interactive mockups, wireframes, and high-fidelity UI designs.

### Example Usage (Conceptual)

```python
# Simulate creating a new Figma file for a project
print(default_api.run_shell_command(command = "figma_create_file --project_name \"New Mobile App UI\" --template \"Mobile UI Kit\""))

# Simulate exporting a frame as an image
print(default_api.run_shell_command(command = "figma_export_frame --file_id 12345 --frame_name \"Homepage\" --format png"))

# Simulate running a Figma plugin (e.g., for generating content)
print(default_api.run_shell_command(command = "figma_run_plugin --plugin_id \"content-generator\" --target_frame \"Product Page\""))
```

## Adobe XD (Conceptual Tool)

Adobe XD is a vector-based design tool for creating interactive digital interfaces. It supports wireframing, prototyping, and sharing designs, with features like Auto-Animate and Repeat Grid.

### Example Usage (Conceptual)

```python
# Simulate creating a new Adobe XD project from a template
print(default_api.run_shell_command(command = "adobe_xd_create_project --template \"Web Design\" --project_name \"Company Website Redesign\""))

# Simulate exporting artboards for development
print(default_api.run_shell_command(command = "adobe_xd_export_artboards --project_id 67890 --format svg --for_development"))
```

## Sketch (Conceptual Tool)

Sketch is a vector graphics editor primarily used for UI and UX design, known for its powerful features for creating reusable components and managing design systems, especially on macOS.

### Example Usage (Conceptual)

```python
# Simulate creating a new Sketch document
print(default_api.run_shell_command(command = "sketch_create_document --document_name \"Design System Library\""))

# Simulate exporting assets from a Sketch document
print(default_api.run_shell_command(command = "sketch_export_assets --document_id 101112 --asset_type icons --format svg"))
```

## Balsamiq (Conceptual Tool)

Balsamiq is a popular tool for creating low-fidelity wireframes, focusing on the structure and content of a design rather than visual details. It's excellent for quick ideation and early-stage user flow mapping.

### Example Usage (Conceptual)

```python
# Simulate creating a new wireframe in Balsamiq
print(default_api.run_shell_command(command = "balsamiq_create_wireframe --project_name \"Login Flow\" --screen_name \"Login Screen\""))

# Simulate exporting a wireframe as a PDF
print(default_api.run_shell_command(command = "balsamiq_export_wireframe --project_id 131415 --format pdf"))
```

## User Research & Testing Tools (Conceptual Tool)

This conceptual tool represents the ability to interact with various user research and usability testing platforms (e.g., UserTesting, Maze, Userpilot) to conduct interviews, surveys, usability tests, and gather feedback.

### Example Usage (Conceptual)

```python
# Simulate launching a usability test on a prototype
print(default_api.run_shell_command(command = "usability_test_launch --tool UserTesting --prototype_url https://my.prototype.com --tasks \"task1,task2\""))

# Simulate analyzing user feedback from a survey
print(default_api.run_shell_command(command = "user_feedback_analyze --tool Userpilot --survey_id 789 --report_format json"))
```