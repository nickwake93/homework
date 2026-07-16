import { test, expect } from "../support/fixtures";

test.describe("Homepage", () => {
  test("renders header, carousel, and about section", async ({ home }) => {
    await home.checkBaseElements();
  });

  test("carousel next/prev controls advance the active slide", async ({ home }) => {
    const firstIndex = await home.getCarouselIndex();
    await home.carouselNextButton.click();
    await expect
      .poll(async () => Number(await home.getCarouselIndex()))
      .toBeGreaterThan(Number(firstIndex));

    const secondIndex = await home.getCarouselIndex();
    await home.carouselPrevButton.click();
    await expect
      .poll(async () => Number(await home.getCarouselIndex()))
      .toBeLessThan(Number(secondIndex));
  });

  test("pagination dots jump to a specific slide", async ({ home }) => {
    await home.carouselDots.nth(2).click();
    await expect(home.carouselDots.nth(2)).toHaveAttribute("data-active", "true");
  });

  test("CTA buttons navigate to the correct routes", async ({ home, page }) => {
    await home.ctaViewGallery.click();
    await expect(page).toHaveURL(/\/gallery$/);
    await page.goBack();
    await home.ctaGetInTouch.click();
    await expect(page).toHaveURL(/\/contact$/);
  });
});
