import { changeOrderTotal, invoiceTotal, timeEntryHours } from "./formatters";
import type {
  Bill,
  ChangeOrder,
  Invoice,
  Project,
  ProjectFinancialTarget,
  PurchaseOrder,
  TimeEntry,
} from "./types";

export interface ProjectFinancePreset {
  projectId: string;
  projectName: string;
  projectLocation: string;
  drawRetainage: {
    contractValue: number;
    percentComplete: number;
    retainagePercent: number;
    paidToDate: number;
  };
  jobCostVariance: {
    budgetedCost: number;
    actualCost: number;
    committedCost: number;
    pendingExposure: number;
    contingencyPercent: number;
  };
  cashFlowForecast: {
    contractValue: number;
    approvedChangeOrders: number;
    percentComplete: number;
    retainagePercent: number;
    paidToDate: number;
    pendingDrawsSubmitted: number;
    vendorPaymentsDue: number;
    payrollDue: number;
    overheadDue: number;
    cashOnHand: number;
  };
}

export interface ProjectFinancePresetInput {
  project: Project;
  financialTarget: ProjectFinancialTarget | null;
  invoices: Invoice[];
  bills: Bill[];
  purchaseOrders: PurchaseOrder[];
  changeOrders: ChangeOrder[];
  timeEntries: TimeEntry[];
  laborBurdenRate?: number;
  overheadReservePercent?: number;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function roundDollars(value: number) {
  return Math.round(Math.max(value, 0));
}

export function buildProjectFinancePreset({
  project,
  financialTarget,
  invoices,
  bills,
  purchaseOrders,
  changeOrders,
  timeEntries,
  laborBurdenRate = 85,
  overheadReservePercent = 2,
}: ProjectFinancePresetInput): ProjectFinancePreset {
  const approvedChangeOrders = sum(
    changeOrders
      .filter((changeOrder) => changeOrder.status === "approved")
      .map((changeOrder) => changeOrderTotal(changeOrder.lineItems)),
  );
  const pendingChangeOrders = sum(
    changeOrders
      .filter((changeOrder) => changeOrder.status === "draft" || changeOrder.status === "sent")
      .map((changeOrder) => changeOrderTotal(changeOrder.lineItems)),
  );
  const paidToDate = sum(
    invoices
      .filter((invoice) => invoice.status === "paid")
      .map((invoice) => invoiceTotal(invoice.lineItems)),
  );
  const pendingDrawsSubmitted = sum(
    invoices
      .filter((invoice) => invoice.status === "sent")
      .map((invoice) => invoiceTotal(invoice.lineItems)),
  );
  const actualCost = sum(
    bills
      .filter((bill) => bill.status === "paid" || bill.status === "received")
      .map((bill) => bill.amount),
  );
  const vendorPaymentsDue = sum(
    bills
      .filter((bill) => bill.status !== "paid")
      .map((bill) => bill.amount),
  );
  const openPurchaseOrders = sum(
    purchaseOrders
      .filter((purchaseOrder) => purchaseOrder.status !== "received")
      .map((purchaseOrder) => purchaseOrder.amount),
  );
  const payrollDue = timeEntries.reduce(
    (total, entry) => total + timeEntryHours(entry.clockIn, entry.clockOut) * laborBurdenRate,
    0,
  );
  const contractValue = financialTarget?.contractValue ?? 0;
  const adjustedContractValue = contractValue + approvedChangeOrders;
  const budgetedCost = financialTarget?.budgetedCost ?? 0;
  const contingencyPercent = financialTarget?.contingencyPercent ?? 0;
  const retainagePercent = 10;

  return {
    projectId: project.id,
    projectName: project.name,
    projectLocation: project.location,
    drawRetainage: {
      contractValue: roundDollars(adjustedContractValue),
      percentComplete: project.progress,
      retainagePercent,
      paidToDate: roundDollars(paidToDate),
    },
    jobCostVariance: {
      budgetedCost: roundDollars(budgetedCost),
      actualCost: roundDollars(actualCost),
      committedCost: roundDollars(openPurchaseOrders + vendorPaymentsDue),
      pendingExposure: roundDollars(pendingChangeOrders),
      contingencyPercent,
    },
    cashFlowForecast: {
      contractValue: roundDollars(contractValue),
      approvedChangeOrders: roundDollars(approvedChangeOrders),
      percentComplete: project.progress,
      retainagePercent,
      paidToDate: roundDollars(paidToDate),
      pendingDrawsSubmitted: roundDollars(pendingDrawsSubmitted),
      vendorPaymentsDue: roundDollars(vendorPaymentsDue),
      payrollDue: roundDollars(payrollDue),
      overheadDue: roundDollars(adjustedContractValue * (overheadReservePercent / 100)),
      cashOnHand: 0,
    },
  };
}
