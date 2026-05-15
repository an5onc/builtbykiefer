import { describe, expect, it } from "vitest";
import { parseVendorSubmittalFormData, parseVendorSubmittalReviewFormData } from "./vendor-submittals";

describe("vendor submittal helpers", () => {
  it("parses a vendor uploaded submittal into a private project storage path", () => {
    const formData = new FormData();
    formData.set("projectId", "project-1");
    formData.set("assignmentId", "assignment-1");
    formData.set("title", "Cabinet shop drawings");
    formData.set("category", "submittal");
    formData.set("file", new File(["drawing-bytes"], "Cabinet Shop Drawings.pdf", { type: "application/pdf" }));

    expect(parseVendorSubmittalFormData({ vendorId: "vendor-1", formData })).toEqual({
      ok: true,
      data: {
        projectId: "project-1",
        vendorId: "vendor-1",
        assignmentId: "assignment-1",
        title: "Cabinet shop drawings",
        category: "submittal",
        file: expect.any(File),
        storageBucket: "project-documents",
        storagePath: expect.stringMatching(
          /^project-1\/vendor-submittals\/vendor-1\/[a-z0-9-]+-cabinet-shop-drawings\.pdf$/,
        ),
        mimeType: "application/pdf",
        sizeLabel: "13 B",
      },
    });
  });

  it("rejects unsupported vendor submittal files", () => {
    const formData = new FormData();
    formData.set("projectId", "project-1");
    formData.set("assignmentId", "assignment-1");
    formData.set("title", "Workbook");
    formData.set("category", "submittal");
    formData.set("file", new File(["workbook"], "schedule.xlsx", { type: "application/vnd.ms-excel" }));

    expect(parseVendorSubmittalFormData({ vendorId: "vendor-1", formData })).toEqual({
      ok: false,
      reason: "Upload a PDF, PNG, or JPG file for vendor submittals.",
    });
  });

  it("parses manager review status and comments", () => {
    const formData = new FormData();
    formData.set("submittalId", "submittal-1");
    formData.set("projectId", "project-1");
    formData.set("status", "approved");
    formData.set("reviewComment", "Approved for fabrication. Keep finish sample on file.");

    expect(parseVendorSubmittalReviewFormData(formData)).toEqual({
      ok: true,
      data: {
        submittalId: "submittal-1",
        projectId: "project-1",
        status: "approved",
        reviewComment: "Approved for fabrication. Keep finish sample on file.",
      },
    });
  });

  it("requires a valid manager review status", () => {
    const formData = new FormData();
    formData.set("submittalId", "submittal-1");
    formData.set("projectId", "project-1");
    formData.set("status", "waiting");

    expect(parseVendorSubmittalReviewFormData(formData)).toEqual({
      ok: false,
      reason: "Choose a valid review status.",
    });
  });
});
