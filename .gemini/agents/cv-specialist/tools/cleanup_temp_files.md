# Tool: cleanup_temp_files

## Description
Removes temporary files generated during the CV creation process, such as the Markdown and HTML versions of the resume.

## Parameters

- **`markdown_file_path`** (string, required)
  - The absolute path to the Markdown file to be removed.
  - *Example:* `/Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/agents/cv-specialist/resume.md`

- **`html_file_path`** (string, required)
  - The absolute path to the HTML file to be removed.
  - *Example:* `/Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/agents/cv-specialist/resume.html`

## Execution Logic
The tool executes the following shell command:

```bash
rm -f /Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/agents/cv-specialist/output/temp/resume.md /Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/agents/cv-specialist/output/temp/resume.html
```

## Usage Example
After generating the PDF, the agent should invoke this tool to clean up the intermediate Markdown and HTML files.