"use client";

import { Landmark } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateProjectCashFlowForecast } from "@/lib/admin/finance-tools";
import { formatCurrency } from "@/lib/admin/formatters";
import type { ProjectFinancePreset } from "@/lib/admin/project-finance-presets";

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ProjectCashFlowForecastTool({
  initialValues,
}: {
  initialValues?: ProjectFinancePreset["cashFlowForecast"];
}) {
  const [contractValue, setContractValue] = useState(String(initialValues?.contractValue ?? "500000"));
  const [approvedChangeOrders, setApprovedChangeOrders] = useState(String(initialValues?.approvedChangeOrders ?? "25000"));
  const [percentComplete, setPercentComplete] = useState(String(initialValues?.percentComplete ?? "60"));
  const [retainagePercent, setRetainagePercent] = useState(String(initialValues?.retainagePercent ?? "10"));
  const [paidToDate, setPaidToDate] = useState(String(initialValues?.paidToDate ?? "240000"));
  const [pendingDrawsSubmitted, setPendingDrawsSubmitted] = useState(String(initialValues?.pendingDrawsSubmitted ?? "18000"));
  const [vendorPaymentsDue, setVendorPaymentsDue] = useState(String(initialValues?.vendorPaymentsDue ?? "42000"));
  const [payrollDue, setPayrollDue] = useState(String(initialValues?.payrollDue ?? "31000"));
  const [overheadDue, setOverheadDue] = useState(String(initialValues?.overheadDue ?? "9500"));
  const [cashOnHand, setCashOnHand] = useState(String(initialValues?.cashOnHand ?? "20000"));

  const forecast = useMemo(
    () =>
      calculateProjectCashFlowForecast({
        contractValue: parseAmount(contractValue),
        approvedChangeOrders: parseAmount(approvedChangeOrders),
        percentComplete: parseAmount(percentComplete),
        retainagePercent: parseAmount(retainagePercent),
        paidToDate: parseAmount(paidToDate),
        pendingDrawsSubmitted: parseAmount(pendingDrawsSubmitted),
        vendorPaymentsDue: parseAmount(vendorPaymentsDue),
        payrollDue: parseAmount(payrollDue),
        overheadDue: parseAmount(overheadDue),
        cashOnHand: parseAmount(cashOnHand),
      }),
    [
      approvedChangeOrders,
      cashOnHand,
      contractValue,
      overheadDue,
      paidToDate,
      payrollDue,
      pendingDrawsSubmitted,
      percentComplete,
      retainagePercent,
      vendorPaymentsDue,
    ],
  );

  const statusLabel =
    forecast.status === "healthy"
      ? "Healthy"
      : forecast.status === "tight"
        ? "Tight"
        : "Funding needed";

  return (
    <section className="rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
          Kiefer Built Cash Control
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
          <Landmark className="size-5 text-[#b92516]" />
          Project Cash-Flow Forecast
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655c52]">
          Forecast upcoming draw receipts, retainage held, vendor bills, payroll pressure, overhead, and short-term cash gaps before the job strains accounting.
        </p>
      </div>

      <div className="grid gap-0 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-black/10 p-5 xl:border-b-0 xl:border-r">
          <div className="grid gap-4 sm:grid-cols-2">
            <ForecastInput label="Contract value" prefix="$" value={contractValue} onChange={setContractValue} />
            <ForecastInput label="Approved change orders" prefix="$" value={approvedChangeOrders} onChange={setApprovedChangeOrders} />
            <ForecastInput label="Percent complete" suffix="%" value={percentComplete} onChange={setPercentComplete} />
            <ForecastInput label="Retainage" suffix="%" value={retainagePercent} onChange={setRetainagePercent} />
            <ForecastInput label="Paid to date" prefix="$" value={paidToDate} onChange={setPaidToDate} />
            <ForecastInput label="Submitted draws not paid" prefix="$" value={pendingDrawsSubmitted} onChange={setPendingDrawsSubmitted} />
            <ForecastInput label="Vendor payments due" prefix="$" value={vendorPaymentsDue} onChange={setVendorPaymentsDue} />
            <ForecastInput label="Payroll due" prefix="$" value={payrollDue} onChange={setPayrollDue} />
            <ForecastInput label="Project overhead due" prefix="$" value={overheadDue} onChange={setOverheadDue} />
            <ForecastInput label="Cash reserve" prefix="$" value={cashOnHand} onChange={setCashOnHand} />
          </div>

          <div className="mt-5 rounded-md bg-[#f9f6f0] p-4 text-sm leading-6 text-[#655c52]">
            Kiefer Built accounting note: use submitted draws for receivables already billed, and current draw ready for earned work that can be billed next.
          </div>
        </div>

        <div className="p-5">
          <div className={`rounded-lg p-5 ${forecast.status === "funding-needed" ? "bg-[#b92516] text-white" : "bg-[#151515] text-white"}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Cash signal</p>
            <p className="mt-2 text-2xl font-bold">{statusLabel}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{forecast.managerNote}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ForecastTile label="Expected cash in" value={formatCurrency(forecast.expectedCashIn)} emphasis />
            <ForecastTile label="Scheduled cash out" value={formatCurrency(forecast.scheduledCashOut)} emphasis />
            <ForecastTile label="Current draw ready" value={formatCurrency(forecast.currentDrawReady)} />
            <ForecastTile label="Retainage held" value={formatCurrency(forecast.retainageHeldToDate)} />
            <ForecastTile label="Projected ending cash" value={formatCurrency(forecast.projectedEndingCash)} />
            <ForecastTile label="Cash gap" value={formatCurrency(forecast.cashGap)} />
            <ForecastTile label="Gross earned to date" value={formatCurrency(forecast.grossEarnedToDate)} />
            <ForecastTile label="Adjusted contract" value={formatCurrency(forecast.adjustedContractValue)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ForecastInput({
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

function ForecastTile({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-md p-4 ${emphasis ? "bg-[#f9f6f0]" : "border border-black/10"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#655c52]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#171717]">{value}</p>
    </div>
  );
}
