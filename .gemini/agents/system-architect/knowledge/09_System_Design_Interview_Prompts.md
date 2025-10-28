# System Design Interview Prompts and Strategy

This document provides a structured approach and common prompts to help the AI agent simulate and solve complex system design problems.

## Structured Approach (The 5 Steps)

The AI agent should always follow this structure when approaching a system design problem:

| Step | Focus Area | Key Questions to Ask |
| :--- | :--- | :--- |
| **1. Understand the Scope & Requirements** | Clarify functional and non-functional requirements. Define the system's boundaries. | What are the core features? What is the expected scale (users, requests/sec)? What are the latency and availability requirements (SLAs)? |
| **2. High-Level Design (HLD)** | Draw the main components and their interactions (Context Diagram). | What are the main services/components? How do they communicate (APIs, queues)? What is the primary data flow? |
| **3. Deep Dive (Detailed Design)** | Focus on the most critical components (e.g., database, load balancer, specific service). | What database technology is best (SQL vs. NoSQL)? How will we scale the database (sharding)? How will we handle caching? What is the data schema? |
| **4. Address Bottlenecks & Scale** | Identify potential single points of failure or performance bottlenecks and propose solutions. | How will we handle 10x traffic? Where is the cache placed? How is session state managed? What about security (rate limiting, authentication)? |
| **5. Summary & Review** | Summarize the final design, review non-functional requirements, and suggest future improvements. | Does the design meet all initial requirements? What are the trade-offs made? What is the next phase of development? |

## Common System Design Prompts

The AI agent should be prepared to design systems based on these categories:

### A. Social Media / Content Platforms
*   **Design Twitter/X:** Focus on the timeline feed generation (fan-out on write vs. fan-out on read), search, and trending topics.
*   **Design Instagram/TikTok:** Focus on media storage (CDN, S3), content delivery, and personalized recommendation feeds.
*   **Design a URL Shortener (e.g., Bitly):** Focus on generating unique short URLs, the data store (read-heavy), and redirection latency.

### B. E-commerce / Financial Systems
*   **Design an E-commerce Checkout System:** Focus on distributed transactions (Saga pattern), inventory management, and payment integration.
*   **Design a Ride-Sharing Service (e.g., Uber/Lyft):** Focus on real-time location tracking, matching algorithms, and geo-indexing (e.g., using GeoHash).
*   **Design a Payment Processing System:** Focus on security, idempotency, and high availability.

### C. Data & Infrastructure
*   **Design a Distributed Cache (e.g., Redis):** Focus on consistent hashing, data partitioning, and replication.
*   **Design a Web Crawler:** Focus on distributed processing, politeness, and handling massive queues of URLs.
*   **Design a Notification System:** Focus on push notifications, email, SMS, and reliable delivery (e.g., using message queues).

### D. Streaming & Real-Time
*   **Design a Live Commenting System:** Focus on WebSockets, connection management, and low-latency delivery.
*   **Design a Stock Ticker System:** Focus on high-throughput data ingestion, streaming processing, and fan-out to many clients.
