# Architectural Decision Records (ADR) Guide

## What is an ADR?

An **Architectural Decision Record (ADR)** is a short text file that records a significant architectural decision, its context, and its consequences. ADRs are crucial for maintaining architectural consistency, onboarding new team members, and providing an auditable history of the system's evolution.

## Best Practices for ADRs

1.  **Keep it Simple:** ADRs should be concise and focused on a single decision. Use Markdown for readability.
2.  **Version Control:** Store ADRs alongside the code in a version control system (e.g., Git). This ensures the decision history is tied to the codebase it affects.
3.  **Immutable:** Once an ADR is accepted and recorded, it should generally not be modified. If a decision needs to be changed, a **new ADR** should be created to supersede the old one, clearly referencing the original.
4.  **Review and Consensus:** Decisions should be reviewed by key stakeholders (architects, senior developers) to ensure consensus before finalization.
5.  **Use a Standard Template:** Consistency in format makes ADRs easier to read and compare.

## Standard ADR Template (Markdown)

This template is based on Michael Nygard's suggested format.

```markdown
# [Decision ID] Title of the Architectural Decision

## Status
[Proposed | Accepted | Superseded by [ADR-00X] | Deprecated]

## Context
This section describes the forces at play, including the technological, business, and organizational context that led to the decision.
*   *What* problem are we trying to solve?
*   *Why* is this problem significant now?
*   *What* are the constraints or existing conditions?

## Decision
This section clearly and concisely states the decision made.
*   We will adopt [Technology/Pattern/Approach X].
*   The primary reason for this choice is [Reason].

## Consequences
This section describes the results of the decision, both positive and negative.

### Positive Consequences
*   [Benefit 1]
*   [Benefit 2]

### Negative Consequences
*   [Drawback 1]
*   [Drawback 2]

### Required Actions
*   [Action item 1 (e.g., Team X needs to learn Technology Y)]
*   [Action item 2 (e.g., Update CI/CD pipeline to support Z)]

## Alternatives Considered
This section lists and briefly discusses the alternatives that were evaluated.

### Alternative A: [Alternative Name]
*   **Pros:** [Pro 1, Pro 2]
*   **Cons:** [Con 1, Con 2]
*   **Reason for Rejection:** [Why this alternative was not chosen]

### Alternative B: [Alternative Name]
*   **Pros:** [Pro 1, Pro 2]
*   **Cons:** [Con 1, Con 2]
*   **Reason for Rejection:** [Why this alternative was not chosen]

## References
*   [Link to relevant documentation or discussion]
```
