import { describe, expect, it } from "vitest";
import {
  changeOrderStatusOptions,
  changeOrderTotal,
  parseChangeOrderApprovalFormData,
  parseChangeOrderCreateFormData,
} from "./change-orders";

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

describe("change order helpers", () => {
  it("parses change order details, schedule impact, and line items", () => {
    const result = parseChangeOrderCreateFormData(
      formData({
        title: "Add covered patio",
        reason: "Owner requested a larger outdoor living area.",
        scheduleImpactDays: "5",
        clientMessage: "This adds the covered patio framing and electrical prep.",
        internalNotes: "Confirm beam lead time before sending.",
        description: ["Patio framing labor", "Electrical rough-in allowance", ""],
        quantity: ["18", "1", ""],
        unitPrice: ["92", "2400", ""],
      }),
    );

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Add covered patio",
        reason: "Owner requested a larger outdoor living area.",
        scheduleImpactDays: 5,
        clientMessage: "This adds the covered patio framing and electrical prep.",
        internalNotes: "Confirm beam lead time before sending.",
        lineItems: [
          { description: "Patio framing labor", quantity: 18, unitPrice: 92 },
          { description: "Electrical rough-in allowance", quantity: 1, unitPrice: 2400 },
        ],
      },
    });
  });

  it("rejects missing required fields with a clear first error", () => {
    const result = parseChangeOrderCreateFormData(
      formData({
        title: "",
        reason: "Owner request.",
        scheduleImpactDays: "0",
        clientMessage: "Client message.",
        description: ["Labor"],
        quantity: ["1"],
        unitPrice: ["100"],
      }),
    );

    expect(result).toEqual({ ok: false, reason: "Change order title is required." });
  });

  it("requires at least one complete line item", () => {
    const result = parseChangeOrderCreateFormData(
      formData({
        title: "Upgrade tile",
        reason: "Selection change.",
        scheduleImpactDays: "2",
        clientMessage: "Tile upgrade summary.",
        description: [""],
        quantity: [""],
        unitPrice: [""],
      }),
    );

    expect(result).toEqual({ ok: false, reason: "Add at least one change order line item." });
  });

  it("ignores untouched template rows with default quantity when one line item is complete", () => {
    const result = parseChangeOrderCreateFormData(
      formData({
        title: "Upgrade tile",
        reason: "Selection change.",
        scheduleImpactDays: "2",
        clientMessage: "Tile upgrade summary.",
        description: ["Tile upgrade allowance", "", "", ""],
        quantity: ["1", "1", "1", "1"],
        unitPrice: ["3200", "", "", ""],
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        lineItems: [{ description: "Tile upgrade allowance", quantity: 1, unitPrice: 3200 }],
      },
    });
  });

  it("calculates the change order total", () => {
    expect(
      changeOrderTotal([
        { quantity: 2, unitPrice: 150 },
        { quantity: 1.5, unitPrice: 80 },
      ]),
    ).toBe(420);
  });

  it("exposes approval-friendly statuses", () => {
    expect(changeOrderStatusOptions.map((option) => option.value)).toEqual([
      "draft",
      "sent",
      "approved",
      "declined",
    ]);
  });

  it("parses a client change order approval", () => {
    expect(parseChangeOrderApprovalFormData(formData({ approvedByName: " Avery Thompson " }))).toEqual({
      ok: true,
      data: {
        approvedByName: "Avery Thompson",
      },
    });
  });

  it("rejects change order approval without a signer name", () => {
    expect(parseChangeOrderApprovalFormData(formData({ approvedByName: " " }))).toEqual({
      ok: false,
      reason: "Enter your name to approve this change order.",
    });
  });
});
