import { Clock, FileText, FolderKanban, ReceiptText, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import MetricCard from "@/components/admin/MetricCard";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatHours } from "@/lib/admin/formatters";
import { getDashboardMetrics, getLeads, getProjects } from "@/lib/admin/queries";

export default function AdminDashboardPage() {
  const metrics = getDashboardMetrics();
  const projects = getProjects();
  const leads = getLeads().slice(0, 4);

  return (
    <AdminShell title="Command Center" eyebrow="Kiefer Built Operations">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Active Projects"
          value={String(metrics.activeProjects)}
          detail="Demo construction workload"
          icon={FolderKanban}
        />
        <MetricCard
          label="Open Leads"
          value={String(metrics.openLeads)}
          detail="CRM follow-up queue"
          icon={Users}
        />
        <MetricCard
          label="Recent Uploads"
          value={String(metrics.recentUploads)}
          detail="Photos and documents"
          icon={FileText}
        />
        <MetricCard
          label="Weekly Hours"
          value={formatHours(metrics.weeklyHours)}
          detail="Demo labor tracking"
          icon={Clock}
        />
        <MetricCard
          label="Draft Invoices"
          value={formatCurrency(metrics.draftInvoiceTotal)}
          detail="Ready for review"
          icon={ReceiptText}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Project Snapshot</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8176]">
              Demo Data
            </span>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-md border border-black/10 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-[#655c52]">
                      {project.location} · {project.currentPhase}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <ProjectProgress progress={project.progress} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Lead Follow-Ups</h2>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="border-b border-black/10 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{lead.name}</p>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="mt-1 text-sm text-[#655c52]">
                  {lead.projectType} · {lead.budgetRange}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#b92516]">
                  Follow up {lead.nextFollowUp}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
