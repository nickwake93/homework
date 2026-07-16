# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gallery.spec.ts >> Gallery >> category filter narrows the visible cards
- Location: specs/gallery.spec.ts:12:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('gallery-filter-forests')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - navigation "Primary" [ref=e5]:
        - link "NatureFrames" [ref=e6] [cursor=pointer]:
          - /url: /
        - list [ref=e7]:
          - listitem [ref=e8]:
            - link "Home" [ref=e9] [cursor=pointer]:
              - /url: /
          - listitem [ref=e10]:
            - link "Gallery" [ref=e11] [cursor=pointer]:
              - /url: /gallery
          - listitem [ref=e12]:
            - link "Contact" [ref=e13] [cursor=pointer]:
              - /url: /contact
          - listitem [ref=e14]:
            - button "Switch to dark mode" [ref=e15]:
              - img [ref=e16]
    - main [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]:
          - paragraph [ref=e21]: Portfolio
          - heading "Gallery" [level=1] [ref=e22]
        - tablist "Filter by category" [ref=e23]:
          - tab "All" [selected] [ref=e24]
          - tab "Landscapes" [ref=e25]
          - tab "Golf" [ref=e26]
          - tab "Safari" [ref=e27]
          - tab "Skiing" [ref=e28]
        - generic [ref=e29]:
          - button "Open 2018 Ryder Cup" [ref=e30]:
            - generic [ref=e31]:
              - img "2018 Ryder Cup" [ref=e32]
              - generic:
                - paragraph: 2018 Ryder Cup
                - paragraph: Golf
          - button "Open Snowy Firs" [ref=e33]:
            - generic [ref=e34]:
              - img "Snowy Firs" [ref=e35]
              - generic:
                - paragraph: Snowy Firs
                - paragraph: Skiing
          - button "Open Rippling Dunes" [ref=e36]:
            - generic [ref=e37]:
              - img "Rippling Dunes" [ref=e38]
              - generic:
                - paragraph: Rippling Dunes
                - paragraph: Landscapes
          - button "Open Snowy Peaks" [ref=e39]:
            - generic [ref=e40]:
              - img "Snowy Peaks" [ref=e41]
              - generic:
                - paragraph: Snowy Peaks
                - paragraph: Skiing
          - button "Open A Long Walk" [ref=e42]:
            - generic [ref=e43]:
              - img "A Long Walk" [ref=e44]
              - generic:
                - paragraph: A Long Walk
                - paragraph: Landscapes
          - button "Open Breezy Brollies" [ref=e45]:
            - generic [ref=e46]:
              - img "Breezy Brollies" [ref=e47]
              - generic:
                - paragraph: Breezy Brollies
                - paragraph: Landscapes
          - button "Open Grazing Zebras" [ref=e48]:
            - generic [ref=e49]:
              - img "Grazing Zebras" [ref=e50]
              - generic:
                - paragraph: Grazing Zebras
                - paragraph: Safari
          - button "Open Rolling Links" [ref=e51]:
            - generic [ref=e52]:
              - img "Rolling Links" [ref=e53]
              - generic:
                - paragraph: Rolling Links
                - paragraph: Golf
          - button "Open Safe Hands" [ref=e54]:
            - generic [ref=e55]:
              - img "Safe Hands" [ref=e56]
              - generic:
                - paragraph: Safe Hands
                - paragraph: Landscapes
          - button "Open Calming Canoes" [ref=e57]:
            - generic [ref=e58]:
              - img "Calming Canoes" [ref=e59]
              - generic:
                - paragraph: Calming Canoes
                - paragraph: Landscapes
          - button "Open Mighty Manhattan" [ref=e60]:
            - generic [ref=e61]:
              - img "Mighty Manhattan" [ref=e62]
              - generic:
                - paragraph: Mighty Manhattan
                - paragraph: Landscapes
    - contentinfo [ref=e63]:
      - paragraph [ref=e64]: © 2026 Nick Wake — Recreational nature photography. Professional test automation.
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "../support/fixtures";
  2  | 
  3  | test.describe("Gallery", () => {
  4  |   test("renders gallery container, filters, and cards", async ({ gallery }) => {
  5  |     await expect(gallery.heading).toBeVisible();
  6  |     await expect(gallery.filters).toBeVisible();
  7  |     await expect(gallery.container).toBeVisible();
  8  |     await expect(gallery.cards.first()).toBeVisible();
  9  |     expect(await gallery.cards.count()).toBeGreaterThan(0);
  10 |   });
  11 | 
  12 |   test("category filter narrows the visible cards", async ({ gallery }) => {
> 13 |     await gallery.filterByCategory("forests").click();
     |                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  14 |     await expect(gallery.filterByCategory("forests")).toHaveAttribute("data-active", "true");
  15 | 
  16 |     const count = await gallery.cards.count();
  17 |     expect(count).toBeGreaterThan(0);
  18 |     for (let i = 0; i < count; i++) {
  19 |       await expect(gallery.cards.nth(i)).toHaveAttribute("data-category", "Forests");
  20 |     }
  21 |   });
  22 | 
  23 |   test("clicking a card opens the lightbox; close button dismisses it", async ({ gallery }) => {
  24 |     await gallery.cards.first().click();
  25 | 
  26 |     await expect(gallery.lightbox).toBeVisible();
  27 |     await expect(gallery.lightbox).toHaveAttribute("role", "dialog");
  28 |     await expect(gallery.lightbox).toHaveAttribute("aria-modal", "true");
  29 |     await expect(gallery.lightboxImage).toBeVisible();
  30 |     await expect(gallery.lightboxTitle).toBeVisible();
  31 | 
  32 |     await gallery.lightboxCloseButton.click();
  33 |     await expect(gallery.lightbox).toHaveCount(0);
  34 |   });
  35 | 
  36 |   test("Escape key closes the lightbox", async ({ gallery, page }) => {
  37 |     await gallery.cards.first().click();
  38 |     await expect(gallery.lightbox).toBeVisible();
  39 |     await page.keyboard.press("Escape");
  40 |     await expect(gallery.lightbox).toHaveCount(0);
  41 |   });
  42 | });
  43 | 
```