import type {
  Client,
  Invoice,
  InvoiceLineItem,
  Lead,
  Project,
  ProjectFile,
  ProjectPhase,
  TimeEntry,
  Worker,
} from "./types";

interface ProjectPhaseRow {
  id: string;
  title: string;
  description: string;
  status: ProjectPhase["status"];
  date_label: string;
  sort_order?: number | null;
}

interface ProjectRow {
  id: string;
  client_id: string;
  name: string;
  location: string;
  type: string;
  status: Project["status"];
  current_phase: string;
  progress: number;
  budget_range: string;
  start_date: string;
  estimated_completion: string;
  notes: string;
  hero_image: string;
  project_phases?: ProjectPhaseRow[] | null;
}

interface InvoiceLineItemRow {
  id: string;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  sort_order?: number | null;
}

interface InvoiceRow {
  id: string;
  invoice_number: string;
  project_id: string;
  client_id: string;
  status: Invoice["status"];
  issue_date: string;
  due_date: string;
  notes: string;
  invoice_line_items?: InvoiceLineItemRow[] | null;
}

export function mapClientRow(row: {
  id: string;
  name: string;
  email: string;
  phone: string;
}): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
  };
}

export function mapLeadRow(row: {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  budget_range: string;
  status: Lead["status"];
  next_follow_up: string | null;
  notes: string;
}): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    projectType: row.project_type,
    budgetRange: row.budget_range,
    status: row.status,
    nextFollowUp: row.next_follow_up ?? "",
    notes: row.notes,
  };
}

export function mapProjectPhaseRow(row: ProjectPhaseRow): ProjectPhase {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dateLabel: row.date_label,
  };
}

export function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    location: row.location,
    type: row.type,
    status: row.status,
    currentPhase: row.current_phase,
    progress: row.progress,
    budgetRange: row.budget_range,
    startDate: row.start_date,
    estimatedCompletion: row.estimated_completion,
    notes: row.notes,
    heroImage: row.hero_image,
    phases: [...(row.project_phases ?? [])]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(mapProjectPhaseRow),
  };
}

export function mapProjectFileRow(row: {
  id: string;
  project_id: string;
  name: string;
  file_type: ProjectFile["type"];
  visibility: ProjectFile["visibility"];
  uploaded_at: string;
  size_label: string;
}): ProjectFile {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    type: row.file_type,
    visibility: row.visibility,
    uploadedAt: row.uploaded_at,
    sizeLabel: row.size_label,
  };
}

export function mapWorkerRow(row: {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
}): Worker {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    status: row.is_active ? "active" : "inactive",
  };
}

export function mapTimeEntryRow(row: {
  id: string;
  worker_id: string;
  project_id: string;
  clock_in: string;
  clock_out: string | null;
  notes: string;
}): TimeEntry {
  return {
    id: row.id,
    workerId: row.worker_id,
    projectId: row.project_id,
    clockIn: row.clock_in,
    clockOut: row.clock_out,
    notes: row.notes,
  };
}

export function mapInvoiceLineItemRow(row: InvoiceLineItemRow): InvoiceLineItem {
  return {
    id: row.id,
    description: row.description,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
  };
}

export function mapInvoiceRow(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    projectId: row.project_id,
    clientId: row.client_id,
    status: row.status,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    notes: row.notes,
    lineItems: [...(row.invoice_line_items ?? [])]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(mapInvoiceLineItemRow),
  };
}
