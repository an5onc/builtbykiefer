import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3,
  Camera,
  ClipboardCheck,
  ClipboardPenLine,
  ClipboardList,
  ExternalLink,
  ListChecks,
  MessageCircleQuestion,
  MessageSquareText,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react";
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
  getProjectBills,
  getProjectChangeOrders,
  getProjectComments,
  getProjectDailyLogs,
  getProjectFiles,
  getProjectFinancialTarget,
  getProjectInvoices,
  getProjectPhotoGallery,
  getProjectPurchaseOrders,
  getProjectRfis,
  getProjectSelections,
  getProjectTasks,
  getProjectTimeEntries,
  getProjectUpdates,
  getProjectVendorAssignmentsForProject,
  getProjectWarrantyItems,
  getVendors,
  getWorkers,
} from "@/lib/admin/queries";
import { buildOperationsReports } from "@/lib/admin/reports";

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

  const [
    client,
    files,
    updates,
    comments,
    dailyLogs,
    tasks,
    selections,
    rfis,
    purchaseOrders,
    bills,
    timeEntries,
    invoices,
    changeOrders,
    warrantyItems,
    projectPhotos,
    vendors,
    vendorAssignments,
    financialTarget,
    workers,
  ] = await Promise.all([
    getClient(project.clientId),
    getProjectFiles(project.id),
    getProjectUpdates(project.id),
    getProjectComments(project.id),
    getProjectDailyLogs(project.id),
    getProjectTasks(project.id),
    getProjectSelections(project.id),
    getProjectRfis(project.id),
    getProjectPurchaseOrders(project.id),
    getProjectBills(project.id),
    getProjectTimeEntries(project.id),
    getProjectInvoices(project.id),
    getProjectChangeOrders(project.id),
    getProjectWarrantyItems(project.id),
    getProjectPhotoGallery(project.id),
    getVendors(),
    getProjectVendorAssignmentsForProject(project.id),
    getProjectFinancialTarget(project.id),
    getWorkers(),
  ]);
  const workersById = new Map(workers.map((worker) => [worker.id, worker]));
  const vendorsById = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  const projectReport = buildOperationsReports({
    projects: [project],
    tasks,
    rfis,
    selections,
    warrantyItems,
    purchaseOrders,
    bills,
    invoices,
    changeOrders,
    projectPhotos,
    vendors,
    vendorAssignments,
    financialTargets: financialTarget ? [financialTarget] : [],
  }).projectReports[0];

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

      <section className="mb-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Job Costing Budget
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <BarChart3 className="size-5 text-[#b92516]" />
              Margin Forecast
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/financials/edit`}
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
          >
            Edit Targets
          </Link>
        </div>
        <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-5">
          <ProjectFinancialTile label="Contract value" value={projectReport.contractValue} />
          <ProjectFinancialTile label="Budgeted cost" value={projectReport.budgetedCost} />
          <ProjectFinancialTile label="Committed cost" value={projectReport.committedCost} />
          <ProjectFinancialTile label="Projected margin" value={projectReport.projectedMargin} />
          <div className="border-b border-black/10 p-5">
            <p className="text-sm font-semibold text-[#655c52]">Margin status</p>
            <p className="mt-2 text-2xl font-bold">{projectReport.projectedMarginPercent.toFixed(1)}%</p>
            <div className="mt-2">
              <StatusBadge status={projectReport.marginStatus} />
            </div>
          </div>
        </div>
      </section>

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
                  {changeOrder.approvedAt ? (
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8176]">
                      Approved by {changeOrder.approvedByName || "client"} · {formatDateTime(changeOrder.approvedAt)}
                    </span>
                  ) : null}
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
              Files
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <Camera className="size-5 text-[#b92516]" />
              Project Photos
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/photos/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Photo
          </Link>
        </div>

        {projectPhotos.length > 0 ? (
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {projectPhotos.map((photo) => (
              <article key={photo.id} className="overflow-hidden rounded-md border border-black/10">
                <div className="relative h-44 bg-[#f9f6f0]">
                  <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                      {photo.category} · {formatDate(photo.photoDate)}
                    </p>
                    <StatusBadge status={photo.visibility} />
                  </div>
                  <h3 className="font-semibold">{photo.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#655c52]">
                    {photo.caption || "No caption added."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No project photos yet. Add jobsite progress, selection, issue, and closeout photos here.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Resource Coordination
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <Users className="size-5 text-[#b92516]" />
              Trade Partners
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/vendors/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            Assign Partner
          </Link>
        </div>

        {vendorAssignments.length > 0 ? (
          <div className="divide-y divide-black/10">
            {vendorAssignments.map((assignment) => {
              const vendor = vendorsById.get(assignment.vendorId);

              return (
                <article
                  key={assignment.id}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[0.9fr_1.2fr_0.65fr_0.55fr_0.55fr]"
                >
                  <div>
                    <p className="font-semibold">{vendor?.name ?? "Unknown partner"}</p>
                    <p className="mt-1 text-sm text-[#655c52]">
                      {vendor?.trade ?? "No trade"} · {vendor?.companyType ?? "partner"}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-[#655c52]">{assignment.scope}</p>
                  <p className="text-sm font-semibold">
                    {formatDate(assignment.startDate)}
                    {assignment.endDate ? ` - ${formatDate(assignment.endDate)}` : ""}
                  </p>
                  <StatusBadge status={assignment.visibility} />
                  <StatusBadge status={assignment.status} />
                </article>
              );
            })}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No subcontractors or vendors are assigned yet. Assign a trade partner when scope and timing are ready.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Closeout
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="size-5 text-[#b92516]" />
              Warranty & Punch List
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/warranty/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Item
          </Link>
        </div>

        {warrantyItems.length > 0 ? (
          <div className="divide-y divide-black/10">
            {warrantyItems.map((item) => (
              <article key={item.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                      {item.itemType === "punch-list" ? "Punch List" : "Warranty"} · {item.location || "No location"}
                    </p>
                    <p className="mt-1 font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-[#655c52]">
                      Requested by {item.requestedBy} · Due {formatDate(item.dueDate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={item.visibility} />
                    <StatusBadge status={item.priority} />
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-[#655c52]">{item.description}</p>
                {item.resolvedAt ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                    Resolved {formatDateTime(item.resolvedAt)}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No warranty or punch-list items yet. Add one during closeout or post-project follow-up.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Kiefer Built Operations
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <ClipboardPenLine className="size-5 text-[#b92516]" />
              Field Reports
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/daily-logs/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Field Report
          </Link>
        </div>

        {dailyLogs.length > 0 ? (
          <div className="divide-y divide-black/10">
            {dailyLogs.map((dailyLog) => (
              <article key={dailyLog.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                      {formatDate(dailyLog.reportDate)} · {dailyLog.weather}
                    </p>
                    <h3 className="mt-1 font-semibold">Kiefer Built Field Report</h3>
                    <p className="mt-1 text-sm text-[#655c52]">
                      {dailyLog.superintendent} · {dailyLog.crewCount} crew members
                    </p>
                  </div>
                  <StatusBadge status={dailyLog.visibility} />
                </div>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-[#655c52]">
                  {dailyLog.workPerformed}
                </p>
                <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
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
                    {dailyLog.nextSteps || "Not set"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No field reports yet. Create one to capture the official Kiefer Built jobsite record.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Project Management
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <ClipboardCheck className="size-5 text-[#b92516]" />
              Selections
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/selections/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Selection
          </Link>
        </div>

        {selections.length > 0 ? (
          <div className="divide-y divide-black/10">
            {selections.map((selection) => (
              <div
                key={selection.id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[0.65fr_1.1fr_0.7fr_0.5fr_0.5fr]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                    {selection.category}
                  </p>
                  <p className="mt-1 font-semibold">{selection.title}</p>
                </div>
                <p className="text-sm text-[#655c52]">
                  {selection.selectedOption || "No option selected"}
                  <span className="mt-1 block">{selection.vendor || "No vendor"}</span>
                  {selection.approvedAt ? (
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8176]">
                      Approved by {selection.approvedByName || "client"} · {formatDateTime(selection.approvedAt)}
                    </span>
                  ) : null}
                </p>
                <p className="font-semibold">{formatCurrency(selection.allowanceAmount)}</p>
                <p className="text-sm font-semibold">{formatDate(selection.dueDate)}</p>
                <StatusBadge status={selection.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No selections yet. Add one when a client decision or allowance needs tracking.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Messaging
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <MessageCircleQuestion className="size-5 text-[#b92516]" />
              RFIs
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/rfis/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New RFI
          </Link>
        </div>

        {rfis.length > 0 ? (
          <div className="divide-y divide-black/10">
            {rfis.map((rfi) => (
              <article key={rfi.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{rfi.title}</p>
                    <p className="mt-1 text-sm text-[#655c52]">
                      Requested by {rfi.requestedBy} · Due {formatDate(rfi.dueDate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={rfi.visibility} />
                    <StatusBadge status={rfi.status} />
                  </div>
                </div>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-[#655c52]">{rfi.question}</p>
                {rfi.answer ? (
                  <p className="mt-2 max-w-4xl rounded-md bg-[#f9f6f0] p-3 text-sm leading-6 text-[#655c52]">
                    {rfi.answer}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No RFIs yet. Create one when a field question needs a tracked answer.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Financial
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <ClipboardList className="size-5 text-[#b92516]" />
              Purchasing
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/projects/${project.id}/purchase-orders/new`}
              className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              <PlusCircle className="size-4" />
              New PO
            </Link>
            <Link
              href={`/admin/projects/${project.id}/bills/new`}
              className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
            >
              <ReceiptText className="size-4" />
              New Bill
            </Link>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-black/10 lg:border-b-0 lg:border-r">
            <div className="border-b border-black/10 px-5 py-3">
              <h3 className="font-bold">Purchase Orders</h3>
            </div>
            {purchaseOrders.length > 0 ? (
              <div className="divide-y divide-black/10">
                {purchaseOrders.map((purchaseOrder) => (
                  <div key={purchaseOrder.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{purchaseOrder.title}</p>
                        <p className="mt-1 text-sm text-[#655c52]">
                          {purchaseOrder.poNumber} · {purchaseOrder.vendor}
                        </p>
                      </div>
                      <StatusBadge status={purchaseOrder.status} />
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      {formatCurrency(purchaseOrder.amount)} · Due {formatDate(purchaseOrder.dueDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-5 py-5 text-sm text-[#655c52]">No purchase orders yet.</p>
            )}
          </div>

          <div>
            <div className="border-b border-black/10 px-5 py-3">
              <h3 className="font-bold">Bills</h3>
            </div>
            {bills.length > 0 ? (
              <div className="divide-y divide-black/10">
                {bills.map((bill) => (
                  <div key={bill.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{bill.billNumber}</p>
                        <p className="mt-1 text-sm text-[#655c52]">{bill.vendor}</p>
                      </div>
                      <StatusBadge status={bill.status} />
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      {formatCurrency(bill.amount)} · Due {formatDate(bill.dueDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-5 py-5 text-sm text-[#655c52]">No bills yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Messaging
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <MessageSquareText className="size-5 text-[#b92516]" />
              Comments
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/comments/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Comment
          </Link>
        </div>

        {comments.length > 0 ? (
          <div className="divide-y divide-black/10">
            {comments.map((comment) => (
              <article key={comment.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{comment.authorName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a8176]">
                      {formatDateTime(comment.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={comment.visibility} />
                </div>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-[#655c52]">
                  {comment.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No comments yet. Post an internal note or client-visible comment when discussion needs to stay with the job.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Project Management
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
              <ListChecks className="size-5 text-[#b92516]" />
              Tasks
            </h2>
          </div>
          <Link
            href={`/admin/projects/${project.id}/tasks/new`}
            className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
          >
            <PlusCircle className="size-4" />
            New Task
          </Link>
        </div>

        {tasks.length > 0 ? (
          <div className="divide-y divide-black/10">
            {tasks.map((task) => {
              const worker = task.assignedWorkerId ? workersById.get(task.assignedWorkerId) : null;

              return (
                <div
                  key={task.id}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_0.7fr_0.55fr_0.55fr_0.55fr]"
                >
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="mt-1 text-sm text-[#655c52]">{task.notes || "No notes"}</p>
                  </div>
                  <p className="text-sm text-[#655c52]">{worker?.name ?? "Unassigned"}</p>
                  <p className="text-sm font-semibold">{formatDate(task.dueDate)}</p>
                  <StatusBadge status={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">
            No tasks yet. Create one when a manager needs to assign or track work.
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

function ProjectFinancialTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-black/10 p-5 xl:border-r">
      <p className="text-sm font-semibold text-[#655c52]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{formatCurrency(value)}</p>
    </div>
  );
}
