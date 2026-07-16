# Nature Frames — Photography Portfolio (QA-Ready)

A modern, responsive photography portfolio for a recreational nature photographer,
built with **TanStack Start + React + TypeScript + Tailwind CSS v4**. Designed
end-to-end for **Playwright / Selenium** automation: every interactive element
has a stable `id`, a `data-testid`, and an accessible label.

## Routes

| Route       | Description                                       |
|-------------|---------------------------------------------------|
| `/`         | Hero carousel + About section with CTAs           |
| `/gallery`  | Filterable masonry gallery with lightbox          |
| `/contact`  | Contact info, newsletter signup, reviews          |

## API Endpoints (mock)

| Method | Path                  | Purpose                                        |
|--------|-----------------------|------------------------------------------------|
| POST   | `/api/newsletter`     | Subscribe + log a "sent" welcome email         |
| GET    | `/api/test/emails`    | Returns all sent emails (for QA verification)  |
| DELETE | `/api/test/emails`    | Clears the in-memory mock email store          |

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

## Running the Playwright smoke tests

```bash
bunx playwright install chromium   # one-time
bun run dev                        # start the app (http://localhost:8080)
bunx playwright test               # in another terminal

# or against a deployed preview:
PLAYWRIGHT_BASE_URL=https://your-preview.lovable.app bunx playwright test
```

Specs live in `tests/` and cover:

- `home.spec.ts` — header, carousel controls + pagination, CTA navigation
- `gallery.spec.ts` — grid, category filtering, lightbox open/close (click + Escape)
- `contact.spec.ts` — contact link `href`s, newsletter validation + success
  (verified against `GET /api/test/emails`), star rating, review submission
