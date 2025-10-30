# Enterprise Integration Patterns (EIP)

This document provides an overview of common patterns used to connect disparate applications and systems within an enterprise.

## 1. Messaging Patterns

Messaging is the foundation for most modern, decoupled integration.

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Message Channel** | The conduit through which messages are transmitted. Can be Point-to-Point (one sender, one receiver) or Publish-Subscribe (one sender, many receivers). | Decoupling services and enabling asynchronous communication. |
| **Message Router** | Determines the destination of a message based on its content or header information. | Directing messages to the correct service instance or channel based on business logic. |
| **Message Translator** | Converts a message from one format to another (e.g., XML to JSON). | Allowing services with different data formats to communicate seamlessly. |
| **Message Bus** | A central communication system that handles all message traffic, often combining channels, routers, and translators. | Centralizing and standardizing integration across the enterprise. |

## 2. Service Invocation Patterns

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Remote Procedure Invocation (RPC)** | A service directly calls a function or method on a remote service (e.g., REST, gRPC). | Synchronous, request-response communication where an immediate response is required (e.g., user login). |
| **API Gateway** | Acts as a single, unified entry point for all external clients, routing requests to the appropriate backend services. | Managing security, throttling, and routing for a suite of backend services (see `03_Advanced_Microservices_Design_Patterns.md`). |
| **Asynchronous Request-Reply** | A service sends a request message and expects a response message later on a separate reply channel. | Long-running processes where the client does not need to wait for the result (e.g., placing a complex order). |

## 3. Data Flow Patterns

| Pattern | Description | Use Case |
| :--- | :--- | :--- |
| **Aggregator** | Receives a set of related messages and combines them into a single message. | Collecting responses from multiple services before returning a final result to the client. |
| **Splitter** | Takes a single message and breaks it down into a series of smaller, related messages. | Breaking down a large batch job into smaller, parallelizable tasks. |
| **Content Enricher** | Takes a message and adds missing information from an external source (e.g., a database lookup). | Completing a message with necessary context before it is processed by a downstream service. |

## 4. Integration Styles Summary

| Style | Communication Type | Coupling | Best For |
| :--- | :--- | :--- | :--- |
| **File Transfer** | Asynchronous | Loose | Large data volumes, batch processing. |
| **Shared Database** | Synchronous/Asynchronous | Tight | Legacy systems, simple data exchange. (Generally discouraged in new designs). |
| **Remote Procedure Invocation (RPC)** | Synchronous | Medium | Real-time interaction, simple request/response. |
| **Messaging** | Asynchronous | Loose | High decoupling, reliability, event-driven systems. |
