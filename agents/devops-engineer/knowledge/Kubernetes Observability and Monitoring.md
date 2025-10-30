# Kubernetes Observability and Monitoring

This document outlines the core components and best practices for achieving full observability of Bun applications deployed on Kubernetes. Observability is broken down into three pillars: Logs, Metrics, and Traces.

## 1. Logs (What happened?)

Logs provide a record of discrete events within the application and system.

| Component | Role | Best Practice for Bun Apps |
| :--- | :--- | :--- |
| **Stdout/Stderr** | The primary log output for containerized applications. | Bun applications should log to `stdout` and `stderr`. **NEVER** log to a file inside the container. |
| **Logging Agent** | A daemon (e.g., Fluentd, Fluent Bit, Logstash) running on each Node to collect logs from the container runtime. | The agent should be configured to parse structured logs (e.g., JSON format) from the Bun application for easier querying. |
| **Centralized Storage** | A backend system (e.g., Elasticsearch, Loki) to store and index logs. | This allows for cluster-wide log searching, filtering, and analysis. |

## 2. Metrics (What is the current state?)

Metrics are numerical measurements of system health and performance over time.

| Component | Role | Key Metrics to Monitor |
| :--- | :--- | :--- |
| **Prometheus** | The standard time-series database for K8s monitoring. | **Application:** Request rate, latency, error rate (RED metrics). **Bun Runtime:** Event loop lag, garbage collection frequency, memory usage. |
| **Node Exporter** | Collects host-level metrics (CPU, memory, disk I/O) from the K8s Nodes. | Helps identify resource bottlenecks at the infrastructure level. |
| **cAdvisor** | Built into the Kubelet, it provides container-level resource usage and performance metrics. | Used to monitor Pod resource consumption against defined Requests and Limits. |
| **Grafana** | The standard visualization tool for Prometheus data. | Used to build dashboards for real-time monitoring and alerting. |

## 3. Traces (How did the request flow?)

Traces record the path of a single request as it travels through multiple services in a distributed system.

| Component | Role | Best Practice |
| :--- | :--- | :--- |
| **Tracing Library** | An SDK (e.g., OpenTelemetry) integrated into the Bun application to generate spans. | The Bun application should be instrumented to create a new span for every incoming request and propagate the trace context to all downstream calls. |
| **Collector** | A service (e.g., Jaeger Agent) that receives spans from the application. | Deployed as a DaemonSet or Sidecar in K8s to ensure low-latency span collection. |
| **Backend** | A storage and visualization system (e.g., Jaeger, Zipkin) for traces. | Allows developers to visualize the entire request flow, identify service dependencies, and pinpoint latency bottlenecks. |

## 4. Alerting Strategy

Alerts should be actionable and minimize noise.

1.  **Golden Signals:** Focus alerting on the four Golden Signals: **Latency**, **Traffic**, **Errors**, and **Saturation** (resource utilization).
2.  **Alertmanager:** Use Prometheus Alertmanager to group, route, and silence alerts, preventing alert storms.
3.  **SLOs/SLIs:** Define Service Level Objectives (SLOs) and Service Level Indicators (SLIs) to alert based on user experience rather than just system health (e.g., "Alert if 99th percentile latency exceeds 500ms").
