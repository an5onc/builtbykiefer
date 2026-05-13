import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MessageSquareText, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ChangeOrderDownloadButton from "@/components/admin/ChangeOrderDownloadButton";
import InvoiceDownloadButton from "@/components/admin/InvoiceDownloadButton";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
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
  getClient,
  getProject,
  getProjectChangeOrders,
  getProjectFiles,
  getProjectInvoices,
  getProjectTimeEntries,
  getProjectUpdates,
  getWorkers,
} from "@/lib/admin/queries";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { projectId } = await params;
  const { notice } = await searchParams;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const [client, files, updates, timeEntries, invoices, changeOrders, workers] = await Promise.all([
    getClient(project.clientId),
    getProjectFiles(project.id),
    getProjectUpdates(project.id),
    getProjectTimeEntries(project.id),
    getProjectInvoices(project.id),
    getProjectChangeOrders(project.id),
    getWorkers(),
  ]);
  const workersById = new Map(workers.map((worker) => [worker.id, worker]));

  return (
    <AdminShell title={project.name} eyebrow={`${project.location} · ${project.type}`}>
      {notice ? (
        <p className="mb-4 rounded-md border border-green-600/20 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {notice}
        </p>
      ) : null}

      <div className="mb-6 flex justify-end">
        <Link
          href={`/portal/projects/${project.id}`}
          className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
        >
          <ExternalLink className="size-4" />
          View Client Portal
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="relative h-72">
            <Image
              src={project.heroImage}
              alt={project.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#655c52]">Client: {client?.name}</p>
                <h2 className="mt-1 text-xl font-bold">{project.currentPhase}</h2>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <ProjectProgress progress={project.progress} />
            <p className="mt-5 text-[#655c52]">{project.notes}</p>
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Invoices</h2>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="rounded-md border border-black/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-[#655c52]">
                      {formatCurrency(invoiceTotal(invoice.lineItems))}
                    </p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <InvoiceDownloadButton invoiceId={invoice.id} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Scope Control
            </p>
            <h2 className="mt-1 text-lg font-bold">Change Orders</h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/change-orders/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Change Order
          </Link>
        </div>

        {changeOrders.length > 0 ? (
          <div className="divide-y divide-black/10">
            {changeOrders.map((changeOrder) => (
              <div
                key={changeOrder.id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_0.6fr_0.5fr_0.6fr_0.75fr]"
              >
                <Link
                  href={`/admin/change-orders/${changeOrder.id}`}
                  className="font-semibold transition hover:text-[#b92516]"
                >
                  {changeOrder.title}
                  <span className="mt-1 block text-sm font-normal text-[#655c52]">
                    {changeOrder.changeOrderNumber}
                  </span>
                </Link>
                <p className="font-semibold">
                  {formatCurrency(changeOrderTotal(changeOrder.lineItems))}
                </p>
                <p className="text-sm text-[#655c52]">
                  {changeOrder.scheduleImpactDays} days
                </p>
                <StatusBadge status={changeOrder.status} />
                <ChangeOrderDownloadButton changeOrderId={changeOrder.id} />
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No change orders yet. Create one when scope, pricing, or schedule shifts.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Daily Logs
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <MessageSquareText className="size-5 text-[#b92516]" />
              Project Updates
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/updates/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Update
          </Link>
        </div>

        {updates.length > 0 ? (
          <div className="divide-y divide-black/10">
            {updates.map((update) => (
              <article key={update.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                      {formatDate(update.updateDate)}
                    </p>
                    <h3 className="mt-1 font-semibold">{update.title}</h3>
                  </div>
                  <StatusBadge status={update.visibility} />
                </div>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-[#655c52]">
                  {update.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No updates yet. Post field notes, schedule progress, or client-facing milestones.
          </p>
        )}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Timeline</h2>
          <div className="space-y-4">
            {project.phases.map((phase) => (
              <div key={phase.id} className="border-l-2 border-[#b92516] pl-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{phase.title}</p>
                  <StatusBadge status={phase.status} />
                </div>
                <p className="mt-1 text-sm text-[#655c52]">{phase.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#8a8176]">
                  {phase.dateLabel}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Files</h2>
            <Link
              href={`/admin/projects/${project.id}/files/new`}
              className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
            >
              <PlusCircle className="size-4" />
              Upload
            </Link>
          </div>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="rounded-md border border-black/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{file.name}</p>
                  <StatusBadge status={file.visibility} />
                </div>
                <p className="mt-1 text-sm text-[#655c52]">
                  {file.type} · {file.sizeLabel}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Time Logs</h2>
          <div className="space-y-3">
            {timeEntries.map((entry) => {
              const worker = workersById.get(entry.workerId);
              return (
                <div key={entry.id} className="rounded-md border border-black/10 p-3">
                  <p className="font-medium">{worker?.name}</p>
                  <p className="text-sm text-[#655c52]">
                    {formatDateTime(entry.clockIn)} ·{" "}
                    {formatHours(timeEntryHours(entry.clockIn, entry.clockOut))}
                  </p>
                  <p className="mt-1 text-sm text-[#655c52]">{entry.notes}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
