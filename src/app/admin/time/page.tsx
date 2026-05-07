import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDateTime, formatHours, timeEntryHours } from "@/lib/admin/formatters";
import { getProject, getTimeEntries, getWorker, getWorkers } from "@/lib/admin/queries";

export default function TimePage() {
  const workers = getWorkers();
  const entries = getTimeEntries();

  return (
    <AdminShell title="Clock-In / Clock-Out" eyebrow="Labor Tracking Demo">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Workers</h2>
          <div className="space-y-3">
            {workers.map((worker) => (
              <div key={worker.id} className="rounded-md border border-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{worker.name}</p>
                    <p className="text-sm text-[#655c52]">{worker.role}</p>
                  </div>
                  <StatusBadge status={worker.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Time Entries</h2>
          <div className="space-y-3">
            {entries.map((entry) => {
              const worker = getWorker(entry.workerId);
              const project = getProject(entry.projectId);
              return (
                <div key={entry.id} className="rounded-md border border-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{worker?.name}</p>
                      <p className="text-sm text-[#655c52]">{project?.name}</p>
                    </div>
                    <StatusBadge status={entry.clockOut ? "completed" : "active"} />
                  </div>
                  <p className="mt-3 text-sm text-[#655c52]">
                    {formatDateTime(entry.clockIn)} ·{" "}
                    {formatHours(timeEntryHours(entry.clockIn, entry.clockOut))}
                  </p>
                  <p className="mt-1 text-sm text-[#655c52]">{entry.notes}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
