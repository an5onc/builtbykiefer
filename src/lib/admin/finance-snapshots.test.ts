import { describe, expect, it } from "vitest";
import { buildProjectFinanceSnapshot, formatFinanceSnapshotExport } from "./finance-snapshots";
import type { ProjectFinancePreset } from "./project-finance-presets";

const preset: ProjectFinancePreset = {
  projectId: "project-1",
  projectName: "Highland Ridge Custom Home",
  projectLocation: "Windsor, CO",
  drawRetainage: {
    contractValue: 1000000,
    percentComplete: 50,
    retainagePercent: 10,
    paidToDate: 300000,
  },
  jobCostVariance: {
    budgetedCost: 700000,
    actualCost: 300000,
    committedCost: 250000,
    pendingExposure: 50000,
    contingencyPercent: 5,
  },
  cashFlowForecast: {
    contractValue: 950000,
    approvedChangeOrders: 50000,
    percentComplete: 50,
    retainagePercent: 10,
    paidToDate: 300000,
    pendingDrawsSubmitted: 40000,
    vendorPaymentsDue: 90000,
    payrollDue: 25000,
    overheadDue: 20000,
    cashOnHand: 30000,
  },
};

describe("finance snapshots", () => {
  it("builds a project finance snapshot from the live project preset", () => {
    const snapshot = buildProjectFinanceSnapshot({
      preset,
      title: "May owner draw review",
      notes: "Use for the lender call.",
    });

    expect(snapshot).toMatchObject({
      projectId: "project-1",
      projectName: "Highland Ridge Custom Home",
      title: "May owner draw review",
      notes: "Use for the lender call.",
      outputs: {
        drawRetainage: {
          currentDrawDue: 150000,
          retainageHeldToDate: 50000,
        },
        jobCostVariance: {
          projectedFinalCost: 600000,
          status: "on-track",
        },
        cashFlowForecast: {
          currentDrawReady: 110000,
          projectedEndingCash: 45000,
          status: "healthy",
        },
      },
    });
  });

  it("formats an exportable text packet for manager review", () => {
    const snapshot = buildProjectFinanceSnapshot({
      preset,
      title: "May owner draw review",
      notes: "Use for the lender call.",
      createdAt: "2026-05-15T12:00:00.000Z",
    });

    const exported = formatFinanceSnapshotExport(snapshot);

    expect(exported).toContain("Kiefer Built Finance Snapshot");
    expect(exported).toContain("Highland Ridge Custom Home");
    expect(exported).toContain("Current draw due: $150,000");
    expect(exported).toContain("Variance status: on-track");
    expect(exported).toContain("Projected ending cash: $45,000");
    expect(exported).toContain("Use for the lender call.");
  });
});
