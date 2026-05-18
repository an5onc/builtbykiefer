import Link from "next/link";
import { PlusCircle, ShieldCheck } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/formatters";
import { getProjects, getWarrantyItems } from "@/lib/admin/queries";

export default async function WarrantyPage() {
  const [warrantyItems, projects] = await Promise.all([getWarrantyItems(), getProjects()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const openCount = warrantyItems.filter((item) => item.status === "open" || item.status === "scheduled").length;
  const clientVisibleCount = warrantyItems.filter((item) => item.visibility === "customer").length;

  return (
    <AdminShell title="Warranty & Punch List" eyebrow="Closeout">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Closeout Control
              </p>
              <h2 className="mt-2 text-2xl font-bold">Warranty & Punch List Tracker</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Track closeout items, warranty follow-up, client visibility, due dates, and resolution status by job.
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

        <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Open items</p>
            <p className="mt-2 text-3xl font-bold">{openCount}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Client-visible</p>
            <p className="mt-2 text-3xl font-bold">{clientVisibleCount}</p>
          </div>
        </aside>
      </div>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1.1fr_0.9fr_0.5fr_0.5fr_0.45fr_0.45fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Item</span>
          <span>Job</span>
          <span>Due</span>
          <span>Priority</span>
          <span>Visibility</span>
          <span>Status</span>
        </div>

        {warrantyItems.length > 0 ? (
          warrantyItems.map((item) => {
            const project = projectsById.get(item.projectId);

            return (
              <Link
                key={item.id}
                href={`/admin/projects/${item.projectId}`}
                className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[1.1fr_0.9fr_0.5fr_0.5fr_0.45fr_0.45fr]"
              >
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="size-4 text-[#b92516]" />
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[#655c52]">
                    {item.itemType === "punch-list" ? "Punch List" : "Warranty"} · {item.location || "No location"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{project?.name ?? "Unknown job"}</p>
                  <p className="mt-1 text-sm text-[#655c52]">Requested by {item.requestedBy}</p>
                </div>
                <p className="text-sm font-semibold">{formatDate(item.dueDate)}</p>
                <StatusBadge status={item.priority} />
                <StatusBadge status={item.visibility} />
                <StatusBadge status={item.status} />
              </Link>
            );
          })
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No warranty or punch-list items yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
