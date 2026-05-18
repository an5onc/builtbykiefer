import type { LeadStatus } from "./types";

export const leadStatusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const leadStatusValues = new Set<LeadStatus>(leadStatusOptions.map((option) => option.value));
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export interface LeadUpdateInput {
  status: LeadStatus;
  nextFollowUp: string;
  notes: string;
}

export interface LeadCreateInput extends LeadUpdateInput {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
}

function requireText(value: FormDataEntryValue | null, message: string) {
  const text = String(value ?? "").trim();

  if (!text) {
    throw new Error(message);
  }

  return text;
}

function requireFollowUpDate(value: FormDataEntryValue | null) {
  const nextFollowUp = String(value ?? "").trim();

  if (!nextFollowUp || !isoDatePattern.test(nextFollowUp)) {
    throw new Error("Use a valid follow-up date.");
  }

  return nextFollowUp;
}

export function parseLeadCreateFormData(formData: FormData): LeadCreateInput {
  return {
    name: requireText(formData.get("name"), "Lead name is required."),
    email: requireText(formData.get("email"), "Email is required.").toLowerCase(),
    phone: requireText(formData.get("phone"), "Phone is required."),
    projectType: requireText(formData.get("projectType"), "Project type is required."),
    budgetRange: requireText(formData.get("budgetRange"), "Budget range is required."),
    status: "new",
    nextFollowUp: requireFollowUpDate(formData.get("nextFollowUp")),
    notes: requireText(formData.get("notes"), "Add a short note before saving."),
  };
}

export function parseLeadUpdateFormData(formData: FormData): LeadUpdateInput {
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!leadStatusValues.has(status as LeadStatus)) {
    throw new Error("Choose a valid lead status.");
  }

  if (!notes) {
    throw new Error("Add a short note before saving.");
  }

  return {
    status: status as LeadStatus,
    nextFollowUp: requireFollowUpDate(formData.get("nextFollowUp")),
    notes,
  };
}
