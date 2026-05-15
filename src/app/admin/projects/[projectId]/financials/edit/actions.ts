"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseProjectFinancialTargetFormData } from "@/lib/admin/project-financials";
import { upsertProjectFinancialTarget } from "@/lib/admin/queries";

function editFinancialTargetUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/financials/edit`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function updateProjectFinancialTargetAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/financials/edit`)}`);
  }

  const parsed = parseProjectFinancialTargetFormData(formData);

  if (!parsed.ok) {
    redirect(editFinancialTargetUrl(projectId, { error: parsed.reason }));
  }

  const result = await upsertProjectFinancialTarget(projectId, parsed.data);

  if (!result.ok) {
    redirect(editFinancialTargetUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Financial targets updated.")}`);
}
