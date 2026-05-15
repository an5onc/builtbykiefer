import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardPenLine } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { dailyLogVisibilityOptions } from "@/lib/admin/daily-logs";
import { getClient, getProject } from "@/lib/admin/queries";
import { createDailyLogAction } from "./actions";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewDailyLogPage({
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
  const action = createDailyLogAction.bind(null, project.id);

  return (
    <AdminShell title={`Field Report for ${project.name}`} eyebrow="Kiefer Built Operations">
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
              <ClipboardPenLine className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Kiefer Built Field Report</h2>
              <p className="text-sm text-[#655c52]">
                {client?.name ?? "Client"} · {project.location} · {project.currentPhase}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.45fr_0.7fr_0.7fr_0.35fr_0.45fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Report date
              <input
                name="reportDate"
                type="date"
                defaultValue={todayIsoDate()}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Superintendent
              <input
                name="superintendent"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Weather
              <input
                name="weather"
                placeholder="Clear, 68F"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Crew
              <input
                name="crewCount"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
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
                {dailyLogVisibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Work performed
            <textarea
              name="workPerformed"
              rows={5}
              className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              required
            />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold text-[#171717]">
              Deliveries
              <textarea
                name="deliveries"
                rows={4}
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              />
            </label>
            <label className="block text-sm font-semibold text-[#171717]">
              Inspections
              <textarea
                name="inspections"
                rows={4}
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              />
            </label>
            <label className="block text-sm font-semibold text-[#171717]">
              Delays
              <textarea
                name="delays"
                rows={4}
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              />
            </label>
            <label className="block text-sm font-semibold text-[#171717]">
              Safety notes
              <textarea
                name="safetyNotes"
                rows={4}
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Next steps
            <textarea
              name="nextSteps"
              rows={4}
              className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
            />
          </label>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Create Field Report
        </button>
      </form>
    </AdminShell>
  );
}
