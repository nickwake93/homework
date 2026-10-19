import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../support/base";

export class HomePage extends BasePage {
  readonly siteHeader = this.page.getByRole("banner");
  readonly primaryNav = this.page.getByRole("navigation", { name: "Primary" });

  readonly carousel = this.page.getByRole("region", { name: "Featured photography" });
  // Inactive slides are aria-hidden, so only the visible slide is in the accessibility tree.
  readonly activeSlide = this.carousel.getByRole("article");
  readonly carouselNextButton = this.carousel.getByRole("button", { name: "Next slide" });
  readonly carouselPrevButton = this.carousel.getByRole("button", { name: "Previous slide" });
  readonly carouselPagination = this.carousel.getByRole("tablist", { name: "Slide pagination" });

  // The about section has no stable accessible name of its own (it's labelled by the bio heading).
  readonly aboutSection = this.page.getByTestId("about-section");
  readonly aboutHeading = this.aboutSection.getByRole("heading", { level: 2 });
  readonly ctaViewGallery = this.page.getByRole("link", { name: "View Gallery" });
  readonly ctaGetInTouch = this.page.getByRole("link", { name: "Get In Touch" });

  constructor(page: Page) {
    super(page, "/");
  }

  slideTab(n: number): Locator {
    return this.carouselPagination.getByRole("tab", { name: `Go to slide ${n}`, exact: true });
  }

  /** Assert slide `n` (1-based) is the one showing, via both the slide and its pagination tab. */
  async expectActiveSlide(n: number) {
    await expect(this.activeSlide).toHaveAccessibleName(new RegExp(`^${n} of \\d+:`));
    await expect(this.slideTab(n)).toHaveAttribute("aria-selected", "true");
  }

  async checkBaseElements() {
    await expect(this.siteHeader).toBeVisible();
    await expect(this.primaryNav).toBeVisible();
    await expect(this.carousel).toBeVisible();
    await expect(this.aboutHeading).toBeVisible();
    await expect(this.ctaViewGallery).toBeVisible();
    await expect(this.ctaGetInTouch).toBeVisible();
  }
}
