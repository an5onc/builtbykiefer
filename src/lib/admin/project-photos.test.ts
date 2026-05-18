import { describe, expect, it } from "vitest";
import { parseProjectPhotoCreateFormData, projectPhotoCategoryOptions } from "./project-photos";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("project photo helpers", () => {
  it("parses a project photo record", () => {
    const data = formData({
      title: "Kitchen rough-in progress",
      photoDate: "2026-05-14",
      category: "progress",
      visibility: "customer",
      caption: "Rough-in wall prep before insulation.",
    });
    data.set("file", new File(["photo-bytes"], "Kitchen Progress.JPG", { type: "image/jpeg" }));

    expect(
      parseProjectPhotoCreateFormData("project-1", data),
    ).toEqual({
      ok: true,
      data: {
        title: "Kitchen rough-in progress",
        photoDate: "2026-05-14",
        category: "progress",
        visibility: "customer",
        caption: "Rough-in wall prep before insulation.",
        file: expect.any(File),
        storageBucket: "project-photos",
        storagePath: expect.stringMatching(/^project-1\/gallery\/[a-z0-9-]+-kitchen-progress\.jpg$/),
      },
    });
  });

  it("rejects invalid photo dates", () => {
    const data = formData({
      title: "Kitchen rough-in progress",
      photoDate: "tomorrow",
      category: "progress",
      visibility: "customer",
      caption: "",
    });
    data.set("file", new File(["photo-bytes"], "kitchen-progress.jpg", { type: "image/jpeg" }));

    expect(
      parseProjectPhotoCreateFormData("project-1", data),
    ).toEqual({ ok: false, reason: "Use a valid photo date." });
  });

  it("rejects missing photo files", () => {
    expect(
      parseProjectPhotoCreateFormData(
        "project-1",
        formData({
          title: "Kitchen rough-in progress",
          photoDate: "2026-05-14",
          category: "progress",
          visibility: "customer",
          caption: "",
        }),
      ),
    ).toEqual({ ok: false, reason: "Choose a project photo to upload." });
  });

  it("rejects non-image photo files", () => {
    const data = formData({
      title: "Kitchen rough-in progress",
      photoDate: "2026-05-14",
      category: "progress",
      visibility: "customer",
      caption: "",
    });
    data.set("file", new File(["not-photo"], "notes.pdf", { type: "application/pdf" }));

    expect(parseProjectPhotoCreateFormData("project-1", data)).toEqual({
      ok: false,
      reason: "Upload a PNG, JPG, or WebP photo.",
    });
  });

  it("exposes construction photo categories", () => {
    expect(projectPhotoCategoryOptions.map((option) => option.value)).toEqual([
      "progress",
      "selections",
      "issue",
      "before",
      "after",
      "closeout",
    ]);
  });
});
