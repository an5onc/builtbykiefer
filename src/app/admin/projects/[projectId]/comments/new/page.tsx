import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { projectCommentVisibilityOptions } from "@/lib/admin/project-comments";
import { getClient, getProject } from "@/lib/admin/queries";
import { createProjectCommentAction } from "./actions";

export default async function NewProjectCommentPage({
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

  const [client, admin] = await Promise.all([getClient(project.clientId), getCurrentAdmin()]);
  const action = createProjectCommentAction.bind(null, project.id);

  return (
    <AdminShell title={`Comment for ${project.name}`} eyebrow="Messaging">
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
              <MessageSquareText className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Project Comment</h2>
              <p className="text-sm text-[#655c52]">
                {client?.name ?? "Client"} · {project.location} · {project.currentPhase}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.55fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Author
              <input
                name="authorName"
                defaultValue={admin?.fullName ?? admin?.email ?? ""}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Visibility
              <select
                name="visibility"
                defaultValue="internal"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              >
                {projectCommentVisibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Comment
            <textarea
              name="body"
              rows={8}
              className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              required
            />
          </label>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Post Comment
        </button>
      </form>
    </AdminShell>
  );
}
