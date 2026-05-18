import {
  calculateDrawRetainagePlan,
  calculateJobCostVariance,
  calculateProjectCashFlowForecast,
  type DrawRetainagePlan,
  type JobCostVariance,
  type ProjectCashFlowForecast,
} from "./finance-tools";
import { formatCurrency } from "./formatters";
import type { ProjectFinancePreset } from "./project-finance-presets";

export interface ProjectFinanceSnapshotOutputs {
  drawRetainage: DrawRetainagePlan;
  jobCostVariance: JobCostVariance;
  cashFlowForecast: ProjectCashFlowForecast;
}

export interface ProjectFinanceSnapshotDraft {
  projectId: string;
  projectName: string;
  title: string;
  notes: string;
  inputs: ProjectFinancePreset;
  outputs: ProjectFinanceSnapshotOutputs;
  createdAt: string;
}

export interface BuildProjectFinanceSnapshotInput {
  preset: ProjectFinancePreset;
  title?: string;
  notes?: string;
  createdAt?: string;
}

function cleanText(value: string | undefined, fallback: string) {
  const trimmed = String(value ?? "").trim();
  return trimmed || fallback;
}

export function buildProjectFinanceSnapshot({
  preset,
  title,
  notes,
  createdAt = new Date().toISOString(),
}: BuildProjectFinanceSnapshotInput): ProjectFinanceSnapshotDraft {
  return {
    projectId: preset.projectId,
    projectName: preset.projectName,
    title: cleanText(title, `${preset.projectName} finance snapshot`),
    notes: cleanText(notes, ""),
    inputs: preset,
    outputs: {
      drawRetainage: calculateDrawRetainagePlan(preset.drawRetainage),
      jobCostVariance: calculateJobCostVariance(preset.jobCostVariance),
      cashFlowForecast: calculateProjectCashFlowForecast(preset.cashFlowForecast),
    },
    createdAt,
  };
}

export function parseFinanceSnapshotFormData(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!projectId) {
    return { ok: false as const, reason: "Choose a project before saving a finance snapshot." };
  }

  return {
    ok: true as const,
    data: {
      projectId,
      title,
      notes,
    },
  };
}

export function formatFinanceSnapshotExport(snapshot: ProjectFinanceSnapshotDraft) {
  const { outputs } = snapshot;

  return [
    "Kiefer Built Finance Snapshot",
    `Title: ${snapshot.title}`,
    `Project: ${snapshot.projectName}`,
    `Location: ${snapshot.inputs.projectLocation}`,
    `Created: ${new Date(snapshot.createdAt).toLocaleString("en-US")}`,
    "",
    "Draw / Retainage",
    `Gross earned to date: ${formatCurrency(outputs.drawRetainage.grossEarnedToDate)}`,
    `Retainage held to date: ${formatCurrency(outputs.drawRetainage.retainageHeldToDate)}`,
    `Current draw due: ${formatCurrency(outputs.drawRetainage.currentDrawDue)}`,
    `Remaining to collect: ${formatCurrency(outputs.drawRetainage.remainingToCollect)}`,
    "",
    "Job Cost Variance",
    `Projected final cost: ${formatCurrency(outputs.jobCostVariance.projectedFinalCost)}`,
    `Variance amount: ${formatCurrency(outputs.jobCostVariance.varianceAmount)}`,
    `Variance status: ${outputs.jobCostVariance.status}`,
    `Manager note: ${outputs.jobCostVariance.managerNote}`,
    "",
    "Cash Flow Forecast",
    `Current draw ready: ${formatCurrency(outputs.cashFlowForecast.currentDrawReady)}`,
    `Expected cash in: ${formatCurrency(outputs.cashFlowForecast.expectedCashIn)}`,
    `Scheduled cash out: ${formatCurrency(outputs.cashFlowForecast.scheduledCashOut)}`,
    `Projected ending cash: ${formatCurrency(outputs.cashFlowForecast.projectedEndingCash)}`,
    `Cash status: ${outputs.cashFlowForecast.status}`,
    `Manager note: ${outputs.cashFlowForecast.managerNote}`,
    "",
    snapshot.notes ? `Manager notes: ${snapshot.notes}` : "Manager notes: None",
  ].join("\n");
}
