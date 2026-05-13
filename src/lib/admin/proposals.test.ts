import { describe, expect, it } from "vitest";
import {
  parseProposalCreateFormData,
  proposalStatusOptions,
  proposalTotal,
} from "./proposals";

function formData(values: Record<string, string | string[]>) {
  const data = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => data.append(key, item));
      return;
    }

    data.set(key, value);
  });

  return data;
}

describe("proposal helpers", () => {
  it("parses a proposal form with sections, optional items, and notes", () => {
    const result = parseProposalCreateFormData(
      formData({
        title: "Guest Suite Addition",
        scopeSummary: "Frame and finish a guest suite above the garage.",
        validUntil: "2026-06-15",
        internalNotes: "Confirm steel allowance before sending.",
        section: ["Base Scope", "Allowance", ""],
        description: ["Framing labor", "Tile allowance", ""],
        quantity: ["12.5", "1", ""],
        unitPrice: ["95", "4200", ""],
        optional: ["1"],
      }),
    );

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Guest Suite Addition",
        scopeSummary: "Frame and finish a guest suite above the garage.",
        validUntil: "2026-06-15",
        internalNotes: "Confirm steel allowance before sending.",
        lineItems: [
          {
            section: "Base Scope",
            description: "Framing labor",
            quantity: 12.5,
            unitPrice: 95,
            isOptional: false,
          },
          {
            section: "Allowance",
            description: "Tile allowance",
            quantity: 1,
            unitPrice: 4200,
            isOptional: true,
          },
        ],
      },
    });
  });

  it("rejects invalid proposal input with a clear first error", () => {
    const result = parseProposalCreateFormData(
      formData({
        title: "",
        scopeSummary: "A short scope.",
        validUntil: "2026-06-15",
        section: ["Base Scope"],
        description: ["Labor"],
        quantity: ["1"],
        unitPrice: ["100"],
      }),
    );

    expect(result).toEqual({ ok: false, reason: "Proposal title is required." });
  });

  it("requires at least one complete line item", () => {
    const result = parseProposalCreateFormData(
      formData({
        title: "Kitchen Remodel",
        scopeSummary: "Replace cabinets and counters.",
        validUntil: "2026-06-15",
        section: [""],
        description: [""],
        quantity: [""],
        unitPrice: [""],
      }),
    );

    expect(result).toEqual({ ok: false, reason: "Add at least one proposal line item." });
  });

  it("calculates totals from line item quantities and unit prices", () => {
    expect(
      proposalTotal([
        { quantity: 2, unitPrice: 150 },
        { quantity: 1.5, unitPrice: 80 },
      ]),
    ).toBe(420);
  });

  it("exposes CRM-friendly proposal statuses", () => {
    expect(proposalStatusOptions.map((option) => option.value)).toEqual([
      "draft",
      "sent",
      "approved",
      "declined",
    ]);
  });
});
