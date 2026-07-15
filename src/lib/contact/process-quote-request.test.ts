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
    createLead: vi.fn(async () => ({ ok: true, leadId: "lead_1" })),
    sendEmail: vi.fn(async () => ({ ok: true })),
    emailConfigured: true,
    ...overrides,
  };
}

describe("processQuoteRequest", () => {
  it("succeeds when the email sends", async () => {
    const result = await processQuoteRequest(request, deps());
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.body.emailSent).toBe(true);
  });

  it("still succeeds when the CRM write fails", async () => {
    const createLead = vi.fn(async () => ({ ok: false }));
    const result = await processQuoteRequest(request, deps({ createLead }));
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.body.emailSent).toBe(true);
  });

  it("still succeeds when the CRM write throws", async () => {
    const createLead = vi.fn(async () => {
      throw new Error("supabase unreachable");
    });
    const result = await processQuoteRequest(request, deps({ createLead }));
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
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
});
