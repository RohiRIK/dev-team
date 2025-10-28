# Resilience and Fault Tolerance Patterns

Resilience is the ability of a system to recover from failures and maintain functionality. Fault tolerance is the ability of a system to continue operating without interruption when a component fails.

## 1. Failure Handling Patterns

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Retry** | Automatically re-sends a request to a service if the initial request fails, often with an exponential backoff delay. | Transient network errors, temporary service unavailability. **Caution:** Must be used only with idempotent operations. |
| **Circuit Breaker** | Monitors failures and, if the failure rate exceeds a threshold, stops further requests to the failing service for a period. | Protecting the system from a perpetually failing or slow downstream service (see `03_Advanced_Microservices_Design_Patterns.md`). |
| **Fallback** | When a primary service fails, the system switches to a secondary, often simplified, service or returns cached data. | Non-critical features (e.g., personalized recommendations) where a failure should not stop the core function (e.g., checkout). |
| **Timeouts** | Define a maximum time to wait for a response from a service. If the time limit is exceeded, the request is aborted. | Preventing resource exhaustion and cascading failures caused by slow services. |

## 2. Resource Isolation Patterns

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Bulkhead** | Partitions resources (e.g., connection pools, thread pools) into separate groups. A failure in one partition does not affect the others. | Isolating calls to different external services or different types of requests within a single service. |
| **Rate Limiting** | Restricts the number of requests a client or service can make within a given time window. | Protecting a service from being overwhelmed by a sudden spike in traffic or a malicious client. |

## 3. Deployment and Operational Patterns

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Health Checks** | Exposing an endpoint (`/health`) that reports the operational status of the service and its dependencies. | Used by load balancers and service meshes to determine if traffic should be routed to an instance. |
| **Idempotency** | Designing operations such that applying them multiple times produces the same result as applying them once. | Essential for services that are called via a Retry mechanism or in an Event-Driven Architecture. |
| **Chaos Engineering** | The discipline of experimenting on a system in order to build confidence in that system's capability to withstand turbulent conditions in production. | Proactively testing the resilience of the system by injecting failures (e.g., latency, service termination). |

## 4. Disaster Recovery (DR) Strategies

| Strategy | Description | RTO/RPO | Cost |
| :--- | :--- | :--- | :--- |
| **Backup and Restore** | Data is backed up to a secondary region and restored upon failure. | High RTO (Recovery Time Objective), High RPO (Recovery Point Objective). | Low |
| **Pilot Light** | Core infrastructure is always running in the DR region, and data is replicated. Full application is deployed only upon failover. | Medium RTO, Low RPO. | Medium |
| **Warm Standby** | A fully functional, scaled-down replica of the production environment is running in the DR region. | Low RTO, Low RPO. | High |
| **Multi-Site Active/Active** | The application is fully deployed and serving traffic in multiple regions simultaneously. | Near-Zero RTO, Near-Zero RPO. | Very High |
