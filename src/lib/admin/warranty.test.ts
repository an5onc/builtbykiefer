import { describe, expect, it } from "vitest";
import {
  parseWarrantyItemCreateFormData,
  warrantyItemPriorityOptions,
  warrantyItemStatusOptions,
  warrantyItemTypeOptions,
} from "./warranty";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("warranty helpers", () => {
  it("parses a warranty or punch-list item", () => {
    expect(
      parseWarrantyItemCreateFormData(
        formData({
          itemType: "punch-list",
          title: "Adjust primary bath door reveal",
          description: "Door rubs slightly at the strike side casing.",
          location: "Primary bath",
          requestedBy: "Avery Thompson",
          dueDate: "2026-06-04",
          status: "open",
          priority: "normal",
          visibility: "customer",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        itemType: "punch-list",
        title: "Adjust primary bath door reveal",
        description: "Door rubs slightly at the strike side casing.",
        location: "Primary bath",
        requestedBy: "Avery Thompson",
        dueDate: "2026-06-04",
        status: "open",
        priority: "normal",
        visibility: "customer",
      },
    });
  });

  it("rejects missing description with a clear error", () => {
    expect(
      parseWarrantyItemCreateFormData(
        formData({
          itemType: "warranty",
          title: "Touch up drywall",
          description: "",
          location: "Mudroom",
          requestedBy: "Avery Thompson",
          dueDate: "2026-06-04",
          status: "open",
          priority: "normal",
          visibility: "customer",
        }),
      ),
    ).toEqual({ ok: false, reason: "Warranty or punch-list description is required." });
  });

  it("exposes expected option sets", () => {
    expect(warrantyItemTypeOptions.map((option) => option.value)).toEqual(["warranty", "punch-list"]);
    expect(warrantyItemStatusOptions.map((option) => option.value)).toEqual([
      "open",
      "scheduled",
      "resolved",
      "closed",
    ]);
    expect(warrantyItemPriorityOptions.map((option) => option.value)).toEqual(["low", "normal", "high"]);
  });
});
