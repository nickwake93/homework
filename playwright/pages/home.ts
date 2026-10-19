import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../support/base";

export class HomePage extends BasePage {
  readonly siteHeader = this.page.getByTestId("site-header");
  readonly primaryNav = this.page.getByTestId("primary-nav");
  readonly carousel = this.page.getByTestId("homepage-carousel");
  readonly aboutSection = this.page.getByTestId("about-section");
  readonly aboutHeading = this.page.getByTestId("about-heading");
  readonly ctaViewGallery = this.page.getByTestId("cta-view-gallery");
  readonly ctaGetInTouch = this.page.getByTestId("cta-get-in-touch");
  readonly carouselNextButton = this.page.getByTestId("carousel-next-button");
  readonly carouselPrevButton = this.page.getByTestId("carousel-prev-button");
  readonly carouselDots = this.page.getByTestId("carousel-dot");

  constructor(page: Page) {
    super(page, "/");
  }

  activeSlide(): Locator {
    return this.carousel.locator('[data-testid="carousel-slide"][data-active="true"]');
  }

  async checkBaseElements() {
    await expect(this.siteHeader).toBeVisible();
    await expect(this.primaryNav).toBeVisible();
    await expect(this.carousel).toBeVisible();
    await expect(this.aboutSection).toBeVisible();
    await expect(this.aboutHeading).toBeVisible();
    await expect(this.ctaViewGallery).toBeVisible();
    await expect(this.ctaGetInTouch).toBeVisible();
  }

  async getCarouselIndex(): Promise<string | null> {
    return this.activeSlide().getAttribute("data-slide-index");
  }
}
