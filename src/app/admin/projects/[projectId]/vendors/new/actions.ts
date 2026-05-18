"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createProjectVendorAssignment } from "@/lib/admin/queries";
import { parseProjectVendorAssignmentCreateFormData } from "@/lib/admin/vendors";

function newProjectVendorAssignmentUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/vendors/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProjectVendorAssignmentAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/vendors/new`)}`);
  }

  const parsed = parseProjectVendorAssignmentCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newProjectVendorAssignmentUrl(projectId, { error: parsed.reason }));
  }

  const result = await createProjectVendorAssignment(projectId, parsed.data);

  if (!result.ok) {
    redirect(newProjectVendorAssignmentUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/vendors");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/portal");
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath("/vendor");
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Trade partner assigned.")}`);
}
