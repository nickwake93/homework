import { createFileRoute } from "@tanstack/react-router";
import { emailStore } from "@/lib/email-store";

const badRequest = (error: string) => Response.json({ ok: false, error }, { status: 400 });

const methodNotAllowed = () =>
  Response.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      // Without an explicit handler, other methods fall through to rendering an empty page with a 200.
      GET: methodNotAllowed,
      PUT: methodNotAllowed,
      PATCH: methodNotAllowed,
      DELETE: methodNotAllowed,
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return badRequest("Invalid JSON");
        }
        // Valid JSON isn't necessarily an object (e.g. `null`, `[]`, `"hi"`), and fields may
        // be non-strings; reject those as 400s rather than throwing a 500.
        if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
          return badRequest("Request body must be a JSON object");
        }
        const { name: rawName, email: rawEmail } = payload as Record<string, unknown>;
        const name = typeof rawName === "string" ? rawName.trim() : "";
        const email = typeof rawEmail === "string" ? rawEmail.trim() : "";

        if (!name || name.length > 100) {
          return badRequest("Name is required (max 100 chars)");
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
          return badRequest("Valid email is required");
        }

        const sent = emailStore.add({
          to: email,
          name,
          subject: "Welcome to Nature Frames",
          body: `Hi ${name},\n\nThank you for subscribing to the Nature Frames newsletter. You'll be the first to see new prints, behind-the-scenes work, and upcoming commission slots.\n\n— Nature Frames`,
        });

        return Response.json({ ok: true, message: "Subscribed successfully", emailId: sent.id });
      },
    },
  },
});
