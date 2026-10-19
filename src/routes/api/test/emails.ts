import { createFileRoute } from "@tanstack/react-router";
import { emailStore } from "@/lib/email-store";

// QA-only endpoints. They expose and wipe every "sent" email, so they only exist when
// ENABLE_TEST_API=true (local dev and CI). Anywhere else they 404 as if absent.
const testApiEnabled = () => process.env.ENABLE_TEST_API === "true";
const notFound = () => new Response("Not Found", { status: 404 });

export const Route = createFileRoute("/api/test/emails")({
  server: {
    handlers: {
      GET: async () => {
        if (!testApiEnabled()) return notFound();
        return Response.json({ emails: emailStore.list() });
      },
      DELETE: async () => {
        if (!testApiEnabled()) return notFound();
        emailStore.clear();
        return Response.json({ ok: true });
      },
    },
  },
});
