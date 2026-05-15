import { changeOrderTotal, invoiceTotal } from "./formatters";
import type {
  Bill,
  ChangeOrder,
  Invoice,
  Project,
  ProjectFinancialTarget,
  ProjectPhoto,
  ProjectRfi,
  ProjectSelection,
  ProjectTask,
  ProjectVendorAssignment,
  PurchaseOrder,
  Vendor,
  WarrantyItem,
} from "./types";

export interface OperationsReportInput {
  today?: string;
  projects: Pick<Project, "id" | "name" | "status" | "progress" | "estimatedCompletion">[];
  tasks: ProjectTask[];
  rfis: ProjectRfi[];
  selections: ProjectSelection[];
  warrantyItems: WarrantyItem[];
  purchaseOrders: PurchaseOrder[];
  bills: Bill[];
  invoices: Invoice[];
  changeOrders: ChangeOrder[];
  projectPhotos: ProjectPhoto[];
  vendors: Vendor[];
  vendorAssignments: ProjectVendorAssignment[];
  financialTargets: ProjectFinancialTarget[];
}

export interface ProjectOperationsReport {
  projectId: string;
  projectName: string;
  status: Project["status"];
  progress: number;
  estimatedCompletion: string;
  openTaskCount: number;
  overdueTaskCount: number;
  pendingChangeOrderTotal: number;
  approvedChangeOrderTotal: number;
  draftInvoiceTotal: number;
  unpaidBillTotal: number;
  openPurchaseOrderTotal: number;
  openRfiCount: number;
  pendingSelectionCount: number;
  openWarrantyCount: number;
  vendorAssignmentCount: number;
  clientVisiblePhotoCount: number;
  contractValue: number;
  budgetedCost: number;
  targetMarginPercent: number;
  contingencyPercent: number;
  committedCost: number;
  actualCost: number;
  approvedRevenue: number;
  projectedRevenue: number;
  projectedCost: number;
  projectedMargin: number;
  projectedMarginPercent: number;
  marginStatus: "on-track" | "watch" | "at-risk" | "unset";
}

export interface NeedsAttentionItem {
  id: string;
  type: "bill" | "warranty" | "selection" | "rfi" | "task" | "change-order";
  projectId: string;
  projectName: string;
  title: string;
  dueDate: string;
  severity: "high" | "normal";
  href: string;
}

export interface VendorCommitmentReport {
  id: string;
  projectId: string;
  projectName: string;
  vendorName: string;
  trade: string;
  scope: string;
  status: ProjectVendorAssignment["status"];
  startDate: string;
  endDate: string;
}

export interface OperationsReports {
  summary: {
    activeProjectCount: number;
    openTaskCount: number;
    overdueTaskCount: number;
    pendingChangeOrderTotal: number;
    unpaidBillTotal: number;
    openPurchaseOrderTotal: number;
    openRfiCount: number;
    pendingSelectionCount: number;
    openWarrantyCount: number;
    portalEnabledVendorCount: number;
    clientVisiblePhotoCount: number;
    needsAttentionCount: number;
    atRiskMarginCount: number;
  };
  financials: {
    openPurchaseOrdersTotal: number;
    unpaidBillsTotal: number;
    draftInvoiceTotal: number;
    pendingChangeOrderTotal: number;
    approvedChangeOrderTotal: number;
  };
  marginSummary: {
    contractValue: number;
    budgetedCost: number;
    committedCost: number;
    actualCost: number;
    approvedRevenue: number;
    projectedRevenue: number;
    projectedCost: number;
    projectedMargin: number;
    averageProjectedMarginPercent: number;
    atRiskMarginCount: number;
  };
  projectReports: ProjectOperationsReport[];
  needsAttention: NeedsAttentionItem[];
  vendorCommitments: VendorCommitmentReport[];
}

function isBeforeToday(value: string, today: string) {
  return value < today;
}

function byProject<T extends { projectId: string }>(items: T[], projectId: string) {
  return items.filter((item) => item.projectId === projectId);
}

function projectName(projectsById: Map<string, Pick<Project, "id" | "name">>, projectId: string) {
  return projectsById.get(projectId)?.name ?? "Unknown job";
}

function isOpenPurchaseOrder(purchaseOrder: PurchaseOrder) {
  return purchaseOrder.status !== "received";
}

function isUnpaidBill(bill: Bill) {
  return bill.status !== "paid";
}

function isOpenTask(task: ProjectTask) {
  return task.status !== "done";
}

function isOpenRfi(rfi: ProjectRfi) {
  return rfi.status === "open";
}

function isPendingSelection(selection: ProjectSelection) {
  return selection.status === "needed" || selection.status === "submitted";
}

function isOpenWarranty(item: WarrantyItem) {
  return item.status === "open" || item.status === "scheduled";
}

function sortedAttention(items: NeedsAttentionItem[]) {
  const typeOrder: Record<NeedsAttentionItem["type"], number> = {
    bill: 0,
    warranty: 1,
    selection: 2,
    rfi: 3,
    task: 4,
    "change-order": 5,
  };

  return [...items].sort((a, b) => {
    if (a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    return typeOrder[a.type] - typeOrder[b.type];
  });
}

function roundCurrency(value: number) {
  return Math.round(value);
}

function roundPercent(value: number) {
  return Math.round(value * 100) / 100;
}

function marginStatus(projectedMarginPercent: number, targetMarginPercent: number, hasTarget: boolean) {
  if (!hasTarget) {
    return "unset" as const;
  }

  if (projectedMarginPercent < targetMarginPercent) {
    return "at-risk" as const;
  }

  return "on-track" as const;
}

export function buildOperationsReports(input: OperationsReportInput): OperationsReports {
  const today = input.today ?? new Date().toISOString().slice(0, 10);
  const projectsById = new Map(input.projects.map((project) => [project.id, project]));
  const financialTargetsByProjectId = new Map(
    input.financialTargets.map((target) => [target.projectId, target]),
  );
  const activePortalVendors = input.vendors.filter(
    (vendor) => vendor.status === "active" && vendor.portalAccess,
  );
  const activePortalVendorsById = new Map(activePortalVendors.map((vendor) => [vendor.id, vendor]));
  const needsAttention: NeedsAttentionItem[] = [];

  for (const bill of input.bills.filter((item) => isUnpaidBill(item) && isBeforeToday(item.dueDate, today))) {
    needsAttention.push({
      id: bill.id,
      type: "bill",
      projectId: bill.projectId,
      projectName: projectName(projectsById, bill.projectId),
      title: `${bill.billNumber ?? "Bill"} · ${bill.vendor}`,
      dueDate: bill.dueDate,
      severity: "high",
      href: `/admin/projects/${bill.projectId}`,
    });
  }

  for (const item of input.warrantyItems.filter((entry) => isOpenWarranty(entry) && isBeforeToday(entry.dueDate, today))) {
    needsAttention.push({
      id: item.id,
      type: "warranty",
      projectId: item.projectId,
      projectName: projectName(projectsById, item.projectId),
      title: item.title,
      dueDate: item.dueDate,
      severity: item.priority === "high" ? "high" : "normal",
      href: `/admin/projects/${item.projectId}`,
    });
  }

  for (const selection of input.selections.filter((item) => isPendingSelection(item) && isBeforeToday(item.dueDate, today))) {
    needsAttention.push({
      id: selection.id,
      type: "selection",
      projectId: selection.projectId,
      projectName: projectName(projectsById, selection.projectId),
      title: selection.title,
      dueDate: selection.dueDate,
      severity: "normal",
      href: `/admin/projects/${selection.projectId}`,
    });
  }

  for (const rfi of input.rfis.filter((item) => isOpenRfi(item) && isBeforeToday(item.dueDate, today))) {
    needsAttention.push({
      id: rfi.id,
      type: "rfi",
      projectId: rfi.projectId,
      projectName: projectName(projectsById, rfi.projectId),
      title: rfi.title,
      dueDate: rfi.dueDate,
      severity: "normal",
      href: `/admin/projects/${rfi.projectId}`,
    });
  }

  for (const task of input.tasks.filter((item) => isOpenTask(item) && isBeforeToday(item.dueDate, today))) {
    needsAttention.push({
      id: task.id,
      type: "task",
      projectId: task.projectId,
      projectName: projectName(projectsById, task.projectId),
      title: task.title,
      dueDate: task.dueDate,
      severity: task.priority === "urgent" || task.priority === "high" ? "high" : "normal",
      href: `/admin/projects/${task.projectId}`,
    });
  }

  for (const changeOrder of input.changeOrders.filter((item) => item.status === "sent")) {
    needsAttention.push({
      id: changeOrder.id,
      type: "change-order",
      projectId: changeOrder.projectId,
      projectName: projectName(projectsById, changeOrder.projectId),
      title: changeOrder.title,
      dueDate: changeOrder.createdAt?.slice(0, 10) ?? today,
      severity: "normal",
      href: `/admin/change-orders/${changeOrder.id}`,
    });
  }

  const projectReports = input.projects.map((project) => {
    const tasks = byProject(input.tasks, project.id);
    const rfis = byProject(input.rfis, project.id);
    const selections = byProject(input.selections, project.id);
    const warrantyItems = byProject(input.warrantyItems, project.id);
    const purchaseOrders = byProject(input.purchaseOrders, project.id);
    const bills = byProject(input.bills, project.id);
    const invoices = byProject(input.invoices, project.id);
    const changeOrders = byProject(input.changeOrders, project.id);
    const projectPhotos = byProject(input.projectPhotos, project.id);
    const vendorAssignments = byProject(input.vendorAssignments, project.id);
    const target = financialTargetsByProjectId.get(project.id);
    const openPurchaseOrderTotal = purchaseOrders
      .filter(isOpenPurchaseOrder)
      .reduce((sum, purchaseOrder) => sum + purchaseOrder.amount, 0);
    const unpaidBillTotal = bills.filter(isUnpaidBill).reduce((sum, bill) => sum + bill.amount, 0);
    const actualCost = bills
      .filter((bill) => bill.status === "paid" || bill.status === "received")
      .reduce((sum, bill) => sum + bill.amount, 0);
    const committedCost = actualCost + openPurchaseOrderTotal;
    const approvedChangeOrderTotal = changeOrders
      .filter((changeOrder) => changeOrder.status === "approved")
      .reduce((sum, changeOrder) => sum + changeOrderTotal(changeOrder.lineItems), 0);
    const approvedRevenue = invoices
      .filter((invoice) => invoice.status === "sent" || invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoiceTotal(invoice.lineItems), 0) + approvedChangeOrderTotal;
    const contractValue = target?.contractValue ?? 0;
    const budgetedCost = target?.budgetedCost ?? 0;
    const targetMarginPercent = target?.targetMarginPercent ?? 0;
    const contingencyPercent = target?.contingencyPercent ?? 0;
    const projectedRevenue = contractValue + approvedChangeOrderTotal;
    const contingencyAmount = budgetedCost * (contingencyPercent / 100);
    const projectedCost = Math.max(budgetedCost, committedCost + contingencyAmount);
    const projectedMargin = projectedRevenue - projectedCost;
    const projectedMarginPercent = projectedRevenue > 0 ? (projectedMargin / projectedRevenue) * 100 : 0;

    return {
      projectId: project.id,
      projectName: project.name,
      status: project.status,
      progress: project.progress,
      estimatedCompletion: project.estimatedCompletion ?? "",
      openTaskCount: tasks.filter(isOpenTask).length,
      overdueTaskCount: tasks.filter((task) => isOpenTask(task) && isBeforeToday(task.dueDate, today)).length,
      pendingChangeOrderTotal: changeOrders
        .filter((changeOrder) => changeOrder.status === "draft" || changeOrder.status === "sent")
        .reduce((sum, changeOrder) => sum + changeOrderTotal(changeOrder.lineItems), 0),
      approvedChangeOrderTotal,
      draftInvoiceTotal: invoices
        .filter((invoice) => invoice.status === "draft")
        .reduce((sum, invoice) => sum + invoiceTotal(invoice.lineItems), 0),
      unpaidBillTotal,
      openPurchaseOrderTotal,
      openRfiCount: rfis.filter(isOpenRfi).length,
      pendingSelectionCount: selections.filter(isPendingSelection).length,
      openWarrantyCount: warrantyItems.filter(isOpenWarranty).length,
      vendorAssignmentCount: vendorAssignments.length,
      clientVisiblePhotoCount: projectPhotos.filter((photo) => photo.visibility === "customer").length,
      contractValue: roundCurrency(contractValue),
      budgetedCost: roundCurrency(budgetedCost),
      targetMarginPercent,
      contingencyPercent,
      committedCost: roundCurrency(committedCost),
      actualCost: roundCurrency(actualCost),
      approvedRevenue: roundCurrency(approvedRevenue),
      projectedRevenue: roundCurrency(projectedRevenue),
      projectedCost: roundCurrency(projectedCost),
      projectedMargin: roundCurrency(projectedMargin),
      projectedMarginPercent: roundPercent(projectedMarginPercent),
      marginStatus: marginStatus(projectedMarginPercent, targetMarginPercent, Boolean(target)),
    };
  });

  const financials = projectReports.reduce(
    (totals, project) => ({
      openPurchaseOrdersTotal: totals.openPurchaseOrdersTotal + project.openPurchaseOrderTotal,
      unpaidBillsTotal: totals.unpaidBillsTotal + project.unpaidBillTotal,
      draftInvoiceTotal: totals.draftInvoiceTotal + project.draftInvoiceTotal,
      pendingChangeOrderTotal: totals.pendingChangeOrderTotal + project.pendingChangeOrderTotal,
      approvedChangeOrderTotal: totals.approvedChangeOrderTotal + project.approvedChangeOrderTotal,
    }),
    {
      openPurchaseOrdersTotal: 0,
      unpaidBillsTotal: 0,
      draftInvoiceTotal: 0,
      pendingChangeOrderTotal: 0,
      approvedChangeOrderTotal: 0,
    },
  );

  const vendorCommitments = input.vendorAssignments
    .filter((assignment) => activePortalVendorsById.has(assignment.vendorId))
    .map((assignment) => {
      const vendor = activePortalVendorsById.get(assignment.vendorId);

      return {
        id: assignment.id,
        projectId: assignment.projectId,
        projectName: projectName(projectsById, assignment.projectId),
        vendorName: vendor?.name ?? "Unknown partner",
        trade: vendor?.trade ?? "Trade",
        scope: assignment.scope,
        status: assignment.status,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
      };
    });

  const openTaskCount = projectReports.reduce((sum, project) => sum + project.openTaskCount, 0);
  const overdueTaskCount = projectReports.reduce((sum, project) => sum + project.overdueTaskCount, 0);
  const openRfiCount = projectReports.reduce((sum, project) => sum + project.openRfiCount, 0);
  const pendingSelectionCount = projectReports.reduce((sum, project) => sum + project.pendingSelectionCount, 0);
  const openWarrantyCount = projectReports.reduce((sum, project) => sum + project.openWarrantyCount, 0);
  const clientVisiblePhotoCount = projectReports.reduce((sum, project) => sum + project.clientVisiblePhotoCount, 0);
  const marginSummary = projectReports.reduce(
    (totals, project) => ({
      contractValue: totals.contractValue + project.contractValue,
      budgetedCost: totals.budgetedCost + project.budgetedCost,
      committedCost: totals.committedCost + project.committedCost,
      actualCost: totals.actualCost + project.actualCost,
      approvedRevenue: totals.approvedRevenue + project.approvedRevenue,
      projectedRevenue: totals.projectedRevenue + project.projectedRevenue,
      projectedCost: totals.projectedCost + project.projectedCost,
      projectedMargin: totals.projectedMargin + project.projectedMargin,
      atRiskMarginCount: totals.atRiskMarginCount + (project.marginStatus === "at-risk" ? 1 : 0),
    }),
    {
      contractValue: 0,
      budgetedCost: 0,
      committedCost: 0,
      actualCost: 0,
      approvedRevenue: 0,
      projectedRevenue: 0,
      projectedCost: 0,
      projectedMargin: 0,
      atRiskMarginCount: 0,
    },
  );
  const averageProjectedMarginPercent =
    marginSummary.projectedRevenue > 0
      ? roundPercent((marginSummary.projectedMargin / marginSummary.projectedRevenue) * 100)
      : 0;

  return {
    summary: {
      activeProjectCount: input.projects.filter((project) => project.status === "active").length,
      openTaskCount,
      overdueTaskCount,
      pendingChangeOrderTotal: financials.pendingChangeOrderTotal,
      unpaidBillTotal: financials.unpaidBillsTotal,
      openPurchaseOrderTotal: financials.openPurchaseOrdersTotal,
      openRfiCount,
      pendingSelectionCount,
      openWarrantyCount,
      portalEnabledVendorCount: activePortalVendors.length,
      clientVisiblePhotoCount,
      needsAttentionCount: needsAttention.length,
      atRiskMarginCount: marginSummary.atRiskMarginCount,
    },
    financials,
    marginSummary: {
      ...marginSummary,
      averageProjectedMarginPercent,
    },
    projectReports,
    needsAttention: sortedAttention(needsAttention),
    vendorCommitments,
  };
}
