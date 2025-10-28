# Troubleshooting Kubernetes Workflows

This document provides a systematic, step-by-step workflow for the Dev/DevOps agent to troubleshoot common issues with Bun applications deployed on Kubernetes.

## 1. The Troubleshooting Flow (Systematic Approach)

The agent should follow a "bottom-up" approach, starting with the smallest unit (Pod) and moving up the hierarchy.

| Step | Command(s) | Focus | Outcome |
| :--- | :--- | :--- | :--- |
| **1. Check Pod Status** | `kubectl get pods` | Is the Pod in a `Running` state? Check for `Pending`, `ImagePullBackOff`, or `CrashLoopBackOff`. | Identify the immediate problem state. |
| **2. Check Pod Events** | `kubectl describe pod <pod-name>` | Check the `Events` section at the bottom for scheduling failures, image pull errors, or volume attachment issues. | Determine *why* the Pod is in its current state. |
| **3. Check Container Logs** | `kubectl logs <pod-name> -f` | Look for application-level errors, startup failures, or configuration issues (e.g., database connection failure). | Pinpoint the application code or configuration error. |
| **4. Check Resource Limits** | `kubectl describe pod <pod-name>` and `kubectl top pod <pod-name>` | Check if the container is being OOMKilled (Out Of Memory) or CPU-throttled due to hitting its defined limits. | Identify resource allocation issues. |
| **5. Check Service/Ingress** | `kubectl get svc,ing` and `kubectl describe svc <svc-name>` | Verify that the Service selector matches the Pod labels and the Ingress is routing traffic to the correct Service port. | Determine if the application is reachable. |
| **6. Check Deployment/ReplicaSet** | `kubectl describe deploy <deploy-name>` | Check the status of the Deployment and ReplicaSet for rollout failures or misconfigurations. | Verify the desired state matches the current state. |

## 2. Common Error Scenarios and Solutions

| Error Message/Status | Likely Cause | Solution |
| :--- | :--- | :--- |
| **`ImagePullBackOff`** | Incorrect image name, private registry credentials missing, or image doesn't exist. | Check image name spelling. Verify Secret for image pull is correctly configured and referenced. |
| **`CrashLoopBackOff`** | Application is starting and immediately crashing (e.g., bad configuration, unhandled exception, missing dependency). | Run `kubectl logs` to view the immediate startup error. Check `ConfigMaps` and `Secrets`. |
| **`Pending`** | No node has enough resources (CPU/Memory) to schedule the Pod, or a persistent volume cannot be attached. | Check `kubectl describe pod` events for scheduling failure reason. Increase cluster capacity or reduce Pod resource requests. |
| **`OOMKilled`** | Container exceeded its memory limit. | Increase the memory limit in the Deployment YAML. Optimize the Bun application memory usage (e.g., check for memory leaks). |
| **`Liveness probe failed`** | The application is running but the health check endpoint is failing or timing out. | Check application logs for health check handler errors. Increase the `failureThreshold` or `periodSeconds` of the probe. |

## 3. Debugging Bun Applications in K8s

*   **`kubectl exec`:** Use `kubectl exec -it <pod-name> -- /bin/sh` to get a shell inside the running container. This allows for manual inspection of the filesystem, environment variables, and running processes.
*   **Ephemeral Containers (Advanced):** Use the `kubectl debug` command to attach a temporary debugging container (e.g., with advanced tools) to a running Pod for deep inspection without restarting the original container.
*   **Port Forwarding:** Use `kubectl port-forward <pod-name> <local-port>:<container-port>` to securely access the application or its debug port from your local machine.

This systematic approach ensures that the agent can quickly diagnose and resolve the root cause of the issue.
