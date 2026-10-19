import { test, expect } from "@playwright/test";
import { subscribe } from "../../support/api";
import { uniqueEmail } from "../../support/data";

// Runs in the "api-prod-like" project against a server with ENABLE_TEST_API off, as in
// production. The QA endpoints expose and wipe subscriber emails, so they must not exist.
test.describe("Test API with ENABLE_TEST_API off", () => {
  for (const method of ["GET", "DELETE"]) {
    test(`${method} /api/test/emails responds 404`, async ({ request }) => {
      const res = await request.fetch("/api/test/emails", { method });
      expect(res.status()).toBe(404);
    });
  }

  test("the public newsletter API still works", async ({ request }, testInfo) => {
    const res = await subscribe(request, { name: "Ada", email: uniqueEmail(testInfo) });
    expect(res.status()).toBe(200);
  });
});
