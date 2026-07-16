# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact.spec.ts >> Contact >> Newsletter form >> shows validation errors when submitted empty
- Location: specs/contact.spec.ts:14:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('newsletter-name-error')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('newsletter-name-error')

```

```yaml
- link "Skip to content":
  - /url: "#main-content"
- banner:
  - navigation "Primary":
    - link "NatureFrames":
      - /url: /
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem:
        - link "Gallery":
          - /url: /gallery
      - listitem:
        - link "Contact":
          - /url: /contact
      - listitem:
        - button "Switch to dark mode"
- main:
  - paragraph: Contact
  - heading "Let's talk" [level=1]
  - paragraph: Commissions, prints, or just to say hello — pick whichever channel works best.
  - region "Contact information":
    - heading "Contact information" [level=2]
    - link "Phone +44 78245 53841":
      - /url: tel:+447700900000
      - paragraph: Phone
      - paragraph: +44 78245 53841
    - link "Email nwake@hey.com":
      - /url: mailto:nwake@hey.com
      - paragraph: Email
      - paragraph: nwake@hey.com
    - link "LinkedIn /in/nick-wake":
      - /url: https://www.linkedin.com/m/in/nick-wake
      - paragraph: LinkedIn
      - paragraph: /in/nick-wake
  - region "Newsletter":
    - heading "Newsletter" [level=2]
    - paragraph: New prints, behind-the-scenes work, and commission slots — straight to your inbox.
    - text: Name
    - textbox "Name"
    - text: Email
    - textbox "Email"
    - button "Subscribe"
    - status
  - region "Reviews":
    - heading "Reviews" [level=2]
    - paragraph: Worked with me? I'd love to hear about it.
    - text: Your name
    - textbox "Your name"
    - text: Rating
    - radiogroup "Star rating":
      - radio "1 star"
      - radio "2 stars"
      - radio "3 stars"
      - radio "4 stars"
      - radio "5 stars"
    - text: Your review
    - textbox "Your review"
    - button "Submit review"
    - list:
      - listitem:
        - paragraph: Most people he's worked with
        - time: 6/12/2026
        - paragraph: Great guy and really good tester, very modest too!
- contentinfo:
  - paragraph: © 2026 Nick Wake — Recreational nature photography. Professional test automation.
- region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "../support/fixtures";
  2  | 
  3  | test.describe("Contact", () => {
  4  |   test("renders contact info with correct hrefs", async ({ contact }) => {
  5  |     await expect(contact.heading).toBeVisible();
  6  |     await expect(contact.phoneLink).toHaveAttribute("href", "tel:+447700900000");
  7  |     await expect(contact.emailLink).toHaveAttribute("href", "mailto:nwake@hey.com");
  8  |     await expect(contact.linkedInLink).toHaveAttribute("href", /linkedin\.com/);
  9  |   });
  10 | 
  11 |   test.describe("Newsletter form", () => {
  12 |     test.describe.configure({ mode: "serial" });
  13 | 
  14 |     test("shows validation errors when submitted empty", async ({ contact }) => {
  15 |       await contact.newsletterSubmitButton.click();
> 16 |       await expect(contact.newsletterNameError).toBeVisible();
     |                                                 ^ Error: expect(locator).toBeVisible() failed
  17 |       await expect(contact.newsletterEmailError).toBeVisible();
  18 |     });
  19 | 
  20 |     test("rejects an invalid email format", async ({ contact }) => {
  21 |       await contact.newsletterNameInput.fill("Test User");
  22 |       await contact.newsletterEmailInput.fill("not-an-email");
  23 |       await contact.newsletterSubmitButton.click();
  24 |       await expect(contact.newsletterEmailError).toBeVisible();
  25 |     });
  26 | 
  27 |     test("submits successfully and shows the success state", async ({ contact, page }) => {
  28 |       const unique = `qa+${Date.now()}@example.com`;
  29 |       await contact.newsletterNameInput.fill("Ada Lovelace");
  30 |       await contact.newsletterEmailInput.fill(unique);
  31 |       await contact.newsletterSubmitButton.click();
  32 | 
  33 |       await expect(contact.newsletterStatus).toHaveAttribute("data-status", "success");
  34 |       await expect(contact.newsletterStatus).toContainText(/thank you/i);
  35 | 
  36 |       const res = await page.request.get("/api/test/emails");
  37 |       expect(res.ok()).toBeTruthy();
  38 |       const { emails } = await res.json();
  39 |       expect(emails.some((e: { to: string }) => e.to === unique)).toBe(true);
  40 |     });
  41 |   });
  42 | 
  43 |   test.describe("Reviews", () => {
  44 |     test.describe.configure({ mode: "serial" });
  45 | 
  46 |     test("shows validation errors when submitted empty", async ({ contact }) => {
  47 |       await contact.submitReviewButton.click();
  48 |       await expect(contact.reviewNameError).toBeVisible();
  49 |       await expect(contact.reviewRatingError).toBeVisible();
  50 |       await expect(contact.reviewTextError).toBeVisible();
  51 |     });
  52 | 
  53 |     test("star rating updates the hidden value", async ({ contact }) => {
  54 |       await contact.ratingStar(4).click();
  55 |       await expect(contact.reviewRatingStars).toHaveAttribute("data-value", "4");
  56 |       await expect(contact.reviewRatingValue).toHaveValue("4");
  57 |     });
  58 | 
  59 |     test("submits a review and prepends it to the list", async ({ contact }) => {
  60 |       const beforeCount = await contact.reviewItems.count();
  61 | 
  62 |       await contact.reviewNameInput.fill("Sam Tester");
  63 |       await contact.ratingStar(5).click();
  64 |       await contact.reviewTextInput.fill("Beautiful prints, fast turnaround.");
  65 |       await contact.submitReviewButton.click();
  66 | 
  67 |       await expect(contact.reviewSuccess).toBeVisible();
  68 |       await expect(contact.reviewItems).toHaveCount(beforeCount + 1);
  69 | 
  70 |       const first = contact.reviewItems.first();
  71 |       await expect(first.getByTestId("review-name")).toHaveText("Sam Tester");
  72 |       await expect(first.getByTestId("review-rating")).toHaveAttribute("data-rating", "5");
  73 |       await expect(first.getByTestId("review-text")).toContainText("Beautiful prints");
  74 |     });
  75 |   });
  76 | });
  77 | 
```