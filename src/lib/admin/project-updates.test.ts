import { describe, expect, it } from "vitest";
import { parseProjectUpdateCreateFormData, projectUpdateVisibilityOptions } from "./project-updates";

function formData(values: Record<string, string>) {
  const data = new FormData();

  Object.entries(values).forEach(([key, value]) => data.set(key, value));

  return data;
}

describe("project update helpers", () => {
  it("parses a customer-visible project update", () => {
    expect(
      parseProjectUpdateCreateFormData(
        formData({
          title: "Rough-in inspection passed",
          body: "Electrical and plumbing rough-ins passed inspection today.",
          visibility: "customer",
          updateDate: "2026-05-13",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        title: "Rough-in inspection passed",
        body: "Electrical and plumbing rough-ins passed inspection today.",
        visibility: "customer",
        updateDate: "2026-05-13",
      },
    });
  });

  it("rejects invalid update input with a clear first error", () => {
    expect(
      parseProjectUpdateCreateFormData(
        formData({
          title: "",
          body: "Inspection update",
          visibility: "customer",
          updateDate: "2026-05-13",
        }),
      ),
    ).toEqual({ ok: false, reason: "Update title is required." });
  });

  it("exposes internal and customer visibility options", () => {
    expect(projectUpdateVisibilityOptions.map((option) => option.value)).toEqual([
      "customer",
      "internal",
    ]);
  });
});
