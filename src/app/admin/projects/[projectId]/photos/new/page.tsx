import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { projectPhotoCategoryOptions, projectPhotoVisibilityOptions } from "@/lib/admin/project-photos";
import { getClient, getProject } from "@/lib/admin/queries";
import { createProjectPhotoAction } from "./actions";

export default async function NewProjectPhotoPage({
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
  const action = createProjectPhotoAction.bind(null, project.id);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AdminShell title={`Photo for ${project.name}`} eyebrow="Project Gallery">
      <div className="mb-6">
        <Link
          href={`/admin/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Project
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
              <Camera className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Project Photo</h2>
              <p className="text-sm text-[#655c52]">
                {client?.name ?? "Client"} · {project.location} · {project.currentPhase}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.45fr_0.45fr_0.45fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Title
              <input
                name="title"
                placeholder="Kitchen rough-in progress"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Date
              <input
                name="photoDate"
                type="date"
                defaultValue={today}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Category
              <select
                name="category"
                defaultValue="progress"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              >
                {projectPhotoCategoryOptions.map((option) => (
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
                defaultValue="customer"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              >
                {projectPhotoVisibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Photo
            <input
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-2 w-full rounded-md border border-dashed border-black/20 bg-[#f9f6f0] px-3 py-8 text-sm outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[#151515] file:px-4 file:py-2 file:text-sm file:font-bold file:uppercase file:tracking-[0.12em] file:text-white focus:border-[#b92516]"
              required
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Caption
            <textarea
              name="caption"
              rows={4}
              placeholder="Short note for managers or clients."
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
            />
          </label>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Add Photo
        </button>
      </form>
    </AdminShell>
  );
}
