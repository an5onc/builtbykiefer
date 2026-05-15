import { describe, expect, it } from "vitest";
import { parseSelectionApprovalFormData, parseSelectionCreateFormData, selectionStatusOptions } from "./selections";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("selection helpers", () => {
  it("parses a project selection", () => {
    expect(
      parseSelectionCreateFormData(
        formData({
          category: "Tile",
          title: "Primary bath floor tile",
          allowanceAmount: "4200",
          selectedOption: "Large format porcelain",
          vendor: "Flooring Studio",
          dueDate: "2026-05-29",
          status: "submitted",
          internalNotes: "Confirm lead time before ordering.",
          clientNotes: "Owner prefers warm gray.",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        category: "Tile",
        title: "Primary bath floor tile",
        allowanceAmount: 4200,
        selectedOption: "Large format porcelain",
        vendor: "Flooring Studio",
        dueDate: "2026-05-29",
        status: "submitted",
        internalNotes: "Confirm lead time before ordering.",
        clientNotes: "Owner prefers warm gray.",
      },
    });
  });

  it("rejects missing title with a clear error", () => {
    expect(
      parseSelectionCreateFormData(
        formData({
          category: "Tile",
          title: "",
          allowanceAmount: "4200",
          selectedOption: "",
          vendor: "",
          dueDate: "2026-05-29",
          status: "needed",
          internalNotes: "",
          clientNotes: "",
        }),
      ),
    ).toEqual({ ok: false, reason: "Selection title is required." });
  });

  it("exposes expected statuses", () => {
    expect(selectionStatusOptions.map((option) => option.value)).toEqual([
      "needed",
      "submitted",
      "approved",
      "ordered",
    ]);
  });

  it("parses a client selection approval", () => {
    expect(parseSelectionApprovalFormData(formData({ approvedByName: " Avery Thompson " }))).toEqual({
      ok: true,
      data: {
        approvedByName: "Avery Thompson",
      },
    });
  });

  it("rejects selection approval without a signer name", () => {
    expect(parseSelectionApprovalFormData(formData({ approvedByName: " " }))).toEqual({
      ok: false,
      reason: "Enter your name to approve this selection.",
    });
  });
});
