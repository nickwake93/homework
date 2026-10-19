import { test, expect } from "@playwright/test";
import { emailsTo, subscribe } from "../../support/api";
import { uniqueEmail } from "../../support/data";

test.describe("POST /api/newsletter", () => {
  test("subscribes and sends a welcome email", async ({ request }, testInfo) => {
    const email = uniqueEmail(testInfo);
    const before = Date.now();

    const res = await subscribe(request, { name: "Ada Lovelace", email });

    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/json");
    const body = await res.json();
    expect(body).toEqual({
      ok: true,
      message: "Subscribed successfully",
      emailId: expect.stringMatching(/^email_/),
    });

    const sent = await emailsTo(request, email);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      id: body.emailId,
      name: "Ada Lovelace",
      subject: "Welcome to Nature Frames",
    });
    expect(sent[0].body).toContain("Hi Ada Lovelace,");
    expect(Date.parse(sent[0].sentAt)).toBeGreaterThanOrEqual(before - 1_000);
  });

  test("trims whitespace from name and email", async ({ request }, testInfo) => {
    const email = uniqueEmail(testInfo);

    const res = await subscribe(request, { name: "  Ada  ", email: `  ${email}  ` });

    expect(res.status()).toBe(200);
    const [sent] = await emailsTo(request, email);
    expect(sent.name).toBe("Ada");
  });

  test("accepts a name at the 100-character limit", async ({ request }, testInfo) => {
    const res = await subscribe(request, { name: "a".repeat(100), email: uniqueEmail(testInfo) });
    expect(res.status()).toBe(200);
  });

  const valid = { name: "Ada", email: "ada@example.com" };
  const NAME_ERROR = "Name is required (max 100 chars)";
  const EMAIL_ERROR = "Valid email is required";
  const BODY_ERROR = "Request body must be a JSON object";

  const invalidRequests: { case: string; body: unknown; error: string }[] = [
    { case: "malformed JSON", body: "{nope", error: "Invalid JSON" },
    { case: "JSON null", body: "null", error: BODY_ERROR },
    { case: "JSON array", body: "[]", error: BODY_ERROR },
    { case: "JSON string", body: '"hello"', error: BODY_ERROR },
    { case: "missing name", body: { email: valid.email }, error: NAME_ERROR },
    { case: "whitespace-only name", body: { ...valid, name: "   " }, error: NAME_ERROR },
    { case: "name over 100 chars", body: { ...valid, name: "a".repeat(101) }, error: NAME_ERROR },
    { case: "non-string name", body: { ...valid, name: 123 }, error: NAME_ERROR },
    { case: "missing email", body: { name: valid.name }, error: EMAIL_ERROR },
    { case: "non-string email", body: { ...valid, email: 5 }, error: EMAIL_ERROR },
    { case: "email without @", body: { ...valid, email: "ada.example.com" }, error: EMAIL_ERROR },
    { case: "email without domain", body: { ...valid, email: "ada@" }, error: EMAIL_ERROR },
    { case: "email without TLD", body: { ...valid, email: "ada@example" }, error: EMAIL_ERROR },
    {
      case: "email with spaces",
      body: { ...valid, email: "a da@example.com" },
      error: EMAIL_ERROR,
    },
    {
      case: "email over 255 chars",
      body: { ...valid, email: `${"a".repeat(244)}@example.com` },
      error: EMAIL_ERROR,
    },
  ];

  for (const { case: name, body, error } of invalidRequests) {
    test(`rejects ${name} with a JSON 400`, async ({ request }) => {
      const res = await subscribe(request, body);

      expect(res.status()).toBe(400);
      expect(res.headers()["content-type"]).toContain("application/json");
      expect(await res.json()).toEqual({ ok: false, error });
    });
  }

  test("does not send an email for a rejected request", async ({ request }, testInfo) => {
    const email = uniqueEmail(testInfo);
    await subscribe(request, { name: "", email });
    expect(await emailsTo(request, email)).toHaveLength(0);
  });

  for (const method of ["GET", "PUT", "PATCH", "DELETE"]) {
    test(`responds 405 to ${method}`, async ({ request }) => {
      const res = await request.fetch("/api/newsletter", { method });

      expect(res.status()).toBe(405);
      expect(res.headers()["allow"]).toBe("POST");
    });
  }
});
