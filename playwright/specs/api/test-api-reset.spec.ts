import { test, expect } from "@playwright/test";
import { listEmails, subscribe } from "../../support/api";
import { uniqueEmail } from "../../support/data";

// Runs in the "api-isolated" project against its own server: clearing the store on the
// shared server would break other tests reading it in parallel.
test.describe("DELETE /api/test/emails", () => {
  test("clears the email store", async ({ request }, testInfo) => {
    await subscribe(request, { name: "Ada", email: uniqueEmail(testInfo) });
    expect(await listEmails(request)).not.toHaveLength(0);

    const res = await request.delete("/api/test/emails");

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(await listEmails(request)).toEqual([]);
  });
});
