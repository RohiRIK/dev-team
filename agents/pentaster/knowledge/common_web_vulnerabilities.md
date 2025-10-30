# Common Web Application Vulnerabilities

Web application vulnerabilities are flaws or weaknesses in web-based applications that can be exploited by attackers to compromise security. These vulnerabilities often arise from issues like unvalidated input, misconfigured servers, and design flaws. The Open Web Application Security Project (OWASP) Top 10 is a widely recognized standard that outlines the most critical security risks to web applications.

## Key Vulnerabilities (often highlighted in OWASP Top 10)

*   **Broken Access Control (A01:2021)**: Occurs when authentication and access restrictions are not properly implemented, allowing unauthorized users to access sensitive files, systems, or user privilege settings. It is currently considered the most serious web application security risk.
*   **Cryptographic Failures (A02:2021)**: Formerly known as Sensitive Data Exposure, this category focuses on failures related to cryptography, such as using hardcoded passwords, outdated algorithms, or weak cryptographic keys, which can expose sensitive data.
*   **Injection (A03:2021)**: This includes vulnerabilities like SQL Injection and Cross-Site Scripting (XSS). Attackers inject malicious code into input fields, which can lead to unauthorized commands, access to sensitive databases, or control over systems.
    *   **SQL Injection (SQLi)**: Attackers insert malicious SQL commands into input fields to manipulate databases, potentially leading to data loss, corruption, or even full system takeover.
    *   **Cross-Site Scripting (XSS)**: Attackers inject scripts into web pages that are then executed in other users' browsers, allowing them to steal credentials, manipulate users, or gain control over user sessions.
*   **Insecure Design (A04:2021)**: A new category in 2021, this focuses on fundamental design flaws and ineffective controls rather than just implementation issues. It emphasizes the need for threat modeling and secure design principles from the start.
*   **Security Misconfiguration (A05:2021)**: Can arise from overly broad permissions, insecure default values, or overly revealing error messages, providing attackers with easy paths to compromise applications.
*   **Vulnerable and Outdated Components (A06:2021)**: Using components with known vulnerabilities can expose applications to attacks. It's crucial to track component versions and use security scanners to identify and update vulnerable dependencies.
*   **Identification and Authentication Failures (A07:2021)**: This category, previously Broken Authentication, includes issues with credentials management, weak access controls, and problems during authentication that can lead to unauthorized access.
*   **Software and Data Integrity Failures (A08:2021)**: A new category in 2021, it addresses assumptions related to software updates, critical data, and CI/CD pipelines without verifying integrity. Insecure Deserialization is now part of this category.
*   **Security Logging and Monitoring Failures (A09:2021)**: Insufficient logging and monitoring can hinder the detection and response to security incidents.
*   **Server-Side Request Forgery (SSRF) (A10:2021)**: This vulnerability allows attackers to instruct a web application to make requests to other domains, potentially bypassing firewalls or revealing sensitive internal information.
*   **Cross-Site Request Forgery (CSRF)**: This attack exploits browsers to submit unauthorized actions to an application when a user is authenticated, often by tricking the user into submitting a malicious request.
*   **XML External Entities (XXE) Attacks**: These attacks exploit poor XML parsing, allowing attackers to submit XML inputs with references to external files or scripts.
*   **Insecure Direct Object References (IDOR)**: Attackers can manipulate object referencing mechanisms to access sensitive files or data that they are not authorized to view.
*   **Unvalidated Redirects and Forwards**: This vulnerability can allow attackers to redirect users to malicious sites.
*   **Information Leakage**: The application may reveal system data or debugging information through error messages, which can help attackers craft specialized attacks.
*   **Path Traversal**: This allows attackers to access files and directories stored outside the web root folder.
*   **File Upload Vulnerabilities**: These occur when an application allows users to upload files without proper validation, potentially leading to the upload of malicious scripts or executables.
