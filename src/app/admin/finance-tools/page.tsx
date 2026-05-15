import Link from "next/link";
import {
  BadgeDollarSign,
  Download,
  Percent,
  Save,
  Truck,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ChangeOrderImpactChecker from "@/components/admin/ChangeOrderImpactChecker";
import DrawRetainagePlanner from "@/components/admin/DrawRetainagePlanner";
import InvestmentDecisionCheck from "@/components/admin/InvestmentDecisionCheck";
import JobCostVarianceTool from "@/components/admin/JobCostVarianceTool";
import ProjectCashFlowForecastTool from "@/components/admin/ProjectCashFlowForecastTool";
import { createFinanceSnapshotAction } from "./actions";
import { formatCurrency, formatDateTime } from "@/lib/admin/formatters";
import {
  calculateEffectiveAnnualRate,
  calculateLoanPaymentPlan,
  calculateMonthlyRateFromApr,
} from "@/lib/admin/finance-tools";
import { buildProjectFinancePreset } from "@/lib/admin/project-finance-presets";
import {
  getBills,
  getChangeOrders,
  getInvoices,
  getProjectFinancialTargets,
  getProjectFinanceSnapshots,
  getProjects,
  getPurchaseOrders,
  getTimeEntries,
} from "@/lib/admin/queries";

const paymentPlan = calculateLoanPaymentPlan({
  principal: 85000,
  annualRatePercent: 7.25,
  termYears: 5,
  paymentsPerYear: 12,
});
const secondPaymentPlan = calculateLoanPaymentPlan({
  principal: 42000,
  annualRatePercent: 8.1,
  termYears: 3,
  paymentsPerYear: 12,
});
const monthlyRate = calculateMonthlyRateFromApr(7.2);
const effectiveAnnualRate = calculateEffectiveAnnualRate({
  nominalRatePercent: 7.2,
  compoundingPeriodsPerYear: 12,
});

export default async function FinanceToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; notice?: string; error?: string }>;
}) {
  const { projectId, notice, error } = await searchParams;
  const [projects, financialTargets, invoices, bills, purchaseOrders, changeOrders, timeEntries] = await Promise.all([
    getProjects(),
    getProjectFinancialTargets(),
    getInvoices(),
    getBills(),
    getPurchaseOrders(),
    getChangeOrders(),
    getTimeEntries(),
  ]);
  const selectedProject = projects.find((project) => project.id === projectId) ?? projects[0] ?? null;
  const selectedProjectId = selectedProject?.id ?? "";
  const selectedPreset = selectedProject
    ? buildProjectFinancePreset({
        project: selectedProject,
        financialTarget: financialTargets.find((target) => target.projectId === selectedProject.id) ?? null,
        invoices: invoices.filter((invoice) => invoice.projectId === selectedProject.id),
        bills: bills.filter((bill) => bill.projectId === selectedProject.id),
        purchaseOrders: purchaseOrders.filter((purchaseOrder) => purchaseOrder.projectId === selectedProject.id),
        changeOrders: changeOrders.filter((changeOrder) => changeOrder.projectId === selectedProject.id),
        timeEntries: timeEntries.filter((entry) => entry.projectId === selectedProject.id),
      })
    : null;
  const financeSnapshots = selectedProjectId ? await getProjectFinanceSnapshots(selectedProjectId) : [];

  return (
    <AdminShell title="Kiefer Built Finance Tools" eyebrow="Accounting Utilities">
      {notice ? (
        <p className="mb-4 rounded-md border border-green-600/20 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#fbe9e7] px-4 py-3 text-sm font-semibold text-[#9b2015]">
          {error}
        </p>
      ) : null}

      <section className="mb-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Built For Construction Accounting
            </p>
            <h2 className="mt-2 text-2xl font-bold">Kiefer Built Field-Tested Finance Checks</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
              Quick planning tools for job cost variance, draw billing, retainage, change order margin protection, equipment financing, lender term checks, and project finance conversations. These use standard finance formulas packaged in Kiefer Built workflows.
            </p>
          </div>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
          >
            <BadgeDollarSign className="size-4" />
            Reports
          </Link>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Live CRM Presets
            </p>
            <h2 className="mt-1 text-lg font-bold">Load A Project Into The Finance Tools</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
              Pull contract value, budget, progress, invoices, bills, purchase orders, change orders, and labor hours from the CRM so accounting starts from job data instead of blank calculator fields.
            </p>
          </div>
          <form className="flex w-full flex-wrap items-end gap-3 lg:w-auto">
            <label className="block min-w-72 flex-1 text-sm font-semibold text-[#171717] lg:min-w-96">
              Project
              <select
                name="projectId"
                defaultValue={selectedProjectId}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              Load Project Data
            </button>
          </form>
        </div>

        {selectedPreset ? (
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <PresetTile label="Selected job" value={selectedPreset.projectName} />
            <PresetTile label="Contract + approved COs" value={formatCurrency(selectedPreset.drawRetainage.contractValue)} />
            <PresetTile label="Budgeted cost" value={formatCurrency(selectedPreset.jobCostVariance.budgetedCost)} />
            <PresetTile label="Paid invoices" value={formatCurrency(selectedPreset.drawRetainage.paidToDate)} />
          </div>
        ) : (
          <p className="mt-4 rounded-md bg-[#f9f6f0] p-4 text-sm text-[#655c52]">
            No projects are available to load yet. The calculators below will use Kiefer Built example values.
          </p>
        )}
      </section>

      <section className="mb-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Saved Finance Snapshots
            </p>
            <h2 className="mt-1 text-lg font-bold">Export Project Finance Reviews</h2>
            <p className="mt-2 text-sm leading-6 text-[#655c52]">
              Save the selected job&apos;s draw, variance, and cash-flow checks as a dated Kiefer Built packet for lender calls, owner updates, and internal accounting review.
            </p>
            {selectedPreset ? (
              <form action={createFinanceSnapshotAction} className="mt-4 space-y-3 rounded-md border border-black/10 bg-[#f9f6f0] p-4">
                <input type="hidden" name="projectId" value={selectedPreset.projectId} />
                <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
                  Snapshot Title
                  <input
                    name="title"
                    defaultValue={`${selectedPreset.projectName} finance snapshot`}
                    className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#171717] outline-none transition focus:border-[#b92516]"
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
                  Manager Notes
                  <textarea
                    name="notes"
                    rows={3}
                    className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-[#171717] outline-none transition focus:border-[#b92516]"
                    placeholder="Use this snapshot for draw review, lender packet, or owner finance update..."
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
                >
                  <Save className="size-4" />
                  Save Snapshot
                </button>
              </form>
            ) : null}
          </div>

          <div className="rounded-md border border-black/10">
            {financeSnapshots.length > 0 ? (
              <div className="divide-y divide-black/10">
                {financeSnapshots.slice(0, 6).map((snapshot) => (
                  <article key={snapshot.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-semibold">{snapshot.title}</p>
                      <p className="mt-1 text-sm text-[#655c52]">
                        {snapshot.projectName} · {formatDateTime(snapshot.createdAt)}
                      </p>
                      {snapshot.notes ? (
                        <p className="mt-2 text-sm leading-6 text-[#655c52]">{snapshot.notes}</p>
                      ) : null}
                    </div>
                    <Link
                      href={`/admin/finance-snapshots/${snapshot.id}/download`}
                      className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
                    >
                      <Download className="size-4" />
                      Export
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="p-4 text-sm leading-6 text-[#655c52]">
                No finance snapshots have been saved for this project yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mb-6">
        <DrawRetainagePlanner
          key={`draw-${selectedProjectId}`}
          initialValues={selectedPreset?.drawRetainage}
        />
      </div>

      <div className="mb-6">
        <InvestmentDecisionCheck />
      </div>

      <div className="mb-6">
        <ChangeOrderImpactChecker />
      </div>

      <div className="mb-6">
        <JobCostVarianceTool
          key={`variance-${selectedProjectId}`}
          initialValues={selectedPreset?.jobCostVariance}
        />
      </div>

      <div className="mb-6">
        <ProjectCashFlowForecastTool
          key={`cash-${selectedProjectId}`}
          initialValues={selectedPreset?.cashFlowForecast}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.82fr]">
        <section className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Kiefer Built Payment Planner
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <Truck className="size-5 text-[#b92516]" />
              Equipment Or Vehicle Financing Check
            </h2>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            <PlannerCard
              title="Skid Steer / Equipment Package"
              principal={85000}
              rate={7.25}
              term="5 years"
              payment={paymentPlan.payment}
              totalInterest={paymentPlan.totalInterest}
              totalPaid={paymentPlan.totalPaid}
            />
            <PlannerCard
              title="Work Truck / Service Vehicle"
              principal={42000}
              rate={8.1}
              term="3 years"
              payment={secondPaymentPlan.payment}
              totalInterest={secondPaymentPlan.totalInterest}
              totalPaid={secondPaymentPlan.totalPaid}
            />
          </div>

          <div className="border-t border-black/10 bg-[#f9f6f0] px-5 py-4 text-sm leading-6 text-[#655c52]">
            Kiefer Built planning note: use this to sanity-check lender quotes before final accounting review. It gives managers a fast monthly payment and interest exposure estimate.
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Kiefer Built Rate Check
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <Percent className="size-5 text-[#b92516]" />
              APR And Effective Rate Review
            </h2>
          </div>

          <div className="p-5">
            <div className="rounded-lg border border-black/10 bg-[#151515] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Example lender quote
              </p>
              <p className="mt-3 text-4xl font-bold">7.20%</p>
              <p className="mt-2 text-sm text-white/70">Nominal annual rate, compounded monthly</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <RateTile label="Monthly periodic rate" value={`${monthlyRate.toFixed(4)}%`} />
              <RateTile label="Effective annual rate" value={`${effectiveAnnualRate.toFixed(2)}%`} />
            </div>

            <div className="mt-4 rounded-md bg-[#f9f6f0] p-4 text-sm leading-6 text-[#655c52]">
              Kiefer Built rate note: compare the effective annual rate to the lender’s headline APR so the true annual cost is easier to explain internally.
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
          Next Kiefer Built Calculator
        </p>
        <h2 className="mt-1 text-lg font-bold">Finance Toolkit Expansion</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
          Next useful finance improvements are saved draw schedule snapshots and exporting finance checks into proposal or lender-review packets.
        </p>
      </section>
    </AdminShell>
  );
}

function PresetTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#655c52]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[#171717]">{value}</p>
    </div>
  );
}

function PlannerCard({
  title,
  principal,
  rate,
  term,
  payment,
  totalInterest,
  totalPaid,
}: {
  title: string;
  principal: number;
  rate: number;
  term: string;
  payment: number;
  totalInterest: number;
  totalPaid: number;
}) {
  return (
    <article className="border-b border-black/10 p-5 md:border-r">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-[#655c52]">
        {formatCurrency(principal)} · {rate.toFixed(2)}% APR · {term}
      </p>
      <p className="mt-5 text-4xl font-bold">{formatCurrency(payment)}</p>
      <p className="mt-1 text-sm font-semibold text-[#655c52]">Estimated monthly payment</p>
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <p className="rounded-md bg-[#f9f6f0] p-3">
          <span className="block font-semibold text-[#171717]">Total interest</span>
          <span className="mt-1 block text-[#655c52]">{formatCurrency(totalInterest)}</span>
        </p>
        <p className="rounded-md bg-[#f9f6f0] p-3">
          <span className="block font-semibold text-[#171717]">Total paid</span>
          <span className="mt-1 block text-[#655c52]">{formatCurrency(totalPaid)}</span>
        </p>
      </div>
    </article>
  );
}

function RateTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 p-4">
      <p className="text-sm font-semibold text-[#655c52]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
