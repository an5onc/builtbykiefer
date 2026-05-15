import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink, Users } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/formatters";
import { getProjectVendorAssignments, getProjects, getVendors } from "@/lib/admin/queries";

export default async function VendorPortalPage() {
  const [vendors, assignments, projects] = await Promise.all([
    getVendors(),
    getProjectVendorAssignments(),
    getProjects(),
  ]);
  const activePortalVendors = vendors.filter((vendor) => vendor.status === "active" && vendor.portalAccess);
  const vendorsById = new Map(activePortalVendors.map((vendor) => [vendor.id, vendor]));
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const portalAssignments = assignments.filter((assignment) => vendorsById.has(assignment.vendorId));

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#171717]">
      <header className="border-b border-black/10 bg-[#151515] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/images/kiefer-k-logo.png" alt="Kiefer Built" width={42} height={42} className="h-10 w-auto" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Kiefer Built Trade Portal
            </span>
          </Link>
          <Link
            href="/admin/vendors"
            className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white/50"
          >
            <ExternalLink className="size-4" />
            Admin Directory
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.34fr_0.34fr]">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Subcontractor & Vendor Access
            </p>
            <h1 className="mt-2 text-3xl font-bold">Trade Partner Workboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#655c52]">
              Portal-enabled partners can review assigned jobs, scope, current schedule windows, and job status without digging through manager emails.
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Active partners</p>
            <p className="mt-2 text-3xl font-bold">{activePortalVendors.length}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Assignments</p>
            <p className="mt-2 text-3xl font-bold">{portalAssignments.length}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {portalAssignments.length > 0 ? (
            portalAssignments.map((assignment) => {
              const vendor = vendorsById.get(assignment.vendorId);
              const project = projectsById.get(assignment.projectId);

              return (
                <article key={assignment.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
                        <Users className="size-4 text-[#b92516]" />
                        {vendor?.name}
                      </p>
                      <h2 className="mt-2 text-xl font-bold">{project?.name ?? "Assigned job"}</h2>
                      <p className="mt-1 text-sm text-[#655c52]">
                        {project?.location ?? "Location pending"} · {vendor?.trade ?? "Trade"}
                      </p>
                    </div>
                    <StatusBadge status={assignment.status} />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#655c52]">{assignment.scope}</p>

                  <div className="mt-4 grid gap-3 rounded-md bg-[#f9f6f0] p-4 text-sm sm:grid-cols-2">
                    <p>
                      <span className="flex items-center gap-2 font-semibold text-[#171717]">
                        <CalendarDays className="size-4 text-[#b92516]" />
                        Schedule
                      </span>
                      <span className="mt-1 block text-[#655c52]">
                        {formatDate(assignment.startDate)}
                        {assignment.endDate ? ` - ${formatDate(assignment.endDate)}` : ""}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-[#171717]">Current phase</span>
                      <span className="mt-1 block text-[#655c52]">{project?.currentPhase ?? "Phase pending"}</span>
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="rounded-lg border border-black/10 bg-white p-5 text-sm text-[#655c52] shadow-sm">
              No portal-enabled vendor assignments are available yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
