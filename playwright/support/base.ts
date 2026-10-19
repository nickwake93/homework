import { expect, type Page } from "@playwright/test";

export abstract class BasePage {
  constructor(
    readonly page: Page,
    private readonly path: string,
  ) {}

  /**
   * Navigate and wait until React has hydrated. The app is server-rendered, so
   * elements are visible before their event handlers are attached; clicking
   * earlier triggers native form submits or no-ops. The app sets
   * `<html data-hydrated="true">` once hydration completes.
   */
  async goto() {
    await this.page.goto(this.path);
    await expect(this.page.locator("html")).toHaveAttribute("data-hydrated", "true");
  }
}

export { test, request } from "@playwright/test";
export type {
  Browser,
  FileChooser,
  Page,
  Locator,
  FrameLocator,
  APIRequestContext,
} from "@playwright/test";
