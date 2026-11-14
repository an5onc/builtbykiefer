import { businessContact } from "@/lib/public-site/business";

export const vendorRecipient = "marlys@kbuiltco.com";

const vendorFields = [
  ["companyName", "Company Name"],
  ["companyWebsite", "Company Website"],
  ["contactName", "Contact Name"],
  ["jobTitle", "Contact Job Title"],
  ["phone", "Contact Phone"],
  ["email", "Email Address"],
  ["address", "Street Address"],
  ["city", "City"],
  ["state", "State"],
  ["zip", "ZIP Code"],
  ["description", "Company Description / Goods or Services Being Offered"],
] as const;

function encodeComponent(value: string) {
  // Browser input can contain a lone UTF-16 surrogate. Keep a usable recovery copy.
  let wellFormed = "";
  for (const character of value) {
    const code = character.charCodeAt(0);
    wellFormed += character.length === 1 && code >= 0xd800 && code <= 0xdfff ? "\uFFFD" : character;
  }
  return encodeURIComponent(wellFormed);
}

export function prepareVendorEmail(formData: FormData) {
  const values = vendorFields.map(([key, label]) => [label, String(formData.get(key) ?? "").trim()] as const);
  const companyName = values[0][1];
  const subject = `Vendor inquiry from ${companyName || "new supplier"}`;
  const body = ["Vendor / Supplier Inquiry", "", ...values.map(([label, value]) => `${label}: ${value}`)].join("\n");
  return {
    subject,
    body,
    mailtoHref: `mailto:${vendorRecipient}?cc=${encodeComponent(businessContact.email)}&subject=${encodeComponent(subject)}&body=${encodeComponent(body)}`,
    recoveryText: [
      "Prepared vendor email — not sent by this website.",
      `To: ${vendorRecipient}`,
      `Cc: ${businessContact.email}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\n"),
  };
}

export type PreparedVendorEmail = ReturnType<typeof prepareVendorEmail>;
