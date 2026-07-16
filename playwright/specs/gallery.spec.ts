import { test, expect } from "../support/fixtures";

test.describe("Gallery", () => {
  test("renders gallery container, filters, and cards", async ({ gallery }) => {
    await expect(gallery.heading).toBeVisible();
    await expect(gallery.filters).toBeVisible();
    await expect(gallery.container).toBeVisible();
    await expect(gallery.cards.first()).toBeVisible();
    expect(await gallery.cards.count()).toBeGreaterThan(0);
  });

  test("category filter narrows the visible cards", async ({ gallery }) => {
    await gallery.filterByCategory("forests").click();
    await expect(gallery.filterByCategory("forests")).toHaveAttribute("data-active", "true");

    const count = await gallery.cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(gallery.cards.nth(i)).toHaveAttribute("data-category", "Forests");
    }
  });

  test("clicking a card opens the lightbox; close button dismisses it", async ({ gallery }) => {
    await gallery.cards.first().click();

    await expect(gallery.lightbox).toBeVisible();
    await expect(gallery.lightbox).toHaveAttribute("role", "dialog");
    await expect(gallery.lightbox).toHaveAttribute("aria-modal", "true");
    await expect(gallery.lightboxImage).toBeVisible();
    await expect(gallery.lightboxTitle).toBeVisible();

    await gallery.lightboxCloseButton.click();
    await expect(gallery.lightbox).toHaveCount(0);
  });

  test("Escape key closes the lightbox", async ({ gallery, page }) => {
    await gallery.cards.first().click();
    await expect(gallery.lightbox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(gallery.lightbox).toHaveCount(0);
  });
});
