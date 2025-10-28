# CI/CD Pipeline Strategy for Bun Applications

This document outlines a robust Continuous Integration and Continuous Delivery (CI/CD) strategy optimized for Bun and Kubernetes deployments.

## 1. Continuous Integration (CI) Phase

The goal is to validate the code quickly and produce a deployable artifact (Docker image).

| Step | Tool/Command | Rationale |
| :--- | :--- | :--- |
| **1. Checkout & Setup** | CI Runner (e.g., GitHub Actions, GitLab CI) | Fetches the code and ensures the Bun runtime is installed on the runner. |
| **2. Dependency Install** | `bun install --frozen-lockfile` | Ensures a fast, reproducible installation of all dependencies as defined in `bun.lockb`. |
| **3. Linting & Formatting** | `bun run lint` / `bun fmt` | Enforces code quality and style consistency across the team. |
| **4. Type Checking** | `bun tsc --noEmit` | Explicitly checks for type errors without transpiling, ensuring compile-time safety. |
| **5. Unit & Integration Tests** | `bun test` | Runs all tests using the fast, built-in Bun test runner. |
| **6. Build Docker Image** | `docker build -t <image-name>:<tag> .` | Uses the multi-stage Dockerfile (see `knowledge/02_Dockerizing_Bun_Applications.md`) to create a minimal production image. |
| **7. Push Image** | `docker push <image-name>:<tag>` | Pushes the validated image to a container registry (e.g., Docker Hub, ECR, GCR). |

## 2. Continuous Delivery (CD) Phase

The goal is to safely deploy the new Docker image to the Kubernetes cluster.

| Step | Tool/Command | Rationale |
| :--- | :--- | :--- |
| **1. Helm Lint & Template** | `helm lint` / `helm template` | Validates the Helm chart syntax and renders the final K8s YAML for review. |
| **2. Security Scan** | `trivy scan <image-name>:<tag>` | Scans the newly built Docker image for known vulnerabilities before deployment (Shift Left Security). |
| **3. Deploy to Staging** | `helm upgrade --install <release-name> ./chart --values values-staging.yaml` | Deploys the application to a non-production environment for end-to-end testing. |
| **4. E2E Tests** | `cypress run` or similar | Runs automated end-to-end tests against the Staging environment. |
| **5. Deploy to Production** | `helm upgrade --install <release-name> ./chart --values values-prod.yaml --atomic` | Performs the final, atomic deployment to the production cluster using the Helm chart. |
| **6. Post-Deployment Checks** | `kubectl rollout status deploy/<deployment-name>` | Verifies that the K8s Deployment successfully rolled out and the Pods are healthy. |

## 3. Bun-Specific CI/CD Optimization

*   **Cache:** Configure the CI system to cache the Bun module store (`~/.bun/install/cache`) to speed up subsequent `bun install` commands even further.
*   **Artifacts:** Only the final, minimal Docker image should be considered the deployment artifact, not the source code or intermediate build files.
*   **Health Checks:** Ensure the CI/CD pipeline verifies the K8s Readiness Probe is passing before marking the deployment as successful.

This pipeline ensures that every code change is quickly and safely validated before reaching the production environment.
