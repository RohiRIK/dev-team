# Kubernetes Deployment Best Practices

This document focuses on best practices for deploying containerized Bun applications to Kubernetes (K8s), ensuring reliability, security, and efficiency.

## 1. Resource Management

| Resource | Best Practice | Rationale |
| :--- | :--- | :--- |
| **Requests** | Set `resources.requests.cpu` and `resources.requests.memory` to the minimum required for the application to function. | Guarantees the Pod will be scheduled with sufficient resources, preventing resource starvation. |
| **Limits** | Set `resources.limits.cpu` and `resources.limits.memory`. | Prevents a runaway container from consuming all node resources, ensuring stability for other Pods. For Bun/JS apps, memory limits are critical. |
| **QoS Class** | Setting requests equal to limits results in a **Guaranteed** QoS class. | This is the highest QoS class, ensuring the Pod is the last to be terminated under resource pressure. |

## 2. Health Checks

Health checks are vital for K8s to manage the lifecycle of your application.

| Check Type | Purpose | Best Practice |
| :--- | :--- | :--- |
| **Liveness Probe** | Determines if the container is running and healthy. If it fails, K8s restarts the container. | Should check the core application logic (e.g., an `/health` endpoint that queries the database). Use a short timeout. |
| **Readiness Probe** | Determines if the container is ready to serve traffic. If it fails, the Pod is removed from the Service's endpoints. | Should check external dependencies (e.g., database connection, external API availability). Use a longer initial delay to allow startup. |
| **Startup Probe** | Used for slow-starting applications. It delays the Liveness and Readiness checks until the application is fully started. | Prevents K8s from killing a container that is slow to start but otherwise healthy. |

## 3. Configuration and Secrets

1.  **Configuration:** Use **ConfigMaps** for non-sensitive configuration data (e.g., log levels, external service URLs). Mount ConfigMaps as files or environment variables.
2.  **Secrets:** Use **Secrets** for sensitive data (e.g., API keys, database passwords). **NEVER** store plain text secrets in your YAML files. Use a Secret Manager (e.g., HashiCorp Vault, AWS Secrets Manager) and a K8s operator to inject them.
3.  **Environment Variables:** Prefer injecting configuration via environment variables for Bun applications, as they are easy to access via `process.env`.

## 4. Deployment Strategy

*   **Rolling Updates:** Use the default `RollingUpdate` strategy. Set `maxUnavailable` and `maxSurge` to control the speed and risk of the rollout.
*   **Pod Disruption Budget (PDB):** Define a PDB to ensure a minimum number of replicas are always running during voluntary disruptions (e.g., node maintenance).
*   **Affinity/Anti-Affinity:** Use Pod Anti-Affinity to ensure replicas of a critical service are spread across different nodes or availability zones, improving fault tolerance.

## 5. Security Context

Always define a `securityContext` for the Pod and Container:

*   `runAsNonRoot: true`: Ensures the container process runs as a non-root user.
*   `allowPrivilegeEscalation: false`: Prevents the container from gaining root privileges.
*   `readOnlyRootFilesystem: true`: Makes the container's root filesystem read-only, preventing runtime tampering.
