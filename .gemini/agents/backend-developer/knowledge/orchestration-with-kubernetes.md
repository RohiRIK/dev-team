# Orchestration with Kubernetes

## What is Kubernetes?
- **Open-source system**: For automating deployment, scaling, and management of containerized applications.
- **Container Orchestration**: Manages the lifecycle of containers across a cluster of machines.

## Key Concepts
- **Pod**: The smallest deployable unit in Kubernetes, representing a single instance of a running process in a cluster.
- **Deployment**: Manages a replicated set of Pods, ensuring a specified number of replicas are running.
- **Service**: An abstract way to expose an application running on a set of Pods as a network service.
- **Ingress**: Manages external access to the services in a cluster, typically HTTP.
- **Namespace**: Provides a mechanism for isolating groups of resources within a single cluster.

## Basic Kubernetes Commands
- `kubectl get pods`: List all pods in the current namespace.
- `kubectl get deployments`: List all deployments.
- `kubectl get services`: List all services.
- `kubectl apply -f <file.yaml>`: Apply a configuration defined in a YAML file.
- `kubectl delete -f <file.yaml>`: Delete resources defined in a YAML file.
- `kubectl logs <pod-name>`: Print the logs for a container in a pod.

## Best Practices
- **Declarative Configuration**: Use YAML files to define desired states for resources.
- **Liveness and Readiness Probes**: Configure probes to ensure applications are healthy and ready to serve traffic.
- **Resource Limits and Requests**: Define CPU and memory limits/requests for pods to prevent resource exhaustion.
- **Secrets Management**: Use Kubernetes Secrets to store sensitive information securely.
