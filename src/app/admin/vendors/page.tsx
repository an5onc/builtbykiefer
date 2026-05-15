import Link from "next/link";
import { PlusCircle, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/formatters";
import { getProjectVendorAssignments, getProjects, getVendors } from "@/lib/admin/queries";

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams;
  const [vendors, assignments, projects] = await Promise.all([
    getVendors(),
    getProjectVendorAssignments(),
    getProjects(),
  ]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const assignmentCountByVendorId = new Map<string, number>();

  for (const assignment of assignments) {
    assignmentCountByVendorId.set(
      assignment.vendorId,
      (assignmentCountByVendorId.get(assignment.vendorId) ?? 0) + 1,
    );
  }

  const activePortalCount = vendors.filter((vendor) => vendor.status === "active" && vendor.portalAccess).length;

  return (
    <AdminShell title="Trade Partners" eyebrow="Subcontractor & Vendor Portal">
      {notice ? (
        <p className="mb-4 rounded-md border border-green-600/20 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {notice}
        </p>
      ) : null}

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Resource Directory
              </p>
              <h2 className="mt-2 text-2xl font-bold">Subcontractors & Vendors</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Manage trade partners, portal access, project assignments, scope, and client-visible schedule commitments.
              </p>
            </div>
            <Link
              href="/admin/vendors/new"
              className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              <PlusCircle className="size-4" />
              New Partner
            </Link>
          </div>
        </section>

        <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Partners</p>
            <p className="mt-2 text-3xl font-bold">{vendors.length}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Portal-enabled</p>
            <p className="mt-2 text-3xl font-bold">{activePortalCount}</p>
          </div>
        </aside>
      </div>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_0.7fr_0.7fr_0.5fr_0.45fr_0.45fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Partner</span>
          <span>Trade</span>
          <span>Contact</span>
          <span>Assignments</span>
          <span>Portal</span>
          <span>Status</span>
        </div>

        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="grid gap-4 border-b border-black/10 px-4 py-4 last:border-0 md:grid-cols-[1fr_0.7fr_0.7fr_0.5fr_0.45fr_0.45fr]"
            >
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  <Users className="size-4 text-[#b92516]" />
                  {vendor.name}
                </p>
                <p className="mt-1 text-sm capitalize text-[#655c52]">{vendor.companyType}</p>
              </div>
              <p className="text-sm font-semibold">{vendor.trade}</p>
              <div className="text-sm text-[#655c52]">
                <p>{vendor.email}</p>
                <p>{vendor.phone || "No phone"}</p>
              </div>
              <p className="text-sm font-semibold">{assignmentCountByVendorId.get(vendor.id) ?? 0}</p>
              <StatusBadge status={vendor.portalAccess ? "active" : "inactive"} />
              <StatusBadge status={vendor.status} />
            </div>
          ))
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No trade partners yet.</p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 px-5 py-4">
          <h2 className="text-lg font-bold">Project Assignments</h2>
        </div>
        {assignments.length > 0 ? (
          <div className="divide-y divide-black/10">
            {assignments.map((assignment) => {
              const vendor = vendors.find((item) => item.id === assignment.vendorId);
              const project = projectsById.get(assignment.projectId);

              return (
                <Link
                  key={assignment.id}
                  href={`/admin/projects/${assignment.projectId}`}
                  className="grid gap-4 px-5 py-4 transition hover:bg-[#f9f6f0] md:grid-cols-[0.85fr_0.85fr_1.1fr_0.65fr_0.45fr]"
                >
                  <div>
                    <p className="font-semibold">{vendor?.name ?? "Unknown partner"}</p>
                    <p className="mt-1 text-sm text-[#655c52]">{vendor?.trade ?? "No trade"}</p>
                  </div>
                  <p className="font-semibold">{project?.name ?? "Unknown job"}</p>
                  <p className="text-sm leading-6 text-[#655c52]">{assignment.scope}</p>
                  <p className="text-sm font-semibold">
                    {formatDate(assignment.startDate)}
                    {assignment.endDate ? ` - ${formatDate(assignment.endDate)}` : ""}
                  </p>
                  <StatusBadge status={assignment.status} />
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No project assignments yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
