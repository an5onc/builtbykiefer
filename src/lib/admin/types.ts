export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type ProjectStatus = "planning" | "active" | "paused" | "completed";
export type ProjectPhaseStatus = "completed" | "in-progress" | "upcoming";
export type FileVisibility = "internal" | "customer";
export type InvoiceStatus = "draft" | "sent" | "paid";
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
  uploadedAt: string;
  sizeLabel: string;
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
