# Nature Frames: a test engineering portfolio

[![CI](https://github.com/nickwake93/nature-frames-qa/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/nickwake93/nature-frames-qa/actions/workflows/ci.yml)
[![Playwright report](https://img.shields.io/badge/Playwright-latest%20report-2EAD33?logo=playwright)](https://nickwake93.github.io/nature-frames-qa/main/)

This repo shows how I approach test engineering. It contains a small photography portfolio
site, which is the system under test, and the Playwright framework that tests it: UI, API,
accessibility, responsive and performance checks, run across three browser engines and two
phone sizes in CI.

**The tests have found 16 real issues, all now fixed**, from a hydration race that made a third
of test runs fail, to an API that crashed on a `null` body, a lightbox that let keyboard focus
escape behind it, and photos that leaked GPS coordinates. They're all listed in
[TESTING.md](TESTING.md#bugs-found).

## How it was built

I'm open about this, because how a project was made matters when you're judging it:

- **The app was generated with [Lovable](https://lovable.dev)**, an AI app builder. That makes
  it a realistic target: it looked finished, but it had bugs.
- **The test strategy and framework are mine.** I designed the page object and fixture
  structure, and made the testing decisions: what to cover, how to keep tests isolated, which
  bugs to fix in the app rather than the test, and what to leave out. Those decisions are
  documented in [TESTING.md](TESTING.md).
- **I used [Claude Code](https://claude.com/claude-code) as a pair programmer** to implement
  much of the suite. Every change went through a pull request that I reviewed and merged, so the
  [PR history](../../pulls?q=is%3Apr) shows each step and the reasoning behind it.

## At a glance

|              |                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| **Tests**    | 50 UI tests × 5 browser projects, plus 28 API tests: 278 runs in about 3 minutes                        |
| **Browsers** | Chromium, Firefox, WebKit; Pixel 7 and iPhone 15 emulation                                              |
| **Layers**   | UI journeys, API contract and edge cases, axe (WCAG 2.2 AA), responsive and reflow, image weight budget |
| **CI**       | Lint, typecheck and format for app and tests, then the full suite against a production build            |
| **Reports**  | Every run's HTML report hosted on GitHub Pages, with traces for failures and a summary on each PR       |

## Quick start

Needs Node 24 or later.

```bash
npm install
cd playwright
npm install
npx playwright install   # one-time: Chromium, Firefox and WebKit
npm test                 # builds the app, serves it, runs everything headless
```

Other ways to run:

```bash
npm run test:ui          # Playwright UI mode
npm run test:smoke       # the 7 @smoke critical-path tests
npx playwright test --project webkit specs/ui/gallery.spec.ts

# Against an app that's already running, e.g. `npm run dev:qa` from the repo root (port 8080):
PLAYWRIGHT_BASE_URL=http://localhost:8080/ npm test
```

`npm run dev` runs the app on its own; `npm run dev:qa` also turns on the test-only API that the
tests use.

## CI and reports

CI (`.github/workflows/ci.yml`) runs on every push to `main`, every pull request, and on demand.

- **Reports:** each run's HTML report is published to GitHub Pages: `main/` for `main`,
  `pr/<number>/` for pull requests, all listed at
  [nickwake93.github.io/nature-frames-qa](https://nickwake93.github.io/nature-frames-qa/). PR
  reports are deleted when the PR closes.
- **Summaries:** the run page and a comment on each PR show results per browser, with failed and
  flaky tests listed. The comment updates on every push.
- **Traces:** kept for every failed attempt. To trace every test, run the workflow manually
  (Actions → CI → Run workflow) and tick "Record a trace for every test", or set `PW_TRACE=on`
  locally.

## Repository layout

```
src/                  the app (TanStack Start, React, TypeScript, Tailwind CSS)
public/images/        photos (resized, metadata stripped)
playwright/
├── pages/            page objects
├── support/          fixtures, base page, API and axe helpers, test data
├── specs/ui/         browser tests
├── specs/api/        HTTP-only tests
└── scripts/          CI summary generator
.github/
├── workflows/        CI, and PR report cleanup
└── scripts/          publishes reports to GitHub Pages
TESTING.md            test strategy, design decisions, bugs found
```

## The app

A portfolio site for a recreational photographer, built with **TanStack Start**, **React**,
**TypeScript** and **Tailwind CSS**, and server-rendered.

| Route      | What's there                                                            |
| ---------- | ----------------------------------------------------------------------- |
| `/`        | Hero carousel, about section with links to the gallery and contact page |
| `/gallery` | Photos filterable by category, with a full-screen lightbox              |
| `/contact` | Contact details, newsletter signup, reviews                             |

| Method   | Path               | Purpose                                                             |
| -------- | ------------------ | ------------------------------------------------------------------- |
| `POST`   | `/api/newsletter`  | Subscribe and "send" a welcome email (recorded in memory, not sent) |
| `GET`    | `/api/test/emails` | Test-only: list the emails sent                                     |
| `DELETE` | `/api/test/emails` | Test-only: clear them                                               |

The test-only endpoints expose subscriber emails, so they only exist when
`ENABLE_TEST_API=true`. Without it they return 404, as they will in production.

Photos and their categories are defined in `src/lib/gallery-data.ts`, with the files in
`public/images/`. Keep new photos under 1MB (a 2400px long edge is plenty); the image budget
test fails otherwise.

## Roadmap

- [ ] **Deploy to Cloudflare** (the app is already configured for it via `wrangler.jsonc`), add a
      live link here, and run the `@smoke` tests against the deployment after each release
- [ ] **Visual regression** tests, with baselines generated in Docker so they match CI
- [ ] **Lighthouse performance budgets** (LCP, CLS, total page weight)
- [ ] **Component tests** for `StarRating` and the carousel
- [ ] **Tidier reports**: every UI test currently appears once per browser; group by project, or
      publish UI and API reports separately
