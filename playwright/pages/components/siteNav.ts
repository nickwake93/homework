import type { Page, Locator } from "@playwright/test";

/** The site header and primary navigation, present on every page. */
export class SiteNav {
  readonly header: Locator;
  readonly nav: Locator;
  readonly logo: Locator;
  readonly themeToggle: Locator;

  constructor(readonly page: Page) {
    this.header = page.getByRole("banner");
    this.nav = this.header.getByRole("navigation", { name: "Primary" });
    this.logo = this.nav.getByRole("link", { name: "NatureFrames" });
    // The label describes the action, so it flips between "dark" and "light".
    this.themeToggle = this.nav.getByRole("button", { name: /^Switch to (dark|light) mode$/ });
  }

  link(name: "Home" | "Gallery" | "Contact"): Locator {
    return this.nav.getByRole("link", { name, exact: true });
  }
}
