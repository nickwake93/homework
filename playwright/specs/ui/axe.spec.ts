import { test, expect } from "../../support/fixtures";
import { scanForViolations } from "../../support/a11y";
import { uniqueEmail } from "../../support/data";

// Runs in Chromium only (desktop and mobile layouts), as axe's rules don't depend on the
// browser engine: see playwright.config.ts.
// Scans every route and the interactive states a static scan of the initial page would miss
// (dialogs, validation errors, success messages), in both colour schemes.
for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`Accessibility (${colorScheme} mode)`, () => {
    test.use({ colorScheme });

    test("homepage has no axe violations", async ({ home, page }, testInfo) => {
      await expect(home.carousel).toBeVisible();
      expect(await scanForViolations(page, testInfo)).toEqual([]);
    });

    test("gallery has no axe violations", async ({ gallery, page }, testInfo) => {
      await expect(gallery.cards.first()).toBeVisible();
      expect(await scanForViolations(page, testInfo)).toEqual([]);
    });

    test("gallery lightbox has no axe violations", async ({ gallery, page }, testInfo) => {
      await gallery.cards.first().click();
      await expect(gallery.lightbox).toBeVisible();
      expect(await scanForViolations(page, testInfo)).toEqual([]);
    });

    test("contact page has no axe violations", async ({ contact, page }, testInfo) => {
      await expect(contact.heading).toBeVisible();
      expect(await scanForViolations(page, testInfo)).toEqual([]);
    });

    test("contact forms showing validation errors have no axe violations", async ({
      contact,
      page,
    }, testInfo) => {
      await contact.newsletterSubmitButton.click();
      await contact.submitReviewButton.click();
      await expect(contact.reviewRating).toHaveAttribute("aria-invalid", "true");
      expect(await scanForViolations(page, testInfo)).toEqual([]);
    });

    test("newsletter success message has no axe violations", async ({
      contact,
      page,
    }, testInfo) => {
      await contact.newsletterNameInput.fill("Ada Lovelace");
      await contact.newsletterEmailInput.fill(uniqueEmail(testInfo));
      await contact.newsletterSubmitButton.click();
      await expect(contact.newsletterStatus).toHaveAttribute("data-status", "success");
      expect(await scanForViolations(page, testInfo)).toEqual([]);
    });
  });
}
