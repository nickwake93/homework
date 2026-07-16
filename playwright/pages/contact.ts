import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../support/base";

export class ContactPage extends BasePage {
  readonly heading = this.page.getByTestId("contact-heading");
  readonly phoneLink = this.page.getByTestId("contact-phone-link");
  readonly emailLink = this.page.getByTestId("contact-email-link");
  readonly linkedInLink = this.page.getByTestId("contact-linkedin-link");

  readonly newsletterNameInput = this.page.getByTestId("newsletter-name-input");
  readonly newsletterEmailInput = this.page.getByTestId("newsletter-email-input");
  readonly newsletterSubmitButton = this.page.getByTestId("newsletter-submit-button");
  readonly newsletterNameError = this.page.getByTestId("newsletter-name-error");
  readonly newsletterEmailError = this.page.getByTestId("newsletter-email-error");
  readonly newsletterStatus = this.page.getByTestId("newsletter-status");

  readonly reviewNameInput = this.page.getByTestId("review-name-input");
  readonly reviewTextInput = this.page.getByTestId("review-text-input");
  readonly submitReviewButton = this.page.getByTestId("submit-review-button");
  readonly reviewNameError = this.page.getByTestId("review-name-error");
  readonly reviewRatingError = this.page.getByTestId("review-rating-error");
  readonly reviewTextError = this.page.getByTestId("review-text-error");
  readonly reviewRatingStars = this.page.getByTestId("review-rating-stars");
  readonly reviewRatingValue = this.page.getByTestId("review-rating-value");
  readonly reviewSuccess = this.page.getByTestId("review-success");
  readonly reviewItems = this.page.getByTestId("review-item");

  constructor(page: Page) {
    super(page, "/contact");
  }

  async goto() {
    await super.goto();
    await this.heading.waitFor();
  }

  ratingStar(n: number): Locator {
    return this.page.getByTestId(`review-rating-star-${n}`);
  }
}
