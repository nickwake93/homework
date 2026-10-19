import { test, expect } from "../support/fixtures";

test.describe("Homepage", () => {
  test("renders header, carousel, and about section", { tag: "@smoke" }, async ({ home }) => {
    await home.checkBaseElements();
  });

  // The carousel auto-advances every 5s but pauses while hovered. Clicking a control
  // leaves the pointer over the carousel, so each step below starts from a known slide.
  test("carousel next/prev controls advance the active slide", async ({ home }) => {
    await home.slideTab(1).click();
    await home.expectActiveSlide(1);

    await home.carouselNextButton.click();
    await home.expectActiveSlide(2);

    await home.carouselPrevButton.click();
    await home.expectActiveSlide(1);
  });

  test("previous from the first slide wraps to the last", async ({ home }) => {
    const total = await home.carouselPagination.getByRole("tab").count();
    await home.slideTab(1).click();

    await home.carouselPrevButton.click();
    await home.expectActiveSlide(total);
  });

  test("pagination tabs jump to a specific slide", async ({ home }) => {
    await home.slideTab(3).click();
    await home.expectActiveSlide(3);
  });

  test("CTA buttons navigate to the correct routes", { tag: "@smoke" }, async ({ home, page }) => {
    await home.ctaViewGallery.click();
    await expect(page).toHaveURL(/\/gallery$/);
    await page.goBack();
    await home.ctaGetInTouch.click();
    await expect(page).toHaveURL(/\/contact$/);
  });
});
