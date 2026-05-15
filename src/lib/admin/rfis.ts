import { getTrimmedValue, isIsoDate } from "./form-utils";
import type { FileVisibility, RfiStatus } from "./types";

export interface RfiCreateInput {
  title: string;
  question: string;
  answer: string;
  requestedBy: string;
  dueDate: string;
  status: RfiStatus;
  visibility: FileVisibility;
}

export type RfiCreateParseResult =
  | { ok: true; data: RfiCreateInput }
  | { ok: false; reason: string };

export const rfiStatusOptions: { value: RfiStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "answered", label: "Answered" },
  { value: "closed", label: "Closed" },
];

export const rfiVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "internal", label: "Internal" },
  { value: "customer", label: "Customer" },
];

const statusValues = new Set<RfiStatus>(rfiStatusOptions.map((option) => option.value));
const visibilityValues = new Set<FileVisibility>(rfiVisibilityOptions.map((option) => option.value));

export function parseRfiCreateFormData(formData: FormData): RfiCreateParseResult {
  const title = getTrimmedValue(formData, "title");
  const question = getTrimmedValue(formData, "question");
  const answer = getTrimmedValue(formData, "answer");
  const requestedBy = getTrimmedValue(formData, "requestedBy");
  const dueDate = getTrimmedValue(formData, "dueDate");
  const status = getTrimmedValue(formData, "status");
  const visibility = getTrimmedValue(formData, "visibility");

  if (!title) {
    return { ok: false, reason: "RFI title is required." };
  }

  if (!question) {
    return { ok: false, reason: "RFI question is required." };
  }

  if (!requestedBy) {
    return { ok: false, reason: "Requested by is required." };
  }

  if (!dueDate || !isIsoDate(dueDate)) {
    return { ok: false, reason: "Use a valid due date." };
  }

  if (!statusValues.has(status as RfiStatus)) {
    return { ok: false, reason: "Choose a valid RFI status." };
  }

  if (!visibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid RFI visibility." };
  }

  return {
    ok: true,
    data: {
      title,
      question,
      answer,
      requestedBy,
      dueDate,
      status: status as RfiStatus,
      visibility: visibility as FileVisibility,
    },
  };
}
