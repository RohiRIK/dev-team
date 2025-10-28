# Traefik Configuration for Docker Swarm

This document provides best practices for configuring Traefik as a reverse proxy in the user's Docker Swarm home lab. Traefik is already a component of the lab (**H35**).

---

## 1. Core Concepts

### 1.1. Dynamic Configuration via Docker Labels

**Best Practice:** The primary way to configure Traefik in a Docker Swarm is by using `labels` on your services within your `docker-compose.yml` files. Traefik listens to the Docker socket and automatically creates routes and applies middleware based on the labels it discovers. This removes the need for manual configuration files for each new service.

**Connection to TELOS:**
- This dynamic approach is a form of automation that directly aligns with your goal of becoming an Automation Engineer (**G1**) and your interest in efficient, automated processes (**N23**).

### 1.2. The Traefik Overlay Network

**Best Practice:** Create a dedicated overlay network (e.g., `traefik-public`) that both the Traefik service and any services you want to expose are connected to. This allows Traefik to communicate with your application containers securely across the Swarm cluster.

**Connection to TELOS:**
- This follows the security principle of network segmentation, a key concept for a Cloud Security Engineer (**SdJ2**). It helps create a more organized and secure home lab, addressing the disorganization problem (**Pr13**).

---

## 2. Deployment & Configuration

### 2.1. Deploy Traefik as a Swarm Service

**Best Practice:** Deploy Traefik itself as a service in your Docker Swarm. It should be constrained to run on a `manager` node to ensure it has access to the Docker socket for service discovery.

**Example `docker-compose.yml` for Traefik:**
```yaml
services:
  traefik:
    image: traefik:v2.10
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-data:/data
    networks:
      - traefik-public
    deploy:
      placement:
        constraints:
          - node.role == manager
```

**Connection to TELOS:**
- Managing your reverse proxy as part of your Docker Swarm stack is a core part of building an easily movable and manageable home lab (**S10**, **C17**).

### 2.2. Automatic HTTPS with Let's Encrypt

**Best Practice:** Configure Traefik to automatically obtain and renew TLS/SSL certificates from Let's Encrypt. This is done in Traefik's static configuration file or via command-line arguments when the service starts.

**Connection to TELOS:**
- Automating certificate management is a professional practice that enhances the security of your home lab, aligning with your security skillset (**SdJ2**) and making your setup more robust (**N28**).

### 2.3. Exposing a Service with Labels

**Best Practice:** To expose another service (e.g., `whoami`) to the internet, add labels to its `deploy` section. You must specify the router rule (the domain name) and the service port.

**Example `docker-compose.yml` for a service:**
```yaml
services:
  whoami:
    image: containous/whoami
    networks:
      - traefik-public
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.whoami.rule=Host(`whoami.yourdomain.com`)"
        - "traefik.http.routers.whoami.entrypoints=websecure"
        - "traefik.http.routers.whoami.tls.certresolver=myresolver"
        - "traefik.http.services.whoami.loadbalancer.server.port=80"
```

**Connection to TELOS:**
- This labeling system is a form of declarative configuration, which is a key concept in modern DevOps and automation (**SdJ1**, **SdJ3**).

---

## 3. Security

### 3.1. Secure the Traefik Dashboard

**Best Practice:** The Traefik dashboard provides a lot of information about your services. It should always be secured with authentication. The simplest method is HTTP Basic Authentication, configured via labels.

**Connection to TELOS:**
- Protecting administrative interfaces is a fundamental security task. Leaving the dashboard exposed would be contrary to your professional identity as a security engineer (**SdJ2**).
