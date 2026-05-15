"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createProjectSelection } from "@/lib/admin/queries";
import { parseSelectionCreateFormData } from "@/lib/admin/selections";

function newSelectionUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/selections/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectSelectionAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/selections/new`)}`);
  }

  const parsed = parseSelectionCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newSelectionUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectSelection(projectId, parsed.data);

  if (!result.ok) {
    redirect(newSelectionUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/selections");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Selection created.")}`);
}
