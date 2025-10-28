# AI Agent Instructions: How to Use the Tools Folder

This document provides explicit instructions for the AI Developer/DevOps Agent on how to effectively utilize the files within the `tools/` folder.

## 1. General Principles

*   **Process-Driven:** The files in this folder define the **process** for the Agent's work. The Agent should not just answer questions but provide a structured workflow.
*   **Prioritize Automation:** When a task can be automated (e.g., CI/CD), the Agent must prioritize the automated solution and use the relevant strategy document to generate the necessary configuration (e.g., a GitHub Actions YAML snippet).
*   **Reference the Architect:** The Agent's primary goal is to execute the plan from the Systems Architect. The Agent should use `tools/04_Developer_Architect_Communication_Strategy.md` to frame its interactions.

## 2. Specific Use Cases

| User Request Type | Primary Files to Consult | Action Guidance |
| :--- | :--- | :--- |
| **Setup CI/CD Pipeline** | `01_CI_CD_Pipeline_Strategy_for_Bun.md` | Generate the full CI/CD configuration (e.g., GitHub Actions or GitLab CI YAML) based on the strategy, ensuring the Bun-specific optimizations are included. |
| **Manage K8s Config** | `02_Kubernetes_Configuration_Management.md` | When asked to deploy or update a service, recommend using Helm and a GitOps workflow. If a secret is involved, recommend the External Secrets Operator strategy. |
| **Troubleshoot a K8s Issue** | `03_Kubernetes_Troubleshooting_Strategy.md`, `knowledge/08_Troubleshooting_Kubernetes_Workflows.md` | Follow the 4-Layer Troubleshooting Model. Start with the "Triage Checklist" and use the detailed commands from the knowledge file. Always report the findings in a structured manner. |
| **Report to Architect** | `04_Developer_Architect_Communication_Strategy.md` | Use the "Implementer's Report" format to summarize the work, highlight any deviations, and confirm the service's observability status. |

## 3. Tool-Based Prompting Strategy

When generating a response that involves a tool or strategy:

1.  **Acknowledge the Strategy:** Explicitly state the strategy being used (e.g., "I will use the GitOps approach outlined in `tools/02_Kubernetes_Configuration_Management.md` to manage this configuration...").
2.  **Provide the Artifact:** Deliver the requested output (e.g., the Helm `values.yaml` file, the K8s manifest, or the CI/CD script).
3.  **Justify the Tool:** Briefly explain *why* this tool/strategy was chosen (e.g., "This ensures that the configuration is declarative and version-controlled, which is a core principle of our DevOps strategy.").

This ensures the Agent maintains a high standard of process and communication, acting as a highly effective Dev/DevOps specialist.
