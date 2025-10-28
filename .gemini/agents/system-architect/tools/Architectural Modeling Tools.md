# Architectural Modeling Tools

This document lists recommended tools for systems architects, categorized by their primary function, to help the AI agent recommend the right tool for the job.

## 1. Diagramming and Modeling Tools

These tools are essential for visualizing system structure and communication, often following the C4 Model.

| Tool | Type | Key Feature | Best For |
| :--- | :--- | :--- | :--- |
| **Structurizr** | Code-as-Diagrams | DSL (Domain Specific Language) for C4 Model. | Maintaining diagrams in sync with the codebase (IaC for diagrams). |
| **PlantUML** | Text-based | Generates UML and other diagrams from simple text. | Quick, simple diagrams, and integrating diagrams into documentation (Markdown). |
| **Mermaid** | Text-based | JavaScript-based diagramming tool that renders flowcharts, sequence diagrams, and more directly in Markdown. | In-line documentation and quick prototyping. |
| **Draw.io / Lucidchart** | Visual Editor | Drag-and-drop interface with extensive libraries (AWS, Azure, GCP icons). | High-fidelity, presentation-ready diagrams, and non-technical users. |
| **Excalidraw** | Sketch-style | Simple, hand-drawn look, collaborative whiteboard. | Brainstorming, whiteboarding, and early-stage design discussions. |

## 2. Infrastructure as Code (IaC) Tools

These tools manage the provisioning and configuration of cloud infrastructure, which is a core architectural concern.

| Tool | Type | Key Feature | Best For |
| :--- | :--- | :--- | :--- |
| **Terraform** | Multi-Cloud Provisioning | Declarative configuration language (HCL) to manage infrastructure across all major clouds. | Managing infrastructure lifecycle across heterogeneous environments. |
| **CloudFormation (AWS)** | Cloud-Specific Provisioning | AWS-native service for modeling and provisioning AWS resources. | Deep integration and fine-grained control within the AWS ecosystem. |
| **ARM Templates (Azure)** | Cloud-Specific Provisioning | JSON-based declarative templates for Azure resources. | Deep integration and fine-grained control within the Azure ecosystem. |
| **Ansible / Chef / Puppet** | Configuration Management | Automating the installation, configuration, and management of software on servers. | Post-provisioning setup and maintaining server state. |

## 3. Observability and Monitoring Tools

Architects must design systems that are observable. These tools are critical for operational excellence.

| Tool | Type | Key Feature | Best For |
| :--- | :--- | :--- | :--- |
| **Prometheus / Grafana** | Monitoring & Visualization | Time-series database and visualization dashboard. | Open-source, high-performance monitoring of metrics. |
| **ELK Stack (Elasticsearch, Logstash, Kibana)** | Logging & Search | Centralized logging platform for searching, analyzing, and visualizing log data. | Centralizing and analyzing massive volumes of application logs. |
| **Jaeger / Zipkin** | Distributed Tracing | Visualizing the end-to-end flow of a request across multiple microservices. | Debugging performance and latency issues in distributed systems. |

## 4. AI Agent Guidance

When a user asks for a tool recommendation, the AI agent should:
1.  Identify the user's primary goal (e.g., "I need to draw a diagram," "I need to provision infrastructure").
2.  Suggest the most appropriate tool from the relevant category.
3.  If the task involves documentation, prioritize text-based tools like **Mermaid** or **PlantUML** for easy integration into Markdown files.
