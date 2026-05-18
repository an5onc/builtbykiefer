import type { ProposalStatus } from "./types";
import { proposalTotal } from "./formatters";

export interface ProposalLineItemInput {
  section: string;
  description: string;
  quantity: number;
  unitPrice: number;
  isOptional: boolean;
}

export interface ProposalCreateInput {
  title: string;
  scopeSummary: string;
  internalNotes: string;
  validUntil: string;
  lineItems: ProposalLineItemInput[];
}

export type ProposalCreateParseResult =
  | { ok: true; data: ProposalCreateInput }
  | { ok: false; reason: string };

export const proposalStatusOptions: { value: ProposalStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function parseMoney(value: FormDataEntryValue | null) {
  const number = Number(String(value ?? "").trim());
  return Number.isFinite(number) ? number : Number.NaN;
}

function parseLineItems(formData: FormData) {
  const sections = formData.getAll("section");
  const descriptions = formData.getAll("description");
  const quantities = formData.getAll("quantity");
  const unitPrices = formData.getAll("unitPrice");
  const optionalRows = new Set(formData.getAll("optional").map(String));
  const maxRows = Math.max(sections.length, descriptions.length, quantities.length, unitPrices.length);
  const lineItems: ProposalLineItemInput[] = [];

  for (let index = 0; index < maxRows; index += 1) {
    const section = String(sections[index] ?? "").trim();
    const description = String(descriptions[index] ?? "").trim();
    const quantity = parseMoney(quantities[index] ?? null);
    const unitPrice = parseMoney(unitPrices[index] ?? null);
    const hasAnyValue = Boolean(section || description || String(quantities[index] ?? "").trim() || String(unitPrices[index] ?? "").trim());

    if (!hasAnyValue) {
      continue;
    }

    if (!section || !description || quantity <= 0 || unitPrice < 0) {
      return { ok: false as const, reason: "Complete each line item with a section, description, quantity, and price." };
    }

    lineItems.push({
      section,
      description,
      quantity,
      unitPrice,
      isOptional: optionalRows.has(String(index)),
    });
  }

  return { ok: true as const, lineItems };
}

export function parseProposalCreateFormData(formData: FormData): ProposalCreateParseResult {
  const title = getTrimmedValue(formData, "title");
  const scopeSummary = getTrimmedValue(formData, "scopeSummary");
  const validUntil = getTrimmedValue(formData, "validUntil");
  const internalNotes = getTrimmedValue(formData, "internalNotes");

  if (!title) {
    return { ok: false, reason: "Proposal title is required." };
  }

  if (!scopeSummary) {
    return { ok: false, reason: "Scope summary is required." };
  }

  if (!validUntil || !isIsoDate(validUntil)) {
    return { ok: false, reason: "Use a valid proposal expiration date." };
  }

  const parsedItems = parseLineItems(formData);

  if (!parsedItems.ok) {
    return { ok: false, reason: parsedItems.reason };
  }

  if (parsedItems.lineItems.length === 0) {
    return { ok: false, reason: "Add at least one proposal line item." };
  }

  return {
    ok: true,
    data: {
      title,
      scopeSummary,
      validUntil,
      internalNotes,
      lineItems: parsedItems.lineItems,
    },
  };
}

export { proposalTotal };
