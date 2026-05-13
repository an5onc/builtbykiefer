import type { ChangeOrderStatus } from "./types";
import { changeOrderTotal } from "./formatters";

export interface ChangeOrderLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ChangeOrderCreateInput {
  title: string;
  reason: string;
  scheduleImpactDays: number;
  clientMessage: string;
  internalNotes: string;
  lineItems: ChangeOrderLineItemInput[];
}

export type ChangeOrderCreateParseResult =
  | { ok: true; data: ChangeOrderCreateInput }
  | { ok: false; reason: string };

export const changeOrderStatusOptions: { value: ChangeOrderStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseNumber(value: FormDataEntryValue | null) {
  const number = Number(String(value ?? "").trim());
  return Number.isFinite(number) ? number : Number.NaN;
}

function parseLineItems(formData: FormData) {
  const descriptions = formData.getAll("description");
  const quantities = formData.getAll("quantity");
  const unitPrices = formData.getAll("unitPrice");
  const maxRows = Math.max(descriptions.length, quantities.length, unitPrices.length);
  const lineItems: ChangeOrderLineItemInput[] = [];

  for (let index = 0; index < maxRows; index += 1) {
    const description = String(descriptions[index] ?? "").trim();
    const quantity = parseNumber(quantities[index] ?? null);
    const unitPrice = parseNumber(unitPrices[index] ?? null);
    const rawUnitPrice = String(unitPrices[index] ?? "").trim();
    const hasAnyValue = Boolean(description || rawUnitPrice);

    if (!hasAnyValue) {
      continue;
    }

    if (!description || quantity <= 0 || unitPrice < 0) {
      return { ok: false as const, reason: "Complete each line item with a description, quantity, and price." };
    }

    lineItems.push({ description, quantity, unitPrice });
  }

  return { ok: true as const, lineItems };
}

export function parseChangeOrderCreateFormData(formData: FormData): ChangeOrderCreateParseResult {
  const title = getTrimmedValue(formData, "title");
  const reason = getTrimmedValue(formData, "reason");
  const clientMessage = getTrimmedValue(formData, "clientMessage");
  const internalNotes = getTrimmedValue(formData, "internalNotes");
  const scheduleImpactDays = parseNumber(formData.get("scheduleImpactDays"));

  if (!title) {
    return { ok: false, reason: "Change order title is required." };
  }

  if (!reason) {
    return { ok: false, reason: "Change order reason is required." };
  }

  if (!Number.isInteger(scheduleImpactDays) || scheduleImpactDays < 0) {
    return { ok: false, reason: "Schedule impact must be zero or more whole days." };
  }

  if (!clientMessage) {
    return { ok: false, reason: "Client message is required." };
  }

  const parsedItems = parseLineItems(formData);

  if (!parsedItems.ok) {
    return { ok: false, reason: parsedItems.reason };
  }

  if (parsedItems.lineItems.length === 0) {
    return { ok: false, reason: "Add at least one change order line item." };
  }

  return {
    ok: true,
    data: {
      title,
      reason,
      scheduleImpactDays,
      clientMessage,
      internalNotes,
      lineItems: parsedItems.lineItems,
    },
  };
}

export { changeOrderTotal };
