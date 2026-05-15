"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { approveChangeOrder, approveProjectSelection } from "@/lib/admin/queries";
import { parseChangeOrderApprovalFormData } from "@/lib/admin/change-orders";
import { parseSelectionApprovalFormData } from "@/lib/admin/selections";

function portalProjectUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/portal/projects/${projectId}`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function approveSelectionAction(projectId: string, selectionId: string, formData: FormData) {
  const parsed = parseSelectionApprovalFormData(formData);

  if (!parsed.ok) {
    redirect(portalProjectUrl(projectId, { error: parsed.reason }));
  }

  const result = await approveProjectSelection(projectId, selectionId, parsed.data);

  if (!result.ok) {
    redirect(portalProjectUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/portal");
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath("/admin/selections");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(portalProjectUrl(projectId, { notice: "Selection approved." }));
}

export async function approveChangeOrderAction(projectId: string, changeOrderId: string, formData: FormData) {
  const parsed = parseChangeOrderApprovalFormData(formData);

  if (!parsed.ok) {
    redirect(portalProjectUrl(projectId, { error: parsed.reason }));
  }

  const result = await approveChangeOrder(projectId, changeOrderId, parsed.data);

  if (!result.ok) {
    redirect(portalProjectUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/portal");
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath("/admin/change-orders");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/change-orders/${changeOrderId}`);
  redirect(portalProjectUrl(projectId, { notice: "Change order approved." }));
}
