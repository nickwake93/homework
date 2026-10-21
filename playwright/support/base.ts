import { expect, type Page } from "@playwright/test";
import { SiteFooter } from "../pages/components/siteFooter";
import { SiteNav } from "../pages/components/siteNav";

export abstract class BasePage {
  readonly nav: SiteNav;
  readonly footer: SiteFooter;

  constructor(
    readonly page: Page,
    private readonly path: string,
  ) {
    this.nav = new SiteNav(page);
    this.footer = new SiteFooter(page);
  }

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
