# n8n Workflows: Best Practices and Patterns

This document contains best practices and advanced patterns for building, managing, and scaling workflows in n8n. It is intended to be a living document and the primary knowledge base for the `automation-specialist` agent.

---

## 1. Workflow Design & Structure

### 1.1. Use Sub-Workflows for Reusability

**Best Practice:** Break down large, complex workflows into smaller, reusable sub-workflows. A common pattern is to have a main workflow that orchestrates calls to several smaller, single-purpose sub-workflows (e.g., one for sending Slack messages, one for updating a database, one for error logging).

**Connection to TELOS:**
- This directly addresses your problem of redundant work (**Pw4**) by creating modular, reusable components that can be used across many automations.
- Building a library of clean, professional sub-workflows contributes to your goal of creating a professional portfolio (**G1**) and sharing your work on GitHub (**M9**, **N17**).

### 1.2. Implement Clear Naming Conventions

**Best Practice:** Adopt a consistent naming convention for workflows and nodes to improve readability and maintainability. A good workflow naming scheme is `[Category]_[Action]_[Target]_[Version]`, for example: `DataPipeline_Sync_NotionToGoogleSheets_v1`.

**Connection to TELOS:**
- This practice helps solve the problem of digital disorganization (**Pr7**, **C9**) by bringing a clear, predictable structure to your automation projects.

### 1.3. Use External Configuration

**Best Practice:** For workflows that might need frequent adjustments (e.g., changing a recipient email, an API endpoint), store configuration variables externally in a Google Sheet, a database, or a JSON file. The workflow can fetch this configuration at the start of its run. This avoids hardcoding values and makes updates easier.

**Connection to TELOS:**
- This aligns with your strategy to build a flexible and easily manageable home lab (**S10**, **N28**) by separating configuration from logic, making your automations more portable and less brittle.

---

## 2. Error Handling & Reliability

### 2.1. Create a Centralized Error Handling Workflow

**Best Practice:** Create a single, dedicated workflow whose job is to process errors from all other workflows. Use the "Error Trigger" node as the entry point. This central workflow can then be responsible for logging the error details to a database and sending a formatted notification to Slack or email.

**Connection to TELOS:**
- A robust error handling system is a core component of a professional automation portfolio (**G1**). It demonstrates foresight and reliability.
- This contributes to your desire for a well-organized and resilient home lab (**Pr13**, **N28**), as it ensures you're immediately aware of any failures.

### 2.2. Use "Retry on Fail" Strategically

**Best Practice:** Enable the "Retry on Fail" option in nodes that make external API calls, as these can often fail due to temporary network issues. However, do not retry on errors that won't be fixed by another attempt (e.g., a 400 Bad Request error, which indicates a problem with the data sent).

**Connection to TELOS:**
- This makes your automations more resilient, which is crucial for complex systems like the `Super-Fleet-Bot` (**Prtd2**) or the `secure-chatbot-ms-tenants` (**Prtd7**).

---

## 3. Performance & Optimization

### 3.1. Filter Data Early

**Best Practice:** Use the "Filter" or "IF" node as early as possible in a workflow to reduce the number of items that need to be processed by subsequent nodes. Processing fewer items is the most effective way to make a workflow faster and more efficient.

**Connection to TELOS:**
- Efficient workflows save execution time and resources on your Intel NUC home lab (**Ofs3**), allowing you to run more automations simultaneously.
- This aligns with your narrative of making workouts "smart and efficient" (**N12**), a principle that can be applied to your code and automations as well.

### 3.2. Process Data in Batches

**Best Practice:** When dealing with a large number of items, configure nodes to process data in batches (e.g., 100 items at a time) instead of one by one. This significantly reduces the overhead of starting and stopping the node for each item.

**Connection to TELOS:**
- This is a key technique for data-heavy projects like the `stock-etl-pipeline` (**Prtt13**) or the `m365-organizational-intelligence` project (**Prtd9**).

---

## 4. Security & Version Control

### 4.1. Never Hardcode Credentials

**Best Practice:** Always use n8n's built-in credential management system. Never write API keys, passwords, or other secrets directly in a "Function" node or as a node parameter. This is a critical security practice.

**Connection to TELOS:**
- As a Cloud Security Engineer (**SdJ2**), adhering to this practice is non-negotiable and reinforces your professional expertise.

### 4.2. Back Up Workflows with Git

**Best Practice:** Use a script to regularly download your workflows from n8n (via the n8n API) and commit them to a private GitHub repository. This provides version control and a reliable backup.

**Connection to TELOS:**
- This is the direct implementation of your strategy to "back everything up to my personal GitHub repository" (**S10**). It solves the problem of having a non-portable home lab (**Pr13**, **C17**) by ensuring your most critical configurations—your automations—are safe and versioned.
