import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright configuration for dev-team dashboard E2E tests.
 *
 * The server is started by each test fixture via `startServer()` using a
 * temp workspace dir, so no global webServer is configured here.
 * Tests bind to 127.0.0.1 on a random free port via PORT env var.
 */
export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  timeout: 30_000,
  retries: 0,
  workers: 1, // serial — each test owns one server process
  use: {
    headless: true,
    baseURL: "http://127.0.0.1:3099",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
