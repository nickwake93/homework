import type { Page } from "@playwright/test";
import { BasePage } from "../support/base";

export class NewPage extends BasePage {
  constructor(page: Page) {
    super(page, "/your-path");
    // locators...
  }
}
