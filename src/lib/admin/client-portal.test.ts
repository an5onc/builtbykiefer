import { describe, expect, it } from "vitest";
import { buildClientPortalView } from "./client-portal";
import type { ChangeOrder, Client, Invoice, Project, ProjectFile, ProjectUpdate } from "./types";

const project: Project = {
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
  notes: "Internal project notes stay out of the portal.",
  heroImage: "/images/project.jpg",
  phases: [
    {
      id: "phase-1",
      title: "Preconstruction",
      description: "Selections and schedule lock.",
      status: "completed",
      dateLabel: "Feb 2026",
    },
  ],
};

const client: Client = {
  id: "client-1",
  name: "Avery Thompson",
  email: "avery@example.com",
  phone: "(970) 555-0181",
};

const files: ProjectFile[] = [
  {
    id: "file-1",
    projectId: "project-1",
    name: "Progress photos",
    type: "photo",
    visibility: "customer",
    storageBucket: "project-photos",
    storagePath: "project-1/photos/progress.jpg",
    uploadedAt: "2026-05-05",
    sizeLabel: "12 photos",
  },
  {
    id: "file-2",
    projectId: "project-1",
    name: "Internal inspection notes.pdf",
    type: "document",
    visibility: "internal",
    storageBucket: "project-documents",
    storagePath: "project-1/documents/inspection-notes.pdf",
    uploadedAt: "2026-05-06",
    sizeLabel: "420 KB",
  },
];

const invoices: Invoice[] = [
  {
    id: "invoice-1",
    invoiceNumber: "KBC-2026-001",
    projectId: "project-1",
    clientId: "client-1",
    status: "draft",
    issueDate: "2026-05-07",
    dueDate: "2026-05-22",
    notes: "Internal payment note.",
    lineItems: [{ id: "line-1", description: "Labor", quantity: 2, unitPrice: 100 }],
  },
];

const updates: ProjectUpdate[] = [
  {
    id: "update-1",
    projectId: "project-1",
    title: "Rough-in inspection passed",
    body: "Electrical and plumbing rough-ins passed.",
    visibility: "customer",
    updateDate: "2026-05-13",
    createdAt: "2026-05-13T10:00:00Z",
  },
  {
    id: "update-2",
    projectId: "project-1",
    title: "Internal blocking note",
    body: "Internal field note.",
    visibility: "internal",
    updateDate: "2026-05-13",
    createdAt: "2026-05-13T11:00:00Z",
  },
];

const changeOrders: ChangeOrder[] = [
  {
    id: "change-order-1",
    changeOrderNumber: "KBCO-2026-001",
    projectId: "project-1",
    clientId: "client-1",
    title: "Covered Patio Expansion",
    status: "sent",
    reason: "Owner requested a larger patio.",
    scheduleImpactDays: 5,
    clientMessage: "Adds patio framing and electrical prep.",
    internalNotes: "Internal beam note.",
    createdAt: "2026-05-13T09:30:00-06:00",
    approvedAt: null,
    lineItems: [{ id: "co-line-1", description: "Patio labor", quantity: 1, unitPrice: 2500 }],
  },
];

describe("client portal view", () => {
  it("keeps client-safe project data and hides internal files and notes", () => {
    const view = buildClientPortalView({
      project,
      client,
      files,
      updates,
      invoices,
      changeOrders,
    });

    expect(view.files).toEqual([files[0]]);
    expect(view.updates).toEqual([
      {
        id: "update-1",
        title: "Rough-in inspection passed",
        body: "Electrical and plumbing rough-ins passed.",
        updateDate: "2026-05-13",
      },
    ]);
    expect(view.invoices).toEqual([
      {
        id: "invoice-1",
        invoiceNumber: "KBC-2026-001",
        status: "draft",
        dueDate: "2026-05-22",
        total: 200,
      },
    ]);
    expect(view.changeOrders).toEqual([
      {
        id: "change-order-1",
        changeOrderNumber: "KBCO-2026-001",
        title: "Covered Patio Expansion",
        status: "sent",
        scheduleImpactDays: 5,
        clientMessage: "Adds patio framing and electrical prep.",
        total: 2500,
      },
    ]);
    expect(JSON.stringify(view)).not.toContain("Internal");
  });
});
