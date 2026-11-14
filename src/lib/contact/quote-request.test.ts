import { describe, expect, it, vi } from "vitest";
import { buildQuoteRequestMailto, formatQuoteRequestEmail, type QuoteRequest } from "./quote-email";
import { parseQuoteRequestPayload } from "./quote-request";

const request: QuoteRequest = {
  name: "Jordan Client",
  email: "jordan@example.com",
  phone: "(970) 555-0199",
  projectType: "Custom home",
  location: "Windsor, CO",
  budget: "$900k-$1.2M",
  timeline: "This year",
  message: "We are planning a custom home and want to discuss build options.",
};

describe("quote request email", () => {
  it("keeps the complete provider email stable across clock changes", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-10-13T10:00:00Z"));
      const first = formatQuoteRequestEmail(request);
      vi.setSystemTime(new Date("2026-10-13T19:30:00Z"));
      expect(formatQuoteRequestEmail(request)).toEqual(first);
      for (const value of Object.values(request)) expect(first.text).toContain(value);
      expect(first.text + first.html).not.toContain("Submitted");
    } finally { vi.useRealTimers(); }
  });
  it("formats a Kiefer Built quote request email template", () => {
    const email = formatQuoteRequestEmail(request);

    expect(email.subject).toBe("New Kiefer Built quote request from Jordan Client");
    expect(email.text).toContain("Project type: Custom home");
    expect(email.text).toContain("Source: kbuiltco.com contact form");
    expect(email.html).toContain("from the kbuiltco.com contact form");
    expect(email.text + email.html).not.toContain("builtbykiefer.com");
    expect(email.html).toContain("Kiefer Built Contracting");
    expect(email.html).toContain("Jordan Client");
  });

  it("builds a mailto fallback addressed to Kiefer Built", () => {
    const mailto = buildQuoteRequestMailto(request);

    expect(mailto).toContain("mailto:info%40kbuiltco.com".replace("%40", "@"));
    expect(mailto).toContain("subject=");
    expect(mailto).toContain("body=");
  });
});

describe("quote request validation", () => {
  it("accepts complete quote requests and trims fields", () => {
    const result = parseQuoteRequestPayload({
      ...request,
      name: "  Jordan Client  ",
      company: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jordan Client");
    }
  });

  it("rejects incomplete quote requests", () => {
    const result = parseQuoteRequestPayload({
      ...request,
      email: "not-an-email",
      message: "short",
    });

    expect(result.success).toBe(false);
  });

  it("bounds long project details and the hidden company field", () => {
    expect(parseQuoteRequestPayload({ ...request, message: "a".repeat(2501) }).success).toBe(false);
    expect(parseQuoteRequestPayload({ ...request, company: "a".repeat(121) }).success).toBe(false);
  });

  it("validates trimmed content rather than allowing whitespace-only fields", () => {
    expect(parseQuoteRequestPayload({ ...request, name: "  ", location: "  ", message: "          " }).success).toBe(false);
  });
});
