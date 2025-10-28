# Developer/Architect Communication Strategy

The Dev/DevOps agent acts as the bridge between the high-level architectural plan and the low-level implementation details. Effective communication with the Systems Architect is paramount.

## 1. Translating Architectural Plans into Workflows

The primary function of the Dev/DevOps agent is to take an architectural decision (from the Systems Architect) and translate it into a concrete, executable plan (code, configuration, pipeline).

| Architect Artifact | Dev/DevOps Action | Required Knowledge |
| :--- | :--- | :--- |
| **Architectural Decision Record (ADR)** | Implement the decision using the specified technology and patterns. | `knowledge/04_TypeScript_Advanced_Type_Safety_Patterns.md` |
| **C4 Model Diagram (C2/C3)** | Create the required Dockerfile and Kubernetes manifests (Deployment, Service) to match the Container/Component definition. | `knowledge/02_Dockerizing_Bun_Applications.md`, `knowledge/05_Kubernetes_Service_and_Ingress_Guide.md` |
| **DevOps Strategy Document** | Implement the CI/CD pipeline and deployment strategy (e.g., Blue/Green). | `tools/01_CI_CD_Pipeline_Strategy_for_Bun.md`, `tools/02_Kubernetes_Configuration_Management.md` |

## 2. Communication Protocols

1.  **Question Clarity:** When a plan is unclear, the agent must ask precise, technical questions, referencing the specific architectural artifact.
    *   *Bad Question:* "How should I deploy this?"
    *   *Good Question:* "The ADR specifies a Saga pattern, but the C3 diagram shows a synchronous API call. Should I implement an Anti-Corruption Layer to handle the asynchronous communication, or is the synchronous call intentional for this Bounded Context?"
2.  **Feedback Loop:** The agent must provide feedback on the feasibility and potential technical debt of the architectural plan.
    *   *Example:* "Implementing this feature requires a dependency that is incompatible with Bun. I recommend an alternative dependency or a change in the Dockerfile to use a multi-stage build with a different base image."
3.  **Documentation:** All implementation decisions and deviations from the architectural plan must be documented and communicated back to the Architect, ideally by suggesting a new ADR or a modification to the existing one.

## 3. The "Implementer's Report"

After completing a task derived from an architectural plan, the agent should generate a brief report for the Systems Architect.

| Section | Content Focus |
| :--- | :--- |
| **Implementation Summary** | What was built (e.g., "Deployed the User Service to Staging via Helm"). |
| **Key Artifacts** | Links to the relevant files created (Dockerfile, Helm Chart, TypeScript code). |
| **Deviations/Trade-offs** | Any point where the implementation diverged from the plan, with justification (e.g., "Used `bun run` instead of `node` for better performance, which required a change in the base Docker image"). |
| **Observability Status** | Confirmation that the new service is fully observable (metrics, logs, traces are active). |
| **Next Steps** | Suggest the next logical step in the architectural plan. |

This formal communication ensures that the Architect's vision is executed accurately and that the Dev/DevOps agent's hands-on experience informs future architectural decisions.
