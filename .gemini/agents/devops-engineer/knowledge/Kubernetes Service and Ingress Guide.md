# Kubernetes Service and Ingress Guide

This document explains how to expose Bun applications running in Kubernetes to the outside world using Services and Ingress.

## 1. Services: Internal Traffic Routing

A Service is an abstraction that defines a logical set of Pods and a policy by which to access them.

| Service Type | Use Case | Example YAML Snippet |
| :--- | :--- | :--- |
| **ClusterIP** | Default type. Exposes the Service on an internal IP in the cluster. | Used for internal microservice communication (e.g., frontend to backend). |
| **NodePort** | Exposes the Service on a port on each Node's IP. | Used for simple external access in development or testing environments. |
| **LoadBalancer** | Exposes the Service externally using the cloud provider's load balancer. | Used for production deployments where a dedicated external load balancer is required. |
| **ExternalName** | Maps the Service to a DNS name. | Used to create a Service alias for an external database or service outside the cluster. |

### Service Definition Example (ClusterIP)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: bun-app-service
spec:
  selector:
    app: bun-app
  ports:
    - protocol: TCP
      port: 80 # Service port
      targetPort: 3000 # Container port (where Bun.serve is listening)
  type: ClusterIP
```

## 2. Ingress: External HTTP/S Routing

Ingress is an API object that manages external access to the services in a cluster, typically HTTP and HTTPS. It requires an Ingress Controller (e.g., Nginx, Traefik) to be running in the cluster.

### Ingress Definition Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bun-app-ingress
  annotations:
    # Example: Enable Nginx Ingress Controller specific features
    nginx.ingress.kubernetes.io/rewrite-target: /
    # Example: Enable Cert-Manager for automatic TLS certificate
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx # Must match your Ingress Controller
  tls: # TLS/SSL termination
    - hosts:
        - api.yourdomain.com
      secretName: bun-app-tls
  rules:
    - host: api.yourdomain.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: bun-app-service
                port:
                  number: 80 # Service port defined above
```

## 3. Best Practices

1.  **Prefer Ingress over LoadBalancer:** For HTTP/S traffic, Ingress is generally more cost-effective and provides more features (path-based routing, TLS termination) than using a separate LoadBalancer Service for every application.
2.  **Health Checks:** Ensure the Service selector matches the Deployment labels and that the Pods' readiness probes are passing before the Service routes traffic to them.
3.  **TLS Termination:** Always terminate TLS at the Ingress layer (or the LoadBalancer) to ensure traffic inside the cluster is not unnecessarily encrypted, reducing overhead.
4.  **Ingress Controller Configuration:** Tune the Ingress Controller (e.g., request timeouts, body size limits) to match the requirements of the Bun application. For Bun's high performance, ensure the controller is not the bottleneck.
