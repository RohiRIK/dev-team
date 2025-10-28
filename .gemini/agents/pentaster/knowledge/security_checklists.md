# Web Application Security Checklist

This checklist covers critical areas for securing web applications, synthesized from various industry best practices and the OWASP Top 10.

### I. Authentication and Authorization

*   **Strong Authentication:**
    *   Enforce strong, complex password policies.
    *   Mandate multi-factor authentication (MFA).
    *   Protect against account enumeration by providing generic responses to invalid login attempts.
    *   Ensure credentials are only delivered over HTTPS.
    *   The login form must be delivered over HTTPS.
*   **Robust Access Control (OWASP A01:2021 - Broken Access Control):**
    *   Implement Role-Based Access Control (RBAC) to assign roles and define allowed actions.
    *   Adhere to the Principle of Least Privilege, granting only necessary access.
    *   Test for Insecure Direct Object References (IDOR) and URL tampering vulnerabilities.
    *   Maintain audit logs to track and review authorization activities.

### II. Data Protection

*   **Data Encryption:**
    *   Implement SSL/TLS for secure data transmission (HTTPS with up-to-date TLS configurations).
    *   Encrypt all sensitive data at rest (in databases, logs, backups).
    *   Avoid deprecated or weak encryption algorithms and protocols.
    *   Establish secure processes for cryptographic key management and rotation.
    *   Check SSL version, algorithms, and key length.
    *   Check for digital certificate validity (duration, signature, and CN).
*   **Data Privacy and Confidentiality:**
    *   Limit access to sensitive information to authorized individuals.
    *   Prevent unauthorized modifications to data or resources.
    *   Prevent data leaks and breaches.

### III. Input Validation and Output Encoding

*   **Perform Input Validation (OWASP A03:2021 - Injection):**
    *   Never trust user input; validate and verify everything.
    *   Use whitelisting to allow only specific, known inputs.
    *   Employ blacklisting to block known malicious inputs (e.g., dangerous characters).
    *   Use parameterized queries to prevent SQL injection attacks.
    *   Ensure proper code reviews to identify insecure practices.
    *   Test for buffer overflows and SQL injection.
*   **Output Encoding:**
    *   Properly encode all output to prevent Cross-Site Scripting (XSS) attacks.

### IV. Session Management

*   **Secure Session Management:**
    *   Establish secure session management, including rotating session IDs and enforcing timeouts.
    *   Check session tokens for cookie flags (httpOnly and secure).
    *   Check session cookie scope (path and domain) and duration (expires and max-age).
    *   Confirm that new session tokens are issued on login, role change, and logout.
    *   Test session cookies for randomness.

### V. API Security

*   **Discover and Secure Your Complete API Ecosystem:**
    *   Protect APIs with rate limiting, proper authentication, and monitoring.
    *   Implement robust authentication and access control for APIs.

### VI. Error Handling and Logging

*   **Proper Logging Practices:**
    *   Implement comprehensive logging to track security-relevant events.
    *   Monitor all authentication events and alert on repeated failures or suspicious activity.
    *   Review error-related configuration and how errors are handled by the application.
    *   Ensure generic error messages are displayed to users, not detailed technical errors.

### VII. Secure Configuration and Deployment

*   **Harden Configuration and Deployment Practices:**
    *   Check for commonly used application and administrative URLs.
    *   Check for old, backup, and unreferenced files.
    *   Test for security HTTP headers (e.g., CSP, X-Frame-Options, HSTS).
    *   Test for non-production data in live environments.
    *   Ensure secure processes for managing program files at the operating system level.
    *   Ensure binaries are stripped.
*   **Manage Vulnerable and Outdated Components (OWASP A06:2021 - Vulnerable and Outdated Components):**
    *   Keep all frameworks, libraries, and other software components updated to the latest stable versions.
    *   Continuously monitor for newly disclosed vulnerabilities in components.
    *   Remove any unsupported or unused dependencies, plugins, and libraries.
*   **Secure Secrets Management:**
    *   Establish secure processes for managing API keys, passwords, and other sensitive configuration data.
    *   Avoid hardcoded credentials.

### VIII. Security Testing and Development Practices

*   **Adopt a DevSecOps Approach:**
    *   Integrate security practices throughout the development lifecycle.
*   **Continuous Security Testing:**
    *   Leverage Dynamic Application Security Testing (DAST) tools to test running applications and APIs.
    *   Utilize Static Application Security Testing (SAST) tools to analyze source code for vulnerabilities.
    *   Perform regular penetration testing.
*   **Information Gathering:**
    *   Manually explore the site and spider/crawl for missed or hidden content.
    *   Check for files that expose content (e.g., `robots.txt`, `sitemap.xml`).
    *   Identify technologies used, user roles, and application entry points.

### IX. Supply Chain Security

*   **Secure Your Software Supply Chain:**
    *   Ensure the security of all third-party components and services used in your application.
