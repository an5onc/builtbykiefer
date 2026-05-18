"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseProjectCommentCreateFormData } from "@/lib/admin/project-comments";
import { createProjectComment } from "@/lib/admin/queries";

function newProjectCommentUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/comments/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectCommentAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/comments/new`)}`);
  }

  const parsed = parseProjectCommentCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newProjectCommentUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectComment(projectId, parsed.data);

  if (!result.ok) {
    redirect(newProjectCommentUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/comments");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Comment posted.")}`);
}
