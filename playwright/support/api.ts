import type { APIRequestContext, APIResponse } from "@playwright/test";

export interface SentEmail {
  id: string;
  to: string;
  name: string;
  subject: string;
  body: string;
  sentAt: string;
}

/** POST /api/newsletter. Pass a string to send it as the raw request body. */
export function subscribe(request: APIRequestContext, body: unknown): Promise<APIResponse> {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return request.post("/api/newsletter", {
    headers: { "content-type": "application/json" },
    // A Buffer is sent byte-for-byte. Given a string that isn't valid JSON alongside a JSON
    // content type, Playwright would JSON-encode it, so malformed bodies never reach the server.
    data: Buffer.from(raw),
  });
}

/** GET /api/test/emails (QA-only endpoint). */
export async function listEmails(request: APIRequestContext): Promise<SentEmail[]> {
  const res = await request.get("/api/test/emails");
  if (!res.ok()) throw new Error(`GET /api/test/emails failed: ${res.status()}`);
  return (await res.json()).emails;
}

export async function emailsTo(request: APIRequestContext, to: string): Promise<SentEmail[]> {
  return (await listEmails(request)).filter((e) => e.to === to);
}
