# Agent-Specific Tools

This directory is intended for tool documentation specific to the **CV Specialist** agent.

This agent has access to the following custom and system tools:

## Custom Tools

### `generate_cv_pdf`
- **Purpose**: To convert a Markdown CV template into a professional, styled PDF with a profile picture.
- **Details**: See `generate_cv_pdf.md` for full documentation.

## System Tools Used

## System Tools Used

### `read_file`
- **Purpose**: To read the contents of the user's `Telos/TELOS.md` file and any job description the user provides.
- **Usage**: The agent calls this tool to get the necessary data for CV generation.

### `write_file`
- **Purpose**: To save the generated CV as a Markdown file in the user's filesystem.
- **Usage**: The agent uses this tool to deliver the final, tailored CV.

## Integration with Fabric
This agent can leverage `fabric` patterns for more complex analysis or data transformation if needed, but it currently does not have any specific patterns assigned.
