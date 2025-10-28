# AI Agent Instructions: How to Use the Knowledge Folder

This document provides explicit instructions for the AI Developer/DevOps Agent on how to effectively utilize the files within the `knowledge/` folder.

## 1. General Principles

*   **Consult First:** Before answering any technical question or proposing a solution, the Agent **MUST** consult the relevant files in this folder to ensure the response is grounded in established best practices.
*   **Cite Sources:** When providing an answer, the Agent **MUST** reference the specific file(s) used (e.g., "As per `02_Dockerizing_Bun_Applications.md`...").
*   **Synthesize, Do Not Quote:** The Agent should synthesize the information from multiple files, rather than simply quoting large sections. The goal is to provide a comprehensive, integrated answer.

## 2. Specific Use Cases

| User Request Type | Primary Files to Consult | Action Guidance |
| :--- | :--- | :--- |
| **New Project Setup (Backend)** | `01_Bun_TypeScript_Best_Practices.md`, `10_API_Creation_Best_Practices.md` | Propose a project structure and configuration, ensuring the API design adheres to RESTful standards (naming, methods, status codes). |
| **New Project Setup (Frontend)** | `09_Vite_Best_Practices.md`, `01_Bun_TypeScript_Best_Practices.md` | Advise on production build optimization (code splitting, asset hashing) and security best practices for environment variables. |
| **Containerization** | `02_Dockerizing_Bun_Applications.md` | Generate a multi-stage Dockerfile, emphasizing the use of the `oven/bun:latest-slim` image and `bun install --frozen-lockfile`. |
| **Deployment to K8s** | `03_Kubernetes_Deployment_Best_Practices.md`, `05_Kubernetes_Service_and_Ingress_Guide.md` | Recommend setting resource requests/limits, configuring Liveness/Readiness probes, and generating the correct Service/Ingress YAML. |
| **Type Safety/Code Quality** | `04_TypeScript_Advanced_Type_Safety_Patterns.md` | Recommend using utility types (`Omit`, `Pick`) and Zod for runtime validation of external data (e.g., API requests). |
| **Troubleshooting** | `08_Troubleshooting_Kubernetes_Workflows.md`, `06_Kubernetes_Observability_and_Monitoring.md` | Follow the systematic troubleshooting flow (bottom-up approach) and advise on checking logs, metrics, and traces. |
| **Packaging for K8s** | `07_Kubernetes_Helm_Chart_Best_Practices.md` | Advise on chart structure, value templating, and the use of the Common Library Chart pattern. |

## 3. Continuous Learning

*   The Agent should treat this folder as a living document. If a new, highly relevant pattern or best practice is discovered during research, the Agent should suggest creating or updating a file in this folder.
*   When a technical term is unclear, consult an internal glossary for a quick definition.
