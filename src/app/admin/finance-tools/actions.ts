"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { buildProjectFinanceSnapshot, parseFinanceSnapshotFormData } from "@/lib/admin/finance-snapshots";
import { buildProjectFinancePreset } from "@/lib/admin/project-finance-presets";
import {
  createProjectFinanceSnapshot,
  getBills,
  getChangeOrders,
  getInvoices,
  getProject,
  getProjectFinancialTarget,
  getProjectPurchaseOrders,
  getProjectTimeEntries,
} from "@/lib/admin/queries";

function redirectWithStatus(projectId: string, key: "notice" | "error", message: string): never {
  const url = new URL("/admin/finance-tools", "http://localhost");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set(key, message);
  redirect(`${url.pathname}${url.search}`);
}

export async function createFinanceSnapshotAction(formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent("/admin/finance-tools")}`);
  }

  const parsed = parseFinanceSnapshotFormData(formData);

  if (!parsed.ok) {
    redirect(`/admin/finance-tools?error=${encodeURIComponent(parsed.reason)}`);
  }

  const { projectId, title, notes } = parsed.data;
  const [project, financialTarget, invoices, bills, purchaseOrders, changeOrders, timeEntries] = await Promise.all([
    getProject(projectId),
    getProjectFinancialTarget(projectId),
    getInvoices(),
    getBills(),
    getProjectPurchaseOrders(projectId),
    getChangeOrders(),
    getProjectTimeEntries(projectId),
  ]);

  if (!project) {
    redirectWithStatus(projectId, "error", "Could not find that project for a finance snapshot.");
  }

  const preset = buildProjectFinancePreset({
    project,
    financialTarget,
    invoices: invoices.filter((invoice) => invoice.projectId === projectId),
    bills: bills.filter((bill) => bill.projectId === projectId),
    purchaseOrders,
    changeOrders: changeOrders.filter((changeOrder) => changeOrder.projectId === projectId),
    timeEntries,
  });
  const snapshot = buildProjectFinanceSnapshot({ preset, title, notes });
  const result = await createProjectFinanceSnapshot(snapshot);

  if (!result.ok) {
    redirectWithStatus(projectId, "error", result.reason);
  }

  revalidatePath("/admin/finance-tools");
  revalidatePath(`/admin/projects/${projectId}`);
  redirectWithStatus(projectId, "notice", "Finance snapshot saved and ready to export.");
}
