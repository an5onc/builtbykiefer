import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, FileText, Mail, Phone, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, proposalTotal } from "@/lib/admin/formatters";
import { leadStatusOptions } from "@/lib/admin/leads";
import { getLead, getLeadProposals } from "@/lib/admin/queries";
import { saveLeadFollowUp } from "./actions";

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ leadId: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { leadId } = await params;
  const { error, notice } = await searchParams;
  const [lead, proposals] = await Promise.all([
    getLead(leadId),
    getLeadProposals(leadId),
  ]);

  if (!lead) {
    notFound();
  }

  const saveAction = saveLeadFollowUp.bind(null, lead.id);

  return (
    <AdminShell title={lead.name} eyebrow="Lead Record">
      <div className="mb-6">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Leads
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          {notice}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                {lead.projectType}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{lead.budgetRange}</h2>
            </div>
            <StatusBadge status={lead.status} />
          </div>

          <div className="mt-6 space-y-4 text-sm text-[#655c52]">
            <p className="flex items-center gap-3">
              <Mail className="size-4 text-[#b92516]" />
              <a className="font-medium text-[#171717]" href={`mailto:${lead.email}`}>
                {lead.email}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="size-4 text-[#b92516]" />
              <a className="font-medium text-[#171717]" href={`tel:${lead.phone}`}>
                {lead.phone}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <CalendarClock className="size-4 text-[#b92516]" />
              <span>
                Next follow-up <span className="font-semibold text-[#171717]">{lead.nextFollowUp}</span>
              </span>
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <form action={saveAction} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold text-[#171717]">
                Status
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                >
                  {leadStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-[#171717]">
                Next follow-up
                <input
                  name="nextFollowUp"
                  type="date"
                  defaultValue={lead.nextFollowUp}
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                  required
                />
              </label>
            </div>
            <label className="block text-sm font-semibold text-[#171717]">
              Notes
              <textarea
                name="notes"
                defaultValue={lead.notes}
                rows={8}
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
            >
              Save Lead Update
            </button>
          </form>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Proposal Pipeline
            </p>
            <h2 className="mt-1 text-lg font-bold">Lead Proposals</h2>
          </div>
          <Link
            href={`/admin/leads/${lead.id}/proposals/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            Create Proposal
          </Link>
        </div>

        {proposals.length > 0 ? (
          <div className="divide-y divide-black/10">
            {proposals.map((proposal) => (
              <Link
                key={proposal.id}
                href={`/admin/proposals/${proposal.id}`}
                className="grid gap-3 px-5 py-4 transition hover:bg-[#f9f6f0] md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr]"
              >
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <FileText className="size-4 text-[#b92516]" />
                    {proposal.title}
                  </p>
                  <p className="mt-1 text-sm text-[#655c52]">{proposal.proposalNumber}</p>
                </div>
                <p className="font-semibold">{formatCurrency(proposalTotal(proposal.lineItems))}</p>
                <StatusBadge status={proposal.status} />
                <p className="text-sm text-[#655c52]">Valid {proposal.validUntil}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No proposals yet. Create one from this lead to turn the sales conversation into a priced scope.
          </p>
        )}
      </section>
    </AdminShell>
  );
}
