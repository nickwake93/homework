import { test, expect } from "../support/fixtures";

test.describe("Gallery", () => {
  test("renders gallery heading, filters, and cards", { tag: "@smoke" }, async ({ gallery }) => {
    await expect(gallery.heading).toBeVisible();
    await expect(gallery.filters).toBeVisible();
    await expect(gallery.filterByCategory("All")).toHaveAttribute("aria-selected", "true");
    await expect(gallery.cards.first()).toBeVisible();
  });

  test("category filter narrows the visible cards", { tag: "@smoke" }, async ({ gallery }) => {
    const total = await gallery.cards.count();
    await gallery.filterByCategory("Landscapes").click();
    await expect(gallery.filterByCategory("Landscapes")).toHaveAttribute("aria-selected", "true");
    await expect(gallery.filterByCategory("All")).toHaveAttribute("aria-selected", "false");

    const count = await gallery.cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(total);
    // Category is exposed only as a data attribute on each card.
    for (const card of await gallery.cards.all()) {
      await expect(card).toHaveAttribute("data-category", "Landscapes");
    }
  });

  test(
    "clicking a card opens that image in the lightbox; close dismisses it",
    { tag: "@smoke" },
    async ({ gallery }) => {
      const card = gallery.cards.first();
      const title = (await card.getAttribute("aria-label"))!.replace(/^Open /, "");
      await card.click();

      await expect(gallery.lightbox).toBeVisible();
      await expect(gallery.lightbox).toHaveAttribute("aria-modal", "true");
      await expect(gallery.lightbox).toHaveAccessibleName(title);
      await expect(gallery.lightboxImage).toHaveAccessibleName(title);

      await gallery.lightboxCloseButton.click();
      await expect(gallery.lightbox).toBeHidden();
    },
  );

  test("Escape key closes the lightbox", async ({ gallery, page }) => {
    await gallery.cards.first().click();
    await expect(gallery.lightbox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(gallery.lightbox).toBeHidden();
  });
});
