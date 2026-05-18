import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Mail } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ProposalDownloadButton from "@/components/admin/ProposalDownloadButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, proposalTotal } from "@/lib/admin/formatters";
import { getProposal } from "@/lib/admin/queries";

export default async function ProposalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ proposalId: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { proposalId } = await params;
  const { notice } = await searchParams;
  const proposal = await getProposal(proposalId);

  if (!proposal) {
    notFound();
  }

  const total = proposalTotal(proposal.lineItems);

  return (
    <AdminShell title={proposal.title} eyebrow="Proposal Detail">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/proposals"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Proposals
        </Link>
        <ProposalDownloadButton proposalId={proposal.id} />
      </div>

      {notice ? (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          {notice}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                {proposal.proposalNumber}
              </p>
              <h2 className="mt-2 text-3xl font-bold">{formatCurrency(total)}</h2>
            </div>
            <StatusBadge status={proposal.status} />
          </div>

          <div className="mt-6 space-y-4 text-sm text-[#655c52]">
            <p className="flex items-center gap-3">
              <Mail className="size-4 text-[#b92516]" />
              <a className="font-medium text-[#171717]" href={`mailto:${proposal.clientEmail}`}>
                {proposal.clientName}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <CalendarDays className="size-4 text-[#b92516]" />
              <span>
                Valid until <span className="font-semibold text-[#171717]">{proposal.validUntil}</span>
              </span>
            </p>
          </div>

          <div className="mt-6 rounded-md bg-[#f9f6f0] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Scope Summary
            </p>
            <p className="mt-2 text-sm leading-6 text-[#655c52]">{proposal.scopeSummary}</p>
          </div>

          {proposal.internalNotes ? (
            <div className="mt-4 rounded-md border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#655c52]">
                Internal Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-[#655c52]">{proposal.internalNotes}</p>
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="grid grid-cols-[0.8fr_1.4fr_0.4fr_0.7fr_0.7fr] gap-3 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Section</span>
            <span>Description</span>
            <span>Qty</span>
            <span>Unit</span>
            <span>Total</span>
          </div>
          {proposal.lineItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[0.8fr_1.4fr_0.4fr_0.7fr_0.7fr] gap-3 border-b border-black/10 px-4 py-4 text-sm last:border-0"
            >
              <p className="font-semibold">
                {item.section}
                {item.isOptional ? <span className="ml-2 text-xs text-[#655c52]">Optional</span> : null}
              </p>
              <p className="text-[#655c52]">{item.description}</p>
              <p>{item.quantity}</p>
              <p>{formatCurrency(item.unitPrice)}</p>
              <p className="font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</p>
            </div>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
