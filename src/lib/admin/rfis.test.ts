import { describe, expect, it } from "vitest";
import { parseRfiCreateFormData, rfiStatusOptions } from "./rfis";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("RFI helpers", () => {
  it("parses an RFI", () => {
    expect(
      parseRfiCreateFormData(
        formData({
          title: "Clarify shower niche layout",
          question: "Should the niche align with the valve wall or center on the tile field?",
          answer: "",
          requestedBy: "Caleb Morgan",
          dueDate: "2026-05-24",
          status: "open",
          visibility: "internal",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        title: "Clarify shower niche layout",
        question: "Should the niche align with the valve wall or center on the tile field?",
        answer: "",
        requestedBy: "Caleb Morgan",
        dueDate: "2026-05-24",
        status: "open",
        visibility: "internal",
      },
    });
  });

  it("rejects missing question with a clear error", () => {
    expect(
      parseRfiCreateFormData(
        formData({
          title: "Clarify shower niche layout",
          question: "",
          answer: "",
          requestedBy: "Caleb Morgan",
          dueDate: "2026-05-24",
          status: "open",
          visibility: "internal",
        }),
      ),
    ).toEqual({ ok: false, reason: "RFI question is required." });
  });

  it("exposes expected statuses", () => {
    expect(rfiStatusOptions.map((option) => option.value)).toEqual(["open", "answered", "closed"]);
  });
});
