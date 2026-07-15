"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseLandLeadNotesFormData } from "@/lib/land-leads/filters";
import { updateLandLeadNotes } from "@/lib/land-leads/queries";

function detailUrl(leadId: string, params: Record<string, string>) {
  const url = new URL(`/admin/land-leads/${encodeURIComponent(leadId)}`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function saveLandLeadNotes(leadId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/land-leads/${leadId}`)}`);
  }

  let input;

  try {
    input = parseLandLeadNotesFormData(formData);
  } catch (error) {
    redirect(
      detailUrl(leadId, {
        error: error instanceof Error ? error.message : "Could not update the lead.",
      }),
    );
  }

  const result = await updateLandLeadNotes(leadId, input);

  if (!result.ok) {
    redirect(detailUrl(leadId, { error: result.reason }));
  }

  revalidatePath("/admin/land-leads");
  revalidatePath(`/admin/land-leads/${leadId}`);
  redirect(detailUrl(leadId, { notice: "Lead updated." }));
}
