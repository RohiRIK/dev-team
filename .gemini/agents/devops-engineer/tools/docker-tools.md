# Docker Tools

This document defines tools for interacting with Docker.

## docker_build

Builds a Docker image from a Dockerfile.

**Parameters:**
- `path`: The path to the directory containing the Dockerfile.
- `tag`: The tag to apply to the built image.

**Example:**
`docker_build(path: './app', tag: 'my-app:latest')`

## docker_push

Pushes a Docker image to a registry.

**Parameters:**
- `tag`: The tag of the image to push.

**Example:**
`docker_push(tag: 'my-app:latest')`

## docker_ps

Lists running Docker containers.

**Parameters:**
- `all`: (boolean) Show all containers (default false).

**Example:**
`docker_ps(all: true)`
