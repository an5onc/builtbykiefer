"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseChangeOrderCreateFormData } from "@/lib/admin/change-orders";
import { createChangeOrderForProject } from "@/lib/admin/queries";

function newChangeOrderUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/change-orders/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createChangeOrderAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/change-orders/new`)}`);
  }

  const parsed = parseChangeOrderCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newChangeOrderUrl(projectId, { error: parsed.reason }));
  }

  const result = await createChangeOrderForProject(projectId, parsed.data);

  if (!result.ok) {
    redirect(newChangeOrderUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/change-orders");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/change-orders/${result.changeOrderId}?notice=${encodeURIComponent("Change order created.")}`);
}
