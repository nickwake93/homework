import { test, expect } from "../support/fixtures";
import { uniqueEmail } from "../support/data";

test.describe("Contact", () => {
  test("renders contact info with correct hrefs", { tag: "@smoke" }, async ({ contact }) => {
    await expect(contact.heading).toBeVisible();
    await expect(contact.phoneLink).toHaveAttribute("href", "tel:+447700900000");
    await expect(contact.emailLink).toHaveAttribute("href", "mailto:nwake@hey.com");
    await expect(contact.linkedInLink).toHaveAttribute("href", /linkedin\.com/);
  });

  test.describe("Newsletter form", () => {
    test("shows validation errors when submitted empty", async ({ contact }) => {
      await contact.newsletterSubmitButton.click();

      await expect(contact.newsletterNameInput).toHaveAttribute("aria-invalid", "true");
      await expect(contact.newsletterNameInput).toHaveAccessibleDescription("Name is required");
      await expect(contact.newsletterEmailInput).toHaveAttribute("aria-invalid", "true");
      await expect(contact.newsletterEmailInput).toHaveAccessibleDescription("Email is required");
    });

    test("rejects an invalid email format", async ({ contact }) => {
      await contact.newsletterNameInput.fill("Test User");
      await contact.newsletterEmailInput.fill("not-an-email");
      await contact.newsletterSubmitButton.click();

      await expect(contact.newsletterNameInput).toHaveAttribute("aria-invalid", "false");
      await expect(contact.newsletterEmailInput).toHaveAttribute("aria-invalid", "true");
      await expect(contact.newsletterEmailInput).toHaveAccessibleDescription(/valid email/i);
      await expect(contact.newsletterStatus).not.toHaveAttribute("data-status", "success");
    });

    test("submits successfully and sends a welcome email", async ({ contact, page }, testInfo) => {
      const email = uniqueEmail(testInfo);
      await contact.newsletterNameInput.fill("Ada Lovelace");
      await contact.newsletterEmailInput.fill(email);
      await contact.newsletterSubmitButton.click();

      await expect(contact.newsletterStatus).toContainText(/thank you/i);
      await expect(contact.newsletterStatus).toHaveAttribute("data-status", "success");

      const res = await page.request.get("/api/test/emails");
      expect(res.ok()).toBeTruthy();
      const { emails } = await res.json();
      expect(emails).toContainEqual(expect.objectContaining({ to: email, name: "Ada Lovelace" }));
    });
  });

  test.describe("Reviews", () => {
    test("shows validation errors when submitted empty", async ({ contact }) => {
      await contact.submitReviewButton.click();

      await expect(contact.reviewNameInput).toHaveAccessibleDescription("Name is required");
      await expect(contact.reviewRatingError).toHaveText("Please choose a rating");
      await expect(contact.reviewTextInput).toHaveAccessibleDescription("Review text is required");
    });

    test("selecting a star checks that rating", async ({ contact }) => {
      await contact.ratingStar(4).click();

      await expect(contact.ratingStar(4)).toBeChecked();
      for (const n of [1, 2, 3, 5]) {
        await expect(contact.ratingStar(n)).not.toBeChecked();
      }
    });

    test("submits a review and prepends it to the list", async ({ contact }) => {
      const beforeCount = await contact.reviewItems.count();

      await contact.reviewNameInput.fill("Sam Tester");
      await contact.ratingStar(5).click();
      await contact.reviewTextInput.fill("Beautiful prints, fast turnaround.");
      await contact.submitReviewButton.click();

      await expect(contact.reviewSuccess).toHaveText(/review submitted/i);
      await expect(contact.reviewItems).toHaveCount(beforeCount + 1);

      // Review fields have no semantic roles, so the test IDs are the stable handle.
      const first = contact.reviewItems.first();
      await expect(first.getByTestId("review-name")).toHaveText("Sam Tester");
      await expect(first.getByTestId("review-rating")).toHaveAttribute("data-rating", "5");
      await expect(first.getByTestId("review-text")).toHaveText(
        "Beautiful prints, fast turnaround.",
      );

      // The form resets after a successful submit.
      await expect(contact.reviewNameInput).toBeEmpty();
      await expect(contact.reviewTextInput).toBeEmpty();
    });
  });
});
