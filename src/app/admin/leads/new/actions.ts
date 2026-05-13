"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseLeadCreateFormData } from "@/lib/admin/leads";
import { createLead } from "@/lib/admin/queries";

function newLeadUrl(params: Record<string, string>) {
  const url = new URL("/admin/leads/new", "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createLeadAction(formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent("/admin/leads/new")}`);
  }

  let input;

  try {
    input = parseLeadCreateFormData(formData);
  } catch (error) {
    redirect(
      newLeadUrl({
        error: error instanceof Error ? error.message : "Could not create the lead.",
      }),
    );
  }

  const result = await createLead(input);

  if (!result.ok) {
    redirect(newLeadUrl({ error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${result.leadId}?notice=${encodeURIComponent("Lead created.")}`);
}
