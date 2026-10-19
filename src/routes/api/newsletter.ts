import { createFileRoute } from "@tanstack/react-router";
import { emailStore } from "@/lib/email-store";

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { name?: string; email?: string };
        try {
          payload = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const name = (payload.name ?? "").trim();
        const email = (payload.email ?? "").trim();

        if (!name || name.length > 100) {
          return Response.json(
            { ok: false, error: "Name is required (max 100 chars)" },
            { status: 400 },
          );
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
          return Response.json({ ok: false, error: "Valid email is required" }, { status: 400 });
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
