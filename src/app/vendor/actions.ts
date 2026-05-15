"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createVendorRfiResponse, createVendorSubmittal, getProjectVendorAssignments } from "@/lib/admin/queries";
import { getCurrentVendor } from "@/lib/admin/vendor-auth";
import { parseVendorRfiResponseFormData } from "@/lib/admin/vendor-rfi-responses";
import { parseVendorSubmittalFormData } from "@/lib/admin/vendor-submittals";
import { createClient } from "@/lib/supabase/server";

function vendorUrl(params: Record<string, string>) {
  const url = new URL("/vendor", "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}?${url.searchParams.toString()}`;
}

export async function createVendorRfiResponseAction(formData: FormData) {
  const vendorSession = await getCurrentVendor();

  if (!vendorSession) {
    redirect("/vendor/login?next=%2Fvendor");
  }

  const parsed = parseVendorRfiResponseFormData(formData);

  if (!parsed.ok) {
    redirect(vendorUrl({ error: parsed.reason }));
  }

  if (parsed.data.vendorId !== vendorSession.vendor.id) {
    redirect(vendorUrl({ error: "This RFI is not assigned to your vendor account." }));
  }

  const result = await createVendorRfiResponse(parsed.data);

  if (!result.ok) {
    redirect(vendorUrl({ error: result.reason }));
  }

  revalidatePath("/vendor");
  revalidatePath("/admin/rfis");
  revalidatePath(`/admin/projects/${parsed.data.projectId}`);
  redirect(vendorUrl({ notice: "RFI response submitted." }));
}

export async function signOutVendor() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/vendor/login?next=%2Fvendor");
}

export async function createVendorSubmittalAction(formData: FormData) {
  const vendorSession = await getCurrentVendor();

  if (!vendorSession) {
    redirect("/vendor/login?next=%2Fvendor");
  }

  const parsed = parseVendorSubmittalFormData({
    vendorId: vendorSession.vendor.id,
    formData,
  });

  if (!parsed.ok) {
    redirect(vendorUrl({ error: parsed.reason }));
  }

  const assignments = await getProjectVendorAssignments();
  const assignment = assignments.find(
    (item) =>
      item.id === parsed.data.assignmentId &&
      item.projectId === parsed.data.projectId &&
      item.vendorId === vendorSession.vendor.id &&
      item.visibility === "customer",
  );

  if (!assignment) {
    redirect(vendorUrl({ error: "This upload is not assigned to your vendor account." }));
  }

  const result = await createVendorSubmittal(parsed.data);

  if (!result.ok) {
    redirect(vendorUrl({ error: result.reason }));
  }

  revalidatePath("/vendor");
  revalidatePath("/admin/vendors");
  revalidatePath(`/admin/projects/${parsed.data.projectId}`);
  redirect(vendorUrl({ notice: "Vendor submittal uploaded." }));
}
