import Link from "next/link";
import {
  ArrowUpDown,
  CalendarDays,
  Clock,
  FileText,
  Filter,
  Home,
  ListChecks,
  Mail,
  MessageSquareText,
  Plus,
  ReceiptText,
  Search,
  UploadCloud,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import { buildJobListItems, pickSelectedJob } from "@/lib/admin/command-center";
import {
  changeOrderTotal,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatHours,
  invoiceTotal,
  timeEntryHours,
} from "@/lib/admin/formatters";
import {
  getClients,
  getDashboardMetrics,
  getLeads,
  getProjectChangeOrders,
  getProjectFiles,
  getProjectInvoices,
  getProjects,
  getProjectTimeEntries,
  getProjectUpdates,
  getWorkers,
} from "@/lib/admin/queries";

export default async function AdminDashboardPage() {
  const [metrics, projects, clients, leads, workers] = await Promise.all([
    getDashboardMetrics(),
    getProjects(),
    getClients(),
    getLeads(),
    getWorkers(),
  ]);
  const jobs = buildJobListItems(projects, clients);
  const selectedJob = pickSelectedJob(jobs);
  const selectedProject = selectedJob
    ? projects.find((project) => project.id === selectedJob.id) ?? null
    : null;

  const [files, updates, invoices, changeOrders, timeEntries] = selectedProject
    ? await Promise.all([
        getProjectFiles(selectedProject.id),
        getProjectUpdates(selectedProject.id),
        getProjectInvoices(selectedProject.id),
        getProjectChangeOrders(selectedProject.id),
        getProjectTimeEntries(selectedProject.id),
      ])
    : [[], [], [], [], []];

  const client = selectedProject
    ? clients.find((candidate) => candidate.id === selectedProject.clientId) ?? null
    : null;
  const clockedInEntries = timeEntries.filter((entry) => !entry.clockOut);
  const leadFollowUps = leads.slice(0, 4);
  const recentUpdates = updates.slice(0, 3);
  const recentFiles = files.slice(0, 3);
  const pendingChangeOrderTotal = changeOrders
    .filter((changeOrder) => changeOrder.status === "draft" || changeOrder.status === "sent")
    .reduce((sum, changeOrder) => sum + changeOrderTotal(changeOrder.lineItems), 0);
  const draftInvoiceTotal = invoices
    .filter((invoice) => invoice.status === "draft")
    .reduce((sum, invoice) => sum + invoiceTotal(invoice.lineItems), 0);
  const weeklyHours = timeEntries.reduce(
    (sum, entry) => sum + timeEntryHours(entry.clockIn, entry.clockOut),
    0,
  );
  const workersById = new Map(workers.map((worker) => [worker.id, worker]));

  return (
    <AdminShell title="Command Center" eyebrow="Kiefer Built Contracting">
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <aside className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 p-4">
            <h2 className="text-lg font-bold">Kiefer Built Contracting</h2>
            {selectedJob ? (
              <Link
                href={selectedJob.href}
                className="mt-4 block rounded-md border-l-4 border-[#8d1f13] bg-[#f9f6f0] p-4 transition hover:bg-[#f4efe7]"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <StatusBadge status={selectedJob.status} />
                  <span className="flex gap-2 text-[#655c52]">
                    <Mail className="size-4" />
                    <Home className="size-4" />
                  </span>
                </div>
                <p className="font-bold">{selectedJob.name}</p>
                <p className="mt-1 text-sm leading-5 text-[#655c52]">
                  {selectedJob.location}
                  <br />
                  {selectedJob.currentPhase}
                </p>
              </Link>
            ) : null}
          </div>

          <div className="border-b border-black/10 p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-md bg-white px-4 py-2 text-sm font-semibold ring-1 ring-black/10">
                Jobs
              </span>
              <span className="rounded-md bg-[#f4efe7] px-4 py-2 text-sm font-semibold text-[#655c52] ring-1 ring-black/10">
                Templates
              </span>
              <Link
                href="/admin/projects"
                className="ml-auto inline-flex items-center gap-1 rounded-md bg-[#d52b1e] px-3 py-2 text-sm font-bold text-white"
              >
                <Plus className="size-4" />
                Job
              </Link>
            </div>
            <label className="flex items-center gap-2 rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm">
              <Search className="size-4 text-[#655c52]" />
              <input
                type="search"
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8a8176]"
              />
              <Filter className="size-4 text-[#655c52]" />
              <ArrowUpDown className="size-4 text-[#655c52]" />
            </label>
          </div>

          <div className="p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
              All {jobs.length} Open Jobs
            </p>
            <div className="space-y-1">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={job.href}
                  className={`flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition hover:bg-[#f9f6f0] ${
                    selectedJob?.id === job.id ? "bg-[#f4efe7] font-semibold" : ""
                  }`}
                >
                  <span className="min-w-0 truncate">{job.name}</span>
                  <span className="rounded-full bg-[#d4f8df] px-2 py-0.5 text-xs font-bold text-[#087a34]">
                    KB
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          {selectedProject && selectedJob ? (
            <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                    <StatusBadge status={selectedProject.status} />
                  </div>
                  <p className="mt-2 text-[#655c52]">{selectedProject.location}</p>
                  <p className="mt-5 text-sm font-semibold">
                    {clockedInEntries.length} internal users are clocked in
                  </p>
                  <Link
                    href="/admin/time"
                    className="mt-3 inline-block text-sm font-semibold text-[#b92516] hover:underline"
                  >
                    View time sheets
                  </Link>
                </div>
                <Link
                  href={selectedJob.href}
                  className="rounded-md border border-black/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
                >
                  Open Job
                </Link>
              </div>

              <div className="mt-6 max-w-2xl">
                <ProjectProgress progress={selectedProject.progress} />
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="mb-3 font-bold">Clients</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="flex size-12 items-center justify-center rounded-full border border-black/20 text-[#655c52]"
                      aria-label="Add client"
                    >
                      <Plus className="size-6" />
                    </button>
                    <div>
                      <p className="font-semibold">{client?.name ?? "No client assigned"}</p>
                      <p className="text-sm text-[#655c52]">{client?.phone ?? "Add contact details"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-3 font-bold">Project Managers</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="flex size-12 items-center justify-center rounded-full border border-black/20 text-[#655c52]"
                      aria-label="Add project manager"
                    >
                      <Plus className="size-6" />
                    </button>
                    <p className="text-sm text-[#655c52]">Assign a manager</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <Link href={`/admin/projects/${selectedProject.id}/updates/new`} className="rounded-md border border-black/10 p-3 text-sm font-semibold transition hover:border-[#b92516]/30 hover:text-[#b92516]">
                  <MessageSquareText className="mb-2 size-5 text-[#b92516]" />
                  Post Update
                </Link>
                <Link href={`/admin/projects/${selectedProject.id}/files/new`} className="rounded-md border border-black/10 p-3 text-sm font-semibold transition hover:border-[#b92516]/30 hover:text-[#b92516]">
                  <UploadCloud className="mb-2 size-5 text-[#b92516]" />
                  Upload File
                </Link>
                <Link href={`/admin/projects/${selectedProject.id}/change-orders/new`} className="rounded-md border border-black/10 p-3 text-sm font-semibold transition hover:border-[#b92516]/30 hover:text-[#b92516]">
                  <ListChecks className="mb-2 size-5 text-[#b92516]" />
                  Change Order
                </Link>
                <Link href="/admin/invoices" className="rounded-md border border-black/10 p-3 text-sm font-semibold transition hover:border-[#b92516]/30 hover:text-[#b92516]">
                  <ReceiptText className="mb-2 size-5 text-[#b92516]" />
                  Invoice
                </Link>
              </div>
            </section>
          ) : null}

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em]">Past Due</p>
                <p className="mt-4 text-2xl font-bold">{formatCurrency(pendingChangeOrderTotal)}</p>
                <p className="text-sm text-[#655c52]">Change orders pending</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em]">Due Today</p>
                <p className="mt-4 text-2xl font-bold">{formatCurrency(draftInvoiceTotal)}</p>
                <p className="text-sm text-[#655c52]">Draft invoices</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em]">Action Items</p>
                <p className="mt-4 text-2xl font-bold">{formatHours(weeklyHours)}</p>
                <p className="text-sm text-[#655c52]">Logged on selected job</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em]">
                Recent Activity From Your Team
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm font-semibold"
              >
                <Filter className="size-4" />
                Filter
              </button>
            </div>
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="border-b border-black/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm text-[#655c52]">{formatDate(update.updateDate)}</p>
                  <p className="mt-1 font-semibold">{update.title}</p>
                  <p className="mt-1 text-sm text-[#655c52]">{update.body}</p>
                </div>
              ))}
              {recentFiles.map((file) => (
                <div key={file.id} className="border-b border-black/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm text-[#655c52]">{formatDateTime(file.uploadedAt)}</p>
                  <p className="mt-1 font-semibold">{file.name}</p>
                  <p className="mt-1 text-sm text-[#655c52]">
                    {file.type} · {file.visibility} · {file.sizeLabel}
                  </p>
                </div>
              ))}
              {clockedInEntries.map((entry) => (
                <div key={entry.id} className="border-b border-black/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm text-[#655c52]">{formatDateTime(entry.clockIn)}</p>
                  <p className="mt-1 font-semibold">
                    {workersById.get(entry.workerId)?.name ?? "Team member"} is clocked in
                  </p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-black/10 bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-bold">
              {updates.filter((update) => update.visibility === "customer").length}
            </p>
            <p className="mt-2 text-sm text-[#655c52]">
              Updates shared with clients on this job
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Link
                href={selectedProject ? `/admin/projects/${selectedProject.id}/updates/new` : "/admin"}
                className="rounded-md border border-black/10 px-3 py-2 text-sm font-semibold"
              >
                Client Updates
              </Link>
              <Link
                href={selectedProject ? `/admin/projects/${selectedProject.id}/updates/new` : "/admin"}
                className="rounded-md border border-black/10 px-3 py-2 text-sm font-semibold"
              >
                Daily Logs
              </Link>
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em]">
                This Week&apos;s Agenda
              </h2>
              <Link href="/admin/leads" className="text-sm font-semibold text-[#b92516]">
                View schedule
              </Link>
            </div>
            <div className="space-y-4">
              {leadFollowUps.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="grid grid-cols-[52px_1fr] gap-3 border-t border-black/10 pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#d52b1e] text-lg font-bold text-white">
                    {new Date(`${lead.nextFollowUp}T00:00:00`).getDate()}
                  </div>
                  <div>
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-sm text-[#655c52]">{lead.projectType}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-[#655c52]">
                      <CalendarDays className="size-4 text-[#8d1f13]" />
                      Follow up {formatDate(lead.nextFollowUp)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.14em]">Portfolio Totals</h2>
            <div className="grid gap-3 text-sm">
              <Link href="/admin/projects" className="flex items-center justify-between rounded-md bg-[#f9f6f0] p-3">
                <span className="flex items-center gap-2">
                  <Home className="size-4 text-[#b92516]" />
                  Active Jobs
                </span>
                <strong>{metrics.activeProjects}</strong>
              </Link>
              <Link href="/admin/leads" className="flex items-center justify-between rounded-md bg-[#f9f6f0] p-3">
                <span className="flex items-center gap-2">
                  <FileText className="size-4 text-[#b92516]" />
                  Open Leads
                </span>
                <strong>{metrics.openLeads}</strong>
              </Link>
              <Link href="/admin/time" className="flex items-center justify-between rounded-md bg-[#f9f6f0] p-3">
                <span className="flex items-center gap-2">
                  <Clock className="size-4 text-[#b92516]" />
                  Weekly Hours
                </span>
                <strong>{formatHours(metrics.weeklyHours)}</strong>
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
