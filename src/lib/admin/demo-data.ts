import type { Client, Invoice, Lead, Project, ProjectFile, TimeEntry, Worker } from "./types";

export const clients: Client[] = [
  { id: "client-1", name: "Avery Thompson", email: "avery@example.com", phone: "(970) 555-0181" },
  { id: "client-2", name: "Morgan Ridge", email: "morgan@example.com", phone: "(970) 555-0194" },
  { id: "client-3", name: "Summit Creek Holdings", email: "projects@summitcreek.example", phone: "(970) 555-0167" },
];

export const leads: Lead[] = [
  {
    id: "lead-1",
    name: "Danielle Porter",
    email: "danielle@example.com",
    phone: "(970) 555-0142",
    projectType: "Custom Home",
    budgetRange: "$900k-$1.2M",
    status: "qualified",
    nextFollowUp: "2026-05-12",
    notes: "Interested in a modern ranch layout near Windsor.",
  },
  {
    id: "lead-2",
    name: "Chris Valdez",
    email: "chris@example.com",
    phone: "(970) 555-0178",
    projectType: "Kitchen Remodel",
    budgetRange: "$120k-$180k",
    status: "contacted",
    nextFollowUp: "2026-05-10",
    notes: "Wants premium finishes and a tighter construction window.",
  },
  {
    id: "lead-3",
    name: "Harper Stone",
    email: "harper@example.com",
    phone: "(970) 555-0126",
    projectType: "Addition",
    budgetRange: "$250k-$350k",
    status: "proposal",
    nextFollowUp: "2026-05-15",
    notes: "Needs garage and guest suite pricing separated.",
  },
  {
    id: "lead-4",
    name: "Northline Dental",
    email: "buildout@northline.example",
    phone: "(970) 555-0118",
    projectType: "Commercial Buildout",
    budgetRange: "$450k-$650k",
    status: "new",
    nextFollowUp: "2026-05-09",
    notes: "Commercial tenant improvement inquiry.",
  },
  {
    id: "lead-5",
    name: "Elena Morris",
    email: "elena@example.com",
    phone: "(970) 555-0155",
    projectType: "Whole Home Remodel",
    budgetRange: "$500k-$750k",
    status: "won",
    nextFollowUp: "2026-05-20",
    notes: "Approved design discovery retainer.",
  },
];

export const projects: Project[] = [
  {
    id: "project-1",
    clientId: "client-1",
    name: "Highland Ridge Custom Home",
    location: "Windsor, CO",
    type: "Custom Home",
    status: "active",
    currentPhase: "Interior rough-in",
    progress: 58,
    budgetRange: "$950k-$1.15M",
    startDate: "2026-02-03",
    estimatedCompletion: "2026-09-18",
    notes: "Demo project showing owner-ready progress updates and internal controls.",
    heroImage: "/images/project-3/exterior-twilight-front.jpg",
    phases: [
      { id: "phase-1", title: "Preconstruction", description: "Selections, budget alignment, and schedule lock.", status: "completed", dateLabel: "Feb 2026" },
      { id: "phase-2", title: "Foundation & Framing", description: "Foundation, framing, and dried-in milestone.", status: "completed", dateLabel: "Mar 2026" },
      { id: "phase-3", title: "Interior Rough-In", description: "MEP rough-in, inspections, and coordination notes.", status: "in-progress", dateLabel: "May 2026" },
      { id: "phase-4", title: "Finishes", description: "Cabinetry, flooring, tile, and fixture installation.", status: "upcoming", dateLabel: "Summer 2026" },
    ],
  },
  {
    id: "project-2",
    clientId: "client-2",
    name: "Poudre Canyon Mountain Modern",
    location: "Bellvue, CO",
    type: "Mountain Custom Home",
    status: "active",
    currentPhase: "Exterior completion",
    progress: 76,
    budgetRange: "$780k-$940k",
    startDate: "2025-11-10",
    estimatedCompletion: "2026-07-22",
    notes: "Demo project focused on remote-site progress photos and document tracking.",
    heroImage: "/images/project-2/exterior-front-facade.jpg",
    phases: [
      { id: "phase-1", title: "Site Prep", description: "Drive, utilities, and site staging.", status: "completed", dateLabel: "Nov 2025" },
      { id: "phase-2", title: "Shell", description: "Framing, siding, roofing, and windows.", status: "completed", dateLabel: "Feb 2026" },
      { id: "phase-3", title: "Exterior Completion", description: "Exterior punch and weatherproofing details.", status: "in-progress", dateLabel: "May 2026" },
      { id: "phase-4", title: "Final Walkthrough", description: "Owner walkthrough and warranty packet.", status: "upcoming", dateLabel: "Jul 2026" },
    ],
  },
  {
    id: "project-3",
    clientId: "client-3",
    name: "Timnath Commercial Buildout",
    location: "Timnath, CO",
    type: "Commercial",
    status: "planning",
    currentPhase: "Preconstruction",
    progress: 18,
    budgetRange: "$420k-$560k",
    startDate: "2026-06-01",
    estimatedCompletion: "2026-11-15",
    notes: "Demo commercial workflow for documents, budget line items, and follow-ups.",
    heroImage: "/images/project-1/exterior-1.jpg",
    phases: [
      { id: "phase-1", title: "Preconstruction", description: "Scope, bids, and submittals.", status: "in-progress", dateLabel: "May 2026" },
      { id: "phase-2", title: "Permits", description: "Permit and inspection workflow.", status: "upcoming", dateLabel: "Jun 2026" },
      { id: "phase-3", title: "Buildout", description: "Framing, MEP, finishes, and turnover.", status: "upcoming", dateLabel: "Summer 2026" },
    ],
  },
];

export const projectFiles: ProjectFile[] = [
  { id: "file-1", projectId: "project-1", name: "Rough-in inspection packet.pdf", type: "document", visibility: "internal", uploadedAt: "2026-05-04", sizeLabel: "1.8 MB" },
  { id: "file-2", projectId: "project-1", name: "Kitchen progress photo set", type: "photo", visibility: "customer", uploadedAt: "2026-05-05", sizeLabel: "12 photos" },
  { id: "file-3", projectId: "project-2", name: "Exterior punch notes.pdf", type: "document", visibility: "internal", uploadedAt: "2026-05-02", sizeLabel: "420 KB" },
  { id: "file-4", projectId: "project-3", name: "Preconstruction estimate.pdf", type: "document", visibility: "customer", uploadedAt: "2026-04-28", sizeLabel: "936 KB" },
];

export const workers: Worker[] = [
  { id: "worker-1", name: "Caleb Jensen", role: "Lead Carpenter", status: "active" },
  { id: "worker-2", name: "Maya Torres", role: "Project Coordinator", status: "active" },
  { id: "worker-3", name: "Eli Brooks", role: "Finish Carpenter", status: "active" },
  { id: "worker-4", name: "Noah Reed", role: "Field Support", status: "inactive" },
];

export const timeEntries: TimeEntry[] = [
  { id: "time-1", workerId: "worker-1", projectId: "project-1", clockIn: "2026-05-06T07:12:00-06:00", clockOut: "2026-05-06T15:48:00-06:00", notes: "Interior blocking and coordination." },
  { id: "time-2", workerId: "worker-2", projectId: "project-1", clockIn: "2026-05-06T08:00:00-06:00", clockOut: "2026-05-06T12:30:00-06:00", notes: "Updated selections and owner notes." },
  { id: "time-3", workerId: "worker-3", projectId: "project-2", clockIn: "2026-05-06T06:45:00-06:00", clockOut: null, notes: "Active shift demo." },
  { id: "time-4", workerId: "worker-1", projectId: "project-3", clockIn: "2026-05-05T09:00:00-06:00", clockOut: "2026-05-05T13:15:00-06:00", notes: "Preconstruction walkthrough." },
];

export const invoices: Invoice[] = [
  {
    id: "invoice-1",
    invoiceNumber: "KBC-2026-001",
    projectId: "project-1",
    clientId: "client-1",
    status: "draft",
    issueDate: "2026-05-07",
    dueDate: "2026-05-22",
    notes: "Demo invoice for platform walkthrough. Payment instructions will be finalized before production use.",
    lineItems: [
      { id: "line-1", description: "Interior rough-in labor", quantity: 42.5, unitPrice: 86 },
      { id: "line-2", description: "MEP coordination allowance", quantity: 1, unitPrice: 2800 },
      { id: "line-3", description: "Site protection materials", quantity: 1, unitPrice: 740 },
    ],
  },
  {
    id: "invoice-2",
    invoiceNumber: "KBC-2026-002",
    projectId: "project-2",
    clientId: "client-2",
    status: "sent",
    issueDate: "2026-05-01",
    dueDate: "2026-05-16",
    notes: "Demo exterior milestone invoice.",
    lineItems: [
      { id: "line-1", description: "Exterior punch labor", quantity: 31, unitPrice: 82 },
      { id: "line-2", description: "Metal siding closeout materials", quantity: 1, unitPrice: 1900 },
    ],
  },
];
