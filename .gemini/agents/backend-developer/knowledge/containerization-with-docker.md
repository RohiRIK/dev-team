# Containerization with Docker

## What is Docker?
- **Platform for Developers and Sysadmins**: To develop, deploy, and run applications with containers.
- **Containers**: Lightweight, standalone, executable packages of software that include everything needed to run an application.

## Key Concepts
- **Dockerfile**: A text file that contains all the commands a user could call on the command line to assemble an image.
- **Image**: A read-only template with instructions for creating a Docker container.
- **Container**: A runnable instance of an image.
- **Registry**: A storage and distribution system for Docker images (e.g., Docker Hub).

## Docker Commands
- `docker build -t <image-name> .`: Build a Docker image from a Dockerfile.
- `docker run -p 80:80 <image-name>`: Run a Docker container and map port 80.
- `docker ps`: List running containers.
- `docker stop <container-id>`: Stop a running container.
- `docker rm <container-id>`: Remove a container.
- `docker rmi <image-id>`: Remove an image.

## Best Practices
- **Small Images**: Use minimal base images (e.g., Alpine) to reduce image size.
- **Multi-Stage Builds**: Use multi-stage builds to separate build-time dependencies from runtime dependencies.
- **Layer Caching**: Leverage Docker's layer caching to speed up builds.
- **Security**: Avoid running containers as root; scan images for vulnerabilities.
