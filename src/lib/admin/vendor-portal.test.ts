import { describe, expect, it } from "vitest";
import { buildVendorPortalView } from "./vendor-portal";
import type {
  Project,
  ProjectFile,
  ProjectRfi,
  ProjectVendorAssignment,
  Vendor,
  VendorRfiResponse,
  VendorSubmittal,
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
  notes: "",
  heroImage: "/images/project-3/exterior-twilight-front.jpg",
  phases: [],
};

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
      notes: "",
      authEmail: "schedule@frcabinetry.example",
      createdAt: "2026-05-14T09:00:00-06:00",
  },
  {
    id: "vendor-2",
    name: "Private Tile",
    companyType: "subcontractor",
    trade: "Tile",
    email: "dispatch@tile.example",
    phone: "(970) 555-0188",
    status: "active",
    portalAccess: false,
      notes: "",
      authEmail: "dispatch@tile.example",
      createdAt: "2026-05-14T09:00:00-06:00",
  },
];

const assignments: ProjectVendorAssignment[] = [
  {
    id: "assignment-1",
    projectId: "project-1",
    vendorId: "vendor-1",
    scope: "Cabinet layout and shop drawing coordination.",
    startDate: "2026-05-20",
    endDate: "2026-06-12",
    status: "active",
    visibility: "customer",
    createdAt: "2026-05-14T09:30:00-06:00",
  },
  {
    id: "assignment-2",
    projectId: "project-1",
    vendorId: "vendor-2",
    scope: "Tile work.",
    startDate: "2026-05-20",
    endDate: "2026-06-12",
    status: "active",
    visibility: "customer",
    createdAt: "2026-05-14T09:30:00-06:00",
  },
];

const files: ProjectFile[] = [
  {
    id: "file-1",
    projectId: "project-1",
    name: "Shared finish schedule.pdf",
    type: "document",
    visibility: "customer",
    storageBucket: "project-documents",
    storagePath: "project-1/documents/shared-finish-schedule.pdf",
    uploadedAt: "2026-05-15",
    sizeLabel: "820 KB",
  },
  {
    id: "file-2",
    projectId: "project-1",
    name: "Internal margin notes.pdf",
    type: "document",
    visibility: "internal",
    storageBucket: "project-documents",
    storagePath: "project-1/documents/internal-margin-notes.pdf",
    uploadedAt: "2026-05-15",
    sizeLabel: "110 KB",
  },
];

const rfis: ProjectRfi[] = [
  {
    id: "rfi-1",
    projectId: "project-1",
    title: "Confirm cabinet pull locations",
    question: "Please confirm drawer pull locations before drilling.",
    answer: "",
    requestedBy: "Caleb Jensen",
    dueDate: "2026-05-24",
    status: "open",
    visibility: "customer",
    createdAt: "2026-05-14T08:30:00-06:00",
    answeredAt: null,
  },
  {
    id: "rfi-2",
    projectId: "project-1",
    title: "Internal allowance question",
    question: "Should the allowance be moved?",
    answer: "",
    requestedBy: "Caleb Jensen",
    dueDate: "2026-05-24",
    status: "open",
    visibility: "internal",
    createdAt: "2026-05-14T08:30:00-06:00",
    answeredAt: null,
  },
];

const responses: VendorRfiResponse[] = [
  {
    id: "response-1",
    projectId: "project-1",
    rfiId: "rfi-1",
    vendorId: "vendor-1",
    assignmentId: "assignment-1",
    responderName: "Morgan Fields",
    responseBody: "Pulls are approved at 6 inches on center.",
    createdAt: "2026-05-15T10:00:00-06:00",
  },
];

const submittals: VendorSubmittal[] = [
  {
    id: "submittal-1",
    projectId: "project-1",
    vendorId: "vendor-1",
    assignmentId: "assignment-1",
    title: "Cabinet shop drawings",
    category: "submittal",
    status: "submitted",
    storageBucket: "project-documents",
    storagePath: "project-1/vendor-submittals/vendor-1/cabinet-shop-drawings.pdf",
    mimeType: "application/pdf",
    sizeLabel: "640 KB",
    submittedAt: "2026-05-15T11:00:00-06:00",
    reviewedAt: null,
  },
];

describe("vendor portal projection", () => {
  it("shows only active portal-enabled vendor assignments and shared exchange items", () => {
    const view = buildVendorPortalView({
      vendors,
      assignments,
      projects: [project],
      files,
      rfis,
      responses,
      submittals,
    });

    expect(view.totals).toEqual({
      activePartners: 1,
      assignments: 1,
      sharedDocuments: 1,
      openRfis: 1,
      submittedDocuments: 1,
    });
    expect(view.assignments).toHaveLength(1);
    expect(view.assignments[0]).toMatchObject({
      vendorName: "Front Range Cabinetry",
      projectName: "Highland Ridge Custom Home",
    });
    expect(view.assignments[0].files.map((file) => file.name)).toEqual(["Shared finish schedule.pdf"]);
    expect(view.assignments[0].rfis.map((rfi) => rfi.title)).toEqual(["Confirm cabinet pull locations"]);
    expect(view.assignments[0].rfis[0].responses).toEqual([
      {
        id: "response-1",
        responderName: "Morgan Fields",
        responseBody: "Pulls are approved at 6 inches on center.",
        createdAt: "2026-05-15T10:00:00-06:00",
      },
    ]);
    expect(view.assignments[0].rfis[0].responseHref).toContain("mailto:office@kieferbuilt.com");
    expect(view.assignments[0].submittals).toEqual([
      {
        id: "submittal-1",
        title: "Cabinet shop drawings",
        category: "submittal",
        status: "submitted",
        storageBucket: "project-documents",
        storagePath: "project-1/vendor-submittals/vendor-1/cabinet-shop-drawings.pdf",
        sizeLabel: "640 KB",
        submittedAt: "2026-05-15T11:00:00-06:00",
        reviewedAt: null,
      },
    ]);
  });
});
