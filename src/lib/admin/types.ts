export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type ProjectStatus = "planning" | "active" | "paused" | "completed";
export type ProjectPhaseStatus = "completed" | "in-progress" | "upcoming";
export type FileVisibility = "internal" | "customer";
export type ChangeOrderStatus = "draft" | "sent" | "approved" | "declined";
export type InvoiceStatus = "draft" | "sent" | "paid";
export type ProposalStatus = "draft" | "sent" | "approved" | "declined";
export type ProjectTaskStatus = "open" | "in-progress" | "done";
export type ProjectTaskPriority = "low" | "normal" | "high" | "urgent";
export type SelectionStatus = "needed" | "submitted" | "approved" | "ordered";
export type RfiStatus = "open" | "answered" | "closed";
export type WarrantyItemType = "warranty" | "punch-list";
export type WarrantyItemStatus = "open" | "scheduled" | "resolved" | "closed";
export type WarrantyItemPriority = "low" | "normal" | "high";
export type ProjectPhotoCategory = "progress" | "selections" | "issue" | "before" | "after" | "closeout";
export type VendorCompanyType = "subcontractor" | "vendor";
export type VendorStatus = "active" | "inactive";
export type ProjectVendorAssignmentStatus = "invited" | "scheduled" | "active" | "complete";
export type VendorSubmittalCategory = "insurance" | "w9" | "submittal" | "closeout" | "warranty" | "other";
export type VendorSubmittalStatus = "submitted" | "reviewed" | "approved" | "rejected";
export type PurchaseOrderStatus = "draft" | "sent" | "approved" | "received";
export type BillStatus = "draft" | "received" | "paid";
export type WorkerStatus = "active" | "inactive";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  status: LeadStatus;
  nextFollowUp: string;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProjectPhase {
  id: string;
  title: string;
  description: string;
  status: ProjectPhaseStatus;
  dateLabel: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: "photo" | "document" | "invoice";
  visibility: FileVisibility;
  storageBucket: string;
  storagePath: string;
  uploadedAt: string;
  sizeLabel: string;
}

export interface ProjectPhoto {
  id: string;
  projectId: string;
  title: string;
  photoDate: string;
  category: ProjectPhotoCategory;
  visibility: FileVisibility;
  imageUrl: string;
  caption: string;
  uploadedAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  body: string;
  visibility: FileVisibility;
  updateDate: string;
  createdAt: string;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  authorName: string;
  body: string;
  visibility: FileVisibility;
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  assignedWorkerId: string | null;
  title: string;
  notes: string;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
}

export interface ProjectSelection {
  id: string;
  projectId: string;
  category: string;
  title: string;
  allowanceAmount: number;
  selectedOption: string;
  vendor: string;
  dueDate: string;
  status: SelectionStatus;
  internalNotes: string;
  clientNotes: string;
  createdAt: string;
  approvedAt: string | null;
  approvedByName: string;
}

export interface ProjectRfi {
  id: string;
  projectId: string;
  title: string;
  question: string;
  answer: string;
  requestedBy: string;
  dueDate: string;
  status: RfiStatus;
  visibility: FileVisibility;
  createdAt: string;
  answeredAt: string | null;
}

export interface VendorRfiResponse {
  id: string;
  projectId: string;
  rfiId: string;
  vendorId: string;
  assignmentId: string;
  responderName: string;
  responseBody: string;
  createdAt: string;
}

export interface VendorSubmittal {
  id: string;
  projectId: string;
  vendorId: string;
  assignmentId: string;
  title: string;
  category: VendorSubmittalCategory;
  status: VendorSubmittalStatus;
  storageBucket: string;
  storagePath: string;
  mimeType: string;
  sizeLabel: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewComment: string;
  reviewedBy: string | null;
}

export interface ProjectFinanceSnapshot {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  notes: string;
  inputs: unknown;
  outputs: unknown;
  createdBy: string | null;
  createdAt: string;
}

export interface WarrantyItem {
  id: string;
  projectId: string;
  itemType: WarrantyItemType;
  title: string;
  description: string;
  location: string;
  requestedBy: string;
  status: WarrantyItemStatus;
  priority: WarrantyItemPriority;
  dueDate: string;
  visibility: FileVisibility;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ProjectDailyLog {
  id: string;
  projectId: string;
  reportDate: string;
  superintendent: string;
  weather: string;
  crewCount: number;
  workPerformed: string;
  deliveries: string;
  inspections: string;
  delays: string;
  safetyNotes: string;
  nextSteps: string;
  visibility: FileVisibility;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  companyType: VendorCompanyType;
  trade: string;
  email: string;
  authEmail: string;
  phone: string;
  status: VendorStatus;
  portalAccess: boolean;
  notes: string;
  createdAt: string;
}

export interface ProjectVendorAssignment {
  id: string;
  projectId: string;
  vendorId: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: ProjectVendorAssignmentStatus;
  visibility: FileVisibility;
  createdAt: string;
}

export interface ProjectFinancialTarget {
  projectId: string;
  contractValue: number;
  budgetedCost: number;
  targetMarginPercent: number;
  contingencyPercent: number;
  updatedAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  location: string;
  type: string;
  status: ProjectStatus;
  currentPhase: string;
  progress: number;
  budgetRange: string;
  startDate: string;
  estimatedCompletion: string;
  notes: string;
  heroImage: string;
  phases: ProjectPhase[];
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: WorkerStatus;
}

export interface TimeEntry {
  id: string;
  workerId: string;
  projectId: string;
  clockIn: string;
  clockOut: string | null;
  notes: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  clientId: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes: string;
  lineItems: InvoiceLineItem[];
}

export interface PurchaseOrder {
  id: string;
  projectId: string;
  poNumber: string;
  title: string;
  vendor: string;
  amount: number;
  status: PurchaseOrderStatus;
  dueDate: string;
  notes: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  projectId: string;
  billNumber: string;
  vendor: string;
  amount: number;
  status: BillStatus;
  dueDate: string;
  notes: string;
  createdAt: string;
}

export interface ChangeOrderLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ChangeOrder {
  id: string;
  changeOrderNumber: string;
  projectId: string;
  clientId: string;
  title: string;
  status: ChangeOrderStatus;
  reason: string;
  scheduleImpactDays: number;
  clientMessage: string;
  internalNotes: string;
  createdAt: string;
  approvedAt: string | null;
  approvedByName: string;
  lineItems: ChangeOrderLineItem[];
}

export interface ProposalLineItem {
  id: string;
  section: string;
  description: string;
  quantity: number;
  unitPrice: number;
  isOptional: boolean;
}

export interface Proposal {
  id: string;
  leadId: string;
  proposalNumber: string;
  title: string;
  status: ProposalStatus;
  clientName: string;
  clientEmail: string;
  scopeSummary: string;
  internalNotes: string;
  validUntil: string;
  createdAt: string;
  lineItems: ProposalLineItem[];
}
