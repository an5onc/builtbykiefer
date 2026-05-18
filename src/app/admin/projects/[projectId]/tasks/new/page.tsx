import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ListChecks } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getClient, getProject, getWorkers } from "@/lib/admin/queries";
import { taskPriorityOptions } from "@/lib/admin/tasks";
import { createProjectTaskAction } from "./actions";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewProjectTaskPage({
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

  const [client, workers] = await Promise.all([getClient(project.clientId), getWorkers()]);
  const action = createProjectTaskAction.bind(null, project.id);

  return (
    <AdminShell title={`Task for ${project.name}`} eyebrow="Project Management">
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
              <ListChecks className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Task Details</h2>
              <p className="text-sm text-[#655c52]">
                {client?.name ?? "Client"} · {project.location} · {project.currentPhase}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.55fr_0.55fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Title
              <input
                name="title"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
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
              Priority
              <select
                name="priority"
                defaultValue="normal"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              >
                {taskPriorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Assigned to
            <select
              name="assignedWorkerId"
              defaultValue=""
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
            >
              <option value="">Unassigned</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} · {worker.role}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Notes
            <textarea
              name="notes"
              rows={5}
              className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
            />
          </label>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Create Task
        </button>
      </form>
    </AdminShell>
  );
}
