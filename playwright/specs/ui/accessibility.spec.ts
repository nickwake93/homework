import { test, expect } from "../../support/fixtures";
import { scanForViolations } from "../../support/a11y";
import { uniqueEmail } from "../../support/data";

// Scans every route and the interactive states a static scan of the initial page would miss
// (dialogs, validation errors, success messages), in both colour schemes.
for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`Accessibility (${colorScheme} mode)`, () => {
    test.use({ colorScheme });
    // axe's rules don't depend on the browser engine, so scanning in every browser only adds
    // time. Chromium covers both the desktop and mobile layouts.
    test.skip(({ browserName }) => browserName !== "chromium", "axe scans run in Chromium only");

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

test.describe("Document structure", () => {
  for (const path of ["/", "/gallery", "/contact"]) {
    test(`${path} has exactly one h1`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      // Hidden headings (e.g. inactive carousel slides) still count for SEO and the DOM outline.
      await expect(page.getByRole("heading", { level: 1, includeHidden: true })).toHaveCount(1);
    });
  }
});

test.describe("Lightbox keyboard support", () => {
  test("opening moves focus into the dialog and Tab can't leave it", async ({ gallery, page }) => {
    await gallery.cards.first().focus();
    await page.keyboard.press("Enter");

    await expect(gallery.lightbox).toBeVisible();
    await expect(gallery.lightboxCloseButton).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(gallery.lightboxCloseButton).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(gallery.lightboxCloseButton).toBeFocused();
  });

  test("closing with Escape returns focus to the card that opened it", async ({
    gallery,
    page,
  }) => {
    const card = gallery.cards.nth(1);
    await card.focus();
    await page.keyboard.press("Enter");
    await expect(gallery.lightbox).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(gallery.lightbox).toBeHidden();
    await expect(card).toBeFocused();
  });

  test("closing with the button returns focus to the clicked card", async ({ gallery }) => {
    const card = gallery.cards.nth(2);
    await card.click();
    await gallery.lightboxCloseButton.click();

    await expect(gallery.lightbox).toBeHidden();
    await expect(card).toBeFocused();
  });
});
