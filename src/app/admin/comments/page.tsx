import Link from "next/link";
import { MessageSquareText, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin/formatters";
import { getComments, getProjects } from "@/lib/admin/queries";

export default async function CommentsPage() {
  const [comments, projects] = await Promise.all([getComments(), getProjects()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const internalComments = comments.filter((comment) => comment.visibility === "internal");
  const clientVisibleComments = comments.filter((comment) => comment.visibility === "customer");

  return (
    <AdminShell title="Comments" eyebrow="Messaging">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Job Communication
              </p>
              <h2 className="mt-2 text-2xl font-bold">Recent Comments</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Track internal notes and client-visible comments across active jobs.
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
            <p className="text-sm font-semibold text-[#655c52]">Internal</p>
            <p className="mt-2 text-3xl font-bold">{internalComments.length}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Client-visible</p>
            <p className="mt-2 text-3xl font-bold">{clientVisibleComments.length}</p>
          </div>
        </aside>
      </div>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.55fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Comment</span>
          <span>Job</span>
          <span>Posted</span>
          <span>Visibility</span>
        </div>

        {comments.length > 0 ? (
          comments.map((comment) => {
            const project = projectsById.get(comment.projectId);

            return (
              <Link
                key={comment.id}
                href={`/admin/projects/${comment.projectId}`}
                className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[1.2fr_1fr_0.8fr_0.55fr]"
              >
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <MessageSquareText className="size-4 text-[#b92516]" />
                    {comment.authorName}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#655c52]">{comment.body}</p>
                </div>
                <div>
                  <p className="font-semibold">{project?.name ?? "Unknown job"}</p>
                  <p className="mt-1 text-sm text-[#655c52]">{project?.currentPhase}</p>
                </div>
                <p className="text-sm font-semibold">{formatDateTime(comment.createdAt)}</p>
                <StatusBadge status={comment.visibility} />
              </Link>
            );
          })
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No comments yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
