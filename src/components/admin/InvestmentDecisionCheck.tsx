"use client";

import { BadgeDollarSign } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateInvestmentDecision } from "@/lib/admin/finance-tools";
import { formatCurrency } from "@/lib/admin/formatters";

const defaultCashFlows = ["22000", "24000", "25000", "26000", "28000"];

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value: number | null) {
  return value === null ? "N/A" : `${value.toFixed(2)}%`;
}

function formatYears(value: number | null) {
  return value === null ? "No payback" : `${value.toFixed(2)} years`;
}

export default function InvestmentDecisionCheck() {
  const [initialInvestment, setInitialInvestment] = useState("85000");
  const [discountRatePercent, setDiscountRatePercent] = useState("12");
  const [cashFlows, setCashFlows] = useState(defaultCashFlows);

  const decision = useMemo(
    () =>
      calculateInvestmentDecision({
        initialInvestment: parseAmount(initialInvestment),
        discountRatePercent: parseAmount(discountRatePercent),
        cashFlows: cashFlows.map(parseAmount),
      }),
    [cashFlows, discountRatePercent, initialInvestment],
  );

  const updateCashFlow = (index: number, value: string) => {
    setCashFlows((current) => current.map((cashFlow, currentIndex) => (currentIndex === index ? value : cashFlow)));
  };

  return (
    <section className="rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
          Kiefer Built Investment Check
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
          <BadgeDollarSign className="size-5 text-[#b92516]" />
          NPV / IRR Decision Check
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
          Compare a truck, equipment package, or major tool purchase against Kiefer Built&apos;s hurdle rate before committing cash.
        </p>
      </div>

      <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-black/10 p-5 xl:border-b-0 xl:border-r">
          <div className="grid gap-4 sm:grid-cols-2">
            <DecisionInput
              label="Initial investment"
              prefix="$"
              value={initialInvestment}
              onChange={setInitialInvestment}
            />
            <DecisionInput
              label="Hurdle / discount rate"
              suffix="%"
              value={discountRatePercent}
              onChange={setDiscountRatePercent}
            />
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-[#655c52]">Expected annual cash benefit</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-5">
              {cashFlows.map((cashFlow, index) => (
                <DecisionInput
                  key={index}
                  label={`Year ${index + 1}`}
                  prefix="$"
                  value={cashFlow}
                  onChange={(value) => updateCashFlow(index, value)}
                  compact
                />
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-md bg-[#f9f6f0] p-4 text-sm leading-6 text-[#655c52]">
            Kiefer Built accounting note: cash benefits can include avoided rentals, increased crew productivity, resale value assumptions, or new billable capacity.
          </div>
        </div>

        <div className="p-5">
          <div
            className={`rounded-lg p-5 ${
              decision.isAboveHurdleRate ? "bg-[#151515] text-white" : "bg-[#b92516] text-white"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Decision signal</p>
            <p className="mt-2 text-2xl font-bold">
              {decision.isAboveHurdleRate ? "Clears Kiefer Built hurdle rate" : "Needs more review"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              NPV is {formatCurrency(decision.netPresentValue)} at a {parseAmount(discountRatePercent).toFixed(2)}% discount rate.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DecisionTile label="Net present value" value={formatCurrency(decision.netPresentValue)} />
            <DecisionTile label="Internal rate of return" value={formatPercent(decision.internalRateOfReturnPercent)} />
            <DecisionTile label="Payback period" value={formatYears(decision.paybackYears)} />
            <DecisionTile label="Net cash gain" value={formatCurrency(decision.netCashGain)} />
            <DecisionTile label="Total cash in" value={formatCurrency(decision.totalCashIn)} />
            <DecisionTile label="Hurdle result" value={decision.isAboveHurdleRate ? "Pass" : "Review"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DecisionInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
}) {
  return (
    <label className="block">
      <span className={`font-semibold text-[#655c52] ${compact ? "text-xs" : "text-sm"}`}>{label}</span>
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

function DecisionTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#655c52]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#171717]">{value}</p>
    </div>
  );
}
