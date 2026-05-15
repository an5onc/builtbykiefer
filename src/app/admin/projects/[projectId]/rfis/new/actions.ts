"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createProjectRfi } from "@/lib/admin/queries";
import { parseRfiCreateFormData } from "@/lib/admin/rfis";

function newRfiUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/rfis/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectRfiAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/rfis/new`)}`);
  }

  const parsed = parseRfiCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newRfiUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectRfi(projectId, parsed.data);

  if (!result.ok) {
    redirect(newRfiUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/rfis");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("RFI created.")}`);
}
