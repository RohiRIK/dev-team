# Tool: generate_cv_pdf

## Description
Converts a given Markdown CV file into a professional, styled PDF document. This tool uses Pandoc and pdflatex to ensure a high-quality, well-formatted output. It automatically includes the user's profile picture at the top of the document.

## Parameters

- **`markdown_file_path`** (string, required)
  - The absolute path to the input Markdown CV file that needs to be converted.
  - *Example:* `/Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/agents/cv-specialist/resume.md`

- **`output_pdf_path`** (string, required)
  - The absolute path for the final PDF document.
  - *Example:* `/Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/agents/cv-specialist/resume.pdf`

- **`profile_picture_path`** (string, required)
  - The absolute path to the profile picture to be included in the CV.
  - *Example:* `agents/cv-specialist/assets/me.jpg`

## Execution Logic
The tool executes the following shell command:

```bash
bun run /Users/rohirikman/Library/CloudStorage/OneDrive-OnCloud/Terminal/Projects/AI-Powered-Knowledge-API/scripts/generate-pdf.ts
```

## Usage Example
When the user asks, "Convert my resume to a PDF", the agent should invoke this tool with the appropriate parameters, ensuring the markdown_file_path, output_pdf_path, and profile_picture_path are correctly set.
