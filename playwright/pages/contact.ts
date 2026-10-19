import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../support/base";

export class ContactPage extends BasePage {
  readonly heading = this.page.getByRole("heading", { level: 1, name: "Let's talk" });

  readonly contactInfo = this.page.getByRole("region", { name: "Contact information" });
  readonly phoneLink = this.contactInfo.getByRole("link", { name: /^Phone/ });
  readonly emailLink = this.contactInfo.getByRole("link", { name: /^Email/ });
  readonly linkedInLink = this.contactInfo.getByRole("link", { name: /^LinkedIn/ });

  readonly newsletter = this.page.getByRole("region", { name: "Newsletter" });
  readonly newsletterNameInput = this.newsletter.getByLabel("Name", { exact: true });
  readonly newsletterEmailInput = this.newsletter.getByLabel("Email", { exact: true });
  readonly newsletterSubmitButton = this.newsletter.getByRole("button", { name: "Subscribe" });
  readonly newsletterStatus = this.newsletter.getByRole("status");

  readonly reviews = this.page.getByRole("region", { name: "Reviews" });
  readonly reviewNameInput = this.reviews.getByLabel("Your name");
  readonly reviewTextInput = this.reviews.getByLabel("Your review");
  readonly reviewRating = this.reviews.getByRole("radiogroup", { name: "Star rating" });
  // Not linked to the radiogroup via aria-describedby, so it can only be found by its text.
  readonly reviewRatingError = this.reviews.getByRole("alert").filter({ hasText: "rating" });
  readonly submitReviewButton = this.reviews.getByRole("button", { name: "Submit review" });
  readonly reviewSuccess = this.reviews.getByRole("status");
  readonly reviewItems = this.reviews.getByRole("listitem");

  constructor(page: Page) {
    super(page, "/contact");
  }

  ratingStar(n: number): Locator {
    return this.reviewRating.getByRole("radio", { name: n === 1 ? "1 star" : `${n} stars` });
  }
}
