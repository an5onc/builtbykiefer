"use client";

import { ChartNoAxesCombined } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateJobCostVariance } from "@/lib/admin/finance-tools";
import { formatCurrency } from "@/lib/admin/formatters";

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function JobCostVarianceTool() {
  const [budgetedCost, setBudgetedCost] = useState("420000");
  const [actualCost, setActualCost] = useState("260000");
  const [committedCost, setCommittedCost] = useState("138000");
  const [pendingExposure, setPendingExposure] = useState("29000");
  const [contingencyPercent, setContingencyPercent] = useState("3");

  const variance = useMemo(
    () =>
      calculateJobCostVariance({
        budgetedCost: parseAmount(budgetedCost),
        actualCost: parseAmount(actualCost),
        committedCost: parseAmount(committedCost),
        pendingExposure: parseAmount(pendingExposure),
        contingencyPercent: parseAmount(contingencyPercent),
      }),
    [actualCost, budgetedCost, committedCost, contingencyPercent, pendingExposure],
  );

  const statusLabel =
    variance.status === "on-track" ? "On track" : variance.status === "watch" ? "Watch" : "Over budget";

  return (
    <section className="rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
          Kiefer Built Cost Control
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
          <ChartNoAxesCombined className="size-5 text-[#b92516]" />
          Job Cost Variance Tool
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
          Compare budget, actual bills, open commitments, and pending cost exposure so accounting can spot job drift before it becomes a margin problem.
        </p>
      </div>

      <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-black/10 p-5 xl:border-b-0 xl:border-r">
          <div className="grid gap-4 sm:grid-cols-2">
            <VarianceInput label="Budgeted cost" prefix="$" value={budgetedCost} onChange={setBudgetedCost} />
            <VarianceInput label="Actual cost" prefix="$" value={actualCost} onChange={setActualCost} />
            <VarianceInput label="Open commitments" prefix="$" value={committedCost} onChange={setCommittedCost} />
            <VarianceInput label="Pending exposure" prefix="$" value={pendingExposure} onChange={setPendingExposure} />
            <VarianceInput label="Contingency allowance" suffix="%" value={contingencyPercent} onChange={setContingencyPercent} />
          </div>

          <div className="mt-5 rounded-md bg-[#f9f6f0] p-4 text-sm leading-6 text-[#655c52]">
            Kiefer Built accounting note: pending exposure should include likely change cost, buyout drift, allowance overages, or known vendor pricing not yet entered as a bill or PO.
          </div>
        </div>

        <div className="p-5">
          <div className={`rounded-lg p-5 ${variance.status === "over-budget" ? "bg-[#b92516] text-white" : "bg-[#151515] text-white"}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Variance signal</p>
            <p className="mt-2 text-2xl font-bold">{statusLabel}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{variance.managerNote}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <VarianceTile label="Projected final cost" value={formatCurrency(variance.projectedFinalCost)} />
            <VarianceTile label="Variance amount" value={formatCurrency(variance.varianceAmount)} />
            <VarianceTile label="Variance percent" value={formatPercent(variance.variancePercent)} />
            <VarianceTile label="Contingency allowance" value={formatCurrency(variance.contingencyAllowance)} />
            <VarianceTile label="Remaining budget" value={formatCurrency(variance.remainingBudget)} />
            <VarianceTile label="Status" value={statusLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}

function VarianceInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#655c52]">{label}</span>
      <span className="mt-2 flex items-center rounded-md border border-black/10 bg-[#f9f6f0] px-3 focus-within:border-[#b92516]">
        {prefix ? <span className="text-xs font-bold text-[#655c52]">{prefix}</span> : null}
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-semibold text-[#171717] outline-none"
        />
        {suffix ? <span className="text-xs font-bold text-[#655c52]">{suffix}</span> : null}
      </span>
    </label>
  );
}

function VarianceTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#655c52]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#171717]">{value}</p>
    </div>
  );
}
