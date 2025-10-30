# Architectural Patterns Cheatsheet

This document provides a quick reference and comparison of essential software architectural patterns. The AI agent should use this as a starting point for system design and pattern selection.

## 1. Layered Pattern (N-Tier)
| Aspect | Description |
| :--- | :--- |
| **Description** | Divides the application into horizontal layers (e.g., Presentation, Business, Persistence, Database). |
| **Best For** | Traditional enterprise applications, e-commerce, and applications with simple, structured data flow. |
| **Pros** | High testability, easy to maintain, clear separation of concerns. |
| **Cons** | Can become a "monolithic" structure, performance issues due to multiple layer traversals. |

## 2. Microservices Pattern
| Aspect | Description |
| :--- | :--- |
| **Description** | A suite of small, independently deployable services, each running its own process and communicating via lightweight mechanisms (e.g., HTTP APIs, message brokers). |
| **Best For** | Large, complex systems that require rapid, independent development and deployment of components. |
| **Pros** | High scalability, technology diversity, fault isolation, faster time-to-market. |
| **Cons** | Operational complexity, distributed transactions are difficult, increased network overhead. |

## 3. Event-Driven Architecture (EDA)
| Aspect | Description |
| :--- | :--- |
| **Description** | Components communicate asynchronously via events. Events are produced by one component and consumed by others. |
| **Best For** | Real-time processing, systems with high data ingestion rates, and systems requiring high decoupling (e.g., IoT, financial trading). |
| **Pros** | High responsiveness, extreme decoupling, easy scalability of producers/consumers. |
| **Cons** | Eventual consistency, complex debugging due to non-linear flow, difficulty in maintaining event contracts. |

## 4. Broker Pattern
| Aspect | Description |
| :--- | :--- |
| **Description** | Used to structure distributed systems with decoupled components that interact by remote service invocations. A broker component handles communication. |
| **Best For** | Distributed systems where components need to locate and invoke services from others without knowing their physical location. |
| **Pros** | Decoupling, transparency of location. |
| **Cons** | High latency, single point of failure (if broker is not clustered), complex runtime. |

## 5. Space-Based Architecture (SBA)
| Aspect | Description |
| :--- | :--- |
| **Description** | Focuses on high scalability and concurrency by distributing processing and data across many servers, often using in-memory data grids (IMDG). |
| **Best For** | High-volume, real-time applications (e.g., online auctions, high-frequency trading). |
| **Pros** | High scalability and performance, avoids database bottlenecks. |
| **Cons** | Data synchronization complexity, high memory consumption, expensive technology stack. |

## 6. Pipeline Pattern (Pipes and Filters)
| Aspect | Description |
| :--- | :--- |
| **Description** | Structures a system as a series of processing steps (filters) connected by data streams (pipes). |
| **Best For** | Data transformation, ETL (Extract, Transform, Load) processes, and compiler design. |
| **Pros** | High reusability of filters, easy to maintain and extend, supports parallel processing. |
| **Cons** | Data format overhead between filters, not suitable for interactive systems. |

## 7. Client-Server Pattern
| Aspect | Description |
| :--- | :--- |
| **Description** | Two main parts: a client that requests services and a server that provides them. |
| **Best For** | Web applications, email, file sharing. |
| **Pros** | Centralized control, easy maintenance of the server. |
| **Cons** | Server can be a bottleneck, high dependency on the network. |

## 8. Peer-to-Peer (P2P) Pattern
| Aspect | Description |
| :--- | :--- |
| **Description** | All components (peers) are equal and can act as both client and server. |
| **Best For** | File sharing, blockchain, distributed computing networks. |
| **Pros** | High robustness, no single point of failure, high scalability. |
| **Cons** | Complex security and data consistency management, difficult to manage and update. |

## 9. Model-View-Controller (MVC)
| Aspect | Description |
| :--- | :--- |
| **Description** | Separates an application into three interconnected parts: Model (data/business logic), View (user interface), and Controller (input handling). |
| **Best For** | User interface development, web frameworks (e.g., Django, Spring MVC, Rails). |
| **Pros** | Parallel development, high code reusability, clear separation of concerns. |
| **Cons** | Increased complexity for simple UIs, navigation can be complex. |
