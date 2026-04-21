# Agents

14 specialists grouped by lifecycle phase. Each agent file under `../agents/<slug>.md` follows the canonical 7-section shape (Role, When to use, When NOT to use, Workflow, Tools, Constraints, Worked example) and is capped at 200 lines.

## Define

Shape the work before anyone writes code.

- **[product-manager](../agents/product-manager.md)** — PRDs, user stories, roadmaps, backlog prioritisation.
  - Use when: you need a written spec or acceptance criteria.
  - Boundaries: never writes code, tests, or commits.

## Design

Translate requirements into architecture before implementation.

- **[system-architect](../agents/system-architect.md)** — C4 diagrams, ADRs, service boundaries, capacity models.
  - Use when: a change touches two or more services, or a design decision needs a written trade-off.
  - Boundaries: design artifacts only; hands off to dev roles.
- **[cloud-architect](../agents/cloud-architect.md)** — cloud topology, region/zone choice, Terraform/Bicep plans, HA/DR, cost modelling.
  - Use when: picking concrete cloud resources or authoring IaC plans.
  - Boundaries: plans only — `devops-engineer` executes them.
- **[ui-ux-designer](../agents/ui-ux-designer.md)** — user flows, wireframes, design tokens, accessibility specs, Figma-to-markup notes.
  - Use when: you need a design artifact before UI code.
  - Boundaries: specs and tokens only; no runnable code.

## Build

Ship the code.

- **[backend-developer](../agents/backend-developer.md)** — APIs, server code, background jobs, DB integration, Node/Python-to-Bun migration.
  - Use when: server-side features or endpoints.
  - Boundaries: hands off UI to `frontend-developer`, schema to `database-admin`, infra execution to `devops-engineer`.
- **[frontend-developer](../agents/frontend-developer.md)** — React/Next/Vue/Svelte components, pages, client state, styling.
  - Use when: UI code and client-side logic.
  - Boundaries: no server code, no schema changes.
- **[database-admin](../agents/database-admin.md)** — schemas, migrations, indexes, query tuning, backup/restore, replicas.
  - Use when: any change to the data tier.
  - Boundaries: owns data shape; does not write app code.
- **[devops-engineer](../agents/devops-engineer.md)** — CI pipelines, container images, Kubernetes manifests, IaC execution, deploy debugging.
  - Use when: executing infra plans or wiring deployment.
  - Boundaries: does not author cloud topology — that is `cloud-architect`.
- **[ml-engineer](../agents/ml-engineer.md)** — data pipelines, model training/eval/serving, experiment tracking, production monitoring.
  - Use when: the task is genuinely ML, not just data handling.
  - Boundaries: hands off app integration to `backend-developer`.

## Review

Catch defects before shipping.

- **[qa-tester](../agents/qa-tester.md)** — E2E, integration, regression tests; test plans; flake triage; fix verification.
  - Use when: proving a bug or verifying a fix.
  - Boundaries: edits existing tests; does not write production code.
- **[security-analyst](../agents/security-analyst.md)** — OWASP review, authz audits, secret scans, dep audits, cloud security posture.
  - Use when: any PR that touches auth, inputs, secrets, or external-data boundaries.
  - Boundaries: review-only — hands every fix back to the owning dev role.
- **[pentester](../agents/pentester.md)** — exploit PoCs, authorised offensive tooling (nmap, burp, sqlmap, nuclei), attacker's-eye reports.
  - Use when: proving exploitability of a suspected vulnerability.
  - Boundaries: review-only; never fixes.

## Ship

Terminal step for any code-producing chain.

- **[github-manager](../agents/github-manager.md)** — commits, branches, PRs, merges, releases, tags, GitHub CLI (`gh`).
  - Use when: work is done and needs to land in a branch / PR / release.
  - Boundaries: CLI-only — no `Write` / `Edit` to source files.

## Meta

Extend the plugin itself.

- **[agent-builder](../agents/agent-builder.md)** — scaffold new agents, port from Gemini/Cursor/Cline, canonicalize, validate.
  - Use when: adding a new dev-team agent or sweeping the agents folder.
  - Boundaries: invokes the [create-agent](./create-agent.md) skill — does not itself implement features.

## Canonical rules

- Every code-producing chain ends at `github-manager`. Never skip.
- Any PR touching auth, inputs, secrets, or external-data surfaces inserts `security-analyst` before `github-manager`.
- "Something is broken" framing starts at `qa-tester` — a failing test must exist before a fix is meaningful.
- Review-only agents (`security-analyst`, `pentester`) never self-fix — findings hand back to the owning dev role.

Full routing: [buddy.md](./buddy.md). Full per-agent body: `../agents/<slug>.md`.
