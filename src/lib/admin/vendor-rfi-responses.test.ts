import { describe, expect, it } from "vitest";
import { parseVendorRfiResponseFormData } from "./vendor-rfi-responses";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("vendor RFI response helpers", () => {
  it("parses a vendor RFI response", () => {
    expect(
      parseVendorRfiResponseFormData(
        formData({
          projectId: "project-1",
          rfiId: "rfi-1",
          vendorId: "vendor-1",
          assignmentId: "assignment-1",
          responderName: "  Morgan Fields  ",
          responseBody: "  Pulls are approved at 6 inches on center.  ",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        projectId: "project-1",
        rfiId: "rfi-1",
        vendorId: "vendor-1",
        assignmentId: "assignment-1",
        responderName: "Morgan Fields",
        responseBody: "Pulls are approved at 6 inches on center.",
      },
    });
  });

  it("rejects an empty response body", () => {
    expect(
      parseVendorRfiResponseFormData(
        formData({
          projectId: "project-1",
          rfiId: "rfi-1",
          vendorId: "vendor-1",
          assignmentId: "assignment-1",
          responderName: "Morgan Fields",
          responseBody: "",
        }),
      ),
    ).toEqual({ ok: false, reason: "Response is required." });
  });
});
