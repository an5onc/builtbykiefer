import Image from "next/image";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import InvoiceDownloadButton from "@/components/admin/InvoiceDownloadButton";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  formatCurrency,
  formatDateTime,
  formatHours,
  invoiceTotal,
  timeEntryHours,
} from "@/lib/admin/formatters";
import {
  getClient,
  getProject,
  getProjectFiles,
  getProjectInvoices,
  getProjectTimeEntries,
  getWorkers,
} from "@/lib/admin/queries";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const [client, files, timeEntries, invoices, workers] = await Promise.all([
    getClient(project.clientId),
    getProjectFiles(project.id),
    getProjectTimeEntries(project.id),
    getProjectInvoices(project.id),
    getWorkers(),
  ]);
  const workersById = new Map(workers.map((worker) => [worker.id, worker]));

  return (
    <AdminShell title={project.name} eyebrow={`${project.location} · ${project.type}`}>
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
          <h2 className="mb-4 text-lg font-bold">Files</h2>
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
