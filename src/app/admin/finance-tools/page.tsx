import Link from "next/link";
import {
  BadgeDollarSign,
  Percent,
  Truck,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ChangeOrderImpactChecker from "@/components/admin/ChangeOrderImpactChecker";
import DrawRetainagePlanner from "@/components/admin/DrawRetainagePlanner";
import InvestmentDecisionCheck from "@/components/admin/InvestmentDecisionCheck";
import JobCostVarianceTool from "@/components/admin/JobCostVarianceTool";
import ProjectCashFlowForecastTool from "@/components/admin/ProjectCashFlowForecastTool";
import { formatCurrency } from "@/lib/admin/formatters";
import {
  calculateEffectiveAnnualRate,
  calculateLoanPaymentPlan,
  calculateMonthlyRateFromApr,
} from "@/lib/admin/finance-tools";

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

export default function FinanceToolsPage() {
  return (
    <AdminShell title="Kiefer Built Finance Tools" eyebrow="Accounting Utilities">
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

      <div className="mb-6">
        <DrawRetainagePlanner />
      </div>

      <div className="mb-6">
        <InvestmentDecisionCheck />
      </div>

      <div className="mb-6">
        <ChangeOrderImpactChecker />
      </div>

      <div className="mb-6">
        <JobCostVarianceTool />
      </div>

      <div className="mb-6">
        <ProjectCashFlowForecastTool />
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
          Next useful finance improvements are live project data presets, draw schedule snapshots, and exporting finance checks into proposal or lender-review packets.
        </p>
      </section>
    </AdminShell>
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
