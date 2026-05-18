"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createBill } from "@/lib/admin/queries";
import { parseBillCreateFormData } from "@/lib/admin/purchasing";

function newBillUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/bills/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createBillAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/bills/new`)}`);
  }

  const parsed = parseBillCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newBillUrl(projectId, { error: parsed.reason }));
  }

  const result = await createBill(projectId, parsed.data);

  if (!result.ok) {
    redirect(newBillUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bills");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Bill created.")}`);
}
