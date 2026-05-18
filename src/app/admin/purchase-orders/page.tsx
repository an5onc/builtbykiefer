import Link from "next/link";
import { ClipboardList, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import { getProjects, getPurchaseOrders } from "@/lib/admin/queries";

export default async function PurchaseOrdersPage() {
  const [purchaseOrders, projects] = await Promise.all([getPurchaseOrders(), getProjects()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const openTotal = purchaseOrders
    .filter((purchaseOrder) => purchaseOrder.status !== "received")
    .reduce((sum, purchaseOrder) => sum + purchaseOrder.amount, 0);

  return (
    <AdminShell title="Purchase Orders" eyebrow="Financial">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Commitments
              </p>
              <h2 className="mt-2 text-2xl font-bold">Purchase Order Log</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Track vendor commitments before they become received material or bills.
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              <PlusCircle className="size-4" />
              Pick Job
            </Link>
          </div>
        </section>

        <aside className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-[#655c52]">Open commitment</p>
          <p className="mt-2 text-3xl font-bold">{formatCurrency(openTotal)}</p>
        </aside>
      </div>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[0.75fr_1fr_0.85fr_0.55fr_0.45fr_0.45fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>PO</span>
          <span>Title</span>
          <span>Job</span>
          <span>Amount</span>
          <span>Due</span>
          <span>Status</span>
        </div>

        {purchaseOrders.length > 0 ? (
          purchaseOrders.map((purchaseOrder) => {
            const project = projectsById.get(purchaseOrder.projectId);

            return (
              <Link
                key={purchaseOrder.id}
                href={`/admin/projects/${purchaseOrder.projectId}`}
                className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[0.75fr_1fr_0.85fr_0.55fr_0.45fr_0.45fr]"
              >
                <p className="flex items-center gap-2 font-semibold">
                  <ClipboardList className="size-4 text-[#b92516]" />
                  {purchaseOrder.poNumber}
                </p>
                <div>
                  <p className="font-semibold">{purchaseOrder.title}</p>
                  <p className="mt-1 text-sm text-[#655c52]">{purchaseOrder.vendor}</p>
                </div>
                <p className="font-semibold">{project?.name ?? "Unknown job"}</p>
                <p className="font-semibold">{formatCurrency(purchaseOrder.amount)}</p>
                <p className="text-sm font-semibold">{formatDate(purchaseOrder.dueDate)}</p>
                <StatusBadge status={purchaseOrder.status} />
              </Link>
            );
          })
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No purchase orders yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
