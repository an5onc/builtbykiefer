import { getTrimmedValue, isIsoDate, parseNonNegativeMoney } from "./form-utils";
import type { SelectionStatus } from "./types";

export interface SelectionCreateInput {
  category: string;
  title: string;
  allowanceAmount: number;
  selectedOption: string;
  vendor: string;
  dueDate: string;
  status: SelectionStatus;
  internalNotes: string;
  clientNotes: string;
}

export interface SelectionApprovalInput {
  approvedByName: string;
}

export type SelectionCreateParseResult =
  | { ok: true; data: SelectionCreateInput }
  | { ok: false; reason: string };

export type SelectionApprovalParseResult =
  | { ok: true; data: SelectionApprovalInput }
  | { ok: false; reason: string };

export const selectionStatusOptions: { value: SelectionStatus; label: string }[] = [
  { value: "needed", label: "Needed" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "ordered", label: "Ordered" },
];

const statusValues = new Set<SelectionStatus>(selectionStatusOptions.map((option) => option.value));

export function parseSelectionCreateFormData(formData: FormData): SelectionCreateParseResult {
  const category = getTrimmedValue(formData, "category");
  const title = getTrimmedValue(formData, "title");
  const allowanceAmount = parseNonNegativeMoney(getTrimmedValue(formData, "allowanceAmount"));
  const selectedOption = getTrimmedValue(formData, "selectedOption");
  const vendor = getTrimmedValue(formData, "vendor");
  const dueDate = getTrimmedValue(formData, "dueDate");
  const status = getTrimmedValue(formData, "status");
  const internalNotes = getTrimmedValue(formData, "internalNotes");
  const clientNotes = getTrimmedValue(formData, "clientNotes");

  if (!category) {
    return { ok: false, reason: "Selection category is required." };
  }

  if (!title) {
    return { ok: false, reason: "Selection title is required." };
  }

  if (allowanceAmount === null) {
    return { ok: false, reason: "Use a valid allowance amount." };
  }

  if (!dueDate || !isIsoDate(dueDate)) {
    return { ok: false, reason: "Use a valid due date." };
  }

  if (!statusValues.has(status as SelectionStatus)) {
    return { ok: false, reason: "Choose a valid selection status." };
  }

  return {
    ok: true,
    data: {
      category,
      title,
      allowanceAmount,
      selectedOption,
      vendor,
      dueDate,
      status: status as SelectionStatus,
      internalNotes,
      clientNotes,
    },
  };
}

export function parseSelectionApprovalFormData(formData: FormData): SelectionApprovalParseResult {
  const approvedByName = getTrimmedValue(formData, "approvedByName");

  if (!approvedByName) {
    return { ok: false, reason: "Enter your name to approve this selection." };
  }

  return {
    ok: true,
    data: {
      approvedByName,
    },
  };
}
