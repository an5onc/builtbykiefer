import Link from "next/link";
import { ClipboardList } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ChangeOrderDownloadButton from "@/components/admin/ChangeOrderDownloadButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { changeOrderTotal, formatCurrency } from "@/lib/admin/formatters";
import { getChangeOrders, getClients, getProjects } from "@/lib/admin/queries";

export default async function ChangeOrdersPage() {
  const [changeOrders, projects, clients] = await Promise.all([
    getChangeOrders(),
    getProjects(),
    getClients(),
  ]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const clientsById = new Map(clients.map((client) => [client.id, client]));

  return (
    <AdminShell title="Change Orders" eyebrow="Scope + Approval Control">
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="min-w-[1020px]">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.55fr_0.7fr_0.75fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Change Order</span>
            <span>Project</span>
            <span>Total</span>
            <span>Days</span>
            <span>Status</span>
            <span>PDF</span>
          </div>
          {changeOrders.map((changeOrder) => {
            const project = projectsById.get(changeOrder.projectId);
            const client = clientsById.get(changeOrder.clientId);

            return (
              <div
                key={changeOrder.id}
                className="grid grid-cols-[1.2fr_1fr_0.8fr_0.55fr_0.7fr_0.75fr] gap-4 border-b border-black/10 px-4 py-4 last:border-0"
              >
                <Link href={`/admin/change-orders/${changeOrder.id}`} className="transition hover:text-[#b92516]">
                  <p className="flex items-center gap-2 font-semibold">
                    <ClipboardList className="size-4 text-[#b92516]" />
                    {changeOrder.title}
                  </p>
                  <p className="mt-1 text-sm text-[#655c52]">{changeOrder.changeOrderNumber}</p>
                </Link>
                <div>
                  <p className="font-medium">{project?.name}</p>
                  <p className="text-sm text-[#655c52]">{client?.name}</p>
                </div>
                <p className="font-semibold">{formatCurrency(changeOrderTotal(changeOrder.lineItems))}</p>
                <p>{changeOrder.scheduleImpactDays}</p>
                <StatusBadge status={changeOrder.status} />
                <ChangeOrderDownloadButton changeOrderId={changeOrder.id} />
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
