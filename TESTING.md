# Testing

How the Nature Frames app is tested, why it's tested that way, and what the tests have found.

- [Strategy](#strategy)
- [Test layers](#test-layers)
- [How the suite is put together](#how-the-suite-is-put-together)
- [Design decisions](#design-decisions)
- [Bugs found](#bugs-found)
- [Reliability](#reliability)
- [Not covered, on purpose](#not-covered-on-purpose)
- [Writing a test](#writing-a-test)
- [Reports and debugging](#reports-and-debugging)

## Strategy

The app is a small server-rendered React site: three pages, two forms, a carousel, a lightbox,
and one public API endpoint. The goals for its test suite:

1. **Every test passes, every time.** A flaky suite gets ignored. New tests are run with
   `--repeat-each=5 --retries=0` before they're merged, and CI retries are a safety net that
   the PR summary reports on, not a way to hide flakiness.
2. **Fix the app, not the test.** When a test fails because the app is wrong, the app gets fixed
   and the test stays strict. Tests only change when they encode the wrong expectation.
3. **Test what users experience.** Locators use roles and labels, validation is asserted the way
   a screen reader announces it, and the suite runs against a production build in three engines
   and on two phone sizes.
4. **Each layer earns its place.** UI tests cover journeys and interaction; API tests cover the
   contract and edge cases far more cheaply than a browser can; accessibility and
   responsive checks cover what functional tests can't see.

## Test layers

| Layer         | Spec                       | Tests | Runs in                      | Covers                                                                                    |
| ------------- | -------------------------- | ----: | ---------------------------- | ----------------------------------------------------------------------------------------- |
| UI            | `ui/home.spec.ts`          |     5 | all 5 browser projects       | Carousel controls, pagination, wraparound, CTAs                                           |
| UI            | `ui/gallery.spec.ts`       |     4 | all 5                        | Filtering, lightbox open/close by click and Escape                                        |
| UI            | `ui/contact.spec.ts`       |     8 | all 5                        | Contact links, newsletter and review forms (validation, success, email sent)              |
| UI            | `ui/navigation.spec.ts`    |     4 | all 5                        | Nav links and `aria-current`, logo, theme toggle and persistence                          |
| Accessibility | `ui/axe.spec.ts`           |    12 | Chromium, desktop and mobile | axe (WCAG 2.2 AA + best practice) on every page and state, in light and dark mode         |
| Accessibility | `ui/accessibility.spec.ts` |     6 | all 5                        | One `h1` per page; lightbox focus management                                              |
| Responsive    | `ui/responsive.spec.ts`    |     7 | all 5                        | No horizontal scrolling, WCAG reflow at 320px, nav fits                                   |
| Responsive    | `ui/touch.spec.ts`         |     2 | phones                       | Tap interactions                                                                          |
| Performance   | `ui/performance.spec.ts`   |     2 | desktop Chromium             | Image weight budget (no image over 1MB)                                                   |
| API           | `api/newsletter.spec.ts`   |    23 | no browser                   | Response contract, email recorded, trimming, length boundaries, 15 invalid requests, 405s |
| API           | `api/test-api*.spec.ts`    |     5 | no browser                   | QA endpoints list and clear emails, and 404 when switched off                             |

That's 34 UI tests run in every browser project, the 16 more specialised ones only where they
mean something, and 28 API tests: **228 test runs** in about 3 minutes in CI, none skipped. Seven critical-path UI tests, and the two checks that the test-only API is off, are tagged
`@smoke` (`npm run test:smoke`).
CI runs them in Chromium first, as a gate: if any fails, the full suite doesn't run, because a
broken critical path would only produce hundreds of failures that say the same thing.

## How the suite is put together

```
playwright/
├── playwright.config.ts   projects, web servers, reporters, trace settings
├── pages/                 page objects (home, gallery, contact) and components/siteNav
├── support/
│   ├── base.ts            BasePage: goto() waits for hydration; every page has .nav
│   ├── fixtures.ts        `home`, `gallery`, `contact` fixtures open their page
│   ├── api.ts             typed helpers for the newsletter and QA endpoints
│   ├── a11y.ts            axe scan with readable failures and the full result attached
│   └── data.ts            uniqueEmail() for collision-free test data
├── specs/ui/              browser tests
├── specs/api/             HTTP-only tests (no browser launched)
└── scripts/               report-summary.mjs: JSON results → CI summary and PR comment
```

### Projects and servers

Playwright builds the app once, as a Cloudflare Worker, and serves it from three local servers
running Cloudflare's runtime (`wrangler dev`), so the tests run against exactly what's deployed.
Each one is a separate process with its own in-memory email store:

| Port | `ENABLE_TEST_API` | Projects                                                                 | Why                                                                   |
| ---- | ----------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 4173 | on                | `chromium`, `firefox`, `webkit`, `mobile-chrome`, `mobile-safari`, `api` | The main suite                                                        |
| 4174 | off               | `api-prod-like`                                                          | Proves the QA endpoints don't exist with production config            |
| 4175 | on                | `api-isolated` (1 worker)                                                | The test that wipes the email store, so it can't affect anything else |

Not every spec belongs in every project. Rather than calling `test.skip`, which still schedules
the test and reports it as skipped, each project leaves out what doesn't apply with `testIgnore`,
so the config shows in one place what runs where:

| Spec                  | chromium | firefox | webkit | mobile-chrome | mobile-safari | Why                                          |
| --------------------- | :------: | :-----: | :----: | :-----------: | :-----------: | -------------------------------------------- |
| other UI specs        |    ✓     |    ✓    |   ✓    |       ✓       |       ✓       | Behaviour can differ by engine and size      |
| `axe.spec.ts`         |    ✓     |         |        |       ✓       |               | axe's rules don't depend on the engine       |
| `performance.spec.ts` |    ✓     |         |        |               |               | Image file sizes don't depend on the browser |
| `touch.spec.ts`       |          |         |        |       ✓       |       ✓       | Desktop projects have no touchscreen         |

A lint rule (`playwright/no-skipped-test`) fails on any `test.skip`, so a skipped test can't
slip into the suite unnoticed.

Mobile projects emulate a Pixel 7 and an iPhone 15. Setting `PLAYWRIGHT_BASE_URL` skips the
web servers and runs against an existing app; the two projects that need their own servers are
dropped automatically. With `PLAYWRIGHT_TARGET=production` as well, as CI sets after each deploy,
`api-prod-like` stays and checks the live site's test API is off.

## Design decisions

**Waiting for hydration, once, in one place.** The app is server-rendered, so content is
visible before React attaches its event handlers, and early clicks were silently lost. The app
sets `<html data-hydrated="true">` once hydration completes, and `BasePage.goto()` waits for
it. No test needs its own wait or timeout.

**Role-first locators.** Page objects use `getByRole` and `getByLabel`, scoped to landmarks
("the Subscribe button in the Newsletter region"). The app has a `data-testid` on everything,
but only five are used, each with a comment explaining why there's no accessible alternative.
`playwright/no-raw-locators` is a lint error, so CSS selectors can't creep back in. A side
effect: if an element loses its accessible name, a functional test fails too.

**Validation asserted as users perceive it.** Form tests check `aria-invalid` and the field's
accessible description (the error linked with `aria-describedby`), not just that some error
text is visible somewhere.

**Isolation without ordering.** No test depends on another, and nothing runs in `serial` mode.
Tests that write data use `uniqueEmail(testInfo)`, which includes the test ID, repeat index and
retry number. The one test that wipes shared state gets its own server rather than relying on
running last.

**Determinism over tolerance.** The carousel autoplays every 5 seconds. Instead of loose checks
like "the index went up", tests start from a known slide and assert the exact slide that should
be showing. Clicking a control leaves the pointer over the carousel, which pauses autoplay.

**Test-only endpoints gated at runtime.** `GET`/`DELETE /api/test/emails` expose and wipe
subscriber emails. They only exist when `ENABLE_TEST_API=true`, read at runtime so the same build
can run with them on in CI and off in production, and a test proves they 404 when off.

**axe in Chromium only.** axe's rules don't depend on the browser engine, so scanning in five
projects would only add time. Desktop and mobile Chromium cover both layouts. Keyboard and
structure tests still run in every project, since focus behaviour does differ between engines.

## Bugs found

Every one of these was fixed in the app, with a test that fails against the old code.

| Area          | Bug                                                                                                               | Fix                                                            | PR                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------ |
| Reliability   | **Hydration race**: clicks before React hydrated did nothing, or natively submitted forms. 27 of 75 runs failed.  | Hydration marker in the app; `goto()` waits for it             | [#2](../../pull/2) |
| Tooling       | App lint config imported a plugin the app doesn't have, so **app code had never been linted**                     | Proper React/TS config; lint, typecheck and format gated in CI | [#4](../../pull/4) |
| Content       | **Phone link dialled a placeholder number** that didn't match the one displayed; LinkedIn used a mobile-only path | Links match what's shown; test asserts text and `href` agree   | [#5](../../pull/5) |
| API           | JSON `null` body: **500** with an HTML error page                                                                 | 400 JSON error                                                 | [#6](../../pull/6) |
| API           | Non-string `name`/`email`: **500**                                                                                | 400 JSON error                                                 | [#6](../../pull/6) |
| API           | `GET`/`PUT`/`PATCH`/`DELETE` returned **200** and an empty page                                                   | 405 with `Allow: POST`                                         | [#6](../../pull/6) |
| Security      | Test endpoints exposing every subscriber email would ship to production                                           | Runtime `ENABLE_TEST_API` flag; 404 when off                   | [#6](../../pull/6) |
| Accessibility | Accent colour contrast 3.64:1 (needs 4.5:1)                                                                       | Darker accent, 4.67:1                                          | [#7](../../pull/7) |
| Accessibility | Carousel dots were 8px touch targets (needs 24px)                                                                 | 24px hit area around each dot                                  | [#7](../../pull/7) |
| Accessibility | `aria-label` on an element with no role                                                                           | `role="img"`                                                   | [#7](../../pull/7) |
| Accessibility | Star-rating error not linked to its control                                                                       | `aria-describedby` and `aria-invalid`                          | [#7](../../pull/7) |
| Accessibility | One `h1` per carousel slide                                                                                       | Slide titles are `h2`; one `h1` per page                       | [#7](../../pull/7) |
| Accessibility | **Lightbox had no focus management**: focus stayed behind the modal and Tab escaped it                            | Focus moves in, is trapped, and returns to the opening card    | [#7](../../pull/7) |
| Mobile        | **Nav overflowed on most phones** (needed 405px; iPhone 15 is 393px), so every page scrolled sideways             | Nav stacks on two rows below 640px; fits down to 320px         | [#8](../../pull/8) |
| Performance   | **Gallery downloaded ~37MB**: photos were camera originals, one 10MB                                              | Resized to 2400px, 37MB → 7MB; 1MB budget test                 | [#9](../../pull/9) |
| Privacy       | 12 of 13 photos contained **GPS coordinates**                                                                     | All image metadata stripped                                    | [#9](../../pull/9) |

Two of the original tests were wrong rather than the app: one filtered the gallery by a
placeholder category that no longer existed, and one asserted the placeholder phone number, so it
was effectively protecting a bug. Both were corrected.

Setting up the deploy turned up one more: **the tests had never run against the build that
would be deployed.** Lovable's build config only builds a Cloudflare Worker inside Lovable's own
sandbox; everywhere else it quietly made a Node server instead. The build now always makes the
Worker, and the suite runs it in Cloudflare's local runtime.

## Reliability

New and changed tests are run with `--repeat-each=5 --retries=0` before merging (for example,
315/315 when the accessibility tests landed). Playwright behaviours found along the way, and how
the suite handles them:

- **Malformed request bodies get "fixed".** Given a string that isn't valid JSON and a JSON
  content type, Playwright JSON-encodes it, so a "malformed JSON" test sends valid JSON.
  `support/api.ts` sends raw bodies as a `Buffer`.
- **Project dependencies are excluded from `--repeat-each`.** An early version ran the
  store-wiping test after the other projects via `dependencies`, which quietly stopped those
  projects from being repeated in stress runs. A dedicated server removed the need for ordering.
- **axe measures colours as rendered.** A toast caught mid-fade failed colour contrast about one
  run in three. `scanForViolations()` waits for finite animations and transitions to finish first.
- **`getByRole("img")` isn't only `<img>`.** It also matches elements with `role="img"`, which have
  no `src`. The image budget test filters to real images.

## Not covered, on purpose

| Area                            | Why not (yet)                                                                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual regression               | Screenshot baselines differ between macOS and CI's Linux; doing it properly means generating baselines in Docker. On the roadmap.                                           |
| Performance beyond image weight | Lighthouse budgets (LCP, CLS, total weight) are the natural next step. On the roadmap.                                                                                      |
| Component tests                 | The site's About section mentions them; they'd suit `StarRating` and the carousel. On the roadmap.                                                                          |
| Real email delivery             | Emails go to an in-memory store, which proves the app _tried_ to send the right email. A real provider plus a test inbox (e.g. Mailpit) would cover delivery and rendering. |
| axe in Firefox and WebKit       | Same rules, same results; Chromium covers it (see design decisions).                                                                                                        |
| Load and security testing       | Out of scope for a static portfolio with one form endpoint.                                                                                                                 |

## Writing a test

- Use a page fixture (`home`, `gallery`, `contact`): it opens the page and waits for hydration.
  Shared header and nav live on every page object as `.nav`.
- Add locators to the page object, not the spec. Prefer `getByRole`/`getByLabel` scoped to a
  landmark; a `data-testid` needs a comment saying why there's nothing better.
- Generate data with `uniqueEmail(testInfo)` rather than fixed values, so tests can run in
  parallel and be retried.
- Use web-first assertions (`await expect(locator).toBe…`), never fixed waits.
- Tag critical-path tests `@smoke`.
- Before opening a PR: `npm run lint`, `npm run typecheck`, `npm run format:check`, and
  `npx playwright test <your spec> --repeat-each=5 --retries=0`.

## Reports and debugging

- **Every CI run** publishes its HTML report to GitHub Pages (`main/` and `pr/<number>/`),
  indexed at [nickwake93.github.io/nature-frames-qa](https://nickwake93.github.io/nature-frames-qa/).
- **The run page and a PR comment** summarise results per project, with failures and flaky tests
  listed alongside the first line of each error.
- **Traces** are kept for every failed attempt, so a failure can be stepped through in the hosted
  report. To trace passing tests too, run the CI workflow manually with "Record a trace for every
  test", or set `PW_TRACE=on` locally.
- **Locally:** `npm run test:ui` for Playwright's UI mode, `npx playwright show-report` after a
  run.
