"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseDailyLogCreateFormData } from "@/lib/admin/daily-logs";
import { createDailyLog } from "@/lib/admin/queries";

function newDailyLogUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/daily-logs/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createDailyLogAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/daily-logs/new`)}`);
  }

  const parsed = parseDailyLogCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newDailyLogUrl(projectId, { error: parsed.reason }));
  }

  const result = await createDailyLog(projectId, parsed.data);

  if (!result.ok) {
    redirect(newDailyLogUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/daily-logs");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Kiefer Built field report created.")}`);
}
