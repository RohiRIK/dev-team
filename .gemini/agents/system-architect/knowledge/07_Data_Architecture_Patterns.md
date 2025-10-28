# Data Architecture Patterns

This document outlines key patterns for designing modern, flexible, and scalable data storage and processing systems.

## 1. Data Storage Patterns

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Polyglot Persistence** | The practice of using different types of data storage technologies (e.g., relational, NoSQL, graph, document) for different needs within a single application. | Microservices where each service chooses the best database for its specific data model and access patterns. |
| **Command Query Responsibility Segregation (CQRS)** | Separates the model for updating information (Command) from the model for reading information (Query). Often involves two separate data stores. | Applications with high read-to-write ratios, or where read models need to be highly optimized for complex queries. |
| **Event Sourcing** | Instead of storing only the current state, all changes to the application state are stored as a sequence of immutable events. The current state is derived by replaying these events. | Systems requiring a complete audit log, or those that need to reconstruct past states (e.g., financial systems, complex domain models). |

## 2. Data Processing and Distribution Patterns

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Data Lake** | A large repository that stores raw data in its native format (structured, semi-structured, or unstructured) until it is needed. | Storing massive amounts of diverse data for future analytics, machine learning, and data science projects. |
| **Data Mesh** | A decentralized data architecture where data is treated as a product, owned by domain teams, and served to other teams via self-service data platforms. | Large, complex organizations with many independent business domains that need to share data securely and efficiently. |
| **Lambda Architecture** | Combines a batch layer (for comprehensive, accurate data) and a speed layer (for real-time, low-latency data) to serve queries. | Applications requiring both historical accuracy and real-time insights (e.g., personalized recommendations, fraud detection). |
| **Kappa Architecture** | A simplification of the Lambda architecture that uses a single stream processing engine (e.g., Kafka and Flink/Spark Streaming) for both real-time and batch processing. | Systems where the data can be fully processed via a stream, simplifying the operational complexity of maintaining two separate layers. |

## 3. Data Governance and Quality

1.  **Data Catalog:** A detailed inventory of all data assets, including metadata, lineage, and ownership. Essential for Data Mesh and Data Lake governance.
2.  **Data Lineage:** The ability to track the movement and transformation of data from its source to its consumption point. Crucial for compliance and debugging.
3.  **Data Quality Checks:** Implementing automated checks (e.g., validity, completeness, consistency) at ingestion and transformation points to ensure data reliability.
4.  **Security and Privacy:** Applying access controls, encryption, and anonymization techniques based on data classification (see `05_Security_Architecture_Checklist.md`).
