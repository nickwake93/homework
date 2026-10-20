import { test, expect } from "../../support/fixtures";

// Checks that depend on how each engine handles the DOM and focus, so they run in every
// project. The axe scans are in axe.spec.ts.
test.describe("Document structure", () => {
  for (const path of ["/", "/gallery", "/contact"]) {
    test(`${path} has exactly one h1`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      // Hidden headings (e.g. inactive carousel slides) still count for SEO and the DOM outline.
      await expect(page.getByRole("heading", { level: 1, includeHidden: true })).toHaveCount(1);
    });
  }
});

test.describe("Lightbox keyboard support", () => {
  test("opening moves focus into the dialog and Tab can't leave it", async ({ gallery, page }) => {
    await gallery.cards.first().focus();
    await page.keyboard.press("Enter");

    await expect(gallery.lightbox).toBeVisible();
    await expect(gallery.lightboxCloseButton).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(gallery.lightboxCloseButton).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(gallery.lightboxCloseButton).toBeFocused();
  });

  test("closing with Escape returns focus to the card that opened it", async ({
    gallery,
    page,
  }) => {
    const card = gallery.cards.nth(1);
    await card.focus();
    await page.keyboard.press("Enter");
    await expect(gallery.lightbox).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(gallery.lightbox).toBeHidden();
    await expect(card).toBeFocused();
  });

  test("closing with the button returns focus to the clicked card", async ({ gallery }) => {
    const card = gallery.cards.nth(2);
    await card.click();
    await gallery.lightboxCloseButton.click();

    await expect(gallery.lightbox).toBeHidden();
    await expect(card).toBeFocused();
  });
});
