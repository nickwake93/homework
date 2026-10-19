// In-memory mock email store. Cleared on server restart.
// Exposed via GET /api/test/emails for QA automation.
export interface SentEmail {
  id: string;
  to: string;
  name: string;
  subject: string;
  body: string;
  sentAt: string;
}

const _store: SentEmail[] = [];

export const emailStore = {
  add(email: Omit<SentEmail, "id" | "sentAt">): SentEmail {
    const record: SentEmail = {
      ...email,
      id: `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      sentAt: new Date().toISOString(),
    };
    _store.unshift(record);

    console.log("[mock-email] sent:", record);
    return record;
  },
  list(): SentEmail[] {
    return [..._store];
  },
  clear(): void {
    _store.length = 0;
  },
};
