# Security Architecture Checklist

This checklist provides a high-level overview of critical security considerations that must be addressed during the design phase of any system.

## 1. Identity and Access Management (IAM)

| Checkpoint | Description | Status |
| :--- | :--- | :--- |
| **Principle of Least Privilege** | Is every user, service, and component granted only the minimum permissions necessary to perform its function? | [ ] |
| **Centralized Authentication** | Is authentication managed by a central identity provider (e.g., OAuth 2.0, OpenID Connect, SAML)? | [ ] |
| **Multi-Factor Authentication (MFA)** | Is MFA enforced for all administrative and privileged accounts? | [ ] |
| **Role-Based Access Control (RBAC)** | Is access to resources granted based on defined roles rather than individual users? | [ ] |
| **API Key/Token Management** | Are API keys, secrets, and access tokens stored securely (e.g., in a vault) and rotated regularly? | [ ] |

## 2. Data Protection

| Checkpoint | Description | Status |
| :--- | :--- | :--- |
| **Encryption at Rest** | Is all sensitive data (databases, storage volumes, backups) encrypted using industry-standard algorithms (e.g., AES-256)? | [ ] |
| **Encryption in Transit** | Is all network communication (internal and external) secured using TLS/SSL (HTTPS, secure gRPC)? | [ ] |
| **Data Classification** | Is data classified by sensitivity (e.g., Public, Internal, Confidential) to apply appropriate controls? | [ ] |
| **Data Masking/Anonymization** | Is sensitive data masked or anonymized in non-production environments (e.g., development, testing)? | [ ] |

## 3. Network and Infrastructure Security

| Checkpoint | Description | Status |
| :--- | :--- | :--- |
| **Network Segmentation** | Are different environments (Prod, Staging, Dev) and tiers (Web, App, DB) logically separated using VPCs, subnets, or firewalls? | [ ] |
| **Ingress/Egress Filtering** | Are network access control lists (ACLs) or security groups strictly configured to allow only necessary traffic? | [ ] |
| **DDoS Protection** | Is a Distributed Denial of Service (DDoS) mitigation service enabled at the edge? | [ ] |
| **Vulnerability Scanning** | Is automated vulnerability scanning performed on all infrastructure and container images? | [ ] |

## 4. Application Security (Based on OWASP Top 10)

| Checkpoint | Description | Status |
| :--- | :--- | :--- |
| **Input Validation** | Is all user input validated, sanitized, and encoded to prevent Injection flaws (e.g., SQL Injection, XSS)? | [ ] |
| **Secure Configuration** | Are all components (OS, web server, frameworks) securely configured, and are unnecessary features disabled? | [ ] |
| **Logging and Monitoring** | Are security-relevant events (failed logins, access to sensitive data) logged, monitored, and alerted upon? | [ ] |
| **Secure Dependencies** | Are all third-party libraries and components checked for known vulnerabilities (e.g., using dependency scanning tools)? | [ ] |

## 5. Operational Security

| Checkpoint | Description | Status |
| :--- | :--- | :--- |
| **Secrets Management** | Are application secrets managed by a dedicated vault service (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault)? | [ ] |
| **Audit Trails** | Is there a non-repudiable audit trail of all administrative actions and significant system events? | [ ] |
| **Incident Response Plan** | Is a clear, tested incident response plan in place for security breaches? | [ ] |
