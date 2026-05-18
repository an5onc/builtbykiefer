import Link from "next/link";
import { ClipboardPenLine, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/formatters";
import { getDailyLogs, getProjects } from "@/lib/admin/queries";

export default async function DailyLogsPage() {
  const [dailyLogs, projects] = await Promise.all([getDailyLogs(), getProjects()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const clientVisibleCount = dailyLogs.filter((dailyLog) => dailyLog.visibility === "customer").length;
  const latestReport = dailyLogs[0];

  return (
    <AdminShell title="Daily Logs" eyebrow="Kiefer Built Operations">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Field Reports
              </p>
              <h2 className="mt-2 text-2xl font-bold">Kiefer Built Jobsite Record</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Capture daily work performed, manpower, weather, deliveries, inspections, delays, and next steps in one branded field report.
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
            <p className="text-sm font-semibold text-[#655c52]">Reports</p>
            <p className="mt-2 text-3xl font-bold">{dailyLogs.length}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Client-visible</p>
            <p className="mt-2 text-3xl font-bold">{clientVisibleCount}</p>
          </div>
        </aside>
      </div>

      {latestReport ? (
        <section className="mb-6 rounded-lg border border-[#b92516]/20 bg-[#b92516]/5 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
            Latest Field Report
          </p>
          <h2 className="mt-2 text-xl font-bold">
            {projectsById.get(latestReport.projectId)?.name ?? "Unknown job"} · {formatDate(latestReport.reportDate)}
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[#655c52]">
            {latestReport.workPerformed}
          </p>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[0.65fr_0.9fr_0.75fr_0.45fr_0.45fr_0.45fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Date</span>
          <span>Job</span>
          <span>Superintendent</span>
          <span>Crew</span>
          <span>Visibility</span>
          <span>Open</span>
        </div>

        {dailyLogs.length > 0 ? (
          dailyLogs.map((dailyLog) => {
            const project = projectsById.get(dailyLog.projectId);

            return (
              <Link
                key={dailyLog.id}
                href={`/admin/projects/${dailyLog.projectId}`}
                className="grid gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0 md:grid-cols-[0.65fr_0.9fr_0.75fr_0.45fr_0.45fr_0.45fr]"
              >
                <p className="flex items-center gap-2 font-semibold">
                  <ClipboardPenLine className="size-4 text-[#b92516]" />
                  {formatDate(dailyLog.reportDate)}
                </p>
                <div>
                  <p className="font-semibold">{project?.name ?? "Unknown job"}</p>
                  <p className="mt-1 text-sm text-[#655c52]">{dailyLog.weather}</p>
                </div>
                <p className="text-sm text-[#655c52]">{dailyLog.superintendent}</p>
                <p className="font-semibold">{dailyLog.crewCount}</p>
                <StatusBadge status={dailyLog.visibility} />
                <span className="text-sm font-semibold text-[#b92516]">Job</span>
              </Link>
            );
          })
        ) : (
          <p className="px-5 py-5 text-sm text-[#655c52]">No daily logs yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
