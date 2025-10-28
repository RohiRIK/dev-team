# Stakeholder Communication Strategy

A systems architect's effectiveness relies heavily on the ability to communicate complex technical decisions to diverse audiences.

## 1. Audience Segmentation and Focus

The communication style, content, and level of detail must be tailored to the audience.

| Audience | Primary Concern | Communication Focus | Recommended Artifacts |
| :--- | :--- | :--- | :--- |
| **Executives/Business Leaders** | Business value, ROI, risk, time-to-market. | **Why** the decision was made, **What** is the business impact, **How** it affects the budget/timeline. | High-level diagrams (C1), Cost-Benefit Analysis, Risk Assessment Summary. |
| **Development Teams** | Implementation details, trade-offs, technical feasibility, standards. | **How** to implement the decision, **What** are the technical constraints, **Which** tools and patterns to use. | Detailed diagrams (C2/C3), ADRs, Technical Specifications, Code Examples. |
| **Operations/DevOps Teams** | Deployment, monitoring, maintenance, reliability, security. | **How** to deploy and run the system, **What** are the monitoring requirements, **Where** are the failure points. | Deployment Guides, Runbooks, Observability Dashboards, Security Checklists. |
| **Product Owners/Managers** | Feature delivery, user experience, functional requirements. | **What** features are enabled/constrained by the architecture, **When** can the feature be delivered. | Feature-to-Component Mapping, Roadmap Dependencies. |

## 2. Communication Artifacts

The AI agent should recommend using the following artifacts to support communication:

1.  **Architecture Decision Records (ADRs):** The primary source of truth for *why* a decision was made. (See `knowledge/04_Architectural_Decision_Records_Guide.md`).
2.  **C4 Model Diagrams:** Used to visually communicate system structure at the appropriate level of abstraction. (See `tools/01_C4_Model_Diagramming_Strategy.md`).
3.  **Runbooks:** Step-by-step guides for operational tasks, especially incident response.
4.  **Cost-Benefit Analysis (CBA):** A structured document comparing the costs and benefits of different architectural alternatives.

## 3. The "Three Whys" Rule

When presenting a decision, the architect must be prepared to answer "Why" at three levels:

1.  **Why this technology?** (e.g., "We chose Kafka for its high-throughput, fault-tolerant streaming capabilities.")
2.  **Why this pattern?** (e.g., "We chose the Event-Driven Architecture to decouple our services and enable real-time processing.")
3.  **Why this solution for the business?** (e.g., "This architecture allows us to process customer orders 50% faster, directly improving customer satisfaction and revenue.")

## 4. AI Agent Guidance

When a user asks the AI agent to explain an architectural concept, the agent should first ask: "Who is the audience for this explanation?" and then tailor the response using the segmentation above. If the audience is not specified, default to the **Development Teams** focus.
