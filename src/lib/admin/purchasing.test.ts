import { describe, expect, it } from "vitest";
import {
  billStatusOptions,
  parseBillCreateFormData,
  parsePurchaseOrderCreateFormData,
  purchaseOrderStatusOptions,
} from "./purchasing";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("purchasing helpers", () => {
  it("parses a purchase order", () => {
    expect(
      parsePurchaseOrderCreateFormData(
        formData({
          title: "Cabinet deposit",
          vendor: "Front Range Cabinetry",
          amount: "18500",
          dueDate: "2026-05-30",
          status: "sent",
          notes: "Deposit to release shop drawings.",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        title: "Cabinet deposit",
        vendor: "Front Range Cabinetry",
        amount: 18500,
        dueDate: "2026-05-30",
        status: "sent",
        notes: "Deposit to release shop drawings.",
      },
    });
  });

  it("parses a bill", () => {
    expect(
      parseBillCreateFormData(
        formData({
          billNumber: "BILL-1042",
          vendor: "Rocky Mountain Tile",
          amount: "2400.50",
          dueDate: "2026-06-05",
          status: "received",
          notes: "Tile material invoice.",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        billNumber: "BILL-1042",
        vendor: "Rocky Mountain Tile",
        amount: 2400.5,
        dueDate: "2026-06-05",
        status: "received",
        notes: "Tile material invoice.",
      },
    });
  });

  it("rejects invalid money values", () => {
    expect(
      parsePurchaseOrderCreateFormData(
        formData({
          title: "Cabinet deposit",
          vendor: "Front Range Cabinetry",
          amount: "-1",
          dueDate: "2026-05-30",
          status: "draft",
          notes: "",
        }),
      ),
    ).toEqual({ ok: false, reason: "Use a valid amount." });
  });

  it("exposes expected statuses", () => {
    expect(purchaseOrderStatusOptions.map((option) => option.value)).toEqual([
      "draft",
      "sent",
      "approved",
      "received",
    ]);
    expect(billStatusOptions.map((option) => option.value)).toEqual(["draft", "received", "paid"]);
  });
});
