import { test, expect } from "../../support/fixtures";

// Runs in the phone projects only, as desktop projects have no touchscreen.
test.describe("Touch", () => {
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
