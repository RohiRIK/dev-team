# /buddy

`/buddy` is the orchestrator. It parses your request, plans a chain of tasks on the `task-tracker` MCP, and dispatches the right specialist. It does not write code, tests, or commits itself — its only outputs are MCP task calls, `Task` dispatches, and a closeout summary.

Full file: [../commands/buddy.md](../commands/buddy.md).

## The preview-approve-dispatch gate

Every `/buddy` invocation passes through a three-step gate.

1. **Plan in memory.** `/buddy` identifies intent / scope / constraints and drafts the full task list with `{agent, title, dependsOn}`. No `create_task` yet.
2. **Preview.** Render the plan as a table. Stop. Wait for the user's reply.
3. **Dispatch on approval.** Only then call `create_task` per row, then invoke subagents via the `Task` tool.

The preview looks like this:

```
Planned dispatch for: "<verbatim user request>"

| # | Agent              | Task                                       | Depends on |
|---|--------------------|--------------------------------------------|------------|
| 1 | <agent-slug>       | <short title>                              | —          |
| 2 | <agent-slug>       | <short title>                              | 1          |

Routing confidence: <high | medium | low — one-line reason>
Security gate: <yes, inserted before github-manager | not needed — one-line reason>

Reply "go" to dispatch, or describe changes.
```

Reply branches:

- **Approval** (`go`, `yes`, `ship it`, `lgtm`, etc.) — `/buddy` creates tasks and dispatches.
- **Change request** (swap an agent, drop a step, reorder, rename) — `/buddy` rebuilds the full plan and re-renders. Always full plan, never a diff. Loop until approved.
- **Decline** (`no`, `cancel`, `abort`) — reply exactly `Cancelled — no tasks created.`
- **Ambiguous** (new question, `ok` / `sure` / `k`) — treat as non-approval, ask `Dispatch this plan as-is, or would you like changes?`, wait.

No `create_task`, `Task` dispatch, or `list_tasks` calls happen during the waiting window. Even a one-row single-agent plan still waits for explicit approval.

## Routing matrix — single agent

First match wins.

| Intent signal in request | Agent |
|---|---|
| "PRD", "user story", "acceptance criteria", "roadmap", "prioritise" | **product-manager** |
| "architecture", "ADR", "service boundary", "C4 diagram", "decomposition" | **system-architect** |
| "cloud topology", "region", "VPC/VNet", "Terraform/Bicep plan", "cost model", "HA/DR" | **cloud-architect** |
| "API", "endpoint", "server code", "backend", "handler", "worker", "background job" | **backend-developer** |
| "component", "page", "React/Next/Vue/Svelte", "styling", "client-side state" | **frontend-developer** |
| "schema", "migration", "index", "query tune", "RLS", "backup", "replica" | **database-admin** |
| "CI", "pipeline", "GitHub Actions", "Dockerfile", "Kubernetes", "Helm", "deploy", "IaC execute" | **devops-engineer** |
| "model", "training", "feature pipeline", "MLflow", "inference", "drift" | **ml-engineer** |
| "wireframe", "flow", "design token", "accessibility", "Figma handoff" | **ui-ux-designer** |
| "test plan", "E2E", "regression", "flaky test", "verify fix", "coverage" | **qa-tester** |
| "security review", "audit", "threat model", "OWASP", "secret scan", "dep audit" | **security-analyst** |
| "pentest", "exploit PoC", "nmap", "burp", "sqlmap" | **pentester** |
| "commit", "push", "PR", "merge", "release", "tag", "gh " | **github-manager** |
| "create an agent", "port an agent", "scaffold a subagent", "validate agents" | **agent-builder** |

## Routing matrix — multi-step DAG

| Request shape | DAG |
|---|---|
| Ship a new feature | `product-manager` -> `system-architect` -> parallel (`backend-developer`, `frontend-developer`, `database-admin`) -> `qa-tester` -> `security-analyst` -> `github-manager` |
| Fix a bug | `qa-tester` (failing repro) -> owning dev role -> `qa-tester` (confirm + regression) -> `github-manager` |
| Deploy a new service | `cloud-architect` -> `devops-engineer` -> `backend-developer` (env wire) -> `github-manager` |
| Refactor subsystem | `system-architect` (ADR) -> dev role(s) (expand-contract) -> `qa-tester` -> `github-manager` |
| Harden auth / security finding | `security-analyst` -> `backend-developer` -> `pentester` (PoC confirms fix) -> `github-manager` |
| Add a new agent | `agent-builder` (invokes `create-agent` skill) -> `github-manager` |
| Investigate prod incident | `devops-engineer` (triage) -> owning dev role -> `qa-tester` -> `github-manager` (hotfix PR) |

## Tie-breakers

When signals conflict or the request is under-specified, apply in order:

1. **No PRD + greenfield ask** — start with `product-manager`.
2. **Touches two or more services or data surfaces** — start with `system-architect` (unless a design already exists).
3. **"Something is broken" framing** — start with `qa-tester`. A failing test must exist before a fix.
4. **PR touching auth / input handling / secrets / external-data** — insert `security-analyst` before `github-manager`.
5. **Always end at `github-manager`** — every dev-side completion hands off for commit / PR. Never skip.

## Refusals

- **Unknown slug** — the user named an agent that doesn't exist in `agents/`. Refuse; suggest scaffolding via `agent-builder`.
- **Destructive infra op without explicit authorisation** — `terraform destroy`, `kubectl delete namespace`, `az group delete`, `git push --force` to main, `rm -rf` on shared paths, live-DB schema drop. Refuse; ask for written confirmation.

## Post-closeout

After the one-screen summary, `/buddy` ends with `Routing confidence: <high|medium|low>. If this routing was wrong, tell me the correct agent.` Blocked tasks are listed with a suggested next `/buddy` invocation to unblock them.

For the full file (worked examples, task-description template, ambiguity protocol): [../commands/buddy.md](../commands/buddy.md).
