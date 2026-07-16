import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../support/base";

export class GalleryPage extends BasePage {
  readonly heading = this.page.getByTestId("gallery-heading");
  readonly filters = this.page.getByTestId("gallery-filters");
  readonly container = this.page.getByTestId("gallery-container");
  readonly cards = this.page.getByTestId("gallery-card");
  readonly lightbox = this.page.getByTestId("gallery-lightbox");
  readonly lightboxImage = this.page.getByTestId("lightbox-image");
  readonly lightboxTitle = this.page.getByTestId("lightbox-title");
  readonly lightboxCloseButton = this.page.getByTestId("lightbox-close-button");

  constructor(page: Page) {
    super(page, "/gallery");
  }

  filterByCategory(category: string): Locator {
    return this.page.getByTestId(`gallery-filter-${category}`);
  }
}
