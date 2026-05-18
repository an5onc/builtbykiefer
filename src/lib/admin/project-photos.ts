import { getTrimmedValue, isIsoDate } from "./form-utils";
import type { FileVisibility, ProjectPhotoCategory } from "./types";

export interface ProjectPhotoCreateInput {
  title: string;
  photoDate: string;
  category: ProjectPhotoCategory;
  visibility: FileVisibility;
  caption: string;
  file: File;
  storageBucket: string;
  storagePath: string;
}

export type ProjectPhotoCreateParseResult =
  | { ok: true; data: ProjectPhotoCreateInput }
  | { ok: false; reason: string };

export const projectPhotoCategoryOptions: { value: ProjectPhotoCategory; label: string }[] = [
  { value: "progress", label: "Progress" },
  { value: "selections", label: "Selections" },
  { value: "issue", label: "Issue" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
  { value: "closeout", label: "Closeout" },
];

export const projectPhotoVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "internal", label: "Internal" },
];

const categoryValues = new Set<ProjectPhotoCategory>(projectPhotoCategoryOptions.map((option) => option.value));
const visibilityValues = new Set<FileVisibility>(projectPhotoVisibilityOptions.map((option) => option.value));
const photoMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function slugifyFileName(fileName: string) {
  const extension = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : "";
  const baseName = extension ? fileName.slice(0, -(extension.length + 1)) : fileName;
  const slug =
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project-photo";

  return extension ? `${slug}.${extension}` : slug;
}

export function parseProjectPhotoCreateFormData(
  projectId: string,
  formData: FormData,
): ProjectPhotoCreateParseResult {
  const title = getTrimmedValue(formData, "title");
  const photoDate = getTrimmedValue(formData, "photoDate");
  const category = getTrimmedValue(formData, "category");
  const visibility = getTrimmedValue(formData, "visibility");
  const caption = getTrimmedValue(formData, "caption");
  const file = formData.get("file");

  if (!title) {
    return { ok: false, reason: "Photo title is required." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, reason: "Choose a project photo to upload." };
  }

  if (!photoDate || !isIsoDate(photoDate)) {
    return { ok: false, reason: "Use a valid photo date." };
  }

  if (!categoryValues.has(category as ProjectPhotoCategory)) {
    return { ok: false, reason: "Choose a valid photo category." };
  }

  if (!visibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid photo visibility." };
  }

  if (!photoMimeTypes.has(file.type)) {
    return { ok: false, reason: "Upload a PNG, JPG, or WebP photo." };
  }

  const uniquePrefix = Date.now().toString(36);
  const safeFileName = slugifyFileName(file.name);

  return {
    ok: true,
    data: {
      title,
      photoDate,
      category: category as ProjectPhotoCategory,
      visibility: visibility as FileVisibility,
      caption,
      file,
      storageBucket: "project-photos",
      storagePath: `${projectId}/gallery/${uniquePrefix}-${safeFileName}`,
    },
  };
}
