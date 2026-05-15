import { getTrimmedValue, isIsoDate, parseNonNegativeMoney } from "./form-utils";
import type { BillStatus, PurchaseOrderStatus } from "./types";

export interface PurchaseOrderCreateInput {
  title: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: PurchaseOrderStatus;
  notes: string;
}

export interface BillCreateInput {
  billNumber: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  notes: string;
}

type ParseResult<T> = { ok: true; data: T } | { ok: false; reason: string };

export const purchaseOrderStatusOptions: { value: PurchaseOrderStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "approved", label: "Approved" },
  { value: "received", label: "Received" },
];

export const billStatusOptions: { value: BillStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "received", label: "Received" },
  { value: "paid", label: "Paid" },
];

const purchaseOrderStatusValues = new Set<PurchaseOrderStatus>(
  purchaseOrderStatusOptions.map((option) => option.value),
);
const billStatusValues = new Set<BillStatus>(billStatusOptions.map((option) => option.value));

export function parsePurchaseOrderCreateFormData(
  formData: FormData,
): ParseResult<PurchaseOrderCreateInput> {
  const title = getTrimmedValue(formData, "title");
  const vendor = getTrimmedValue(formData, "vendor");
  const amount = parseNonNegativeMoney(getTrimmedValue(formData, "amount"));
  const dueDate = getTrimmedValue(formData, "dueDate");
  const status = getTrimmedValue(formData, "status");
  const notes = getTrimmedValue(formData, "notes");

  if (!title) {
    return { ok: false, reason: "Purchase order title is required." };
  }

  if (!vendor) {
    return { ok: false, reason: "Vendor is required." };
  }

  if (amount === null) {
    return { ok: false, reason: "Use a valid amount." };
  }

  if (!dueDate || !isIsoDate(dueDate)) {
    return { ok: false, reason: "Use a valid due date." };
  }

  if (!purchaseOrderStatusValues.has(status as PurchaseOrderStatus)) {
    return { ok: false, reason: "Choose a valid purchase order status." };
  }

  return {
    ok: true,
    data: {
      title,
      vendor,
      amount,
      dueDate,
      status: status as PurchaseOrderStatus,
      notes,
    },
  };
}

export function parseBillCreateFormData(formData: FormData): ParseResult<BillCreateInput> {
  const billNumber = getTrimmedValue(formData, "billNumber");
  const vendor = getTrimmedValue(formData, "vendor");
  const amount = parseNonNegativeMoney(getTrimmedValue(formData, "amount"));
  const dueDate = getTrimmedValue(formData, "dueDate");
  const status = getTrimmedValue(formData, "status");
  const notes = getTrimmedValue(formData, "notes");

  if (!billNumber) {
    return { ok: false, reason: "Bill number is required." };
  }

  if (!vendor) {
    return { ok: false, reason: "Vendor is required." };
  }

  if (amount === null) {
    return { ok: false, reason: "Use a valid amount." };
  }

  if (!dueDate || !isIsoDate(dueDate)) {
    return { ok: false, reason: "Use a valid due date." };
  }

  if (!billStatusValues.has(status as BillStatus)) {
    return { ok: false, reason: "Choose a valid bill status." };
  }

  return {
    ok: true,
    data: {
      billNumber,
      vendor,
      amount,
      dueDate,
      status: status as BillStatus,
      notes,
    },
  };
}
