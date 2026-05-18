"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createPurchaseOrder } from "@/lib/admin/queries";
import { parsePurchaseOrderCreateFormData } from "@/lib/admin/purchasing";

function newPurchaseOrderUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/purchase-orders/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createPurchaseOrderAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/purchase-orders/new`)}`);
  }

  const parsed = parsePurchaseOrderCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newPurchaseOrderUrl(projectId, { error: parsed.reason }));
  }

  const result = await createPurchaseOrder(projectId, parsed.data);

  if (!result.ok) {
    redirect(newPurchaseOrderUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/purchase-orders");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Purchase order created.")}`);
}
