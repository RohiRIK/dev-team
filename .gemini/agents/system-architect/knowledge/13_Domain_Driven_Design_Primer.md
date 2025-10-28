# Domain-Driven Design (DDD) Primer

Domain-Driven Design (DDD) is an approach to software development that centers the development on programming a model of the business domain.

## 1. Core Concepts

| Concept | Description | Architectural Significance |
| :--- | :--- | :--- |
| **Domain** | The subject area to which the application is being applied (e.g., Insurance, E-commerce, Healthcare). | Defines the overall scope of the system. |
| **Model** | A system of abstractions that describes selected aspects of the domain and can be used to solve problems related to it. | The foundation of the software design and implementation. |
| **Ubiquitous Language** | A structured language, agreed upon by both domain experts and software developers, used consistently everywhere (code, documentation, conversations). | Ensures clear communication and reduces ambiguity between business and technical teams. |
| **Bounded Context** | A logical boundary within which a particular model is defined and consistent. Terms in the Ubiquitous Language have a specific, single meaning only *within* this context. | Defines the boundaries of microservices or other large components, ensuring high cohesion and low coupling. |

## 2. Strategic Design Patterns (Modeling within Bounded Contexts)

| Pattern | Description |
| :--- | :--- |
| **Context Map** | A visual representation of the relationships and communication between different Bounded Contexts. |
| **Shared Kernel** | A subset of the domain model that is shared and used by two or more Bounded Contexts. |
| **Customer/Supplier** | One Bounded Context (Supplier) provides a model that another Bounded Context (Customer) depends on. The Customer influences the Supplier's roadmap. |
| **Conformist** | The Customer Bounded Context strictly conforms to the model of the Supplier Bounded Context, accepting the Supplier's model as-is. |
| **Anti-Corruption Layer (ACL)** | A layer introduced between two Bounded Contexts to translate concepts from one to the other, preventing the model of one from "corrupting" the model of the other. Essential for integrating with legacy systems. |

## 3. Tactical Design Patterns (Building the Model)

| Pattern | Description |
| :--- | :--- |
| **Entity** | An object defined by its identity (a unique ID) rather than its attributes. |
| **Value Object** | An object defined by its attributes, with no conceptual identity. They are immutable. |
| **Aggregate** | A cluster of Entities and Value Objects treated as a single unit for data changes. It has a root Entity (the Aggregate Root) that controls access to all other objects within the cluster. |
| **Domain Service** | An operation that does not naturally belong to any Entity or Value Object (e.g., a money transfer between two accounts). |
| **Repository** | A mechanism for retrieving and persisting Aggregates, abstracting the underlying data storage technology. |
| **Domain Event** | An event that signifies something important happened in the domain (e.g., `OrderPlaced`, `CustomerVerified`). Used to communicate between Bounded Contexts (see Event-Driven Architecture). |
