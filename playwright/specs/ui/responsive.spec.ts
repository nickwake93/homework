import type { Page } from "@playwright/test";
import { test, expect } from "../../support/fixtures";

async function expectNoHorizontalScroll(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `${path} is wider than the viewport`).toBeLessThanOrEqual(0);
}

// Runs in every project, but matters most in the mobile ones (Pixel 7 and iPhone 15).
test.describe("Responsive layout", () => {
  for (const path of ["/", "/gallery", "/contact"]) {
    test(`${path} has no horizontal scrolling`, async ({ page }) => {
      await expectNoHorizontalScroll(page, path);
    });
  }

  test("every nav item is fully on screen", async ({ home, page }) => {
    const viewport = page.viewportSize()!;
    for (const item of [
      home.nav.logo,
      home.nav.link("Home"),
      home.nav.link("Gallery"),
      home.nav.link("Contact"),
      home.nav.themeToggle,
    ]) {
      const box = (await item.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    }
  });
});

// WCAG 1.4.10 Reflow: content must work at 320 CSS px wide without scrolling sideways.
test.describe("Reflow at 320px", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const path of ["/", "/gallery", "/contact"]) {
    test(`${path} fits a 320px viewport`, async ({ page }) => {
      await expectNoHorizontalScroll(page, path);
    });
  }
});

test.describe("Touch", () => {
  test.skip(({ isMobile }) => !isMobile, "touch-only behaviour");

  test("tapping a gallery card opens the lightbox", async ({ gallery }) => {
    await gallery.cards.first().tap();
    await expect(gallery.lightbox).toBeVisible();

    await gallery.lightboxCloseButton.tap();
    await expect(gallery.lightbox).toBeHidden();
  });

  test("tapping a carousel dot changes slide", async ({ home }) => {
    await home.slideTab(2).tap();
    await home.expectActiveSlide(2);
  });
});
