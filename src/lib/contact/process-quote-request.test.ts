import { describe, expect, it, vi } from "vitest";
import { processQuoteRequest, type ProcessDeps } from "./process-quote-request";
import type { QuoteRequestPayload } from "./quote-request";

const request: QuoteRequestPayload = {
  name: "Jordan Client",
  email: "jordan@example.com",
  phone: "(970) 555-0199",
  projectType: "Custom home",
  location: "Windsor, CO",
  budget: "$900k-$1.2M",
  timeline: "This year",
  message: "We want to discuss a SIPs custom home.",
  company: "",
};

function deps(overrides: Partial<ProcessDeps> = {}): ProcessDeps {
  return {
    sendEmail: vi.fn(async () => ({ ok: true })),
    emailConfigured: true,
    ...overrides,
  };
}

describe("processQuoteRequest", () => {
  it("succeeds when the email sends", async () => {
    const sendEmail = vi.fn(async () => ({ ok: true }));
    const result = await processQuoteRequest(request, deps({ sendEmail }));
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true, emailSent: true });
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: "jordan@example.com" }),
    );
  });

  it("fails clearly when email is not configured", async () => {
    const result = await processQuoteRequest(request, deps({ emailConfigured: false }));
    expect(result.ok).toBe(false);
    expect(result.status).toBe(500);
    expect(result.body.code).toBe("email_not_configured");
  });

  it("fails when the email send fails", async () => {
    const sendEmail = vi.fn(async () => ({ ok: false }));
    const result = await processQuoteRequest(request, deps({ sendEmail }));
    expect(result.ok).toBe(false);
    expect(result.status).toBe(502);
    expect(result.body.code).toBe("email_send_failed");
  });

  it("does not attempt delivery without configuration", async () => {
    const sendEmail = vi.fn(async () => ({ ok: true }));
    await processQuoteRequest(request, deps({ emailConfigured: false, sendEmail }));
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("handles provider transport failure without leaking it or retrying", async () => {
    const sendEmail = vi.fn(async () => { throw new Error("provider key and customer details must stay private"); });
    const result = await processQuoteRequest(request, deps({ sendEmail }));
    expect(result.status).toBe(502);
    expect(result.body).toMatchObject({ ok: false, code: "email_send_unconfirmed" });
    expect(JSON.stringify(result)).not.toContain("must stay private");
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("reports timeout as an unconfirmed submission", async () => {
    const result = await processQuoteRequest(request, deps({
      sendEmail: async () => { throw new DOMException("Timed out", "TimeoutError"); },
    }));
    expect(result.status).toBe(504);
    expect(result.body).toMatchObject({ ok: false, code: "email_timeout" });
    expect(result.body.error).toContain("couldn't confirm");
  });

  it("keeps the accepted provider reference out of the public response body", async () => {
    const result = await processQuoteRequest(request, deps({
      sendEmail: async () => ({ ok: true, emailId: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" }),
    }));
    expect(result.emailId).toBe("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794");
    expect(result.body).toEqual({ ok: true, emailSent: true });
  });
});
