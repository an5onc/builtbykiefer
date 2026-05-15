"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { taskStatusOptions } from "@/lib/admin/tasks";
import { updateProjectTaskStatus } from "@/lib/admin/queries";
import type { ProjectTaskStatus } from "@/lib/admin/types";

const taskStatusValues = new Set<ProjectTaskStatus>(
  taskStatusOptions.map((option) => option.value),
);

function tasksUrl(params: Record<string, string>) {
  const url = new URL("/admin/tasks", "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function updateTaskStatusAction(formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent("/admin/tasks")}`);
  }

  const taskId = String(formData.get("taskId") ?? "").trim();
  const projectId = String(formData.get("projectId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!taskId || !taskStatusValues.has(status as ProjectTaskStatus)) {
    redirect(tasksUrl({ error: "Choose a valid task status." }));
  }

  const result = await updateProjectTaskStatus(taskId, status as ProjectTaskStatus);

  if (!result.ok) {
    redirect(tasksUrl({ error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/tasks");

  if (projectId) {
    revalidatePath(`/admin/projects/${projectId}`);
  }

  redirect(tasksUrl({ notice: "Task status updated." }));
}
