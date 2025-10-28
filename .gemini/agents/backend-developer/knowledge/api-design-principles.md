# API Design Principles

## RESTful API Design
- **Resource-Based**: APIs should be designed around resources (e.g., `/users`, `/products`).
- **Stateless**: Each request from client to server must contain all the information needed to understand the request.
- **Standard Methods**: Use standard HTTP methods (GET, POST, PUT, DELETE) for CRUD operations.

## Naming Conventions
- **Plural Nouns**: Use plural nouns for resource names (e.g., `/users` instead of `/user`).
- **Lowercase**: Use lowercase for all path segments.
- **Hyphens for Readability**: Use hyphens to separate words in path segments (e.g., `/order-items`).

## Versioning
- **URI Versioning**: Include the API version in the URI (e.g., `/v1/users`).
- **Header Versioning**: Include the API version in a custom request header.

## Security
- **Authentication**: Use OAuth2, API Keys, or JWT for authentication.
- **Authorization**: Implement role-based access control (RBAC).
- **HTTPS**: Always use HTTPS for secure communication.
