# Glossary of Architectural Terms

This glossary provides concise definitions for key terms used in systems architecture.

| Term | Definition | Context/Related Concept |
| :--- | :--- | :--- |
| **Monolith** | A single, tightly coupled application where all components are packaged and deployed as one unit. | Opposite of Microservices. |
| **Microservice** | A small, autonomous service that is independently deployable and scalable. | `03_Advanced_Microservices_Design_Patterns.md` |
| **API Gateway** | A single entry point for all clients, handling request routing, composition, and protocol translation. | `03_Advanced_Microservices_Design_Patterns.md` |
| **Idempotency** | An operation that produces the same result no matter how many times it is executed. | Essential for Retries and reliable messaging. |
| **Latency** | The time delay between a user request and the system's response. | Performance metric. |
| **Throughput** | The rate at which a system can process requests or data over a period of time. | Performance metric (e.g., requests per second). |
| **Sharding** | A type of database partitioning that separates large databases into smaller, faster, more easily managed parts called data shards. | Horizontal scaling of databases. |
| **Eventual Consistency** | A consistency model where, if no new updates are made, all reads will eventually return the last updated value. | Common in distributed systems and Event-Driven Architecture. |
| **CAP Theorem** | States that a distributed data store can only guarantee two of the following three: Consistency, Availability, and Partition Tolerance. | Fundamental trade-off in distributed systems design. |
| **RTO (Recovery Time Objective)** | The maximum tolerable duration of time that a system or application can be down after a disaster. | Disaster Recovery planning. |
| **RPO (Recovery Point Objective)** | The maximum tolerable period in which data might be lost from an IT service due to a major incident. | Disaster Recovery planning. |
| **Infrastructure as Code (IaC)** | Managing and provisioning computer data centers through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools. | DevOps and Operational Excellence. |
| **Bulkhead** | A design pattern that isolates resources to prevent failure in one part of the system from cascading to others. | `12_Resilience_and_Fault_Tolerance_Patterns.md` |
| **Bounded Context** | A specific area within a domain where a particular model is defined and applicable. | Domain-Driven Design (`13_Domain_Driven_Design_Primer.md`). |
| **Saga** | A sequence of local transactions that coordinates distributed transactions across multiple services. | `03_Advanced_Microservices_Design_Patterns.md` |
| **Technical Debt** | The implied cost of additional rework caused by choosing an easy, limited solution now instead of a better approach. | `11_Technical_Debt_Management_Strategy.md` |
