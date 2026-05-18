import { describe, expect, it } from "vitest";
import { parseProjectFinancialTargetFormData } from "./project-financials";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("project financial target helpers", () => {
  it("parses contract value, budgeted cost, target margin, and contingency", () => {
    expect(
      parseProjectFinancialTargetFormData(
        formData({
          contractValue: "950000",
          budgetedCost: "760000",
          targetMarginPercent: "20",
          contingencyPercent: "5",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        contractValue: 950000,
        budgetedCost: 760000,
        targetMarginPercent: 20,
        contingencyPercent: 5,
      },
    });
  });

  it("rejects impossible margin percentages", () => {
    expect(
      parseProjectFinancialTargetFormData(
        formData({
          contractValue: "950000",
          budgetedCost: "760000",
          targetMarginPercent: "120",
          contingencyPercent: "5",
        }),
      ),
    ).toEqual({ ok: false, reason: "Use a target margin between 0 and 100." });
  });
});
