# Kubernetes Helm Chart Best Practices

Helm is the package manager for Kubernetes. Helm Charts define, install, and upgrade even the most complex Kubernetes applications.

## 1. Chart Structure and Organization

A well-structured chart is essential for maintainability.

| Directory/File | Purpose | Best Practice |
| :--- | :--- | :--- |
| `Chart.yaml` | Metadata about the chart (name, version, dependencies). | Use semantic versioning. Clearly define dependencies in the `dependencies` section. |
| `values.yaml` | Default configuration values for the chart. | Provide sensible defaults. Use comments to explain each value. **NEVER** include secrets here. |
| `templates/` | Directory containing Kubernetes resource definitions (YAML). | Keep templates modular. Use `_helpers.tpl` for reusable template fragments (e.g., labels, names). |
| `templates/NOTES.txt` | Instructions displayed to the user after a successful installation. | Provide clear instructions on how to access the deployed application (e.g., Ingress URL, port). |

## 2. Templating and Values

1.  **Avoid Hardcoding:** **NEVER** hardcode values in the `templates/` YAML files. All configurable parameters must be exposed through `values.yaml`.
2.  **Use `{{ .Release.Name }}`:** Use the release name in resource names to ensure uniqueness within a namespace.
3.  **Conditional Logic:** Use `{{ if .Values.featureToggle }}` to conditionally include or exclude entire resources (e.g., a `Secret` or an `Ingress` resource).
4.  **Secrets Management:** Use placeholders in `values.yaml` (e.g., `dbPassword: ""`) and instruct the user to inject the actual secrets via command line (`--set`) or a separate, secure `values-prod.yaml` file. Better yet, use a Secret Management Operator.

## 3. Reusability and Dependencies

*   **Subcharts:** Use subcharts for complex applications that consist of multiple independent components (e.g., a database, a message queue, and the Bun application).
*   **Common Library Chart:** For an organization with many microservices, create a "common" library chart that contains reusable templates (e.g., standard Deployment, Service, and HPA configurations) that all service charts can rely on. This reduces duplication.

## 4. Testing and Linting

1.  **Chart Linting:** Always run `helm lint` to check the chart for syntax errors and best practice violations.
2.  **Unit Testing:** Use the Helm test feature to define tests in the `templates/tests` directory. These tests should verify that the rendered Kubernetes YAML is correct based on different input values.
3.  **Integration Testing:** Use the Helm test feature to run simple integration tests (e.g., checking if the Pod is running and the service endpoint is reachable) after deployment.

## 5. Helm and CI/CD

Integrate `helm upgrade --install` into your CI/CD pipeline. Use a dedicated service account with limited permissions for deployment. This ensures that every code change can be automatically deployed to the cluster in a controlled and repeatable manner.
