import { describe, expect, it } from "vitest";
import { parseProjectFileCreateFormData } from "./project-files";

describe("project file helpers", () => {
  it("parses a customer-visible photo upload", () => {
    const formData = new FormData();
    formData.set("name", "Kitchen progress photos");
    formData.set("fileType", "photo");
    formData.set("visibility", "customer");
    formData.set("file", new File(["photo-bytes"], "kitchen progress.jpg", { type: "image/jpeg" }));

    expect(parseProjectFileCreateFormData("project-1", formData)).toEqual({
      ok: true,
      data: {
        name: "Kitchen progress photos",
        type: "photo",
        visibility: "customer",
        file: expect.any(File),
        storageBucket: "project-photos",
        storagePath: expect.stringMatching(/^project-1\/photos\/[a-z0-9-]+-kitchen-progress\.jpg$/),
        sizeLabel: "11 B",
      },
    });
  });

  it("uses the original file name when the display name is blank", () => {
    const formData = new FormData();
    formData.set("fileType", "document");
    formData.set("visibility", "internal");
    formData.set("file", new File(["contract"], "Signed Contract.pdf", { type: "application/pdf" }));

    expect(parseProjectFileCreateFormData("project-1", formData)).toMatchObject({
      ok: true,
      data: {
        name: "Signed Contract.pdf",
        type: "document",
        visibility: "internal",
        storageBucket: "project-documents",
        sizeLabel: "8 B",
      },
    });
  });

  it("rejects a missing file", () => {
    const formData = new FormData();
    formData.set("name", "Progress photo");
    formData.set("fileType", "photo");
    formData.set("visibility", "customer");

    expect(parseProjectFileCreateFormData("project-1", formData)).toEqual({
      ok: false,
      reason: "Choose a file to upload.",
    });
  });

  it("rejects file types that the selected bucket cannot store", () => {
    const formData = new FormData();
    formData.set("name", "Selections sheet");
    formData.set("fileType", "document");
    formData.set("visibility", "internal");
    formData.set("file", new File(["sheet"], "selections.xlsx", { type: "application/vnd.ms-excel" }));

    expect(parseProjectFileCreateFormData("project-1", formData)).toEqual({
      ok: false,
      reason: "Upload a PDF, PNG, or JPG file for documents and invoices.",
    });
  });
});
