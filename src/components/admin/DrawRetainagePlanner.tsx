"use client";

import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateDrawRetainagePlan } from "@/lib/admin/finance-tools";
import { formatCurrency } from "@/lib/admin/formatters";

const defaultInputs = {
  contractValue: "500000",
  percentComplete: "62.5",
  retainagePercent: "10",
  paidToDate: "225000",
};

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function DrawRetainagePlanner() {
  const [contractValue, setContractValue] = useState(defaultInputs.contractValue);
  const [percentComplete, setPercentComplete] = useState(defaultInputs.percentComplete);
  const [retainagePercent, setRetainagePercent] = useState(defaultInputs.retainagePercent);
  const [paidToDate, setPaidToDate] = useState(defaultInputs.paidToDate);

  const plan = useMemo(
    () =>
      calculateDrawRetainagePlan({
        contractValue: parseAmount(contractValue),
        percentComplete: parseAmount(percentComplete),
        retainagePercent: parseAmount(retainagePercent),
        paidToDate: parseAmount(paidToDate),
      }),
    [contractValue, paidToDate, percentComplete, retainagePercent],
  );

  return (
    <section className="rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
          Kiefer Built Draw Control
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
          <Calculator className="size-5 text-[#b92516]" />
          Draw & Retainage Planner
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
          Give accounting a quick way to check earned revenue, retainage held, current draw due, and cash still left to collect before preparing a payment application.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-black/10 p-5 lg:border-b-0 lg:border-r">
          <div className="grid gap-4 sm:grid-cols-2">
            <PlannerInput
              label="Contract value"
              prefix="$"
              value={contractValue}
              onChange={setContractValue}
            />
            <PlannerInput
              label="Paid to date"
              prefix="$"
              value={paidToDate}
              onChange={setPaidToDate}
            />
            <PlannerInput
              label="Percent complete"
              suffix="%"
              value={percentComplete}
              onChange={setPercentComplete}
            />
            <PlannerInput
              label="Retainage"
              suffix="%"
              value={retainagePercent}
              onChange={setRetainagePercent}
            />
          </div>

          <div className="mt-5 rounded-md bg-[#f9f6f0] p-4 text-sm leading-6 text-[#655c52]">
            Kiefer Built accounting note: paid-to-date should be entered as payments already released to Kiefer, not the gross value of approved work before retainage.
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultTile
              label="Current draw due"
              value={formatCurrency(plan.currentDrawDue)}
              emphasis
            />
            <ResultTile label="Retainage held" value={formatCurrency(plan.retainageHeldToDate)} />
            <ResultTile label="Gross earned to date" value={formatCurrency(plan.grossEarnedToDate)} />
            <ResultTile label="Net earned after retainage" value={formatCurrency(plan.netEarnedToDate)} />
            <ResultTile label="Remaining contract value" value={formatCurrency(plan.remainingContractValue)} />
            <ResultTile label="Remaining to collect" value={formatCurrency(plan.remainingToCollect)} />
          </div>

          <div className="mt-4 rounded-md border border-black/10 p-4">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[#655c52]">
              <span>Work remaining</span>
              <span className="text-[#171717]">{plan.percentRemaining.toFixed(1)}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[#b92516]"
                style={{ width: `${Math.max(0, Math.min(100, 100 - plan.percentRemaining))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlannerInput({
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
        {prefix ? <span className="text-sm font-bold text-[#655c52]">{prefix}</span> : null}
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-semibold text-[#171717] outline-none"
        />
        {suffix ? <span className="text-sm font-bold text-[#655c52]">{suffix}</span> : null}
      </span>
    </label>
  );
}

function ResultTile({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-md p-4 ${emphasis ? "bg-[#151515] text-white" : "border border-black/10"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${emphasis ? "text-white/60" : "text-[#655c52]"}`}>
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${emphasis ? "text-white" : "text-[#171717]"}`}>{value}</p>
    </div>
  );
}
