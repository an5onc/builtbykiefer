import type { FileVisibility, ProjectFile } from "./types";

export interface ProjectFileCreateInput {
  name: string;
  type: ProjectFile["type"];
  visibility: FileVisibility;
  file: File;
  storageBucket: string;
  storagePath: string;
  sizeLabel: string;
}

export type ProjectFileCreateParseResult =
  | { ok: true; data: ProjectFileCreateInput }
  | { ok: false; reason: string };

export const projectFileTypeOptions: { value: ProjectFile["type"]; label: string }[] = [
  { value: "photo", label: "Photo" },
  { value: "document", label: "Document" },
  { value: "invoice", label: "Invoice" },
];

export const projectFileVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "internal", label: "Internal" },
];

const fileTypeValues = new Set<ProjectFile["type"]>(
  projectFileTypeOptions.map((option) => option.value),
);
const visibilityValues = new Set<FileVisibility>(
  projectFileVisibilityOptions.map((option) => option.value),
);
const photoMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const documentMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function slugifyFileName(fileName: string) {
  const extension = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : "";
  const baseName = extension ? fileName.slice(0, -(extension.length + 1)) : fileName;
  const slug =
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload";

  return extension ? `${slug}.${extension}` : slug;
}

function fileFolder(type: ProjectFile["type"]) {
  if (type === "photo") {
    return "photos";
  }

  if (type === "invoice") {
    return "invoices";
  }

  return "documents";
}

function storageBucket(type: ProjectFile["type"]) {
  return type === "photo" ? "project-photos" : "project-documents";
}

function validateMimeType(type: ProjectFile["type"], mimeType: string) {
  if (type === "photo") {
    return photoMimeTypes.has(mimeType)
      ? null
      : "Upload a PNG, JPG, or WebP file for photos.";
  }

  return documentMimeTypes.has(mimeType)
    ? null
    : "Upload a PDF, PNG, or JPG file for documents and invoices.";
}

export function formatFileSizeLabel(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function parseProjectFileCreateFormData(
  projectId: string,
  formData: FormData,
): ProjectFileCreateParseResult {
  const name = getTrimmedValue(formData, "name");
  const fileType = getTrimmedValue(formData, "fileType");
  const visibility = getTrimmedValue(formData, "visibility");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, reason: "Choose a file to upload." };
  }

  if (!fileTypeValues.has(fileType as ProjectFile["type"])) {
    return { ok: false, reason: "Choose a valid file type." };
  }

  if (!visibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid file visibility." };
  }

  const type = fileType as ProjectFile["type"];
  const mimeTypeError = validateMimeType(type, file.type);

  if (mimeTypeError) {
    return { ok: false, reason: mimeTypeError };
  }

  const safeFileName = slugifyFileName(file.name);
  const uniquePrefix = Date.now().toString(36);

  return {
    ok: true,
    data: {
      name: name || file.name,
      type,
      visibility: visibility as FileVisibility,
      file,
      storageBucket: storageBucket(type),
      storagePath: `${projectId}/${fileFolder(type)}/${uniquePrefix}-${safeFileName}`,
      sizeLabel: formatFileSizeLabel(file.size),
    },
  };
}
