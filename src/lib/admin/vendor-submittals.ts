import { formatFileSizeLabel } from "./project-files";
import type { VendorSubmittalCategory, VendorSubmittalStatus } from "./types";

export interface VendorSubmittalCreateInput {
  projectId: string;
  vendorId: string;
  assignmentId: string;
  title: string;
  category: VendorSubmittalCategory;
  file: File;
  storageBucket: string;
  storagePath: string;
  mimeType: string;
  sizeLabel: string;
}

export type VendorSubmittalCreateParseResult =
  | { ok: true; data: VendorSubmittalCreateInput }
  | { ok: false; reason: string };

export interface VendorSubmittalReviewInput {
  status: VendorSubmittalStatus;
  reviewComment: string;
}

export type VendorSubmittalReviewParseResult =
  | { ok: true; data: VendorSubmittalReviewInput & { submittalId: string; projectId: string } }
  | { ok: false; reason: string };

export const vendorSubmittalCategoryOptions: { value: VendorSubmittalCategory; label: string }[] = [
  { value: "submittal", label: "Submittal" },
  { value: "insurance", label: "Insurance" },
  { value: "w9", label: "W-9" },
  { value: "closeout", label: "Closeout" },
  { value: "warranty", label: "Warranty" },
  { value: "other", label: "Other" },
];

export const vendorSubmittalReviewStatusOptions: { value: VendorSubmittalStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const categoryValues = new Set(vendorSubmittalCategoryOptions.map((option) => option.value));
const reviewStatusValues = new Set(vendorSubmittalReviewStatusOptions.map((option) => option.value));
const supportedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

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

export function parseVendorSubmittalFormData({
  vendorId,
  formData,
}: {
  vendorId: string;
  formData: FormData;
}): VendorSubmittalCreateParseResult {
  const projectId = getTrimmedValue(formData, "projectId");
  const assignmentId = getTrimmedValue(formData, "assignmentId");
  const title = getTrimmedValue(formData, "title");
  const category = getTrimmedValue(formData, "category");
  const file = formData.get("file");

  if (!projectId || !assignmentId) {
    return { ok: false, reason: "Choose a valid project assignment before uploading." };
  }

  if (!title) {
    return { ok: false, reason: "Add a title for the vendor submittal." };
  }

  if (!categoryValues.has(category as VendorSubmittalCategory)) {
    return { ok: false, reason: "Choose a valid submittal category." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, reason: "Choose a vendor submittal file to upload." };
  }

  if (!supportedMimeTypes.has(file.type)) {
    return { ok: false, reason: "Upload a PDF, PNG, or JPG file for vendor submittals." };
  }

  const safeFileName = slugifyFileName(file.name);
  const uniquePrefix = Date.now().toString(36);

  return {
    ok: true,
    data: {
      projectId,
      vendorId,
      assignmentId,
      title,
      category: category as VendorSubmittalCategory,
      file,
      storageBucket: "project-documents",
      storagePath: `${projectId}/vendor-submittals/${vendorId}/${uniquePrefix}-${safeFileName}`,
      mimeType: file.type,
      sizeLabel: formatFileSizeLabel(file.size),
    },
  };
}

export function parseVendorSubmittalReviewFormData(formData: FormData): VendorSubmittalReviewParseResult {
  const submittalId = getTrimmedValue(formData, "submittalId");
  const projectId = getTrimmedValue(formData, "projectId");
  const status = getTrimmedValue(formData, "status");
  const reviewComment = getTrimmedValue(formData, "reviewComment");

  if (!submittalId || !projectId) {
    return { ok: false, reason: "Choose a valid vendor submittal before saving review notes." };
  }

  if (!reviewStatusValues.has(status as VendorSubmittalStatus)) {
    return { ok: false, reason: "Choose a valid review status." };
  }

  return {
    ok: true,
    data: {
      submittalId,
      projectId,
      status: status as VendorSubmittalStatus,
      reviewComment,
    },
  };
}
