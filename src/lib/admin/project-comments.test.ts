import { describe, expect, it } from "vitest";
import {
  parseProjectCommentCreateFormData,
  projectCommentVisibilityOptions,
} from "./project-comments";

function formData(values: Record<string, string>) {
  const data = new FormData();

  Object.entries(values).forEach(([key, value]) => data.set(key, value));

  return data;
}

describe("project comment helpers", () => {
  it("parses a client-visible project comment", () => {
    expect(
      parseProjectCommentCreateFormData(
        formData({
          authorName: "Avery Thompson",
          body: "Client approved the tile direction during the site walk.",
          visibility: "customer",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        authorName: "Avery Thompson",
        body: "Client approved the tile direction during the site walk.",
        visibility: "customer",
      },
    });
  });

  it("rejects empty comment body with a clear error", () => {
    expect(
      parseProjectCommentCreateFormData(
        formData({
          authorName: "Avery Thompson",
          body: "",
          visibility: "internal",
        }),
      ),
    ).toEqual({ ok: false, reason: "Comment body is required." });
  });

  it("exposes internal and customer visibility options", () => {
    expect(projectCommentVisibilityOptions.map((option) => option.value)).toEqual([
      "internal",
      "customer",
    ]);
  });
});
