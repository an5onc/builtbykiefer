import { getTrimmedValue, isIsoDate } from "./form-utils";
import type { FileVisibility, WarrantyItemPriority, WarrantyItemStatus, WarrantyItemType } from "./types";

export interface WarrantyItemCreateInput {
  itemType: WarrantyItemType;
  title: string;
  description: string;
  location: string;
  requestedBy: string;
  dueDate: string;
  status: WarrantyItemStatus;
  priority: WarrantyItemPriority;
  visibility: FileVisibility;
}

export type WarrantyItemCreateParseResult =
  | { ok: true; data: WarrantyItemCreateInput }
  | { ok: false; reason: string };

export const warrantyItemTypeOptions: { value: WarrantyItemType; label: string }[] = [
  { value: "warranty", label: "Warranty" },
  { value: "punch-list", label: "Punch List" },
];

export const warrantyItemStatusOptions: { value: WarrantyItemStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "scheduled", label: "Scheduled" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const warrantyItemPriorityOptions: { value: WarrantyItemPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

export const warrantyItemVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "internal", label: "Internal" },
  { value: "customer", label: "Customer" },
];

const itemTypeValues = new Set<WarrantyItemType>(warrantyItemTypeOptions.map((option) => option.value));
const statusValues = new Set<WarrantyItemStatus>(warrantyItemStatusOptions.map((option) => option.value));
const priorityValues = new Set<WarrantyItemPriority>(warrantyItemPriorityOptions.map((option) => option.value));
const visibilityValues = new Set<FileVisibility>(warrantyItemVisibilityOptions.map((option) => option.value));

export function parseWarrantyItemCreateFormData(formData: FormData): WarrantyItemCreateParseResult {
  const itemType = getTrimmedValue(formData, "itemType");
  const title = getTrimmedValue(formData, "title");
  const description = getTrimmedValue(formData, "description");
  const location = getTrimmedValue(formData, "location");
  const requestedBy = getTrimmedValue(formData, "requestedBy");
  const dueDate = getTrimmedValue(formData, "dueDate");
  const status = getTrimmedValue(formData, "status");
  const priority = getTrimmedValue(formData, "priority");
  const visibility = getTrimmedValue(formData, "visibility");

  if (!itemTypeValues.has(itemType as WarrantyItemType)) {
    return { ok: false, reason: "Choose warranty or punch list." };
  }

  if (!title) {
    return { ok: false, reason: "Warranty or punch-list title is required." };
  }

  if (!description) {
    return { ok: false, reason: "Warranty or punch-list description is required." };
  }

  if (!requestedBy) {
    return { ok: false, reason: "Requested by is required." };
  }

  if (!dueDate || !isIsoDate(dueDate)) {
    return { ok: false, reason: "Use a valid due date." };
  }

  if (!statusValues.has(status as WarrantyItemStatus)) {
    return { ok: false, reason: "Choose a valid warranty or punch-list status." };
  }

  if (!priorityValues.has(priority as WarrantyItemPriority)) {
    return { ok: false, reason: "Choose a valid priority." };
  }

  if (!visibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid visibility." };
  }

  return {
    ok: true,
    data: {
      itemType: itemType as WarrantyItemType,
      title,
      description,
      location,
      requestedBy,
      dueDate,
      status: status as WarrantyItemStatus,
      priority: priority as WarrantyItemPriority,
      visibility: visibility as FileVisibility,
    },
  };
}
