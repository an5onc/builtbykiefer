import Link from "next/link";
import { MessageCircleQuestion, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/admin/formatters";
import { getProjects, getRfis, getVendorRfiResponses } from "@/lib/admin/queries";

export default async function RfisPage() {
  const [rfis, projects, responses] = await Promise.all([getRfis(), getProjects(), getVendorRfiResponses()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const responsesByRfiId = new Map<string, typeof responses>();

  for (const response of responses) {
    responsesByRfiId.set(response.rfiId, [...(responsesByRfiId.get(response.rfiId) ?? []), response]);
  }

  const openCount = rfis.filter((rfi) => rfi.status === "open").length;
  const clientVisibleCount = rfis.filter((rfi) => rfi.visibility === "customer").length;
  const vendorResponseCount = responses.length;

  return (
    <AdminShell title="RFIs" eyebrow="Messaging">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Field Questions
              </p>
              <h2 className="mt-2 text-2xl font-bold">RFI Log</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Keep questions, answers, visibility, and response deadlines tied to each job.
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
            <p className="text-sm font-semibold text-[#655c52]">Open RFIs</p>
            <p className="mt-2 text-3xl font-bold">{openCount}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Client-visible</p>
            <p className="mt-2 text-3xl font-bold">{clientVisibleCount}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Vendor responses</p>
            <p className="mt-2 text-3xl font-bold">{vendorResponseCount}</p>
          </div>
        </aside>
      </div>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_0.9fr_0.55fr_0.45fr_0.45fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>RFI</span>
          <span>Job</span>
          <span>Due</span>
          <span>Visibility</span>
          <span>Status</span>
        </div>

        {rfis.length > 0 ? (
          rfis.map((rfi) => {
            const project = projectsById.get(rfi.projectId);
            const rfiResponses = responsesByRfiId.get(rfi.id) ?? [];
            const latestResponse = rfiResponses[0];

            return (
              <Link
                key={rfi.id}
                href={`/admin/projects/${rfi.projectId}`}
                className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[1.2fr_0.9fr_0.55fr_0.45fr_0.45fr]"
              >
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <MessageCircleQuestion className="size-4 text-[#b92516]" />
                    {rfi.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#655c52]">{rfi.question}</p>
                  {latestResponse ? (
                    <div className="mt-3 rounded-md bg-[#f9f6f0] p-3 text-sm leading-6 text-[#655c52]">
                      <p className="font-semibold text-[#171717]">
                        Latest vendor response from {latestResponse.responderName}
                      </p>
                      <p className="mt-1">{latestResponse.responseBody}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8177]">
                        {formatDateTime(latestResponse.createdAt)}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold">{project?.name ?? "Unknown job"}</p>
                  <p className="mt-1 text-sm text-[#655c52]">Requested by {rfi.requestedBy}</p>
                </div>
                <p className="text-sm font-semibold">{formatDate(rfi.dueDate)}</p>
                <StatusBadge status={rfi.visibility} />
                <StatusBadge status={rfi.status} />
              </Link>
            );
          })
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No RFIs yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
