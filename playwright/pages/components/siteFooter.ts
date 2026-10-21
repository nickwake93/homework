import type { Page, Locator } from "@playwright/test";

/** The site footer, present on every page, linking to the project behind the site. */
export class SiteFooter {
  readonly footer: Locator;
  readonly repoLink: Locator;
  readonly reportLink: Locator;

  constructor(readonly page: Page) {
    this.footer = page.getByRole("contentinfo");
    this.repoLink = this.footer.getByRole("link", { name: "See the tests on GitHub" });
    this.reportLink = this.footer.getByRole("link", { name: "Latest test report" });
  }
}
