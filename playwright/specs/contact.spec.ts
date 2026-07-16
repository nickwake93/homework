import { test, expect } from "../support/fixtures";

test.describe("Contact", () => {
  test("renders contact info with correct hrefs", async ({ contact }) => {
    await expect(contact.heading).toBeVisible();
    await expect(contact.phoneLink).toHaveAttribute("href", "tel:+447700900000");
    await expect(contact.emailLink).toHaveAttribute("href", "mailto:nwake@hey.com");
    await expect(contact.linkedInLink).toHaveAttribute("href", /linkedin\.com/);
  });

  test.describe("Newsletter form", () => {
    test.describe.configure({ mode: "serial" });

    test("shows validation errors when submitted empty", async ({ contact }) => {
      await contact.newsletterSubmitButton.click();
      await expect(contact.newsletterNameError).toBeVisible();
      await expect(contact.newsletterEmailError).toBeVisible();
    });

    test("rejects an invalid email format", async ({ contact }) => {
      await contact.newsletterNameInput.fill("Test User");
      await contact.newsletterEmailInput.fill("not-an-email");
      await contact.newsletterSubmitButton.click();
      await expect(contact.newsletterEmailError).toBeVisible();
    });

    test("submits successfully and shows the success state", async ({ contact, page }) => {
      const unique = `qa+${Date.now()}@example.com`;
      await contact.newsletterNameInput.fill("Ada Lovelace");
      await contact.newsletterEmailInput.fill(unique);
      await contact.newsletterSubmitButton.click();

      await expect(contact.newsletterStatus).toHaveAttribute("data-status", "success");
      await expect(contact.newsletterStatus).toContainText(/thank you/i);

      const res = await page.request.get("/api/test/emails");
      expect(res.ok()).toBeTruthy();
      const { emails } = await res.json();
      expect(emails.some((e: { to: string }) => e.to === unique)).toBe(true);
    });
  });

  test.describe("Reviews", () => {
    test.describe.configure({ mode: "serial" });

    test("shows validation errors when submitted empty", async ({ contact }) => {
      await contact.submitReviewButton.click();
      await expect(contact.reviewNameError).toBeVisible();
      await expect(contact.reviewRatingError).toBeVisible();
      await expect(contact.reviewTextError).toBeVisible();
    });

    test("star rating updates the hidden value", async ({ contact }) => {
      await contact.ratingStar(4).click();
      await expect(contact.reviewRatingStars).toHaveAttribute("data-value", "4");
      await expect(contact.reviewRatingValue).toHaveValue("4");
    });

    test("submits a review and prepends it to the list", async ({ contact }) => {
      const beforeCount = await contact.reviewItems.count();

      await contact.reviewNameInput.fill("Sam Tester");
      await contact.ratingStar(5).click();
      await contact.reviewTextInput.fill("Beautiful prints, fast turnaround.");
      await contact.submitReviewButton.click();

      await expect(contact.reviewSuccess).toBeVisible();
      await expect(contact.reviewItems).toHaveCount(beforeCount + 1);

      const first = contact.reviewItems.first();
      await expect(first.getByTestId("review-name")).toHaveText("Sam Tester");
      await expect(first.getByTestId("review-rating")).toHaveAttribute("data-rating", "5");
      await expect(first.getByTestId("review-text")).toContainText("Beautiful prints");
    });
  });
});
