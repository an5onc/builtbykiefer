import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, FileText, MessageSquareText, ReceiptText, Wrench } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { buildClientPortalView } from "@/lib/admin/client-portal";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import {
  getClient,
  getProject,
  getProjectChangeOrders,
  getProjectFiles,
  getProjectInvoices,
  getProjectUpdates,
} from "@/lib/admin/queries";

export default async function ClientProjectPortalPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const [client, files, updates, invoices, changeOrders] = await Promise.all([
    getClient(project.clientId),
    getProjectFiles(project.id),
    getProjectUpdates(project.id),
    getProjectInvoices(project.id),
    getProjectChangeOrders(project.id),
  ]);
  const view = buildClientPortalView({
    project,
    client,
    files,
    updates,
    invoices,
    changeOrders,
  });

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#171717]">
      <section className="relative min-h-[470px] overflow-hidden bg-[#151515] text-white">
        <Image
          src={view.project.heroImage}
          alt={view.project.name}
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/50 to-transparent" />
        <div className="relative mx-auto flex min-h-[470px] max-w-6xl flex-col justify-end px-5 py-10 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6a57]">
            Kiefer Built Client Portal
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
                {view.project.name}
              </h1>
              <p className="mt-4 text-lg text-white/76">
                {view.project.location} · {view.project.type}
              </p>
            </div>
            <StatusBadge status={view.project.status} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                  Current Phase
                </p>
                <h2 className="mt-1 text-2xl font-bold">{view.project.currentPhase}</h2>
              </div>
              <p className="text-3xl font-bold">{view.project.progress}%</p>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[#b92516]"
                style={{ width: `${view.project.progress}%` }}
              />
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <MessageSquareText className="size-5 text-[#b92516]" />
              Latest Updates
            </h2>
            {view.updates.length > 0 ? (
              <div className="space-y-4">
                {view.updates.map((update) => (
                  <article key={update.id} className="rounded-md border border-black/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-semibold">{update.title}</h3>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                        {formatDate(update.updateDate)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#655c52]">{update.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No updates have been posted yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Timeline</h2>
            <div className="space-y-5">
              {view.project.phases.map((phase) => (
                <div key={phase.id} className="border-l-2 border-[#b92516] pl-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">{phase.title}</p>
                    <StatusBadge status={phase.status} />
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#655c52]">{phase.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#8a8176]">
                    {phase.dateLabel}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Shared Files</h2>
            {view.files.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {view.files.map((file) => (
                  <div key={file.id} className="rounded-md border border-black/10 p-4">
                    <div className="flex items-start gap-3">
                      <span className="rounded-md bg-[#b92516]/10 p-2 text-[#b92516]">
                        <FileText className="size-4" />
                      </span>
                      <div>
                        <p className="font-semibold">{file.name}</p>
                        <p className="mt-1 text-sm text-[#655c52]">
                          {file.type} · {file.sizeLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No shared files have been posted yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Client
            </p>
            <h2 className="mt-2 text-xl font-bold">{view.client?.name ?? "Client"}</h2>
            {view.client ? (
              <p className="mt-2 text-sm leading-6 text-[#655c52]">
                {view.client.email}
                <br />
                {view.client.phone}
              </p>
            ) : null}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <ReceiptText className="size-5 text-[#b92516]" />
              Invoices
            </h2>
            <div className="space-y-3">
              {view.invoices.map((invoice) => (
                <div key={invoice.id} className="rounded-md border border-black/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <p className="mt-2 text-sm text-[#655c52]">
                    Due {formatDate(invoice.dueDate)}
                  </p>
                  <p className="mt-1 font-semibold">{formatCurrency(invoice.total)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Wrench className="size-5 text-[#b92516]" />
              Change Orders
            </h2>
            <div className="space-y-3">
              {view.changeOrders.map((changeOrder) => (
                <div key={changeOrder.id} className="rounded-md border border-black/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{changeOrder.title}</p>
                    <StatusBadge status={changeOrder.status} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#655c52]">
                    {changeOrder.clientMessage}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-[#655c52]">
                    <CalendarDays className="size-4 text-[#b92516]" />
                    {changeOrder.scheduleImpactDays} day schedule impact
                  </p>
                  <p className="mt-1 font-semibold">{formatCurrency(changeOrder.total)}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
