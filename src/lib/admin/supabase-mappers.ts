import type {
  Client,
  ChangeOrder,
  ChangeOrderLineItem,
  Bill,
  Invoice,
  InvoiceLineItem,
  Lead,
  Proposal,
  ProposalLineItem,
  Project,
  ProjectComment,
  ProjectDailyLog,
  ProjectFile,
  ProjectFinanceSnapshot,
  ProjectFinancialTarget,
  ProjectPhoto,
  ProjectPhase,
  ProjectRfi,
  ProjectSelection,
  ProjectTask,
  ProjectVendorAssignment,
  ProjectUpdate,
  PurchaseOrder,
  TimeEntry,
  Vendor,
  VendorRfiResponse,
  VendorSubmittal,
  WarrantyItem,
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

interface ChangeOrderLineItemRow {
  id: string;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  sort_order?: number | null;
}

interface ChangeOrderRow {
  id: string;
  change_order_number: string;
  project_id: string;
  client_id: string;
  title: string;
  status: ChangeOrder["status"];
  reason: string;
  schedule_impact_days: number;
  client_message: string;
  internal_notes: string;
  created_at: string;
  approved_at: string | null;
  approved_by_name: string | null;
  change_order_line_items?: ChangeOrderLineItemRow[] | null;
}

interface WarrantyItemRow {
  id: string;
  project_id: string;
  item_type: WarrantyItem["itemType"];
  title: string;
  description: string;
  location: string;
  requested_by: string;
  status: WarrantyItem["status"];
  priority: WarrantyItem["priority"];
  due_date: string;
  visibility: WarrantyItem["visibility"];
  created_at: string;
  resolved_at: string | null;
}

interface ProjectPhotoRow {
  id: string;
  project_id: string;
  title: string;
  photo_date: string;
  category: ProjectPhoto["category"];
  visibility: ProjectPhoto["visibility"];
  image_url: string;
  caption: string;
  uploaded_at: string;
}

interface VendorRow {
  id: string;
  name: string;
  company_type: Vendor["companyType"];
  trade: string;
  email: string;
  auth_email?: string | null;
  phone: string;
  status: Vendor["status"];
  portal_access: boolean;
  notes: string;
  created_at: string;
}

interface ProjectVendorAssignmentRow {
  id: string;
  project_id: string;
  vendor_id: string;
  scope: string;
  start_date: string;
  end_date: string | null;
  status: ProjectVendorAssignment["status"];
  visibility: ProjectVendorAssignment["visibility"];
  created_at: string;
}

interface ProjectFinancialTargetRow {
  project_id: string;
  contract_value: number | string;
  budgeted_cost: number | string;
  target_margin_percent: number | string;
  contingency_percent: number | string;
  updated_at: string;
}

interface VendorSubmittalRow {
  id: string;
  project_id: string;
  vendor_id: string;
  assignment_id: string;
  title: string;
  category: VendorSubmittal["category"];
  status: VendorSubmittal["status"];
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  size_label: string;
  submitted_at: string;
  reviewed_at: string | null;
  review_comment?: string | null;
  reviewed_by?: string | null;
}

interface ProjectFinanceSnapshotRow {
  id: string;
  project_id: string;
  projects?: { name: string } | { name: string }[] | null;
  title: string;
  notes: string | null;
  inputs: unknown;
  outputs: unknown;
  created_by: string | null;
  created_at: string;
}

interface ProposalLineItemRow {
  id: string;
  section: string;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  is_optional: boolean;
  sort_order?: number | null;
}

interface ProposalRow {
  id: string;
  lead_id: string;
  proposal_number: string;
  title: string;
  status: Proposal["status"];
  client_name: string;
  client_email: string;
  scope_summary: string;
  internal_notes: string;
  valid_until: string;
  created_at: string;
  proposal_line_items?: ProposalLineItemRow[] | null;
}

export function mapClientRow(row: {
  id: string;
  name: string;
  email: string;
  phone: string;
  auth_user_id?: string | null;
}): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    authUserId: row.auth_user_id ?? null,
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
  storage_bucket: string;
  storage_path: string;
  uploaded_at: string;
  size_label: string;
}): ProjectFile {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    type: row.file_type,
    visibility: row.visibility,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    uploadedAt: row.uploaded_at,
    sizeLabel: row.size_label,
  };
}

export function mapVendorSubmittalRow(row: VendorSubmittalRow): VendorSubmittal {
  return {
    id: row.id,
    projectId: row.project_id,
    vendorId: row.vendor_id,
    assignmentId: row.assignment_id,
    title: row.title,
    category: row.category,
    status: row.status,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sizeLabel: row.size_label,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    reviewComment: row.review_comment ?? "",
    reviewedBy: row.reviewed_by ?? null,
  };
}

export function mapProjectFinanceSnapshotRow(row: ProjectFinanceSnapshotRow): ProjectFinanceSnapshot {
  const projectReference = Array.isArray(row.projects) ? row.projects[0] : row.projects;

  return {
    id: row.id,
    projectId: row.project_id,
    projectName: projectReference?.name ?? "Project",
    title: row.title,
    notes: row.notes ?? "",
    inputs: row.inputs,
    outputs: row.outputs,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function mapProjectPhotoRow(row: ProjectPhotoRow): ProjectPhoto {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    photoDate: row.photo_date,
    category: row.category,
    visibility: row.visibility,
    imageUrl: row.image_url,
    caption: row.caption,
    uploadedAt: row.uploaded_at,
  };
}

export function mapProjectUpdateRow(row: {
  id: string;
  project_id: string;
  title: string;
  body: string;
  visibility: ProjectUpdate["visibility"];
  update_date: string;
  created_at: string;
}): ProjectUpdate {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    body: row.body,
    visibility: row.visibility,
    updateDate: row.update_date,
    createdAt: row.created_at,
  };
}

export function mapProjectCommentRow(row: {
  id: string;
  project_id: string;
  author_name: string;
  body: string;
  visibility: ProjectComment["visibility"];
  created_at: string;
}): ProjectComment {
  return {
    id: row.id,
    projectId: row.project_id,
    authorName: row.author_name,
    body: row.body,
    visibility: row.visibility,
    createdAt: row.created_at,
  };
}

export function mapProjectSelectionRow(row: {
  id: string;
  project_id: string;
  category: string;
  title: string;
  allowance_amount: number | string;
  selected_option: string;
  vendor: string;
  due_date: string;
  status: ProjectSelection["status"];
  internal_notes: string;
  client_notes: string;
  created_at: string;
  approved_at: string | null;
  approved_by_name: string | null;
}): ProjectSelection {
  return {
    id: row.id,
    projectId: row.project_id,
    category: row.category,
    title: row.title,
    allowanceAmount: Number(row.allowance_amount),
    selectedOption: row.selected_option,
    vendor: row.vendor,
    dueDate: row.due_date,
    status: row.status,
    internalNotes: row.internal_notes,
    clientNotes: row.client_notes,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
    approvedByName: row.approved_by_name ?? "",
  };
}

export function mapProjectRfiRow(row: {
  id: string;
  project_id: string;
  title: string;
  question: string;
  answer: string;
  requested_by: string;
  due_date: string;
  status: ProjectRfi["status"];
  visibility: ProjectRfi["visibility"];
  created_at: string;
  answered_at: string | null;
}): ProjectRfi {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    question: row.question,
    answer: row.answer,
    requestedBy: row.requested_by,
    dueDate: row.due_date,
    status: row.status,
    visibility: row.visibility,
    createdAt: row.created_at,
    answeredAt: row.answered_at,
  };
}

export function mapVendorRfiResponseRow(row: {
  id: string;
  project_id: string;
  rfi_id: string;
  vendor_id: string;
  assignment_id: string;
  responder_name: string;
  response_body: string;
  created_at: string;
}): VendorRfiResponse {
  return {
    id: row.id,
    projectId: row.project_id,
    rfiId: row.rfi_id,
    vendorId: row.vendor_id,
    assignmentId: row.assignment_id,
    responderName: row.responder_name,
    responseBody: row.response_body,
    createdAt: row.created_at,
  };
}

export function mapWarrantyItemRow(row: WarrantyItemRow): WarrantyItem {
  return {
    id: row.id,
    projectId: row.project_id,
    itemType: row.item_type,
    title: row.title,
    description: row.description,
    location: row.location,
    requestedBy: row.requested_by,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    visibility: row.visibility,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  };
}

export function mapDailyLogRow(row: {
  id: string;
  project_id: string;
  report_date: string;
  superintendent: string;
  weather: string;
  crew_count: number | string;
  work_performed: string;
  deliveries: string;
  inspections: string;
  delays: string;
  safety_notes: string;
  next_steps: string;
  visibility: ProjectDailyLog["visibility"];
  created_at: string;
}): ProjectDailyLog {
  return {
    id: row.id,
    projectId: row.project_id,
    reportDate: row.report_date,
    superintendent: row.superintendent,
    weather: row.weather,
    crewCount: Number(row.crew_count),
    workPerformed: row.work_performed,
    deliveries: row.deliveries,
    inspections: row.inspections,
    delays: row.delays,
    safetyNotes: row.safety_notes,
    nextSteps: row.next_steps,
    visibility: row.visibility,
    createdAt: row.created_at,
  };
}

export function mapProjectTaskRow(row: {
  id: string;
  project_id: string;
  assigned_worker_id: string | null;
  title: string;
  notes: string;
  status: ProjectTask["status"];
  priority: ProjectTask["priority"];
  due_date: string;
  created_at: string;
  completed_at: string | null;
}): ProjectTask {
  return {
    id: row.id,
    projectId: row.project_id,
    assignedWorkerId: row.assigned_worker_id,
    title: row.title,
    notes: row.notes,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export function mapVendorRow(row: VendorRow): Vendor {
  return {
    id: row.id,
    name: row.name,
    companyType: row.company_type,
    trade: row.trade,
    email: row.email,
    authEmail: row.auth_email ?? "",
    phone: row.phone,
    status: row.status,
    portalAccess: row.portal_access,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function mapProjectVendorAssignmentRow(
  row: ProjectVendorAssignmentRow,
): ProjectVendorAssignment {
  return {
    id: row.id,
    projectId: row.project_id,
    vendorId: row.vendor_id,
    scope: row.scope,
    startDate: row.start_date,
    endDate: row.end_date ?? "",
    status: row.status,
    visibility: row.visibility,
    createdAt: row.created_at,
  };
}

export function mapProjectFinancialTargetRow(row: ProjectFinancialTargetRow): ProjectFinancialTarget {
  return {
    projectId: row.project_id,
    contractValue: Number(row.contract_value),
    budgetedCost: Number(row.budgeted_cost),
    targetMarginPercent: Number(row.target_margin_percent),
    contingencyPercent: Number(row.contingency_percent),
    updatedAt: row.updated_at,
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

export function mapPurchaseOrderRow(row: {
  id: string;
  project_id: string;
  po_number: string;
  title: string;
  vendor: string;
  amount: number | string;
  status: PurchaseOrder["status"];
  due_date: string;
  notes: string;
  created_at: string;
}): PurchaseOrder {
  return {
    id: row.id,
    projectId: row.project_id,
    poNumber: row.po_number,
    title: row.title,
    vendor: row.vendor,
    amount: Number(row.amount),
    status: row.status,
    dueDate: row.due_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function mapBillRow(row: {
  id: string;
  project_id: string;
  bill_number: string;
  vendor: string;
  amount: number | string;
  status: Bill["status"];
  due_date: string;
  notes: string;
  created_at: string;
}): Bill {
  return {
    id: row.id,
    projectId: row.project_id,
    billNumber: row.bill_number,
    vendor: row.vendor,
    amount: Number(row.amount),
    status: row.status,
    dueDate: row.due_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function mapChangeOrderLineItemRow(row: ChangeOrderLineItemRow): ChangeOrderLineItem {
  return {
    id: row.id,
    description: row.description,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
  };
}

export function mapChangeOrderRow(row: ChangeOrderRow): ChangeOrder {
  return {
    id: row.id,
    changeOrderNumber: row.change_order_number,
    projectId: row.project_id,
    clientId: row.client_id,
    title: row.title,
    status: row.status,
    reason: row.reason,
    scheduleImpactDays: row.schedule_impact_days,
    clientMessage: row.client_message,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
    approvedByName: row.approved_by_name ?? "",
    lineItems: [...(row.change_order_line_items ?? [])]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(mapChangeOrderLineItemRow),
  };
}

export function mapProposalLineItemRow(row: ProposalLineItemRow): ProposalLineItem {
  return {
    id: row.id,
    section: row.section,
    description: row.description,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    isOptional: row.is_optional,
  };
}

export function mapProposalRow(row: ProposalRow): Proposal {
  return {
    id: row.id,
    leadId: row.lead_id,
    proposalNumber: row.proposal_number,
    title: row.title,
    status: row.status,
    clientName: row.client_name,
    clientEmail: row.client_email,
    scopeSummary: row.scope_summary,
    internalNotes: row.internal_notes,
    validUntil: row.valid_until,
    createdAt: row.created_at,
    lineItems: [...(row.proposal_line_items ?? [])]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(mapProposalLineItemRow),
  };
}
