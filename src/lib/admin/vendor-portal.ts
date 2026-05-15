import type {
  Project,
  ProjectFile,
  ProjectRfi,
  ProjectVendorAssignment,
  Vendor,
  VendorRfiResponse,
  VendorSubmittal,
} from "./types";

export interface VendorPortalView {
  totals: {
    activePartners: number;
    assignments: number;
    sharedDocuments: number;
    openRfis: number;
    submittedDocuments: number;
  };
  assignments: VendorPortalAssignmentView[];
}

export interface VendorPortalAssignmentView {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorTrade: string;
  vendorEmail: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  projectPhase: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: ProjectVendorAssignment["status"];
  files: VendorPortalFileView[];
  rfis: VendorPortalRfiView[];
  submittals: VendorPortalSubmittalView[];
}

export interface VendorPortalFileView {
  id: string;
  name: string;
  type: ProjectFile["type"];
  uploadedAt: string;
  sizeLabel: string;
}

export interface VendorPortalRfiView {
  id: string;
  title: string;
  question: string;
  answer: string;
  requestedBy: string;
  dueDate: string;
  status: ProjectRfi["status"];
  responseHref: string;
  responses: {
    id: string;
    responderName: string;
    responseBody: string;
    createdAt: string;
  }[];
}

export interface VendorPortalSubmittalView {
  id: string;
  title: string;
  category: VendorSubmittal["category"];
  status: VendorSubmittal["status"];
  storageBucket: string;
  storagePath: string;
  sizeLabel: string;
  submittedAt: string;
  reviewedAt: string | null;
}

export function buildVendorPortalView({
  vendors,
  assignments,
  projects,
  files,
  rfis,
  responses = [],
  submittals = [],
  rfiResponseEmail = "office@kieferbuilt.com",
}: {
  vendors: Vendor[];
  assignments: ProjectVendorAssignment[];
  projects: Project[];
  files: ProjectFile[];
  rfis: ProjectRfi[];
  responses?: VendorRfiResponse[];
  submittals?: VendorSubmittal[];
  rfiResponseEmail?: string;
}): VendorPortalView {
  const portalVendors = vendors.filter((vendor) => vendor.status === "active" && vendor.portalAccess);
  const vendorsById = new Map(portalVendors.map((vendor) => [vendor.id, vendor]));
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const sharedFiles = files.filter((file) => file.visibility === "customer" && file.type !== "photo");
  const sharedRfis = rfis.filter((rfi) => rfi.visibility === "customer");

  const assignmentViews = assignments
    .filter((assignment) => assignment.visibility === "customer" && vendorsById.has(assignment.vendorId))
    .map((assignment) => {
      const vendor = vendorsById.get(assignment.vendorId);
      const project = projectsById.get(assignment.projectId);
      const assignmentFiles = sharedFiles
        .filter((file) => file.projectId === assignment.projectId)
        .map((file) => ({
          id: file.id,
          name: file.name,
          type: file.type,
          uploadedAt: file.uploadedAt,
          sizeLabel: file.sizeLabel,
        }));
      const assignmentRfis = sharedRfis
        .filter((rfi) => rfi.projectId === assignment.projectId)
        .map((rfi) => ({
          id: rfi.id,
          title: rfi.title,
          question: rfi.question,
          answer: rfi.answer,
          requestedBy: rfi.requestedBy,
          dueDate: rfi.dueDate,
          status: rfi.status,
          responseHref: makeRfiResponseHref({
            responseEmail: rfiResponseEmail,
            vendorName: vendor?.name ?? "Trade partner",
            vendorEmail: vendor?.email ?? "",
            projectName: project?.name ?? "Assigned job",
            rfiTitle: rfi.title,
          }),
          responses: responses
            .filter(
              (response) =>
                response.rfiId === rfi.id &&
                response.projectId === assignment.projectId &&
                response.vendorId === assignment.vendorId &&
                response.assignmentId === assignment.id,
            )
            .map((response) => ({
              id: response.id,
              responderName: response.responderName,
              responseBody: response.responseBody,
              createdAt: response.createdAt,
            })),
        }));
      const assignmentSubmittals = submittals
        .filter(
          (submittal) =>
            submittal.projectId === assignment.projectId &&
            submittal.vendorId === assignment.vendorId &&
            submittal.assignmentId === assignment.id,
        )
        .map((submittal) => ({
          id: submittal.id,
          title: submittal.title,
          category: submittal.category,
          status: submittal.status,
          storageBucket: submittal.storageBucket,
          storagePath: submittal.storagePath,
          sizeLabel: submittal.sizeLabel,
          submittedAt: submittal.submittedAt,
          reviewedAt: submittal.reviewedAt,
        }));

      return {
        id: assignment.id,
        vendorId: assignment.vendorId,
        vendorName: vendor?.name ?? "Trade partner",
        vendorTrade: vendor?.trade ?? "Trade partner",
        vendorEmail: vendor?.email ?? "",
        projectId: assignment.projectId,
        projectName: project?.name ?? "Assigned job",
        projectLocation: project?.location ?? "Location pending",
        projectPhase: project?.currentPhase ?? "Phase pending",
        scope: assignment.scope,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        status: assignment.status,
        files: assignmentFiles,
        rfis: assignmentRfis,
        submittals: assignmentSubmittals,
      };
    });

  return {
    totals: {
      activePartners: portalVendors.length,
      assignments: assignmentViews.length,
      sharedDocuments: assignmentViews.reduce((total, assignment) => total + assignment.files.length, 0),
      openRfis: assignmentViews.reduce(
        (total, assignment) => total + assignment.rfis.filter((rfi) => rfi.status === "open").length,
        0,
      ),
      submittedDocuments: assignmentViews.reduce((total, assignment) => total + assignment.submittals.length, 0),
    },
    assignments: assignmentViews,
  };
}

function makeRfiResponseHref({
  responseEmail,
  vendorName,
  vendorEmail,
  projectName,
  rfiTitle,
}: {
  responseEmail: string;
  vendorName: string;
  vendorEmail: string;
  projectName: string;
  rfiTitle: string;
}) {
  const subject = `RFI response: ${projectName} - ${rfiTitle}`;
  const body = [
    `Project: ${projectName}`,
    `RFI: ${rfiTitle}`,
    `Trade partner: ${vendorName}`,
    vendorEmail ? `Partner email: ${vendorEmail}` : "",
    "",
    "Response:",
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${responseEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
