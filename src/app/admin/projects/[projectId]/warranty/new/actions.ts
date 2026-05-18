"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createWarrantyItem } from "@/lib/admin/queries";
import { parseWarrantyItemCreateFormData } from "@/lib/admin/warranty";

function newWarrantyItemUrl(projectId: string, params: Record<string, string>) {
  const url = new URL(`/admin/projects/${projectId}/warranty/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createWarrantyItemAction(projectId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/projects/${projectId}/warranty/new`)}`);
  }

  const parsed = parseWarrantyItemCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newWarrantyItemUrl(projectId, { error: parsed.reason }));
  }

  const result = await createWarrantyItem(projectId, parsed.data);

  if (!result.ok) {
    redirect(newWarrantyItemUrl(projectId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/warranty");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/portal");
  revalidatePath(`/portal/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?notice=${encodeURIComponent("Warranty or punch-list item created.")}`);
}
