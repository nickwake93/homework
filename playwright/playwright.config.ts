import { defineConfig, devices } from "@playwright/test";

// Point at an already-running app (e.g. `npm run dev:qa` on :8080, or a deployed
// URL) with PLAYWRIGHT_BASE_URL. Otherwise Playwright builds the app and serves
// the production bundle itself.
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const PREVIEW_PORT = 4173;
// Extra servers from the same build. Each preview process has its own in-memory email
// store, so tests that need a different config or that wipe state get a server to themselves.
const PROD_LIKE_PORT = 4174; // test API off, as in production
const ISOLATED_PORT = 4175; // test API on, for tests that clear the shared email store

const UI_SPECS = /specs\/ui\/.*\.spec\.ts/;

export default defineConfig({
  testDir: "./specs",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }], ["github"]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PREVIEW_PORT}/`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Started in order, so the second server reuses the first one's build.
  webServer: externalBaseURL
    ? undefined
    : [
        {
          command: `npm run build && npm run preview -- --port ${PREVIEW_PORT} --strictPort`,
          cwd: "..",
          url: `http://localhost:${PREVIEW_PORT}/`,
          env: { ENABLE_TEST_API: "true" },
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
        {
          command: `npm run preview -- --port ${PROD_LIKE_PORT} --strictPort`,
          cwd: "..",
          url: `http://localhost:${PROD_LIKE_PORT}/`,
          env: { ENABLE_TEST_API: "false" },
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
        {
          command: `npm run preview -- --port ${ISOLATED_PORT} --strictPort`,
          cwd: "..",
          url: `http://localhost:${ISOLATED_PORT}/`,
          env: { ENABLE_TEST_API: "true" },
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      ],
  projects: [
    {
      name: "chromium",
      testMatch: UI_SPECS,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // HTTP-only: these specs use the `request` fixture, so no browser is launched.
      name: "api",
      testMatch: /specs\/api\/.*\.spec\.ts/,
      testIgnore: /test-api-(reset|disabled)\.spec\.ts/,
    },
    // These need servers Playwright starts itself, so they're skipped against an external URL.
    ...(externalBaseURL
      ? []
      : [
          {
            name: "api-prod-like",
            testMatch: /specs\/api\/test-api-disabled\.spec\.ts/,
            use: { baseURL: `http://localhost:${PROD_LIKE_PORT}/` },
          },
          {
            name: "api-isolated",
            testMatch: /specs\/api\/test-api-reset\.spec\.ts/,
            use: { baseURL: `http://localhost:${ISOLATED_PORT}/` },
            // One at a time: these tests wipe the store this server's other tests rely on.
            workers: 1,
          },
        ]),
  ],
});
