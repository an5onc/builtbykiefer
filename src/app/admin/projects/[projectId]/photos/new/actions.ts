"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseProjectPhotoCreateFormData } from "@/lib/admin/project-photos";
import { createProjectPhoto } from "@/lib/admin/queries";

function newProjectPhotoUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/photos/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectPhotoAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/photos/new`)}`);
  }

  const parsed = parseProjectPhotoCreateFormData(projectId, formData);

  if (!parsed.ok) {
    redirect(newProjectPhotoUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectPhoto(projectId, parsed.data);

  if (!result.ok) {
    redirect(newProjectPhotoUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/photos");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/portal");
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Project photo added.")}`);
}
