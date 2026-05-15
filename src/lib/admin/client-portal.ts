import { changeOrderTotal, invoiceTotal } from "./formatters";
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

export interface ClientPortalView {
  project: Project;
  client: Client | null;
  files: ProjectFile[];
  updates: {
    id: string;
    title: string;
    body: string;
    updateDate: string;
  }[];
  comments: {
    id: string;
    authorName: string;
    body: string;
    createdAt: string;
  }[];
  selections: {
    id: string;
    category: string;
    title: string;
    selectedOption: string;
    vendor: string;
    dueDate: string;
    status: ProjectSelection["status"];
    allowanceAmount: number;
    clientNotes: string;
    approvedAt: string | null;
    approvedByName: string;
    isActionable: boolean;
  }[];
  rfis: {
    id: string;
    title: string;
    question: string;
    answer: string;
    dueDate: string;
    status: ProjectRfi["status"];
  }[];
  dailyLogs: {
    id: string;
    reportDate: string;
    superintendent: string;
    weather: string;
    crewCount: number;
    workPerformed: string;
    deliveries: string;
    inspections: string;
    delays: string;
    nextSteps: string;
  }[];
  invoices: {
    id: string;
    invoiceNumber: string;
    status: Invoice["status"];
    dueDate: string;
    total: number;
  }[];
  changeOrders: {
    id: string;
    changeOrderNumber: string;
    title: string;
    status: ChangeOrder["status"];
    scheduleImpactDays: number;
    clientMessage: string;
    total: number;
    approvedAt: string | null;
    approvedByName: string;
    isActionable: boolean;
  }[];
  warrantyItems: {
    id: string;
    itemType: WarrantyItem["itemType"];
    title: string;
    description: string;
    location: string;
    requestedBy: string;
    status: WarrantyItem["status"];
    priority: WarrantyItem["priority"];
    dueDate: string;
    resolvedAt: string | null;
  }[];
  projectPhotos: {
    id: string;
    title: string;
    photoDate: string;
    category: ProjectPhoto["category"];
    imageUrl: string;
    caption: string;
  }[];
  vendorAssignments: {
    id: string;
    vendorName: string;
    companyType: Vendor["companyType"];
    trade: string;
    email: string;
    phone: string;
    scope: string;
    startDate: string;
    endDate: string;
    status: ProjectVendorAssignment["status"];
  }[];
}

export interface ClientPortalDashboardView {
  projects: {
    id: string;
    name: string;
    location: string;
    type: string;
    status: Project["status"];
    currentPhase: string;
    progress: number;
    heroImage: string;
    clientName: string;
    latestFieldReport: {
      id: string;
      reportDate: string;
      weather: string;
      workPerformed: string;
    } | null;
    openSelectionCount: number;
    openRfiCount: number;
    openChangeOrderCount: number;
    openWarrantyCount: number;
    photoCount: number;
    vendorAssignmentCount: number;
    invoiceBalance: number;
    sharedFileCount: number;
  }[];
  totals: {
    activeProjects: number;
    sharedFiles: number;
    openChangeOrders: number;
    invoiceBalance: number;
  };
}

export function buildClientPortalDashboardView({
  projects,
  clients,
  files,
  invoices,
  changeOrders,
  selections,
  rfis,
  dailyLogs,
  warrantyItems,
  projectPhotos,
  vendors,
  vendorAssignments,
}: {
  projects: Project[];
  clients: Client[];
  files: ProjectFile[];
  updates: ProjectUpdate[];
  comments: ProjectComment[];
  selections: ProjectSelection[];
  rfis: ProjectRfi[];
  dailyLogs: ProjectDailyLog[];
  invoices: Invoice[];
  changeOrders: ChangeOrder[];
  warrantyItems: WarrantyItem[];
  projectPhotos: ProjectPhoto[];
  vendors: Vendor[];
  vendorAssignments: ProjectVendorAssignment[];
}): ClientPortalDashboardView {
  const clientsById = new Map(clients.map((client) => [client.id, client]));
  const visibleFiles = files.filter((file) => file.visibility === "customer");
  const visibleDailyLogs = dailyLogs.filter((dailyLog) => dailyLog.visibility === "customer");
  const visibleRfis = rfis.filter((rfi) => rfi.visibility === "customer");
  const visibleWarrantyItems = warrantyItems.filter((item) => item.visibility === "customer");
  const visibleProjectPhotos = projectPhotos.filter((photo) => photo.visibility === "customer");
  const vendorsById = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  const visibleVendorAssignments = vendorAssignments.filter((assignment) => {
    const vendor = vendorsById.get(assignment.vendorId);
    return assignment.visibility === "customer" && vendor?.portalAccess && vendor.status === "active";
  });

  const projectCards = projects.map((project) => {
    const projectDailyLogs = visibleDailyLogs
      .filter((dailyLog) => dailyLog.projectId === project.id)
      .toSorted((a, b) => b.reportDate.localeCompare(a.reportDate));
    const latestFieldReport = projectDailyLogs[0] ?? null;
    const projectInvoices = invoices.filter((invoice) => invoice.projectId === project.id);
    const projectChangeOrders = changeOrders.filter((changeOrder) => changeOrder.projectId === project.id);

    return {
      id: project.id,
      name: project.name,
      location: project.location,
      type: project.type,
      status: project.status,
      currentPhase: project.currentPhase,
      progress: project.progress,
      heroImage: project.heroImage,
      clientName: clientsById.get(project.clientId)?.name ?? "Client",
      latestFieldReport: latestFieldReport
        ? {
            id: latestFieldReport.id,
            reportDate: latestFieldReport.reportDate,
            weather: latestFieldReport.weather,
            workPerformed: latestFieldReport.workPerformed,
          }
        : null,
      openSelectionCount: selections.filter(
        (selection) => selection.projectId === project.id && selection.status === "submitted",
      ).length,
      openRfiCount: visibleRfis.filter((rfi) => rfi.projectId === project.id && rfi.status === "open").length,
      openChangeOrderCount: projectChangeOrders.filter(
        (changeOrder) => changeOrder.status === "sent",
      ).length,
      openWarrantyCount: visibleWarrantyItems.filter(
        (item) =>
          item.projectId === project.id &&
          (item.status === "open" || item.status === "scheduled"),
      ).length,
      photoCount: visibleProjectPhotos.filter((photo) => photo.projectId === project.id).length,
      vendorAssignmentCount: visibleVendorAssignments.filter(
        (assignment) => assignment.projectId === project.id && assignment.status !== "complete",
      ).length,
      invoiceBalance: projectInvoices
        .filter((invoice) => invoice.status !== "paid")
        .reduce((sum, invoice) => sum + invoiceTotal(invoice.lineItems), 0),
      sharedFileCount: visibleFiles.filter((file) => file.projectId === project.id).length,
    };
  });

  return {
    projects: projectCards,
    totals: {
      activeProjects: projectCards.filter((project) => project.status === "active").length,
      sharedFiles: visibleFiles.length,
      openChangeOrders: projectCards.reduce((sum, project) => sum + project.openChangeOrderCount, 0),
      invoiceBalance: projectCards.reduce((sum, project) => sum + project.invoiceBalance, 0),
    },
  };
}

export function buildClientPortalView({
  project,
  client,
  files,
  invoices,
  changeOrders,
  updates,
  comments,
  selections,
  rfis,
  dailyLogs,
  warrantyItems,
  projectPhotos,
  vendors,
  vendorAssignments,
}: {
  project: Project;
  client: Client | null;
  files: ProjectFile[];
  updates: ProjectUpdate[];
  comments: ProjectComment[];
  selections: ProjectSelection[];
  rfis: ProjectRfi[];
  dailyLogs: ProjectDailyLog[];
  invoices: Invoice[];
  changeOrders: ChangeOrder[];
  warrantyItems: WarrantyItem[];
  projectPhotos: ProjectPhoto[];
  vendors: Vendor[];
  vendorAssignments: ProjectVendorAssignment[];
}): ClientPortalView {
  const vendorsById = new Map(vendors.map((vendor) => [vendor.id, vendor]));

  return {
    project: {
      ...project,
      notes: "",
    },
    client,
    files: files.filter((file) => file.visibility === "customer"),
    updates: updates
      .filter((update) => update.visibility === "customer")
      .map((update) => ({
        id: update.id,
        title: update.title,
        body: update.body,
        updateDate: update.updateDate,
      })),
    comments: comments
      .filter((comment) => comment.visibility === "customer")
      .map((comment) => ({
        id: comment.id,
        authorName: comment.authorName,
        body: comment.body,
        createdAt: comment.createdAt,
      })),
    selections: selections
      .filter(
        (selection) =>
          selection.status === "submitted" ||
          selection.status === "approved" ||
          selection.status === "ordered",
      )
      .map((selection) => ({
        id: selection.id,
        category: selection.category,
        title: selection.title,
        selectedOption: selection.selectedOption,
        vendor: selection.vendor,
        dueDate: selection.dueDate,
        status: selection.status,
        allowanceAmount: selection.allowanceAmount,
        clientNotes: selection.clientNotes,
        approvedAt: selection.approvedAt,
        approvedByName: selection.approvedByName,
        isActionable: selection.status === "submitted",
      })),
    rfis: rfis
      .filter((rfi) => rfi.visibility === "customer")
      .map((rfi) => ({
        id: rfi.id,
        title: rfi.title,
        question: rfi.question,
        answer: rfi.answer,
        dueDate: rfi.dueDate,
        status: rfi.status,
      })),
    dailyLogs: dailyLogs
      .filter((dailyLog) => dailyLog.visibility === "customer")
      .map((dailyLog) => ({
        id: dailyLog.id,
        reportDate: dailyLog.reportDate,
        superintendent: dailyLog.superintendent,
        weather: dailyLog.weather,
        crewCount: dailyLog.crewCount,
        workPerformed: dailyLog.workPerformed,
        deliveries: dailyLog.deliveries,
        inspections: dailyLog.inspections,
        delays: dailyLog.delays,
        nextSteps: dailyLog.nextSteps,
      })),
    invoices: invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      dueDate: invoice.dueDate,
      total: invoiceTotal(invoice.lineItems),
    })),
    changeOrders: changeOrders
      .filter((changeOrder) => changeOrder.status === "sent" || changeOrder.status === "approved")
      .map((changeOrder) => ({
        id: changeOrder.id,
        changeOrderNumber: changeOrder.changeOrderNumber,
        title: changeOrder.title,
        status: changeOrder.status,
        scheduleImpactDays: changeOrder.scheduleImpactDays,
        clientMessage: changeOrder.clientMessage,
        total: changeOrderTotal(changeOrder.lineItems),
        approvedAt: changeOrder.approvedAt,
        approvedByName: changeOrder.approvedByName,
        isActionable: changeOrder.status === "sent",
      })),
    warrantyItems: warrantyItems
      .filter((item) => item.visibility === "customer")
      .map((item) => ({
        id: item.id,
        itemType: item.itemType,
        title: item.title,
        description: item.description,
        location: item.location,
        requestedBy: item.requestedBy,
        status: item.status,
        priority: item.priority,
        dueDate: item.dueDate,
        resolvedAt: item.resolvedAt,
    })),
    projectPhotos: projectPhotos
      .filter((photo) => photo.visibility === "customer")
      .map((photo) => ({
        id: photo.id,
        title: photo.title,
        photoDate: photo.photoDate,
        category: photo.category,
        imageUrl: photo.imageUrl,
        caption: photo.caption,
      })),
    vendorAssignments: vendorAssignments
      .filter((assignment) => {
        const vendor = vendorsById.get(assignment.vendorId);
        return assignment.visibility === "customer" && vendor?.portalAccess && vendor.status === "active";
      })
      .map((assignment) => {
        const vendor = vendorsById.get(assignment.vendorId);

        return {
          id: assignment.id,
          vendorName: vendor?.name ?? "Vendor",
          companyType: vendor?.companyType ?? "vendor",
          trade: vendor?.trade ?? "Trade",
          email: vendor?.email ?? "",
          phone: vendor?.phone ?? "",
          scope: assignment.scope,
          startDate: assignment.startDate,
          endDate: assignment.endDate,
          status: assignment.status,
        };
      }),
  };
}
