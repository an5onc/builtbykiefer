import { describe, expect, it, vi } from "vitest";
import { QUOTE_RETRY_WINDOW_MS, selectQuoteAttempt } from "./quote-attempt";

const payload = { name: "Jordan Client", email: "jordan@example.com", phone: "9705550100", projectType: "Custom home",
  location: "Windsor", budget: "Still planning", timeline: "Still planning", message: "A fictitious custom home inquiry.", company: "" };
const id = "11111111-2222-4333-8444-555555555555";
const otherId = "11111111-2222-4333-8444-666666666666";
const first = () => { const result = selectQuoteAttempt(null, payload, 1000, () => id); if (!result.ok) throw new Error("fixture"); return result.attempt; };

describe("quote attempt lifecycle", () => {
  it("reuses the frozen intent and exact body for unchanged normalized retries", () => {
    const attempt = first(); const generator = vi.fn(() => otherId);
    const retried = selectQuoteAttempt(attempt, { ...payload, name: "  Jordan Client  " }, 6000, generator);
    expect(retried).toEqual({ ok: true, attempt });
    if (retried.ok) expect(retried.attempt).toBe(attempt);
    expect(generator).not.toHaveBeenCalled(); expect(Object.isFrozen(attempt)).toBe(true);
  });
  it.each(Object.keys(payload) as (keyof typeof payload)[])("creates a fresh intent when %s changes", (field) => {
    const attempt = first(); const changed = { ...payload, [field]: payload[field] + " edited" };
    const next = selectQuoteAttempt(attempt, changed, 2000, () => otherId);
    expect(next.ok).toBe(true);
    if (next.ok) { expect(next.attempt.id).toBe(otherId); expect(next.attempt.body).not.toBe(attempt.body); }
    expect(JSON.parse(attempt.body)).toEqual(payload);
  });
  it("gives independent/completed requests fresh identities even with identical details", () => {
    expect(selectQuoteAttempt(null, payload, 2000, () => otherId)).toMatchObject({ ok: true, attempt: { id: otherId } });
    expect(first().id).not.toBe(otherId);
  });
  it("blocks expired/backward-clock retries without silently generating a new ID", () => {
    const attempt = first(); const generate = vi.fn(() => otherId);
    for (const time of [1000 + QUOTE_RETRY_WINDOW_MS, 1000 + QUOTE_RETRY_WINDOW_MS + 1, 999]) {
      expect(selectQuoteAttempt(attempt, payload, time, generate)).toEqual({ ok: false, reason: "expired" });
    }
    expect(generate).not.toHaveBeenCalled();
    expect(selectQuoteAttempt(attempt, payload, 1000 + QUOTE_RETRY_WINDOW_MS - 1, generate).ok).toBe(true);
  });
  it("fails safely when secure UUID creation is unavailable or invalid", () => {
    expect(selectQuoteAttempt(null, payload, 1000, () => { throw new Error("unavailable"); })).toEqual({ ok: false, reason: "unavailable" });
    expect(selectQuoteAttempt(null, payload, 1000, () => "unsafe-key")).toEqual({ ok: false, reason: "unavailable" });
  });
});
