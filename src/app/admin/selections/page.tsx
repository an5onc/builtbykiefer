import Link from "next/link";
import { ClipboardCheck, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/admin/formatters";
import { getProjects, getSelections } from "@/lib/admin/queries";

export default async function SelectionsPage() {
  const [selections, projects] = await Promise.all([getSelections(), getProjects()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const pendingCount = selections.filter((selection) => selection.status === "needed" || selection.status === "submitted").length;
  const approvedCount = selections.filter((selection) => selection.status === "approved" || selection.status === "ordered").length;

  return (
    <AdminShell title="Selections" eyebrow="Project Management">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Owner Decisions
              </p>
              <h2 className="mt-2 text-2xl font-bold">Selection Tracker</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Track allowances, vendors, due dates, and approved client-facing selections by job.
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
            <p className="text-sm font-semibold text-[#655c52]">Needs action</p>
            <p className="mt-2 text-3xl font-bold">{pendingCount}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Approved or ordered</p>
            <p className="mt-2 text-3xl font-bold">{approvedCount}</p>
          </div>
        </aside>
      </div>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_0.9fr_0.6fr_0.5fr_0.45fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Selection</span>
          <span>Job</span>
          <span>Vendor</span>
          <span>Due</span>
          <span>Status</span>
        </div>

        {selections.length > 0 ? (
          selections.map((selection) => {
            const project = projectsById.get(selection.projectId);

            return (
              <Link
                key={selection.id}
                href={`/admin/projects/${selection.projectId}`}
                className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[1.2fr_0.9fr_0.6fr_0.5fr_0.45fr]"
              >
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <ClipboardCheck className="size-4 text-[#b92516]" />
                    {selection.title}
                  </p>
                  <p className="mt-1 text-sm text-[#655c52]">
                    {selection.category} · {formatCurrency(selection.allowanceAmount)}
                  </p>
                  {selection.approvedAt ? (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8176]">
                      Approved by {selection.approvedByName || "client"} · {formatDateTime(selection.approvedAt)}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold">{project?.name ?? "Unknown job"}</p>
                  <p className="mt-1 text-sm text-[#655c52]">{project?.currentPhase}</p>
                </div>
                <p className="text-sm text-[#655c52]">{selection.vendor || "No vendor"}</p>
                <p className="text-sm font-semibold">{formatDate(selection.dueDate)}</p>
                <StatusBadge status={selection.status} />
              </Link>
            );
          })
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No selections yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
