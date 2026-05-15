import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/admin/formatters";
import { getProject, getProjectFinancialTarget } from "@/lib/admin/queries";
import { updateProjectFinancialTargetAction } from "./actions";

export default async function EditProjectFinancialTargetPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { projectId } = await params;
  const { error } = await searchParams;
  const [project, target] = await Promise.all([
    getProject(projectId),
    getProjectFinancialTarget(projectId),
  ]);

  if (!project) {
    notFound();
  }

  const action = updateProjectFinancialTargetAction.bind(null, project.id);
  const currentTargetMargin =
    target && target.contractValue > 0
      ? ((target.contractValue - target.budgetedCost) / target.contractValue) * 100
      : 0;

  return (
    <AdminShell title={`Financial Targets for ${project.name}`} eyebrow="Job Costing Budget">
      <div className="mb-6">
        <Link
          href={`/admin/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Project
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}

      <form action={action} className="space-y-6">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-[#b92516]/10 text-[#b92516]">
              <BarChart3 className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Margin Forecast Inputs</h2>
              <p className="text-sm text-[#655c52]">
                Set the baseline contract, budgeted cost, target margin, and contingency used by reports.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="block text-sm font-semibold text-[#171717]">
              Contract value
              <input
                name="contractValue"
                type="number"
                min="0"
                step="0.01"
                defaultValue={target?.contractValue ?? ""}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Budgeted cost
              <input
                name="budgetedCost"
                type="number"
                min="0"
                step="0.01"
                defaultValue={target?.budgetedCost ?? ""}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Target margin %
              <input
                name="targetMarginPercent"
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue={target?.targetMarginPercent ?? ""}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Contingency %
              <input
                name="contingencyPercent"
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue={target?.contingencyPercent ?? ""}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
          </div>

          {target ? (
            <div className="mt-5 grid gap-3 rounded-md bg-[#f9f6f0] p-4 text-sm md:grid-cols-3">
              <p>
                <span className="font-semibold text-[#171717]">Current gross target</span>
                <span className="mt-1 block text-[#655c52]">{currentTargetMargin.toFixed(1)}%</span>
              </p>
              <p>
                <span className="font-semibold text-[#171717]">Budgeted gross margin</span>
                <span className="mt-1 block text-[#655c52]">
                  {formatCurrency(target.contractValue - target.budgetedCost)}
                </span>
              </p>
              <p>
                <span className="font-semibold text-[#171717]">Last updated</span>
                <span className="mt-1 block text-[#655c52]">
                  {new Date(target.updatedAt).toLocaleDateString("en-US")}
                </span>
              </p>
            </div>
          ) : null}
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Save Financial Targets
        </button>
      </form>
    </AdminShell>
  );
}
