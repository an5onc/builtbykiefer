import Link from "next/link";
import { PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { getLeads } from "@/lib/admin/queries";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <AdminShell title="Lead + Client CRM" eyebrow="Sales Pipeline">
      <div className="mb-5 flex justify-end">
        <Link
          href="/admin/leads/new"
          className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
        >
          <PlusCircle className="size-4" />
          New Lead
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Lead</span>
            <span>Project</span>
            <span>Budget</span>
            <span>Status</span>
            <span>Next Step</span>
          </div>
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0"
            >
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm text-[#655c52]">{lead.email}</p>
                <p className="text-sm text-[#655c52]">{lead.phone}</p>
              </div>
              <p>{lead.projectType}</p>
              <p>{lead.budgetRange}</p>
              <StatusBadge status={lead.status} />
              <div>
                <p className="font-medium">{lead.nextFollowUp}</p>
                <p className="mt-1 text-sm text-[#655c52]">{lead.notes}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
