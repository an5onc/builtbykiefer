import Link from "next/link";
import { FileText } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ProposalDownloadButton from "@/components/admin/ProposalDownloadButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, proposalTotal } from "@/lib/admin/formatters";
import { getProposals } from "@/lib/admin/queries";

export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <AdminShell title="Proposals" eyebrow="Sales Estimating">
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[1.3fr_1fr_0.8fr_0.7fr_0.8fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Proposal</span>
            <span>Client</span>
            <span>Total</span>
            <span>Status</span>
            <span>PDF</span>
          </div>
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="grid grid-cols-[1.3fr_1fr_0.8fr_0.7fr_0.8fr] gap-4 border-b border-black/10 px-4 py-4 last:border-0"
            >
              <Link href={`/admin/proposals/${proposal.id}`} className="transition hover:text-[#b92516]">
                <p className="flex items-center gap-2 font-semibold">
                  <FileText className="size-4 text-[#b92516]" />
                  {proposal.title}
                </p>
                <p className="mt-1 text-sm text-[#655c52]">
                  {proposal.proposalNumber} · Valid {formatDate(proposal.validUntil)}
                </p>
              </Link>
              <div>
                <p className="font-medium">{proposal.clientName}</p>
                <p className="text-sm text-[#655c52]">{proposal.clientEmail}</p>
              </div>
              <p className="font-semibold">{formatCurrency(proposalTotal(proposal.lineItems))}</p>
              <StatusBadge status={proposal.status} />
              <ProposalDownloadButton proposalId={proposal.id} />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
