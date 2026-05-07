import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { getLeads } from "@/lib/admin/queries";

export default function LeadsPage() {
  const leads = getLeads();

  return (
    <AdminShell title="Lead + Client CRM" eyebrow="Sales Pipeline">
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
            <div
              key={lead.id}
              className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-black/10 px-4 py-4 last:border-0"
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
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
