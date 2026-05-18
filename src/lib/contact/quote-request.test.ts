import { describe, expect, it } from "vitest";
import { buildQuoteRequestMailto, formatQuoteRequestEmail, type QuoteRequest } from "./quote-email";
import { buildQuoteRequestLeadInput, parseQuoteRequestPayload } from "./quote-request";

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
  it("formats a Kiefer Built quote request email template", () => {
    const email = formatQuoteRequestEmail(request);

    expect(email.subject).toBe("New Kiefer Built quote request from Jordan Client");
    expect(email.text).toContain("Project type: Custom home");
    expect(email.text).toContain("Source: builtbykiefer.com contact form");
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
});

describe("quote request lead capture", () => {
  it("converts quote requests into new CRM lead input", () => {
    expect(buildQuoteRequestLeadInput({ ...request, company: "" }, new Date("2026-05-17T12:00:00-06:00"))).toEqual({
      name: "Jordan Client",
      email: "jordan@example.com",
      phone: "(970) 555-0199",
      projectType: "Custom home",
      budgetRange: "$900k-$1.2M",
      status: "new",
      nextFollowUp: "2026-05-18",
      notes: [
        "Website Quote Request",
        "Source: builtbykiefer.com contact form",
        "Project location: Windsor, CO",
        "Timeline: This year",
        "Project details: We are planning a custom home and want to discuss build options.",
      ].join("\n"),
    });
  });
});
