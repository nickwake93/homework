import type { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(
    readonly page: Page,
    private readonly path: string,
  ) {}

  async goto() {
    await this.page.goto(this.path);
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
