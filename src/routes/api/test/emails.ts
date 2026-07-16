import { createFileRoute } from "@tanstack/react-router";
import { emailStore } from "@/lib/email-store";

export const Route = createFileRoute("/api/test/emails")({
  server: {
    handlers: {
      GET: async () => Response.json({ emails: emailStore.list() }),
      DELETE: async () => {
        emailStore.clear();
        return Response.json({ ok: true });
      },
    },
  },
});
