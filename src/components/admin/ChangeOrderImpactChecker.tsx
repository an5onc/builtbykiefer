"use client";

import { ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateChangeOrderImpact } from "@/lib/admin/finance-tools";
import { formatCurrency } from "@/lib/admin/formatters";

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function ChangeOrderImpactChecker() {
  const [proposedPrice, setProposedPrice] = useState("9500");
  const [laborCost, setLaborCost] = useState("3200");
  const [materialCost, setMaterialCost] = useState("2100");
  const [subcontractorCost, setSubcontractorCost] = useState("1500");
  const [otherCost, setOtherCost] = useState("700");
  const [targetMarginPercent, setTargetMarginPercent] = useState("25");
  const [scheduleDaysAdded, setScheduleDaysAdded] = useState("4");

  const impact = useMemo(
    () =>
      calculateChangeOrderImpact({
        proposedPrice: parseAmount(proposedPrice),
        laborCost: parseAmount(laborCost),
        materialCost: parseAmount(materialCost),
        subcontractorCost: parseAmount(subcontractorCost),
        otherCost: parseAmount(otherCost),
        targetMarginPercent: parseAmount(targetMarginPercent),
        scheduleDaysAdded: parseAmount(scheduleDaysAdded),
      }),
    [laborCost, materialCost, otherCost, proposedPrice, scheduleDaysAdded, subcontractorCost, targetMarginPercent],
  );

  return (
    <section className="rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
          Kiefer Built Margin Protection
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
          <ShieldCheck className="size-5 text-[#b92516]" />
          Change Order Margin Impact Checker
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
          Check whether a change order price covers added cost, protects target margin, and clearly captures schedule impact before sending it to the client.
        </p>
      </div>

      <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-black/10 p-5 xl:border-b-0 xl:border-r">
          <div className="grid gap-4 sm:grid-cols-2">
            <ImpactInput label="Proposed client price" prefix="$" value={proposedPrice} onChange={setProposedPrice} />
            <ImpactInput label="Target margin" suffix="%" value={targetMarginPercent} onChange={setTargetMarginPercent} />
            <ImpactInput label="Labor cost" prefix="$" value={laborCost} onChange={setLaborCost} />
            <ImpactInput label="Material cost" prefix="$" value={materialCost} onChange={setMaterialCost} />
            <ImpactInput label="Sub / vendor cost" prefix="$" value={subcontractorCost} onChange={setSubcontractorCost} />
            <ImpactInput label="Other cost" prefix="$" value={otherCost} onChange={setOtherCost} />
            <ImpactInput label="Schedule days added" suffix="days" value={scheduleDaysAdded} onChange={setScheduleDaysAdded} />
          </div>

          <div className="mt-5 rounded-md bg-[#f9f6f0] p-4 text-sm leading-6 text-[#655c52]">
            Kiefer Built manager note: use this before sending client approvals so field-driven scope changes do not quietly dilute gross margin.
          </div>
        </div>

        <div className="p-5">
          <div className={`rounded-lg p-5 ${impact.isMarginProtected ? "bg-[#151515] text-white" : "bg-[#b92516] text-white"}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Margin signal</p>
            <p className="mt-2 text-2xl font-bold">
              {impact.isMarginProtected ? "Margin protected" : "Price is under target"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Recommended billing is {formatCurrency(impact.recommendedBillingAmount)}
              {impact.marginGap > 0 ? `, leaving a ${formatCurrency(impact.marginGap)} pricing gap.` : "."}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ImpactTile label="Total added cost" value={formatCurrency(impact.totalAddedCost)} />
            <ImpactTile label="Gross profit" value={formatCurrency(impact.grossProfit)} />
            <ImpactTile label="Gross margin" value={formatPercent(impact.grossMarginPercent)} />
            <ImpactTile label="Markup on cost" value={formatPercent(impact.markupPercent)} />
            <ImpactTile label="Recommended billing" value={formatCurrency(impact.recommendedBillingAmount)} />
            <ImpactTile label="Margin gap" value={formatCurrency(impact.marginGap)} />
            <ImpactTile label="Schedule impact" value={`${impact.scheduleDaysAdded} days`} />
            <ImpactTile label="Approval readiness" value={impact.isMarginProtected ? "Ready" : "Review"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactInput({
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

function ImpactTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#655c52]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#171717]">{value}</p>
    </div>
  );
}
