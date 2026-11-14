import type { QuoteRequest } from "./quote-email";

export const QUOTE_ATTEMPT_HEADER = "X-Quote-Attempt";
export const QUOTE_RETRY_WINDOW_MS = 23 * 60 * 60 * 1000;
export const quoteAttemptIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type QuoteAttemptPayload = QuoteRequest & { company: string };
export type QuoteAttempt = Readonly<{ id: string; body: string; createdAt: number }>;

const fields = ["name", "email", "phone", "projectType", "location", "budget", "timeline", "message", "company"] as const;

// One browser-page intent. Refresh/new tabs/manual email are outside this protection.
export function selectQuoteAttempt(
  previous: QuoteAttempt | null,
  request: QuoteAttemptPayload,
  now = Date.now(),
  generateId: () => string = () => crypto.randomUUID(),
): { ok: true; attempt: QuoteAttempt } | { ok: false; reason: "expired" | "unavailable" } {
  const body = JSON.stringify(Object.fromEntries(fields.map((field) => [field, request[field].trim()])));
  if (previous?.body === body) {
    const age = now - previous.createdAt;
    if (!Number.isFinite(age) || age < 0 || age >= QUOTE_RETRY_WINDOW_MS) return { ok: false, reason: "expired" };
    return { ok: true, attempt: previous };
  }
  try {
    const id = generateId();
    if (!quoteAttemptIdPattern.test(id) || !Number.isFinite(now)) return { ok: false, reason: "unavailable" };
    return { ok: true, attempt: Object.freeze({ id, body, createdAt: now }) };
  } catch {
    // Do not silently send without an identity when secure ID generation is unavailable.
    return { ok: false, reason: "unavailable" };
  }
}
