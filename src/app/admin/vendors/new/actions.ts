"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createVendor } from "@/lib/admin/queries";
import { parseVendorCreateFormData } from "@/lib/admin/vendors";

function newVendorUrl(params: Record<string, string>) {
  const url = new URL("/admin/vendors/new", "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createVendorAction(formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent("/admin/vendors/new")}`);
  }

  const parsed = parseVendorCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newVendorUrl({ error: parsed.reason }));
  }

  const result = await createVendor(parsed.data);

  if (!result.ok) {
    redirect(newVendorUrl({ error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/vendors");
  revalidatePath("/vendor");
  redirect(`/admin/vendors?notice=${encodeURIComponent("Trade partner created.")}`);
}
