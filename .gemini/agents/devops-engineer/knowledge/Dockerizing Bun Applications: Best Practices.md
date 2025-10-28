# Dockerizing Bun Applications: Best Practices

This document provides a guide to creating small, secure, and efficient Docker images for Bun-based TypeScript applications, focusing on multi-stage builds.

## 1. Multi-Stage Dockerfile Template

A multi-stage build is essential to separate the build environment (which includes development dependencies) from the final, minimal runtime environment.

```dockerfile
# ----------------------------------------------------------------------
# STAGE 1: Build Stage (Uses a full Bun image for building)
# ----------------------------------------------------------------------
FROM oven/bun:latest AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package.json bun.lockb ./

# Install dependencies (Bun is extremely fast here)
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application (e.g., if using a bundler like esbuild or Bun's built-in bundler)
# For a simple server, this step might be skipped, but included for completeness.
# RUN bun run build

# ----------------------------------------------------------------------
# STAGE 2: Production Stage (Uses a minimal base image for runtime)
# ----------------------------------------------------------------------
# Use a minimal image like Alpine or a minimal Debian image
FROM oven/bun:latest-slim AS runner

# Set environment variables
ENV NODE_ENV=production
ENV BUN_ENV=production

# Set working directory
WORKDIR /app

# Copy *only* the necessary files from the builder stage
# 1. Copy node_modules (or Bun's equivalent)
COPY --from=builder /app/node_modules ./node_modules
# 2. Copy the source code (or the built output)
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist # If you have a build step

# Expose the port the Bun server listens on (e.g., 3000)
EXPOSE 3000

# Command to run the application
# Use 'bun run' for scripts or 'bun --hot run' for development
CMD ["bun", "run", "src/index.ts"]
```

## 2. Optimization Checklist

| Optimization | Rationale |
| :--- | :--- |
| **Use `oven/bun:latest-slim`** | Provides a minimal base image, significantly reducing the final image size and attack surface. |
| **Multi-Stage Builds** | Ensures development tools and build artifacts (like the full `builder` image) are not included in the final image. |
| **Copy `package.json` First** | Docker caches the `bun install` layer. If only source code changes, dependencies are not re-installed. |
| **`--frozen-lockfile`** | Ensures the installed dependencies exactly match the `bun.lockb` file, guaranteeing reproducible builds. |
| **Non-Root User** | Run the application as a non-root user for security (e.g., `USER bun` if using the official Bun image). |
| **Graceful Shutdown** | Ensure the application handles `SIGTERM` (the signal Kubernetes sends to stop a container) for clean shutdown. |

## 3. Development vs. Production

*   **Development:** Use Docker Compose to mount the local source code volume (`-v .:/app`) for hot reloading. Use `bun --hot run src/index.ts` in the `CMD`.
*   **Production:** Use the final `runner` stage image. Do not mount volumes. Use `CMD ["bun", "run", "src/index.ts"]` without hot reloading.
