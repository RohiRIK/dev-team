# API Creation Best Practices (RESTful Focus)

This document provides a set of best practices for designing, securing, and maintaining robust and scalable RESTful APIs, which will typically be implemented using Bun and TypeScript.

## 1. Design Principles

| Principle | Description | Example |
| :--- | :--- | :--- |
| **Resource-Based Naming** | Use nouns (resources) for endpoints, not verbs. The HTTP method defines the action. | **Good:** `GET /users`, `POST /orders` **Bad:** `GET /getAllUsers`, `POST /createOrder` |
| **Use HTTP Methods Correctly** | Map CRUD operations to the appropriate HTTP verbs. | `GET` (Read), `POST` (Create), `PUT` (Replace/Update), `PATCH` (Partial Update), `DELETE` (Delete). |
| **Use Plural Nouns** | Resources should be represented by plural nouns. | `/products`, `/customers` |
| **Versioning** | Use versioning (e.g., `v1`, `v2`) in the URI path to allow for non-breaking changes. | `/api/v1/users` |
| **Filtering, Sorting, Paging** | Implement standard query parameters for complex resource retrieval. | `GET /products?category=electronics&sort=-price&limit=20&offset=40` |

## 2. Security Best Practices

1.  **Use HTTPS/TLS:** **ALWAYS** enforce TLS encryption for all API traffic to prevent Man-in-the-Middle attacks. (Handled by K8s Ingress, see `knowledge/05_Kubernetes_Service_and_Ingress_Guide.md`).
2.  **Authentication & Authorization:**
    *   **Authentication (Who are you?):** Use modern standards like OAuth 2.0 or JWT (JSON Web Tokens) for stateless authentication.
    *   **Authorization (What can you do?):** Implement role-based access control (RBAC) to ensure the authenticated user only accesses resources they are permitted to.
3.  **Rate Limiting:** Implement rate limiting to protect the API from brute-force attacks and resource exhaustion. (See `knowledge/12_Resilience_and_Fault_Tolerance_Patterns.md` in the Architect's knowledge base).
4.  **Input Validation:** Strictly validate all incoming data against a schema (e.g., using Zod, see `knowledge/04_TypeScript_Advanced_Type_Safety_Patterns.md`) to prevent injection attacks and ensure data integrity.

## 3. Performance and Reliability

1.  **Caching:** Implement server-side caching (e.g., Redis) for frequently accessed, non-changing data. Use appropriate HTTP caching headers (`Cache-Control`, `ETag`) for client-side caching.
2.  **Asynchronous Operations:** For long-running tasks, return an HTTP `202 Accepted` status immediately and provide a link to a status endpoint where the client can check the job's progress.
3.  **Error Handling:** Use standard HTTP status codes correctly.
    *   `200 OK` (GET, PUT, PATCH)
    *   `201 Created` (POST)
    *   `204 No Content` (DELETE)
    *   `400 Bad Request` (Client-side validation error)
    *   `401 Unauthorized` (Missing/invalid auth)
    *   `403 Forbidden` (Authenticated but lacks permission)
    *   `404 Not Found`
    *   `500 Internal Server Error` (Server-side error)
4.  **Idempotency:** Ensure `PUT` and `DELETE` requests are idempotent. For `POST` requests that should only execute once (e.g., creating an order), use an idempotency key provided by the client.
