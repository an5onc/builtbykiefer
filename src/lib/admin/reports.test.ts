import { describe, expect, it } from "vitest";
import { buildOperationsReports } from "./reports";
import type { OperationsReportInput } from "./reports";

describe("operations reports", () => {
  it("rolls financial exposure into project and company summaries", () => {
    const report = buildOperationsReports({
      today: "2026-05-14",
      projects: [
        {
          id: "project-1",
          name: "Highland Ridge",
          status: "active",
          progress: 58,
          estimatedCompletion: "2026-07-01",
        },
      ] as OperationsReportInput["projects"],
      tasks: [],
      rfis: [],
      selections: [],
      warrantyItems: [],
      purchaseOrders: [
        { id: "po-1", projectId: "project-1", amount: 12000, status: "approved", dueDate: "2026-05-20" },
        { id: "po-2", projectId: "project-1", amount: 5000, status: "received", dueDate: "2026-05-10" },
      ] as OperationsReportInput["purchaseOrders"],
      bills: [
        { id: "bill-1", projectId: "project-1", amount: 3000, status: "received", dueDate: "2026-05-13" },
        { id: "bill-2", projectId: "project-1", amount: 7000, status: "paid", dueDate: "2026-05-09" },
      ] as OperationsReportInput["bills"],
      invoices: [
        {
          id: "invoice-1",
          projectId: "project-1",
          status: "draft",
          lineItems: [{ id: "line-1", description: "Progress billing", quantity: 1, unitPrice: 45000 }],
        },
      ] as OperationsReportInput["invoices"],
      changeOrders: [
        {
          id: "co-1",
          projectId: "project-1",
          status: "sent",
          lineItems: [{ id: "line-1", description: "Added lighting", quantity: 1, unitPrice: 4200 }],
        },
        {
          id: "co-2",
          projectId: "project-1",
          status: "approved",
          lineItems: [{ id: "line-2", description: "Trim upgrade", quantity: 2, unitPrice: 1500 }],
        },
      ] as OperationsReportInput["changeOrders"],
      projectPhotos: [],
      vendors: [],
      vendorAssignments: [],
      financialTargets: [],
    });

    expect(report.financials).toMatchObject({
      openPurchaseOrdersTotal: 12000,
      unpaidBillsTotal: 3000,
      draftInvoiceTotal: 45000,
      pendingChangeOrderTotal: 4200,
      approvedChangeOrderTotal: 3000,
    });
    expect(report.projectReports[0]).toMatchObject({
      projectId: "project-1",
      openPurchaseOrderTotal: 12000,
      unpaidBillTotal: 3000,
      pendingChangeOrderTotal: 4200,
      approvedChangeOrderTotal: 3000,
    });
  });

  it("flags overdue work that needs manager attention", () => {
    const report = buildOperationsReports({
      today: "2026-05-14",
      projects: [{ id: "project-1", name: "Highland Ridge", status: "active", progress: 58 }] as OperationsReportInput["projects"],
      tasks: [
        { id: "task-1", projectId: "project-1", title: "Confirm tile layout", status: "open", priority: "high", dueDate: "2026-05-13" },
      ] as OperationsReportInput["tasks"],
      rfis: [
        { id: "rfi-1", projectId: "project-1", title: "Beam detail", status: "open", dueDate: "2026-05-12" },
      ] as OperationsReportInput["rfis"],
      selections: [
        { id: "selection-1", projectId: "project-1", title: "Kitchen pulls", status: "needed", dueDate: "2026-05-11" },
      ] as OperationsReportInput["selections"],
      warrantyItems: [
        { id: "warranty-1", projectId: "project-1", title: "Paint touch-up", status: "open", priority: "normal", dueDate: "2026-05-10" },
      ] as OperationsReportInput["warrantyItems"],
      bills: [
        { id: "bill-1", projectId: "project-1", billNumber: "B-1", vendor: "Rocky Mountain Tile", amount: 3000, status: "received", dueDate: "2026-05-09" },
      ] as OperationsReportInput["bills"],
      purchaseOrders: [],
      invoices: [],
      changeOrders: [],
      projectPhotos: [],
      vendors: [],
      vendorAssignments: [],
      financialTargets: [],
    });

    expect(report.summary.needsAttentionCount).toBe(5);
    expect(report.needsAttention.map((item) => item.type)).toEqual([
      "bill",
      "warranty",
      "selection",
      "rfi",
      "task",
    ]);
    expect(report.projectReports[0]).toMatchObject({
      overdueTaskCount: 1,
      openRfiCount: 1,
      pendingSelectionCount: 1,
      openWarrantyCount: 1,
    });
  });

  it("counts client-visible photos and portal-enabled vendor commitments", () => {
    const report = buildOperationsReports({
      today: "2026-05-14",
      projects: [{ id: "project-1", name: "Highland Ridge", status: "active", progress: 58 }] as OperationsReportInput["projects"],
      tasks: [],
      rfis: [],
      selections: [],
      warrantyItems: [],
      bills: [],
      purchaseOrders: [],
      invoices: [],
      changeOrders: [],
      projectPhotos: [
        { id: "photo-1", projectId: "project-1", visibility: "customer" },
        { id: "photo-2", projectId: "project-1", visibility: "internal" },
      ] as OperationsReportInput["projectPhotos"],
      vendors: [
        { id: "vendor-1", name: "Front Range Cabinetry", trade: "Cabinetry", status: "active", portalAccess: true },
        { id: "vendor-2", name: "Inactive Lighting", trade: "Lighting", status: "inactive", portalAccess: true },
      ] as OperationsReportInput["vendors"],
      vendorAssignments: [
        { id: "assignment-1", projectId: "project-1", vendorId: "vendor-1", scope: "Cabinet install", status: "active", startDate: "2026-05-15", endDate: "" },
        { id: "assignment-2", projectId: "project-1", vendorId: "vendor-2", scope: "Lighting", status: "scheduled", startDate: "2026-05-20", endDate: "" },
      ] as OperationsReportInput["vendorAssignments"],
      financialTargets: [],
    });

    expect(report.summary.clientVisiblePhotoCount).toBe(1);
    expect(report.summary.portalEnabledVendorCount).toBe(1);
    expect(report.vendorCommitments).toHaveLength(1);
    expect(report.vendorCommitments[0]).toMatchObject({
      vendorName: "Front Range Cabinetry",
      projectName: "Highland Ridge",
      trade: "Cabinetry",
    });
  });

  it("forecasts job margin against financial targets", () => {
    const report = buildOperationsReports({
      today: "2026-05-14",
      projects: [{ id: "project-1", name: "Highland Ridge", status: "active", progress: 58 }] as OperationsReportInput["projects"],
      tasks: [],
      rfis: [],
      selections: [],
      warrantyItems: [],
      projectPhotos: [],
      vendors: [],
      vendorAssignments: [],
      purchaseOrders: [
        { id: "po-1", projectId: "project-1", amount: 25000, status: "approved", dueDate: "2026-05-20" },
        { id: "po-2", projectId: "project-1", amount: 12000, status: "received", dueDate: "2026-05-12" },
      ] as OperationsReportInput["purchaseOrders"],
      bills: [
        { id: "bill-1", projectId: "project-1", amount: 18000, status: "received", dueDate: "2026-05-13" },
        { id: "bill-2", projectId: "project-1", amount: 40000, status: "paid", dueDate: "2026-05-09" },
      ] as OperationsReportInput["bills"],
      invoices: [
        {
          id: "invoice-1",
          projectId: "project-1",
          status: "sent",
          lineItems: [{ id: "line-1", description: "Draw 1", quantity: 1, unitPrice: 300000 }],
        },
      ] as OperationsReportInput["invoices"],
      changeOrders: [
        {
          id: "co-1",
          projectId: "project-1",
          status: "approved",
          lineItems: [{ id: "line-1", description: "Upgrade", quantity: 1, unitPrice: 25000 }],
        },
      ] as OperationsReportInput["changeOrders"],
      financialTargets: [
        {
          projectId: "project-1",
          contractValue: 950000,
          budgetedCost: 760000,
          targetMarginPercent: 20,
          contingencyPercent: 5,
          updatedAt: "2026-05-14T12:00:00Z",
        },
      ],
    });

    expect(report.projectReports[0]).toMatchObject({
      contractValue: 950000,
      budgetedCost: 760000,
      committedCost: 83000,
      actualCost: 58000,
      approvedRevenue: 325000,
      projectedRevenue: 975000,
      projectedCost: 760000,
      projectedMargin: 215000,
      projectedMarginPercent: 22.05,
      marginStatus: "on-track",
    });
    expect(report.marginSummary).toMatchObject({
      projectedRevenue: 975000,
      projectedCost: 760000,
      projectedMargin: 215000,
    });
  });

  it("warns when projected margin falls under the target margin", () => {
    const report = buildOperationsReports({
      today: "2026-05-14",
      projects: [{ id: "project-1", name: "Highland Ridge", status: "active", progress: 58 }] as OperationsReportInput["projects"],
      tasks: [],
      rfis: [],
      selections: [],
      warrantyItems: [],
      projectPhotos: [],
      vendors: [],
      vendorAssignments: [],
      purchaseOrders: [],
      bills: [],
      invoices: [],
      changeOrders: [],
      financialTargets: [
        {
          projectId: "project-1",
          contractValue: 500000,
          budgetedCost: 450000,
          targetMarginPercent: 20,
          contingencyPercent: 0,
          updatedAt: "2026-05-14T12:00:00Z",
        },
      ],
    });

    expect(report.projectReports[0]).toMatchObject({
      projectedMarginPercent: 10,
      marginStatus: "at-risk",
    });
    expect(report.summary.atRiskMarginCount).toBe(1);
  });
});
