import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ClipboardList } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ChangeOrderDownloadButton from "@/components/admin/ChangeOrderDownloadButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { changeOrderTotal, formatCurrency, formatDate } from "@/lib/admin/formatters";
import { getChangeOrder, getClient, getProject } from "@/lib/admin/queries";

export default async function ChangeOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ changeOrderId: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { changeOrderId } = await params;
  const { notice } = await searchParams;
  const changeOrder = await getChangeOrder(changeOrderId);

  if (!changeOrder) {
    notFound();
  }

  const [project, client] = await Promise.all([
    getProject(changeOrder.projectId),
    getClient(changeOrder.clientId),
  ]);
  const total = changeOrderTotal(changeOrder.lineItems);

  return (
    <AdminShell title={changeOrder.title} eyebrow="Change Order Detail">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/change-orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Change Orders
        </Link>
        <ChangeOrderDownloadButton changeOrderId={changeOrder.id} />
      </div>

      {notice ? (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          {notice}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                {changeOrder.changeOrderNumber}
              </p>
              <h2 className="mt-2 text-3xl font-bold">{formatCurrency(total)}</h2>
            </div>
            <StatusBadge status={changeOrder.status} />
          </div>

          <div className="mt-6 space-y-4 text-sm text-[#655c52]">
            <p className="flex items-center gap-3">
              <ClipboardList className="size-4 text-[#b92516]" />
              <span>
                {project?.name ?? "Project"} · {client?.name ?? "Client"}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <CalendarDays className="size-4 text-[#b92516]" />
              <span>
                Schedule impact{" "}
                <span className="font-semibold text-[#171717]">
                  {changeOrder.scheduleImpactDays} days
                </span>
              </span>
            </p>
          </div>

          {changeOrder.approvedAt ? (
            <div className="mt-4 rounded-md border border-green-600/20 bg-green-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                Client Approved
              </p>
              <p className="mt-2 text-sm leading-6 text-green-800">
                {changeOrder.approvedByName || "Client"} approved this change order on{" "}
                {formatDate(changeOrder.approvedAt)}.
              </p>
            </div>
          ) : null}

          <div className="mt-6 rounded-md bg-[#f9f6f0] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Client Message
            </p>
            <p className="mt-2 text-sm leading-6 text-[#655c52]">{changeOrder.clientMessage}</p>
          </div>

          <div className="mt-4 rounded-md border border-black/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#655c52]">
              Reason
            </p>
            <p className="mt-2 text-sm leading-6 text-[#655c52]">{changeOrder.reason}</p>
          </div>

          {changeOrder.internalNotes ? (
            <div className="mt-4 rounded-md border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#655c52]">
                Internal Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-[#655c52]">{changeOrder.internalNotes}</p>
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="grid grid-cols-[1.6fr_0.45fr_0.7fr_0.7fr] gap-3 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Description</span>
            <span>Qty</span>
            <span>Unit</span>
            <span>Total</span>
          </div>
          {changeOrder.lineItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.6fr_0.45fr_0.7fr_0.7fr] gap-3 border-b border-black/10 px-4 py-4 text-sm last:border-0"
            >
              <p className="font-medium">{item.description}</p>
              <p>{item.quantity}</p>
              <p>{formatCurrency(item.unitPrice)}</p>
              <p className="font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</p>
            </div>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
