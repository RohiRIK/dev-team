# Kubernetes Troubleshooting Strategy

This document provides a high-level, strategic approach for the Dev/DevOps agent to efficiently diagnose and resolve Kubernetes-related issues. The strategy emphasizes a systematic, layered approach.

## 1. The 4-Layer Troubleshooting Model

Always start at the highest layer and work your way down.

| Layer | Focus | Key Question | Primary Tool |
| :--- | :--- | :--- | :--- |
| **4. Application** | Code logic, configuration, startup errors. | Is the application running correctly *inside* the container? | `kubectl logs`, `kubectl exec` |
| **3. Container/Pod** | Container lifecycle, resource constraints, image pull errors. | Is the Pod scheduled and healthy? Is it being OOMKilled or crashing? | `kubectl describe pod`, `kubectl get events` |
| **2. Cluster Resources** | Services, Ingress, Volumes, ConfigMaps, Secrets. | Is the Pod reachable? Are its dependencies available? | `kubectl get svc,ing,cm,secret`, `kubectl describe svc` |
| **1. Node/Infrastructure** | Node health, network connectivity, Kubelet status. | Is the underlying infrastructure healthy and ready to host the Pod? | `kubectl get nodes`, `kubectl describe node`, SSH to node (if necessary) |

## 2. The "Triage" Checklist (Initial 5 Minutes)

When an issue is reported, the agent should immediately perform these checks:

1.  **Check Rollout Status:** Is a recent deployment failing?
    *   `kubectl rollout status deployment/<deployment-name>`
2.  **Check Pod Status:** Are any Pods in a non-`Running` state?
    *   `kubectl get pods -l app=<app-label>`
3.  **Check Logs:** Are there any obvious application errors in the recent logs?
    *   `kubectl logs -l app=<app-label> --since=5m`
4.  **Check Events:** Are there any recent, critical events on the Pods?
    *   `kubectl get events --sort-by='.lastTimestamp'`
5.  **Check Reachability:** Can the Service be reached internally?
    *   `kubectl exec -it <another-pod> -- curl <service-name>` (if applicable)

## 3. Advanced Diagnostic Techniques

*   **Port-Forwarding for Debugging:** Use `kubectl port-forward` to expose a container's port to the local machine, allowing the developer to use local tools (e.g., a browser, a debugger) to interact with the running container.
*   **Debug Sidecar Injection:** If the application container is minimal (e.g., no shell), the agent should recommend temporarily injecting a sidecar container with debugging tools (e.g., `busybox`, `netshoot`) into the Pod to inspect the network or filesystem.
*   **Resource Throttling:** If the issue is performance-related, analyze the `kubelet` metrics to determine if the container is being throttled due to hitting its CPU limits.

## 4. Post-Mortem and Prevention

After resolving an issue, the agent should recommend:

1.  **Updating the Knowledge Base:** Document the root cause and resolution steps in a new file in the `knowledge/` folder.
2.  **Improving Probes:** If a Pod failed without the Liveness/Readiness probes catching it, recommend adjusting the probe configuration (e.g., shorter `periodSeconds`, more comprehensive check endpoint).
3.  **Adjusting Resource Limits:** If the issue was OOMKilled, recommend increasing the memory limit and/or optimizing the Bun application.

This structured approach ensures that troubleshooting is fast, repeatable, and contributes to the overall stability of the system. (See `knowledge/08_Troubleshooting_Kubernetes_Workflows.md` for detailed commands).
