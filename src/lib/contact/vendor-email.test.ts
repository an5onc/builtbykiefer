import { describe, expect, it } from "vitest";
import { prepareVendorEmail, vendorRecipient } from "./vendor-email";

const fields = {
  companyName: "Audit Supplier",
  companyWebsite: "https://example.com/supplier",
  contactName: "Test Person",
  jobTitle: "Representative",
  phone: "9705550100",
  email: "vendor-audit@example.com",
  address: "Test address",
  city: "Windsor",
  state: "Colorado",
  zip: "80550",
  description: "Materials for local builder projects",
};

function form(values = fields) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("prepared vendor email", () => {
  it("preserves all fields and the established To/Cc in both recovery and email", () => {
    const prepared = prepareVendorEmail(form());
    const mailto = new URL(prepared.mailtoHref);
    expect(mailto.pathname).toBe(vendorRecipient);
    expect(mailto.searchParams.get("cc")).toBe("info@kbuiltco.com");
    expect(mailto.searchParams.get("subject")).toBe(prepared.subject);
    expect(mailto.searchParams.get("body")).toBe(prepared.body);
    for (const value of Object.values(fields)) {
      expect(prepared.body.split(value)).toHaveLength(2);
      expect(prepared.recoveryText).toContain(value);
    }
    expect(prepared.recoveryText).toContain("not sent by this website");
    expect(prepared.recoveryText).toContain(`To: ${vendorRecipient}`);
    expect(prepared.recoveryText).toContain("Cc: info@kbuiltco.com");
  });

  it("trims fields and retains a prepared snapshot when the form is edited", () => {
    const data = form({ ...fields, companyName: "  Audit Supplier  " });
    const previous = prepareVendorEmail(data);
    data.set("companyName", "Edited supplier");
    const next = prepareVendorEmail(data);
    expect(previous.subject).toBe("Vendor inquiry from Audit Supplier");
    expect(previous.body).not.toContain("Edited supplier");
    expect(next.body).toContain("Edited supplier");
    expect(next.mailtoHref).not.toBe(previous.mailtoHref);
  });

  it("keeps long Unicode, newlines and literal markup complete without URI injection", () => {
    const description = '木材 🏠 & <script>literal text</script>\n'.repeat(100);
    const prepared = prepareVendorEmail(form({ ...fields, description }));
    const mailto = new URL(prepared.mailtoHref);
    expect(mailto.searchParams.get("body")).toContain(description.trim());
    expect(prepared.recoveryText).toContain(description.trim());
    expect([...mailto.searchParams.keys()]).toEqual(["cc", "subject", "body"]);
    expect(mailto.hash).toBe("");
  });

  it("can prepare browser-normalized malformed Unicode without throwing", () => {
    // FormData normalizes lone surrogates to a Unicode replacement character.
    const prepared = prepareVendorEmail(form({ ...fields, description: "Test \uD800 details" }));
    expect(prepared.body).toContain("Test \uFFFD details");
    expect(new URL(prepared.mailtoHref).searchParams.get("body")).toBe(prepared.body);
  });
});
