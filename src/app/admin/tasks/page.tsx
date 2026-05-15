import Link from "next/link";
import { ListChecks, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/formatters";
import { getProjects, getTasks, getWorkers } from "@/lib/admin/queries";
import { taskStatusOptions } from "@/lib/admin/tasks";
import { updateTaskStatusAction } from "./actions";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;
  const [tasks, projects, workers] = await Promise.all([getTasks(), getProjects(), getWorkers()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const workersById = new Map(workers.map((worker) => [worker.id, worker]));
  const openTasks = tasks.filter((task) => task.status !== "done");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <AdminShell title="Tasks" eyebrow="Project Management">
      {notice ? (
        <p className="mb-4 rounded-md border border-green-600/20 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {notice}
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Open Work
              </p>
              <h2 className="mt-1 text-lg font-bold">Action Items</h2>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              <PlusCircle className="size-4" />
              Pick Job
            </Link>
          </div>

          {openTasks.length > 0 ? (
            <div className="divide-y divide-black/10">
              {openTasks.map((task) => {
                const project = projectsById.get(task.projectId);
                const worker = task.assignedWorkerId ? workersById.get(task.assignedWorkerId) : null;

                return (
                  <div
                    key={task.id}
                    className="grid gap-4 px-5 py-4 lg:grid-cols-[1.35fr_0.85fr_0.55fr_0.75fr_0.9fr]"
                  >
                    <Link
                      href={`/admin/projects/${task.projectId}`}
                      className="font-semibold transition hover:text-[#b92516]"
                    >
                      <span className="flex items-center gap-2">
                        <ListChecks className="size-4 text-[#b92516]" />
                        {task.title}
                      </span>
                      <span className="mt-1 block text-sm font-normal text-[#655c52]">
                        {project?.name}
                      </span>
                    </Link>
                    <p className="text-sm text-[#655c52]">
                      {worker?.name ?? "Unassigned"}
                      <span className="mt-1 block">{task.notes || "No notes"}</span>
                    </p>
                    <p className="font-semibold">{formatDate(task.dueDate)}</p>
                    <StatusBadge status={task.priority} />
                    <form action={updateTaskStatusAction} className="flex gap-2">
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="projectId" value={task.projectId} />
                      <select
                        name="status"
                        defaultValue={task.status}
                        className="min-w-0 flex-1 rounded-md border border-black/10 bg-[#f9f6f0] px-2 py-2 text-sm outline-none transition focus:border-[#b92516]"
                      >
                        {taskStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-[#151515] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="px-5 py-5 text-sm text-[#655c52]">No open tasks.</p>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Task Totals</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-md bg-[#f9f6f0] p-4">
                <p className="text-3xl font-bold">{openTasks.length}</p>
                <p className="text-sm text-[#655c52]">Open tasks</p>
              </div>
              <div className="rounded-md bg-[#f9f6f0] p-4">
                <p className="text-3xl font-bold">{doneTasks.length}</p>
                <p className="text-sm text-[#655c52]">Completed tasks</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Recently Completed</h2>
            <div className="space-y-3">
              {doneTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="rounded-md border border-black/10 p-3">
                  <p className="font-semibold">{task.title}</p>
                  <p className="mt-1 text-sm text-[#655c52]">
                    {projectsById.get(task.projectId)?.name}
                  </p>
                </div>
              ))}
              {doneTasks.length === 0 ? (
                <p className="text-sm text-[#655c52]">No completed tasks yet.</p>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
