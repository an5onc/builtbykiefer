import type { FileVisibility } from "./types";

export interface ProjectCommentCreateInput {
  authorName: string;
  body: string;
  visibility: FileVisibility;
}

export type ProjectCommentCreateParseResult =
  | { ok: true; data: ProjectCommentCreateInput }
  | { ok: false; reason: string };

export const projectCommentVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "internal", label: "Internal" },
  { value: "customer", label: "Customer" },
];

const visibilityValues = new Set<FileVisibility>(
  projectCommentVisibilityOptions.map((option) => option.value),
);

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function parseProjectCommentCreateFormData(
  formData: FormData,
): ProjectCommentCreateParseResult {
  const authorName = getTrimmedValue(formData, "authorName");
  const body = getTrimmedValue(formData, "body");
  const visibility = getTrimmedValue(formData, "visibility");

  if (!authorName) {
    return { ok: false, reason: "Author name is required." };
  }

  if (!body) {
    return { ok: false, reason: "Comment body is required." };
  }

  if (!visibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid comment visibility." };
  }

  return {
    ok: true,
    data: {
      authorName,
      body,
      visibility: visibility as FileVisibility,
    },
  };
}
