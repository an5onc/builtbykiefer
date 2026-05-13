"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { parseProposalCreateFormData } from "@/lib/admin/proposals";
import { createProposalFromLead } from "@/lib/admin/queries";

function newProposalUrl(leadId: string, params: Record<string, string>) {
  const url = new URL(`/admin/leads/${leadId}/proposals/new`, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

export async function createProposalAction(leadId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(`/admin/leads/${leadId}/proposals/new`)}`);
  }

  const parsed = parseProposalCreateFormData(formData);

  if (!parsed.ok) {
    redirect(newProposalUrl(leadId, { error: parsed.reason }));
  }

  const result = await createProposalFromLead(leadId, parsed.data);

  if (!result.ok) {
    redirect(newProposalUrl(leadId, { error: result.reason }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/proposals");
  redirect(`/admin/proposals/${result.proposalId}?notice=${encodeURIComponent("Proposal created.")}`);
}
