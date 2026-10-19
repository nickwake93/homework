import { defineConfig, devices } from "@playwright/test";

// Point at an already-running app (e.g. `npm run dev` on :8080, or a deployed
// URL) with PLAYWRIGHT_BASE_URL. Otherwise Playwright builds the app and serves
// the production bundle itself.
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const PREVIEW_PORT = 4173;

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
  webServer: externalBaseURL
    ? undefined
    : {
        command: `npm run build && npm run preview -- --port ${PREVIEW_PORT} --strictPort`,
        cwd: "..",
        url: `http://localhost:${PREVIEW_PORT}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
