import { test, expect } from "@playwright/test";
import { listEmails, subscribe } from "../../support/api";
import { uniqueEmail } from "../../support/data";

test.describe("GET /api/test/emails", () => {
  test("lists sent emails, newest first", async ({ request }, testInfo) => {
    const first = `1-${uniqueEmail(testInfo)}`;
    const second = `2-${uniqueEmail(testInfo)}`;
    await subscribe(request, { name: "First", email: first });
    await subscribe(request, { name: "Second", email: second });

    // Other tests write to the same store in parallel, so only check our own emails' order.
    const recipients = (await listEmails(request)).map((e) => e.to);
    expect(recipients).toContain(first);
    expect(recipients.indexOf(second)).toBeLessThan(recipients.indexOf(first));
  });
});
