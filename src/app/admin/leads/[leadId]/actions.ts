"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseLeadUpdateFormData } from "@/lib/admin/leads";
import { updateLead } from "@/lib/admin/queries";

function leadDetailUrl(leadId: string, params: Record<string, string>) {
  const url = new URL(`/admin/leads/${encodeURIComponent(leadId)}`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function saveLeadFollowUp(leadId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/leads/${leadId}`)}`);
  }

  let input;

  try {
    input = parseLeadUpdateFormData(formData);
  } catch (error) {
    redirect(
      leadDetailUrl(leadId, {
        error: error instanceof Error ? error.message : "Could not update the lead.",
      }),
    );
  }

  const result = await updateLead(leadId, input);

  if (!result.ok) {
    redirect(leadDetailUrl(leadId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  redirect(leadDetailUrl(leadId, { notice: "Lead follow-up updated." }));
}
