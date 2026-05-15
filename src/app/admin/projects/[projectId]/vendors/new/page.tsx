import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getProject, getVendors } from "@/lib/admin/queries";
import {
  projectVendorAssignmentStatusOptions,
  projectVendorAssignmentVisibilityOptions,
} from "@/lib/admin/vendors";
import { createProjectVendorAssignmentAction } from "./actions";

export default async function NewProjectVendorAssignmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { projectId } = await params;
  const { error } = await searchParams;
  const [project, vendors] = await Promise.all([getProject(projectId), getVendors()]);

  if (!project) {
    notFound();
  }

  const action = createProjectVendorAssignmentAction.bind(null, project.id);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AdminShell title={`Assign Partner to ${project.name}`} eyebrow="Subcontractor & Vendor Portal">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Project
        </Link>
        <Link
          href="/admin/vendors/new"
          className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
        >
          New Partner
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}

      {vendors.length > 0 ? (
        <form action={action} className="space-y-6">
          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-[#b92516]/10 text-[#b92516]">
                <Users className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold">Project Assignment</h2>
                <p className="text-sm text-[#655c52]">
                  Set scope, schedule, status, and whether the assignment appears in the client/vendor portals.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_0.45fr_0.45fr_0.45fr_0.45fr]">
              <label className="block text-sm font-semibold text-[#171717]">
                Partner
                <select
                  name="vendorId"
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                  required
                >
                  <option value="">Choose partner</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} · {vendor.trade}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#171717]">
                Start
                <input
                  name="startDate"
                  type="date"
                  defaultValue={today}
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-[#171717]">
                End
                <input
                  name="endDate"
                  type="date"
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                />
              </label>

              <label className="block text-sm font-semibold text-[#171717]">
                Status
                <select
                  name="status"
                  defaultValue="scheduled"
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                  required
                >
                  {projectVendorAssignmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#171717]">
                Visibility
                <select
                  name="visibility"
                  defaultValue="internal"
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                  required
                >
                  {projectVendorAssignmentVisibilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block text-sm font-semibold text-[#171717]">
              Scope
              <textarea
                name="scope"
                rows={5}
                placeholder="Cabinet install, hardware coordination, and final punch walk."
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
          </section>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
          >
            Assign Partner
          </button>
        </form>
      ) : (
        <section className="rounded-lg border border-black/10 bg-white p-5 text-sm text-[#655c52] shadow-sm">
          Create a trade partner before assigning one to this job.
        </section>
      )}
    </AdminShell>
  );
}
