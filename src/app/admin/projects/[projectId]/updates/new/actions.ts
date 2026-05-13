"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseProjectUpdateCreateFormData } from "@/lib/admin/project-updates";
import { createProjectUpdate } from "@/lib/admin/queries";

function newProjectUpdateUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/updates/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectUpdateAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/updates/new`)}`);
  }

  const parsed = parseProjectUpdateCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newProjectUpdateUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectUpdate(projectId, parsed.data);

  if (!result.ok) {
    redirect(newProjectUpdateUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Project update posted.")}`);
}
