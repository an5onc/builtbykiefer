import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  Hammer,
  ReceiptText,
  Users,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import {
  getBills,
  getChangeOrders,
  getInvoices,
  getProjectFinancialTargets,
  getProjectPhotos,
  getProjectVendorAssignments,
  getProjects,
  getPurchaseOrders,
  getRfis,
  getSelections,
  getTasks,
  getVendors,
  getWarrantyItems,
} from "@/lib/admin/queries";
import { buildOperationsReports } from "@/lib/admin/reports";

const attentionLabels = {
  bill: "Bill",
  warranty: "Warranty",
  selection: "Selection",
  rfi: "RFI",
  task: "Task",
  "change-order": "Change Order",
};

export default async function AdminReportsPage() {
  const [
    projects,
    tasks,
    rfis,
    selections,
    warrantyItems,
    purchaseOrders,
    bills,
    invoices,
    changeOrders,
    projectPhotos,
    vendors,
    vendorAssignments,
    financialTargets,
  ] = await Promise.all([
    getProjects(),
    getTasks(),
    getRfis(),
    getSelections(),
    getWarrantyItems(),
    getPurchaseOrders(),
    getBills(),
    getInvoices(),
    getChangeOrders(),
    getProjectPhotos(),
    getVendors(),
    getProjectVendorAssignments(),
    getProjectFinancialTargets(),
  ]);

  const reports = buildOperationsReports({
    projects,
    tasks,
    rfis,
    selections,
    warrantyItems,
    purchaseOrders,
    bills,
    invoices,
    changeOrders,
    projectPhotos,
    vendors,
    vendorAssignments,
    financialTargets,
  });

  const topProjects = [...reports.projectReports].sort(
    (a, b) =>
      b.pendingChangeOrderTotal +
      b.unpaidBillTotal +
      b.openPurchaseOrderTotal -
      (a.pendingChangeOrderTotal + a.unpaidBillTotal + a.openPurchaseOrderTotal),
  );

  return (
    <AdminShell title="Reports" eyebrow="Operations Intelligence">
      <section className="mb-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Kiefer Built Command Data
            </p>
            <h2 className="mt-2 text-2xl font-bold">Manager Reporting Dashboard</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
              Review job cost exposure, overdue work, vendor commitments, open decisions, and client-visible activity from one place.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
          >
            <BarChart3 className="size-4" />
            Command Center
          </Link>
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <ReportMetric
          icon={<Hammer className="size-5" />}
          label="Active Jobs"
          value={reports.summary.activeProjectCount.toString()}
          detail="Current workload"
          href="/admin/projects"
        />
        <ReportMetric
          icon={<AlertTriangle className="size-5" />}
          label="Needs Attention"
          value={reports.summary.needsAttentionCount.toString()}
          detail={`${reports.summary.overdueTaskCount} overdue tasks`}
          href="#needs-attention"
        />
        <ReportMetric
          icon={<BadgeDollarSign className="size-5" />}
          label="Pending COs"
          value={formatCurrency(reports.summary.pendingChangeOrderTotal)}
          detail="Draft and sent"
          href="/admin/change-orders"
        />
        <ReportMetric
          icon={<ReceiptText className="size-5" />}
          label="Unpaid Bills"
          value={formatCurrency(reports.summary.unpaidBillTotal)}
          detail="Not paid yet"
          href="/admin/bills"
        />
        <ReportMetric
          icon={<Users className="size-5" />}
          label="Trade Partners"
          value={reports.summary.portalEnabledVendorCount.toString()}
          detail="Portal enabled"
          href="/admin/vendors"
        />
        <ReportMetric
          icon={<BarChart3 className="size-5" />}
          label="Margin"
          value={`${reports.marginSummary.averageProjectedMarginPercent.toFixed(1)}%`}
          detail={`${reports.summary.atRiskMarginCount} at risk`}
          href="#margin-forecast"
        />
      </section>

      <section id="margin-forecast" className="mb-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
            Margin Forecast
          </p>
          <h2 className="mt-1 text-lg font-bold">Budget, Cost, Revenue, And Projected Margin</h2>
        </div>
        <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-5">
          <FinancialTile label="Contract value" value={reports.marginSummary.contractValue} />
          <FinancialTile label="Budgeted cost" value={reports.marginSummary.budgetedCost} />
          <FinancialTile label="Committed cost" value={reports.marginSummary.committedCost} />
          <FinancialTile label="Projected revenue" value={reports.marginSummary.projectedRevenue} />
          <FinancialTile label="Projected margin" value={reports.marginSummary.projectedMargin} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.72fr]">
        <section className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Job Cost Snapshot
            </p>
            <h2 className="mt-1 text-lg font-bold">Financial Exposure By Job</h2>
          </div>
          <div className="divide-y divide-black/10">
            {topProjects.map((project) => (
              <Link
                key={project.projectId}
                href={`/admin/projects/${project.projectId}`}
                className="grid gap-4 px-5 py-4 transition hover:bg-[#f9f6f0] lg:grid-cols-[1fr_0.55fr_0.55fr_0.55fr_0.55fr]"
              >
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{project.projectName}</p>
                    <StatusBadge status={project.status} />
                  </div>
                  <ProjectProgress progress={project.progress} />
                </div>
                <ReportAmount label="Pending COs" value={project.pendingChangeOrderTotal} />
                <ReportAmount label="Open POs" value={project.openPurchaseOrderTotal} />
                <ReportAmount label="Unpaid Bills" value={project.unpaidBillTotal} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">Margin</p>
                  <p className="mt-1 font-bold">{project.projectedMarginPercent.toFixed(1)}%</p>
                  <StatusBadge status={project.marginStatus} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="needs-attention" className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Exception Report
            </p>
            <h2 className="mt-1 text-lg font-bold">Needs Attention</h2>
          </div>
          {reports.needsAttention.length > 0 ? (
            <div className="divide-y divide-black/10">
              {reports.needsAttention.slice(0, 10).map((item) => (
                <Link key={`${item.type}-${item.id}`} href={item.href} className="block px-5 py-4 transition hover:bg-[#f9f6f0]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                        {attentionLabels[item.type]} · Due {formatDate(item.dueDate)}
                      </p>
                      <p className="mt-1 font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-[#655c52]">{item.projectName}</p>
                    </div>
                    <StatusBadge status={item.severity} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-5 py-5 text-sm text-[#655c52]">No overdue operational items right now.</p>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
            Operational Health
          </p>
          <h2 className="mt-1 text-lg font-bold">Project Workflow Counts</h2>
        </div>
        <div className="grid grid-cols-[1fr_0.35fr_0.35fr_0.35fr_0.35fr_0.35fr_0.35fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Job</span>
          <span>Tasks</span>
          <span>RFIs</span>
          <span>Selections</span>
          <span>Warranty</span>
          <span>Photos</span>
          <span>Trades</span>
        </div>
        {reports.projectReports.map((project) => (
          <Link
            key={project.projectId}
            href={`/admin/projects/${project.projectId}`}
            className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[1fr_0.35fr_0.35fr_0.35fr_0.35fr_0.35fr_0.35fr]"
          >
            <div>
              <p className="font-semibold">{project.projectName}</p>
              <p className="mt-1 text-sm text-[#655c52]">
                Estimated completion {project.estimatedCompletion ? formatDate(project.estimatedCompletion) : "not set"}
              </p>
            </div>
            <CountCell value={project.openTaskCount} detail={`${project.overdueTaskCount} overdue`} />
            <CountCell value={project.openRfiCount} />
            <CountCell value={project.pendingSelectionCount} />
            <CountCell value={project.openWarrantyCount} />
            <CountCell value={project.clientVisiblePhotoCount} />
            <CountCell value={project.vendorAssignmentCount} />
          </Link>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Financial Totals
            </p>
            <h2 className="mt-1 text-lg font-bold">Company Rollup</h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            <FinancialTile label="Open purchase orders" value={reports.financials.openPurchaseOrdersTotal} />
            <FinancialTile label="Unpaid bills" value={reports.financials.unpaidBillsTotal} />
            <FinancialTile label="Draft invoices" value={reports.financials.draftInvoiceTotal} />
            <FinancialTile label="Approved change orders" value={reports.financials.approvedChangeOrderTotal} />
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Vendor Commitments
            </p>
            <h2 className="mt-1 text-lg font-bold">Portal-Enabled Trade Work</h2>
          </div>
          {reports.vendorCommitments.length > 0 ? (
            <div className="divide-y divide-black/10">
              {reports.vendorCommitments.slice(0, 6).map((commitment) => (
                <Link
                  key={commitment.id}
                  href={`/admin/projects/${commitment.projectId}`}
                  className="block px-5 py-4 transition hover:bg-[#f9f6f0]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{commitment.vendorName}</p>
                      <p className="mt-1 text-sm text-[#655c52]">
                        {commitment.projectName} · {commitment.trade}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#655c52]">{commitment.scope}</p>
                    </div>
                    <StatusBadge status={commitment.status} />
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                    {formatDate(commitment.startDate)}
                    {commitment.endDate ? ` - ${formatDate(commitment.endDate)}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-5 py-5 text-sm text-[#655c52]">No portal-enabled trade commitments yet.</p>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_0.45fr_0.45fr_0.45fr_0.35fr_0.35fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Job</span>
          <span>Contract</span>
          <span>Budgeted Cost</span>
          <span>Projected Margin</span>
          <span>Target</span>
          <span>Status</span>
        </div>
        {reports.projectReports.map((project) => (
          <Link
            key={project.projectId}
            href={`/admin/projects/${project.projectId}/financials/edit`}
            className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[1fr_0.45fr_0.45fr_0.45fr_0.35fr_0.35fr]"
          >
            <div>
              <p className="font-semibold">{project.projectName}</p>
              <p className="mt-1 text-sm text-[#655c52]">
                Committed {formatCurrency(project.committedCost)} · Actual {formatCurrency(project.actualCost)}
              </p>
            </div>
            <p className="font-semibold">{formatCurrency(project.contractValue)}</p>
            <p className="font-semibold">{formatCurrency(project.budgetedCost)}</p>
            <div>
              <p className="font-semibold">{formatCurrency(project.projectedMargin)}</p>
              <p className="mt-1 text-sm text-[#655c52]">{project.projectedMarginPercent.toFixed(1)}%</p>
            </div>
            <p className="font-semibold">{project.targetMarginPercent.toFixed(1)}%</p>
            <StatusBadge status={project.marginStatus} />
          </Link>
        ))}
      </section>
    </AdminShell>
  );
}

function ReportMetric({
  icon,
  label,
  value,
  detail,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="mb-4 flex size-10 items-center justify-center rounded-md bg-[#b92516]/10 text-[#b92516]">
        {icon}
      </span>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8176]">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-[#655c52]">{detail}</p>
    </Link>
  );
}

function ReportAmount({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">{label}</p>
      <p className="mt-1 font-bold">{formatCurrency(value)}</p>
    </div>
  );
}

function CountCell({ value, detail }: { value: number; detail?: string }) {
  return (
    <div>
      <p className="font-bold">{value}</p>
      {detail ? <p className="mt-1 text-xs text-[#655c52]">{detail}</p> : null}
    </div>
  );
}

function FinancialTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-black/10 p-5 odd:border-r">
      <p className="text-sm font-semibold text-[#655c52]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{formatCurrency(value)}</p>
    </div>
  );
}
