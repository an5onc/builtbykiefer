import { describe, expect, it } from "vitest";
import { buildClientPortalDashboardView, buildClientPortalView } from "./client-portal";
import type {
  ChangeOrder,
  Client,
  Invoice,
  Project,
  ProjectComment,
  ProjectDailyLog,
  ProjectFile,
  ProjectPhoto,
  ProjectRfi,
  ProjectSelection,
  ProjectVendorAssignment,
  ProjectUpdate,
  Vendor,
  WarrantyItem,
} from "./types";

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

const secondClient: Client = {
  id: "client-2",
  name: "Morgan Ridge",
  email: "morgan@example.com",
  phone: "(970) 555-0194",
};

const secondProject: Project = {
  ...project,
  id: "project-2",
  clientId: "client-2",
  name: "Poudre Canyon Mountain Modern",
  progress: 76,
  currentPhase: "Exterior completion",
  notes: "Second internal project note.",
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

const comments: ProjectComment[] = [
  {
    id: "comment-1",
    projectId: "project-1",
    authorName: "Avery Thompson",
    body: "Tile direction approved.",
    visibility: "customer",
    createdAt: "2026-05-14T10:00:00Z",
  },
  {
    id: "comment-2",
    projectId: "project-1",
    authorName: "Caleb Morgan",
    body: "Internal crew note.",
    visibility: "internal",
    createdAt: "2026-05-14T11:00:00Z",
  },
];

const selections: ProjectSelection[] = [
  {
    id: "selection-1",
    projectId: "project-1",
    category: "Tile",
    title: "Primary bath floor tile",
    allowanceAmount: 4200,
    selectedOption: "Large format porcelain",
    vendor: "Flooring Studio",
    dueDate: "2026-05-29",
    status: "approved",
    internalNotes: "Internal ordering note.",
    clientNotes: "Warm gray finish approved.",
    createdAt: "2026-05-14T10:00:00Z",
    approvedAt: "2026-05-14T16:30:00Z",
    approvedByName: "Avery Thompson",
  },
  {
    id: "selection-2",
    projectId: "project-1",
    category: "Cabinets",
    title: "Kitchen cabinet package",
    allowanceAmount: 32000,
    selectedOption: "White oak slab fronts",
    vendor: "Front Range Cabinetry",
    dueDate: "2026-05-27",
    status: "submitted",
    internalNotes: "Internal cabinet note.",
    clientNotes: "Under review.",
    createdAt: "2026-05-14T09:00:00Z",
    approvedAt: null,
    approvedByName: "",
  },
];

const rfis: ProjectRfi[] = [
  {
    id: "rfi-1",
    projectId: "project-1",
    title: "Kitchen pendant spacing",
    question: "Confirm pendant spacing.",
    answer: "Use equal spacing centered over the island.",
    requestedBy: "Maya Torres",
    dueDate: "2026-05-21",
    status: "answered",
    visibility: "customer",
    createdAt: "2026-05-13T12:00:00Z",
    answeredAt: "2026-05-14T11:30:00Z",
  },
  {
    id: "rfi-2",
    projectId: "project-1",
    title: "Shower niche layout",
    question: "Internal layout question.",
    answer: "",
    requestedBy: "Caleb Morgan",
    dueDate: "2026-05-24",
    status: "open",
    visibility: "internal",
    createdAt: "2026-05-14T08:30:00Z",
    answeredAt: null,
  },
];

const dailyLogs: ProjectDailyLog[] = [
  {
    id: "log-1",
    projectId: "project-1",
    reportDate: "2026-05-14",
    superintendent: "Caleb Jensen",
    weather: "Clear, 68F",
    crewCount: 6,
    workPerformed: "Framing crew completed blocking and porch lid framing.",
    deliveries: "Window flashing delivered.",
    inspections: "Rough framing inspection scheduled.",
    delays: "No delays.",
    safetyNotes: "Internal ladder huddle note.",
    nextSteps: "Prep inspection packet.",
    visibility: "customer",
    createdAt: "2026-05-14T15:00:00Z",
  },
  {
    id: "log-2",
    projectId: "project-1",
    reportDate: "2026-05-13",
    superintendent: "Maya Torres",
    weather: "Windy",
    crewCount: 4,
    workPerformed: "Internal coordination.",
    deliveries: "",
    inspections: "",
    delays: "",
    safetyNotes: "Internal safety note.",
    nextSteps: "",
    visibility: "internal",
    createdAt: "2026-05-13T15:00:00Z",
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
    approvedByName: "",
    lineItems: [{ id: "co-line-1", description: "Patio labor", quantity: 1, unitPrice: 2500 }],
  },
];

const warrantyItems: WarrantyItem[] = [
  {
    id: "warranty-1",
    projectId: "project-1",
    itemType: "punch-list",
    title: "Adjust primary bath door reveal",
    description: "Door rubs slightly at the strike side casing.",
    location: "Primary bath",
    requestedBy: "Avery Thompson",
    status: "open",
    priority: "normal",
    dueDate: "2026-06-04",
    visibility: "customer",
    createdAt: "2026-05-14T12:00:00Z",
    resolvedAt: null,
  },
  {
    id: "warranty-2",
    projectId: "project-1",
    itemType: "warranty",
    title: "Internal cabinet touch-up",
    description: "Track with finish carpenter.",
    location: "Kitchen",
    requestedBy: "Caleb Morgan",
    status: "scheduled",
    priority: "low",
    dueDate: "2026-06-07",
    visibility: "internal",
    createdAt: "2026-05-14T13:00:00Z",
    resolvedAt: null,
  },
];

const projectPhotos: ProjectPhoto[] = [
  {
    id: "photo-1",
    projectId: "project-1",
    title: "Kitchen rough-in progress",
    photoDate: "2026-05-14",
    category: "progress",
    visibility: "customer",
    imageUrl: "/images/project-3/kitchen-progress.jpg",
    caption: "Rough-in wall prep before insulation.",
    uploadedAt: "2026-05-14T15:30:00Z",
  },
  {
    id: "photo-2",
    projectId: "project-1",
    title: "Internal backing condition",
    photoDate: "2026-05-14",
    category: "issue",
    visibility: "internal",
    imageUrl: "/images/project-3/backing.jpg",
    caption: "Internal condition note.",
    uploadedAt: "2026-05-14T16:00:00Z",
  },
];

const vendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Front Range Cabinetry",
    companyType: "subcontractor",
    trade: "Cabinetry",
    email: "schedule@frcabinetry.example",
    phone: "(970) 555-0199",
    status: "active",
    portalAccess: true,
    notes: "Preferred cabinet partner.",
    createdAt: "2026-05-14T09:00:00Z",
  },
];

const vendorAssignments: ProjectVendorAssignment[] = [
  {
    id: "vendor-assignment-1",
    projectId: "project-1",
    vendorId: "vendor-1",
    scope: "Cabinet layout, shop drawings, and install coordination.",
    startDate: "2026-05-20",
    endDate: "2026-06-12",
    status: "active",
    visibility: "customer",
    createdAt: "2026-05-14T09:30:00Z",
  },
];

describe("client portal view", () => {
  it("keeps client-safe project data and hides internal files and notes", () => {
    const view = buildClientPortalView({
      project,
      client,
      files,
      updates,
      comments,
      selections,
      rfis,
      dailyLogs,
      invoices,
      changeOrders,
      warrantyItems,
      projectPhotos,
      vendors,
      vendorAssignments,
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
    expect(view.comments).toEqual([
      {
        id: "comment-1",
        authorName: "Avery Thompson",
        body: "Tile direction approved.",
        createdAt: "2026-05-14T10:00:00Z",
      },
    ]);
    expect(view.selections).toEqual([
      {
        id: "selection-1",
        category: "Tile",
        title: "Primary bath floor tile",
        selectedOption: "Large format porcelain",
        vendor: "Flooring Studio",
        dueDate: "2026-05-29",
        status: "approved",
        allowanceAmount: 4200,
        clientNotes: "Warm gray finish approved.",
        approvedAt: "2026-05-14T16:30:00Z",
        approvedByName: "Avery Thompson",
        isActionable: false,
      },
      {
        id: "selection-2",
        category: "Cabinets",
        title: "Kitchen cabinet package",
        selectedOption: "White oak slab fronts",
        vendor: "Front Range Cabinetry",
        dueDate: "2026-05-27",
        status: "submitted",
        allowanceAmount: 32000,
        clientNotes: "Under review.",
        approvedAt: null,
        approvedByName: "",
        isActionable: true,
      },
    ]);
    expect(view.rfis).toEqual([
      {
        id: "rfi-1",
        title: "Kitchen pendant spacing",
        question: "Confirm pendant spacing.",
        answer: "Use equal spacing centered over the island.",
        dueDate: "2026-05-21",
        status: "answered",
      },
    ]);
    expect(view.dailyLogs).toEqual([
      {
        id: "log-1",
        reportDate: "2026-05-14",
        superintendent: "Caleb Jensen",
        weather: "Clear, 68F",
        crewCount: 6,
        workPerformed: "Framing crew completed blocking and porch lid framing.",
        deliveries: "Window flashing delivered.",
        inspections: "Rough framing inspection scheduled.",
        delays: "No delays.",
        nextSteps: "Prep inspection packet.",
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
        approvedAt: null,
        approvedByName: "",
        isActionable: true,
      },
    ]);
    expect(view.warrantyItems).toEqual([
      {
        id: "warranty-1",
        itemType: "punch-list",
        title: "Adjust primary bath door reveal",
        description: "Door rubs slightly at the strike side casing.",
        location: "Primary bath",
        requestedBy: "Avery Thompson",
        status: "open",
        priority: "normal",
        dueDate: "2026-06-04",
        resolvedAt: null,
      },
    ]);
    expect(view.projectPhotos).toEqual([
      {
        id: "photo-1",
        title: "Kitchen rough-in progress",
        photoDate: "2026-05-14",
        category: "progress",
        imageUrl: "/images/project-3/kitchen-progress.jpg",
        caption: "Rough-in wall prep before insulation.",
      },
    ]);
    expect(view.vendorAssignments).toEqual([
      {
        id: "vendor-assignment-1",
        vendorName: "Front Range Cabinetry",
        companyType: "subcontractor",
        trade: "Cabinetry",
        email: "schedule@frcabinetry.example",
        phone: "(970) 555-0199",
        scope: "Cabinet layout, shop drawings, and install coordination.",
        startDate: "2026-05-20",
        endDate: "2026-06-12",
        status: "active",
      },
    ]);
    expect(JSON.stringify(view)).not.toContain("Internal");
  });

  it("builds a client dashboard without exposing internal-only records", () => {
    const dashboard = buildClientPortalDashboardView({
      projects: [project, secondProject],
      clients: [client, secondClient],
      files,
      updates,
      comments,
      selections,
      rfis,
      dailyLogs,
      invoices,
      changeOrders,
      warrantyItems,
      projectPhotos,
      vendors,
      vendorAssignments,
    });

    expect(dashboard.projects).toEqual([
      {
        id: "project-1",
        name: "Highland Ridge Custom Home",
        location: "Windsor, CO",
        type: "Custom Home",
        status: "active",
        currentPhase: "Interior rough-in",
        progress: 58,
        heroImage: "/images/project.jpg",
        clientName: "Avery Thompson",
        latestFieldReport: {
          id: "log-1",
          reportDate: "2026-05-14",
          weather: "Clear, 68F",
          workPerformed: "Framing crew completed blocking and porch lid framing.",
        },
        openSelectionCount: 1,
        openRfiCount: 0,
        openChangeOrderCount: 1,
        openWarrantyCount: 1,
        photoCount: 1,
        vendorAssignmentCount: 1,
        invoiceBalance: 200,
        sharedFileCount: 1,
      },
      {
        id: "project-2",
        name: "Poudre Canyon Mountain Modern",
        location: "Windsor, CO",
        type: "Custom Home",
        status: "active",
        currentPhase: "Exterior completion",
        progress: 76,
        heroImage: "/images/project.jpg",
        clientName: "Morgan Ridge",
        latestFieldReport: null,
        openSelectionCount: 0,
        openRfiCount: 0,
        openChangeOrderCount: 0,
        openWarrantyCount: 0,
        photoCount: 0,
        vendorAssignmentCount: 0,
        invoiceBalance: 0,
        sharedFileCount: 0,
      },
    ]);
    expect(dashboard.totals).toEqual({
      activeProjects: 2,
      sharedFiles: 1,
      openChangeOrders: 1,
      invoiceBalance: 200,
    });
    expect(JSON.stringify(dashboard)).not.toContain("Internal");
  });
});
