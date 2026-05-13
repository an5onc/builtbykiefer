export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type ProjectStatus = "planning" | "active" | "paused" | "completed";
export type ProjectPhaseStatus = "completed" | "in-progress" | "upcoming";
export type FileVisibility = "internal" | "customer";
export type ChangeOrderStatus = "draft" | "sent" | "approved" | "declined";
export type InvoiceStatus = "draft" | "sent" | "paid";
export type ProposalStatus = "draft" | "sent" | "approved" | "declined";
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

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  body: string;
  visibility: FileVisibility;
  updateDate: string;
  createdAt: string;
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
