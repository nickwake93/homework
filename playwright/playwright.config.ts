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
// UI specs that only belong in some projects. Projects leave them out with testIgnore, rather
// than the specs calling test.skip, so nothing is scheduled just to be skipped.
const AXE = /specs\/ui\/axe\.spec\.ts/; // axe's rules don't depend on the engine: Chromium only
const IMAGE_BUDGET = /specs\/ui\/performance\.spec\.ts/; // file sizes: desktop Chromium only
const TOUCH = /specs\/ui\/touch\.spec\.ts/; // phones only

// Keep a trace for every failed attempt. PW_TRACE=on records every test (CI's manual
// "Run workflow" exposes this), at the cost of a much larger report.
const trace = process.env.PW_TRACE === "on" ? "on" : "retain-on-failure";

// CI builds the app in its own step and runs Playwright twice (smoke, then everything), so it
// sets PW_PREBUILT to skip rebuilding for each run.
const build = process.env.PW_PREBUILT ? "" : "npm run build && ";

export default defineConfig({
  testDir: "./specs",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [
        ["list"],
        ["html", { open: "never" }],
        ["github"],
        // Read by scripts/report-summary.mjs to write the CI job summary.
        ["json", { outputFile: "test-results/results.json" }],
      ]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PREVIEW_PORT}/`,
    trace,
    screenshot: "only-on-failure",
  },
  // Started in order, so the second server reuses the first one's build.
  webServer: externalBaseURL
    ? undefined
    : [
        {
          command: `${build}npm run preview -- --port ${PREVIEW_PORT} --strictPort`,
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
      testIgnore: [TOUCH],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: UI_SPECS,
      testIgnore: [AXE, IMAGE_BUDGET, TOUCH],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testMatch: UI_SPECS,
      testIgnore: [AXE, IMAGE_BUDGET, TOUCH],
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      testMatch: UI_SPECS,
      testIgnore: [IMAGE_BUDGET],
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      testMatch: UI_SPECS,
      testIgnore: [AXE, IMAGE_BUDGET],
      use: { ...devices["iPhone 15"] },
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
