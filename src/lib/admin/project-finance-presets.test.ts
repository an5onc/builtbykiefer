import { describe, expect, it } from "vitest";
import { buildProjectFinancePreset } from "./project-finance-presets";
import type {
  Bill,
  ChangeOrder,
  Invoice,
  Project,
  ProjectFinancialTarget,
  PurchaseOrder,
  TimeEntry,
} from "./types";

const project: Project = {
  id: "project-1",
  clientId: "client-1",
  name: "Highland Ridge Custom Home",
  location: "Windsor, CO",
  type: "Custom Home",
  status: "active",
  currentPhase: "Interior rough-in",
  progress: 60,
  budgetRange: "$900k-$1.1M",
  startDate: "2026-02-01",
  estimatedCompletion: "2026-09-01",
  notes: "",
  heroImage: "",
  phases: [],
};

const target: ProjectFinancialTarget = {
  projectId: "project-1",
  contractValue: 500000,
  budgetedCost: 360000,
  targetMarginPercent: 28,
  contingencyPercent: 4,
  updatedAt: "2026-05-15T09:00:00-06:00",
};

const invoices: Invoice[] = [
  {
    id: "invoice-paid",
    invoiceNumber: "KBC-001",
    projectId: "project-1",
    clientId: "client-1",
    status: "paid",
    issueDate: "2026-05-01",
    dueDate: "2026-05-10",
    notes: "",
    lineItems: [{ id: "line-1", description: "Paid draw", quantity: 1, unitPrice: 210000 }],
  },
  {
    id: "invoice-sent",
    invoiceNumber: "KBC-002",
    projectId: "project-1",
    clientId: "client-1",
    status: "sent",
    issueDate: "2026-05-10",
    dueDate: "2026-05-25",
    notes: "",
    lineItems: [{ id: "line-2", description: "Submitted draw", quantity: 1, unitPrice: 30000 }],
  },
];

const bills: Bill[] = [
  {
    id: "bill-paid",
    projectId: "project-1",
    billNumber: "B-1",
    vendor: "Concrete",
    amount: 65000,
    status: "paid",
    dueDate: "2026-05-01",
    notes: "",
    createdAt: "2026-04-28T09:00:00-06:00",
  },
  {
    id: "bill-received",
    projectId: "project-1",
    billNumber: "B-2",
    vendor: "Cabinetry",
    amount: 24000,
    status: "received",
    dueDate: "2026-05-20",
    notes: "",
    createdAt: "2026-05-10T09:00:00-06:00",
  },
];

const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    projectId: "project-1",
    poNumber: "PO-1",
    title: "Cabinet deposit",
    vendor: "Cabinetry",
    amount: 42000,
    status: "sent",
    dueDate: "2026-05-30",
    notes: "",
    createdAt: "2026-05-11T09:00:00-06:00",
  },
];

const changeOrders: ChangeOrder[] = [
  {
    id: "co-approved",
    changeOrderNumber: "CO-1",
    projectId: "project-1",
    clientId: "client-1",
    title: "Approved patio",
    status: "approved",
    reason: "",
    scheduleImpactDays: 0,
    clientMessage: "",
    internalNotes: "",
    createdAt: "2026-05-01T09:00:00-06:00",
    approvedAt: "2026-05-02T09:00:00-06:00",
    approvedByName: "Avery",
    lineItems: [{ id: "line-1", description: "Patio", quantity: 1, unitPrice: 25000 }],
  },
  {
    id: "co-sent",
    changeOrderNumber: "CO-2",
    projectId: "project-1",
    clientId: "client-1",
    title: "Pending trim",
    status: "sent",
    reason: "",
    scheduleImpactDays: 0,
    clientMessage: "",
    internalNotes: "",
    createdAt: "2026-05-05T09:00:00-06:00",
    approvedAt: null,
    approvedByName: "",
    lineItems: [{ id: "line-2", description: "Trim", quantity: 1, unitPrice: 12000 }],
  },
];

const timeEntries: TimeEntry[] = [
  {
    id: "time-1",
    workerId: "worker-1",
    projectId: "project-1",
    clockIn: "2026-05-14T08:00:00-06:00",
    clockOut: "2026-05-14T12:00:00-06:00",
    notes: "",
  },
];

describe("project finance presets", () => {
  it("builds calculator defaults from live project financial records", () => {
    expect(
      buildProjectFinancePreset({
        project,
        financialTarget: target,
        invoices,
        bills,
        purchaseOrders,
        changeOrders,
        timeEntries,
        laborBurdenRate: 85,
        overheadReservePercent: 2,
      }),
    ).toEqual({
      projectId: "project-1",
      projectName: "Highland Ridge Custom Home",
      projectLocation: "Windsor, CO",
      drawRetainage: {
        contractValue: 525000,
        percentComplete: 60,
        retainagePercent: 10,
        paidToDate: 210000,
      },
      jobCostVariance: {
        budgetedCost: 360000,
        actualCost: 89000,
        committedCost: 66000,
        pendingExposure: 12000,
        contingencyPercent: 4,
      },
      cashFlowForecast: {
        contractValue: 500000,
        approvedChangeOrders: 25000,
        percentComplete: 60,
        retainagePercent: 10,
        paidToDate: 210000,
        pendingDrawsSubmitted: 30000,
        vendorPaymentsDue: 24000,
        payrollDue: 340,
        overheadDue: 10500,
        cashOnHand: 0,
      },
    });
  });

  it("falls back to project progress and zero-value defaults when no target exists", () => {
    expect(
      buildProjectFinancePreset({
        project: { ...project, progress: 35 },
        financialTarget: null,
        invoices: [],
        bills: [],
        purchaseOrders: [],
        changeOrders: [],
        timeEntries: [],
      }),
    ).toMatchObject({
      drawRetainage: {
        contractValue: 0,
        percentComplete: 35,
        retainagePercent: 10,
        paidToDate: 0,
      },
      jobCostVariance: {
        budgetedCost: 0,
        contingencyPercent: 0,
      },
    });
  });
});
