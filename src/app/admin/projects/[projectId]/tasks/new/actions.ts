"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createProjectTask } from "@/lib/admin/queries";
import { parseProjectTaskCreateFormData } from "@/lib/admin/tasks";

function newTaskUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/tasks/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectTaskAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/tasks/new`)}`);
  }

  const parsed = parseProjectTaskCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newTaskUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectTask(projectId, parsed.data);

  if (!result.ok) {
    redirect(newTaskUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Task created.")}`);
}
