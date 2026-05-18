"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseProjectFileCreateFormData } from "@/lib/admin/project-files";
import { createProjectFile } from "@/lib/admin/queries";

function newProjectFileUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/files/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectFileAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/files/new`)}`);
  }

  const parsed = parseProjectFileCreateFormData(projectId, formData);

  if (!parsed.ok) {
    redirect(newProjectFileUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectFile(projectId, parsed.data);

  if (!result.ok) {
    redirect(newProjectFileUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Project file uploaded.")}`);
}
