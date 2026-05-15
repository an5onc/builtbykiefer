import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Camera,
  ClipboardCheck,
  ClipboardPenLine,
  FileText,
  MessageCircleQuestion,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { buildClientPortalView } from "@/lib/admin/client-portal";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/admin/formatters";
import {
  getClient,
  getProject,
  getProjectChangeOrders,
  getProjectComments,
  getProjectDailyLogs,
  getProjectFiles,
  getProjectInvoices,
  getProjectPhotoGallery,
  getProjectRfis,
  getProjectSelections,
  getProjectUpdates,
  getProjectVendorAssignmentsForProject,
  getProjectWarrantyItems,
  getVendors,
} from "@/lib/admin/queries";
import { approveChangeOrderAction, approveSelectionAction } from "./actions";

export default async function ClientProjectPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const { projectId } = await params;
  const { notice, error } = await searchParams;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const [
    client,
    files,
    updates,
    comments,
    selections,
    rfis,
    dailyLogs,
    invoices,
    changeOrders,
    warrantyItems,
    projectPhotos,
    vendors,
    vendorAssignments,
  ] =
    await Promise.all([
      getClient(project.clientId),
      getProjectFiles(project.id),
      getProjectUpdates(project.id),
      getProjectComments(project.id),
      getProjectSelections(project.id),
      getProjectRfis(project.id),
      getProjectDailyLogs(project.id),
      getProjectInvoices(project.id),
      getProjectChangeOrders(project.id),
      getProjectWarrantyItems(project.id),
      getProjectPhotoGallery(project.id),
      getVendors(),
      getProjectVendorAssignmentsForProject(project.id),
    ]);
  const view = buildClientPortalView({
    project,
    client,
    files,
    updates,
    comments,
    selections,
    rfis,
    dailyLogs,
    invoices,
    changeOrders,
    warrantyItems,
    projectPhotos,
    vendors,
    vendorAssignments,
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

      {notice || error ? (
        <section className="mx-auto max-w-6xl space-y-3 px-5 pt-8 lg:px-8">
          {notice ? (
            <p className="rounded-md border border-green-600/20 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </section>
      ) : null}

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
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <MessageSquareText className="size-5 text-[#b92516]" />
              Comments
            </h2>
            {view.comments.length > 0 ? (
              <div className="space-y-4">
                {view.comments.map((comment) => (
                  <article key={comment.id} className="rounded-md border border-black/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-semibold">{comment.authorName}</h3>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#655c52]">{comment.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No comments have been shared yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <ClipboardPenLine className="size-5 text-[#b92516]" />
              Kiefer Built Field Reports
            </h2>
            {view.dailyLogs.length > 0 ? (
              <div className="space-y-4">
                {view.dailyLogs.map((dailyLog) => (
                  <article key={dailyLog.id} className="rounded-md border border-black/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                          {formatDate(dailyLog.reportDate)} · {dailyLog.weather}
                        </p>
                        <h3 className="mt-1 font-semibold">Field Report</h3>
                      </div>
                      <p className="rounded-full bg-[#f4efe7] px-3 py-1 text-xs font-bold">
                        Crew: {dailyLog.crewCount}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#655c52]">{dailyLog.workPerformed}</p>
                    <div className="mt-3 grid gap-3 text-sm text-[#655c52] md:grid-cols-2">
                      <p className="rounded-md bg-[#f9f6f0] p-3">
                        <span className="font-semibold text-[#171717]">Deliveries: </span>
                        {dailyLog.deliveries || "None"}
                      </p>
                      <p className="rounded-md bg-[#f9f6f0] p-3">
                        <span className="font-semibold text-[#171717]">Inspections: </span>
                        {dailyLog.inspections || "None"}
                      </p>
                      <p className="rounded-md bg-[#f9f6f0] p-3">
                        <span className="font-semibold text-[#171717]">Delays: </span>
                        {dailyLog.delays || "None"}
                      </p>
                      <p className="rounded-md bg-[#f9f6f0] p-3">
                        <span className="font-semibold text-[#171717]">Next: </span>
                        {dailyLog.nextSteps || "Not posted"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No field reports have been shared yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <Camera className="size-5 text-[#b92516]" />
              Project Photos
            </h2>
            {view.projectPhotos.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {view.projectPhotos.map((photo) => (
                  <article key={photo.id} className="overflow-hidden rounded-md border border-black/10">
                    <div className="relative aspect-[4/3] bg-[#151515]">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                        {photo.category} · {formatDate(photo.photoDate)}
                      </p>
                      <h3 className="mt-1 font-semibold">{photo.title}</h3>
                      {photo.caption ? (
                        <p className="mt-2 text-sm leading-6 text-[#655c52]">{photo.caption}</p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No client-visible photos have been shared yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <ClipboardCheck className="size-5 text-[#b92516]" />
              Selections
            </h2>
            {view.selections.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {view.selections.map((selection) => {
                  const approvalAction = approveSelectionAction.bind(null, view.project.id, selection.id);

                  return (
                    <article key={selection.id} className="rounded-md border border-black/10 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                            {selection.category}
                          </p>
                          <h3 className="mt-1 font-semibold">{selection.title}</h3>
                        </div>
                        <StatusBadge status={selection.status} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#655c52]">
                        {selection.selectedOption || "Selection details pending"}
                      </p>
                      <p className="mt-2 text-sm text-[#655c52]">
                        {selection.vendor || "Vendor pending"} · Due {formatDate(selection.dueDate)}
                      </p>
                      {selection.clientNotes ? (
                        <p className="mt-3 rounded-md bg-[#f9f6f0] p-3 text-sm leading-6 text-[#655c52]">
                          {selection.clientNotes}
                        </p>
                      ) : null}
                      {selection.approvedAt ? (
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                          Approved by {selection.approvedByName || "client"} · {formatDateTime(selection.approvedAt)}
                        </p>
                      ) : null}
                      {selection.isActionable ? (
                        <form action={approvalAction} className="mt-4 rounded-md border border-[#b92516]/20 bg-[#fff7f4] p-3">
                          <label
                            htmlFor={`approvedByName-${selection.id}`}
                            className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]"
                          >
                            Approver name
                          </label>
                          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                            <input
                              id={`approvedByName-${selection.id}`}
                              name="approvedByName"
                              type="text"
                              required
                              placeholder={view.client?.name ?? "Your name"}
                              className="min-h-11 flex-1 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-[#b92516]"
                            />
                            <button
                              type="submit"
                              className="min-h-11 rounded-md bg-[#b92516] px-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#951e13]"
                            >
                              Approve
                            </button>
                          </div>
                        </form>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No selections have been shared yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <MessageCircleQuestion className="size-5 text-[#b92516]" />
              Shared RFIs
            </h2>
            {view.rfis.length > 0 ? (
              <div className="space-y-4">
                {view.rfis.map((rfi) => (
                  <article key={rfi.id} className="rounded-md border border-black/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-semibold">{rfi.title}</h3>
                      <StatusBadge status={rfi.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#655c52]">{rfi.question}</p>
                    {rfi.answer ? (
                      <p className="mt-3 rounded-md bg-[#f9f6f0] p-3 text-sm leading-6 text-[#655c52]">
                        {rfi.answer}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                      Due {formatDate(rfi.dueDate)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No RFIs have been shared yet.</p>
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
              {view.changeOrders.map((changeOrder) => {
                const approvalAction = approveChangeOrderAction.bind(null, view.project.id, changeOrder.id);

                return (
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
                    {changeOrder.approvedAt ? (
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        Approved by {changeOrder.approvedByName || "client"} · {formatDateTime(changeOrder.approvedAt)}
                      </p>
                    ) : null}
                    {changeOrder.isActionable ? (
                      <form action={approvalAction} className="mt-4 rounded-md border border-[#b92516]/20 bg-[#fff7f4] p-3">
                        <label
                          htmlFor={`changeOrderApprovedByName-${changeOrder.id}`}
                          className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]"
                        >
                          Approver name
                        </label>
                        <div className="mt-2 flex flex-col gap-2">
                          <input
                            id={`changeOrderApprovedByName-${changeOrder.id}`}
                            name="approvedByName"
                            type="text"
                            required
                            placeholder={view.client?.name ?? "Your name"}
                            className="min-h-11 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-[#b92516]"
                          />
                          <button
                            type="submit"
                            className="min-h-11 rounded-md bg-[#b92516] px-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#951e13]"
                          >
                            Approve Change Order
                          </button>
                        </div>
                      </form>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <ShieldCheck className="size-5 text-[#b92516]" />
              Warranty & Punch List
            </h2>
            {view.warrantyItems.length > 0 ? (
              <div className="space-y-3">
                {view.warrantyItems.map((item) => (
                  <div key={item.id} className="rounded-md border border-black/10 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                          {item.itemType === "punch-list" ? "Punch List" : "Warranty"} · {item.location || "Location pending"}
                        </p>
                        <p className="mt-1 font-semibold">{item.title}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#655c52]">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                      Requested by {item.requestedBy} · Due {formatDate(item.dueDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No warranty or punch-list items have been shared yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Users className="size-5 text-[#b92516]" />
              Trade Partners
            </h2>
            {view.vendorAssignments.length > 0 ? (
              <div className="space-y-3">
                {view.vendorAssignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-md border border-black/10 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                          {assignment.companyType} · {assignment.trade}
                        </p>
                        <p className="mt-1 font-semibold">{assignment.vendorName}</p>
                      </div>
                      <StatusBadge status={assignment.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#655c52]">{assignment.scope}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                      {formatDate(assignment.startDate)}
                      {assignment.endDate ? ` - ${formatDate(assignment.endDate)}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#655c52]">No trade partner assignments have been shared yet.</p>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}
