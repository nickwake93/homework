# Nature Frames — Photography Portfolio (QA-Ready)

[![CI](https://github.com/nickwake93/homework/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/nickwake93/homework/actions/workflows/ci.yml)
[![Playwright report](https://img.shields.io/badge/Playwright-latest%20report-2EAD33?logo=playwright)](https://nickwake93.github.io/homework/)

A modern, responsive photography portfolio for a recreational nature photographer,
built with **TanStack Start + React + TypeScript + Tailwind CSS v4**. Designed
end-to-end for **Playwright / Selenium** automation: every interactive element
has a stable `id`, a `data-testid`, and an accessible label.

## Routes

| Route      | Description                              |
| ---------- | ---------------------------------------- |
| `/`        | Hero carousel + About section with CTAs  |
| `/gallery` | Filterable masonry gallery with lightbox |
| `/contact` | Contact info, newsletter signup, reviews |

## API Endpoints (mock)

| Method | Path               | Purpose                                       |
| ------ | ------------------ | --------------------------------------------- |
| POST   | `/api/newsletter`  | Subscribe + log a "sent" welcome email        |
| GET    | `/api/test/emails` | Returns all sent emails (for QA verification) |
| DELETE | `/api/test/emails` | Clears the in-memory mock email store         |

## Configuring images

All gallery and hero images are defined in **`src/lib/gallery-data.ts`**.
Drop your files into `public/images/gallery/` (or `public/images/hero/`) and
update the `imageUrl` field — no other changes required.

```ts
{ id: "forest-001", title: "Morning Mist", category: "Forests",
  imageUrl: "/images/gallery/forest-001.jpg" }
```

## QA selector conventions

- IDs are kebab-case and stable: `homepage-carousel`, `submit-review-button`,
  `newsletter-email-input`, `gallery-filter-forests`, `lightbox-close-button`.
- Every form field exposes both an `id` and a matching `data-testid`.
- Validation errors render with `role="alert"` and a stable id
  (e.g. `newsletter-email-error`).
- Status regions use `role="status"` + `aria-live="polite"` and a
  `data-status` attribute (`idle | loading | success | error`).
- The carousel exposes `data-active`, `data-slide-index`, and `data-index`
  for deterministic targeting.

## Extras included

- Dark / light mode toggle with `localStorage` persistence
- Toast notifications (Sonner)
- Skip-to-content link, semantic landmarks, full keyboard navigation
- Smooth scrolling, lazy-loaded images, restrained transitions

## Setup

```bash
npm install
cd playwright && npm install && cd ..
```

## Running the Playwright tests

```bash
cd playwright
npx playwright install chromium   # one-time
npm test                          # builds the app, serves it on :4173, runs headless

# or via the interactive UI:
npm run test:ui

# or against an app that's already running (e.g. `npm run dev` on :8080, or a deployment):
PLAYWRIGHT_BASE_URL=http://localhost:8080/ npm test
```

CI runs on every push and pull request (`.github/workflows/ci.yml`): app typecheck,
test lint/typecheck/format, then the full suite against a production build. The
HTML report is uploaded as an artifact, and the latest `main` report is published
to GitHub Pages.

Specs live in `playwright/specs/` and cover:

- `home.spec.ts` — header, carousel controls + pagination, CTA navigation
- `gallery.spec.ts` — grid, category filtering, lightbox open/close (click + Escape)
- `contact.spec.ts` — contact link `href`s, newsletter validation + success
  (verified against `GET /api/test/emails`), star rating, review submission
