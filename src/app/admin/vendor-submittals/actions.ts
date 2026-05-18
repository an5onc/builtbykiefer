"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { updateVendorSubmittalReview } from "@/lib/admin/queries";
import { parseVendorSubmittalReviewFormData } from "@/lib/admin/vendor-submittals";

function redirectToProject(projectId: string, key: "notice" | "error", message: string) {
  redirect(`/admin/projects/${projectId}?${key}=${encodeURIComponent(message)}`);
}

export async function updateVendorSubmittalReviewAction(formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent("/admin")}`);
  }

  const parsed = parseVendorSubmittalReviewFormData(formData);

  if (!parsed.ok) {
    redirect(`/admin?error=${encodeURIComponent(parsed.reason)}`);
  }

  const { submittalId, projectId, status, reviewComment } = parsed.data;
  const result = await updateVendorSubmittalReview(submittalId, { status, reviewComment });

  if (!result.ok) {
    redirectToProject(projectId, "error", result.reason);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/vendors");
  revalidatePath("/vendor");
  revalidatePath(`/admin/projects/${projectId}`);
  redirectToProject(projectId, "notice", "Vendor submittal review saved.");
}
