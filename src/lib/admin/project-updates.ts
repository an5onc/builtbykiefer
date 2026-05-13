import type { FileVisibility } from "./types";

export interface ProjectUpdateCreateInput {
  title: string;
  body: string;
  visibility: FileVisibility;
  updateDate: string;
}

export type ProjectUpdateCreateParseResult =
  | { ok: true; data: ProjectUpdateCreateInput }
  | { ok: false; reason: string };

export const projectUpdateVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "internal", label: "Internal" },
];

const visibilityValues = new Set<FileVisibility>(
  projectUpdateVisibilityOptions.map((option) => option.value),
);

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function parseProjectUpdateCreateFormData(
  formData: FormData,
): ProjectUpdateCreateParseResult {
  const title = getTrimmedValue(formData, "title");
  const body = getTrimmedValue(formData, "body");
  const visibility = getTrimmedValue(formData, "visibility");
  const updateDate = getTrimmedValue(formData, "updateDate");

  if (!title) {
    return { ok: false, reason: "Update title is required." };
  }

  if (!body) {
    return { ok: false, reason: "Update body is required." };
  }

  if (!visibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid update visibility." };
  }

  if (!updateDate || !isIsoDate(updateDate)) {
    return { ok: false, reason: "Use a valid update date." };
  }

  return {
    ok: true,
    data: {
      title,
      body,
      visibility: visibility as FileVisibility,
      updateDate,
    },
  };
}
