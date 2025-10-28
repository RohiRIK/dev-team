# Troubleshooting Guide

This guide provides solutions for common issues that may arise during the CV generation process.

---

## 1. PDF Generation Failures

If the `generate_cv_pdf` tool fails, it is almost always due to a system dependency issue or a problem with the input file.

**Symptom:** The tool returns an error, often mentioning `pandoc` or `pdflatex`.

**Troubleshooting Steps:**

1.  **Verify Dependencies:** The tool requires **Pandoc** and a **LaTeX** engine (like `pdflatex` or `tectonic`) to be installed on the system where the agent is running. 
    - **Your Action:** If you see an error like `pandoc: command not found` or `pdflatex: command not found`, you must inform the user that a required dependency is missing and that they need to install it.

2.  **Check for Special Characters:** Complex, non-standard characters in the Markdown file can sometimes cause the LaTeX engine to fail.
    - **Your Action:** If the error seems related to a specific character or line, review the source Markdown template. Report the problematic character to the user and suggest simplifying it.

3.  **File Not Found:** The error might indicate that the input Markdown file or the profile picture could not be found.
    - **Your Action:** Double-check the file paths you are providing to the tool. Use absolute paths and verify they are correct using the `list_directory` tool if necessary.

---

## 2. Asset and File Path Reference

It is critical to use the correct paths when reading templates and generating files.

- **Profile Picture Location:**
  - The user's profile picture (`p7.jpg`) is located at: `agents/cv-specialist/assets/p7.jpg`.
  - This should be the default path you provide to the `profile_picture_path` parameter of the `generate_cv_pdf` tool.

- **CV Templates Location:**
  - All Markdown CV templates are stored in the `agents/cv-specialist/templates/` directory.

- **Output PDF Location:**
  - The generated PDF file will be saved in the project's root directory by default.

---

## 3. General Error Handling

- **Be Specific:** When a tool fails, do not simply say "it didn't work." Read the `stderr` or `error` output from the tool and report the specific message to the user.
- **Example:** Instead of "I couldn't create the PDF," say: "The PDF generation failed with the error: `pdflatex: command not found`. It seems the LaTeX engine is not installed."
