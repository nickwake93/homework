import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../support/base";

export class GalleryPage extends BasePage {
  readonly heading = this.page.getByRole("heading", { level: 1, name: "Gallery" });
  readonly filters = this.page.getByRole("tablist", { name: "Filter by category" });
  // The grid is a plain container with no landmark role.
  readonly container = this.page.getByTestId("gallery-container");
  readonly cards = this.container.getByRole("button", { name: /^Open / });

  readonly lightbox = this.page.getByRole("dialog");
  readonly lightboxImage = this.lightbox.getByRole("img");
  readonly lightboxCloseButton = this.lightbox.getByRole("button", { name: "Close image viewer" });

  constructor(page: Page) {
    super(page, "/gallery");
  }

  filterByCategory(category: string): Locator {
    return this.filters.getByRole("tab", { name: category, exact: true });
  }
}
