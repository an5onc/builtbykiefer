import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getClient, getProject } from "@/lib/admin/queries";
import { selectionStatusOptions } from "@/lib/admin/selections";
import { createProjectSelectionAction } from "./actions";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewProjectSelectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { projectId } = await params;
  const { error } = await searchParams;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const client = await getClient(project.clientId);
  const action = createProjectSelectionAction.bind(null, project.id);

  return (
    <AdminShell title={`Selection for ${project.name}`} eyebrow="Project Management">
      <div className="mb-6">
        <Link
          href={`/admin/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Job
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}

      <form action={action} className="space-y-6">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-[#b92516]/10 text-[#b92516]">
              <ClipboardCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Selection Details</h2>
              <p className="text-sm text-[#655c52]">
                {client?.name ?? "Client"} · {project.location} · {project.currentPhase}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.7fr_1.2fr_0.6fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Category
              <input
                name="category"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Title
              <input
                name="title"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Allowance
              <input
                name="allowanceAmount"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.8fr_0.5fr_0.5fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Selected option
              <input
                name="selectedOption"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Vendor
              <input
                name="vendor"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Due date
              <input
                name="dueDate"
                type="date"
                defaultValue={todayIsoDate()}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Status
              <select
                name="status"
                defaultValue="needed"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              >
                {selectionStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold text-[#171717]">
              Internal notes
              <textarea
                name="internalNotes"
                rows={5}
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              />
            </label>
            <label className="block text-sm font-semibold text-[#171717]">
              Client notes
              <textarea
                name="clientNotes"
                rows={5}
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Create Selection
        </button>
      </form>
    </AdminShell>
  );
}
