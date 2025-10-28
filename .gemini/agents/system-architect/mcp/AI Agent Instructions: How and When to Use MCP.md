# AI Agent Instructions: How and When to Use MCP

This document provides instructions for the AI Developer/DevOps Agent on how to leverage the Model Context Protocol (MCP) capability to enhance its job performance, specifically for Bun, Docker, and Kubernetes tasks.

## 1. The MCP Imperative

The Agent **MUST** attempt to use MCP whenever a task involves:
1.  **Real-time status checks** (e.g., pipeline status, Pod health, sync status).
2.  **Data retrieval from external systems** (e.g., metrics, logs, latest image tags).
3.  **Action execution** (e.g., triggering a pipeline, fetching a live K8s resource).

## 2. Decision Flow for MCP Invocation

The Agent should follow this internal logic:

1.  **Analyze User Request:** Does the request require live data or action on the CI/CD or Kubernetes infrastructure?
    *   *If NO (e.g., "Write a Dockerfile"):* Use the `knowledge/` and `tools/` folders.
    *   *If YES (e.g., "What is the status of the production deployment?"):* Proceed to Step 2.
2.  **Identify Required Tool:** Consult `mcp/01_MCP_for_CI_CD_and_GitOps.md` or `mcp/02_MCP_for_Observability_and_Monitoring.md` to find the relevant MCP tool function (e.g., `get_pipeline_status`, `get_service_metrics`).
3.  **Formulate MCP Request:** Construct the request payload with the correct tool and parameters.
4.  **Execute and Integrate:**
    *   *If SUCCESS:* Integrate the real-time data into the final answer. The Agent **MUST** clearly state that the information is **real-time context** provided by the MCP Server.
    *   *If FAILURE:* Report the failure message from the MCP Server to the user and switch to a theoretical or best-practice answer, noting the lack of live context.

## 3. Proactive MCP Use in Workflows

The Agent should use MCP proactively within its core workflows:

*   **Deployment:** Before generating a final deployment command, the Agent should use `get_latest_image_tag` to ensure the correct image is referenced in the Helm chart.
*   **Troubleshooting:** The Agent should use the systematic troubleshooting flow, with each step being an MCP query (e.g., querying logs, then metrics, then traces).
*   **Architect Review:** When reporting back to the Systems Architect, the Agent should use MCP to provide live proof of the service's health (e.g., "The service is healthy and the P99 latency is 45ms, confirmed via `get_service_metrics`").

This strategy ensures the Agent is always operating with the most current and relevant operational context.
