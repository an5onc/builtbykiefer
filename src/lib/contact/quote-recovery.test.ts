import { describe, expect, it } from "vitest";
import { buildQuoteRequestMailto, buildQuoteRequestRecovery, type QuoteRequest } from "./quote-email";

const request: QuoteRequest = {
  name: "Jordan Client", email: "jordan@example.com", phone: "9705550100",
  projectType: "Custom home", location: "Windsor", budget: "Still planning",
  timeline: "Still planning", message: "We would like to discuss a new custom home.",
};

describe("quote recovery copy", () => {
  it("includes every request detail and marks delivery unconfirmed", () => {
    const recovery = buildQuoteRequestRecovery(request);
    for (const value of Object.values(request)) expect(recovery.text).toContain(value);
    expect(recovery.text).toContain("Delivery has not been confirmed");
    expect(recovery.text).not.toContain("Submitted:");
    expect(recovery.text).toContain("Source: kbuiltco.com contact form");
    expect(recovery.text).not.toContain("builtbykiefer.com");
    const url = new URL(recovery.mailtoHref);
    expect(url.pathname).toBe("info@kbuiltco.com");
    expect(url.searchParams.get("body")).toBe(recovery.text);
    expect(url.searchParams.get("subject")).toBe("New Kiefer Built quote request from Jordan Client");
    expect(buildQuoteRequestMailto(request)).toBe(recovery.mailtoHref);
  });

  it("retains maximum-length Unicode and literal markup without truncation", () => {
    const suffix = "\n<script>literal</script>";
    const message = "暖".repeat(2500 - suffix.length) + suffix;
    expect(message.length).toBe(2500);
    const recovery = buildQuoteRequestRecovery({ ...request, message });
    expect(recovery.text).toContain(message);
    expect(new URL(recovery.mailtoHref).searchParams.get("body")).toBe(recovery.text);
  });

  it("keeps an attempted request's copy stable when fields are edited later", () => {
    const input = { ...request };
    const original = buildQuoteRequestRecovery(input);
    input.message = "Changed details for a later attempt.";
    expect(original.text).toContain(request.message);
    expect(original.text).not.toContain(input.message);
    expect(buildQuoteRequestRecovery(input).text).toContain(input.message);
  });

  it("does not throw on a lone UTF-16 surrogate while preparing recovery", () => {
    const recovery = buildQuoteRequestRecovery({ ...request, message: "Partial pasted character: \uD800" });
    expect(recovery.text).toContain("\uD800");
    expect(new URL(recovery.mailtoHref).searchParams.get("body")).toContain("Partial pasted character: \uFFFD");
  });
});
