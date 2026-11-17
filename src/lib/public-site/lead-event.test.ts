import { afterEach, describe, expect, it, vi } from "vitest";
import { GA4_MEASUREMENT_ID, trackAcceptedServiceLead } from "./lead-event";

const attempt = "11111111-2222-4333-8444-555555555555";
const result = { ok: true, emailSent: true, requestId: "11111111-2222-4333-8444-666666666666" };
afterEach(() => vi.unstubAllGlobals());

describe("provider-confirmed service lead measurement", () => {
  it.each([{}, { ok: true }, { ok: true, emailSent: false }, { ...result, requestId: "invalid" }, null])("does not count unconfirmed, honeypot or malformed acceptance %j", (body) => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location: { hostname: "kbuiltco.com" }, gtag });
    expect(trackAcceptedServiceLead("kitchen-remodeling", attempt, true, body)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });
  it.each(["localhost", "127.0.0.1", "preview.vercel.app", "kbuiltco.com.example.com"])("excludes %s", (hostname) => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location: { hostname }, gtag });
    expect(trackAcceptedServiceLead("kitchen-remodeling", attempt, true, result)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });
  it("requires successful HTTP, known service and a safe attempt", () => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location: { hostname: "kbuiltco.com" }, gtag });
    expect(trackAcceptedServiceLead("kitchen-remodeling", attempt, false, result)).toBe(false);
    expect(trackAcceptedServiceLead("email@example.com", attempt, true, result)).toBe(false);
    expect(trackAcceptedServiceLead("kitchen-remodeling", "bad", true, result)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });
  it("sends only allowlisted non-personal fields to GA4 once per accepted attempt", () => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location: { hostname: "www.kbuiltco.com" }, gtag });
    const body = { ...result, email: "not-for-analytics@example.com", message: "private project details" };
    expect(trackAcceptedServiceLead("cabinet-replacement", attempt, true, body)).toBe(true);
    expect(trackAcceptedServiceLead("cabinet-replacement", attempt, true, body)).toBe(false);
    expect(gtag).toHaveBeenCalledExactlyOnceWith("event", "generate_lead", { send_to: GA4_MEASUREMENT_ID, service_type: "cabinet-replacement", form_name: "service_consultation", delivery_status: "email_accepted" });
  });
  it("handles unavailable or throwing measurement without breaking form acceptance", () => {
    vi.stubGlobal("window", { location: { hostname: "kbuiltco.com" } });
    expect(trackAcceptedServiceLead("basement-remodeling", result.requestId, true, result)).toBe(false);
    vi.stubGlobal("window", { location: { hostname: "kbuiltco.com" }, gtag: () => { throw new Error("blocked"); } });
    expect(trackAcceptedServiceLead("basement-remodeling", result.requestId, true, result)).toBe(false);
  });
});
