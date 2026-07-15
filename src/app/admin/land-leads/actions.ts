"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import {
  countyOptions,
  LAND_LEAD_MAX_UPLOAD_BYTES,
  LAND_LEAD_MAX_UPLOAD_LABEL,
} from "@/lib/land-leads/constants";
import { parseCountyCsv } from "@/lib/land-leads/csv";
import { parseLandLeadStatusFormData } from "@/lib/land-leads/filters";
import {
  getExistingLeadHashes,
  touchUnchangedLeads,
  updateLandLeadStatus,
  upsertLandLeads,
} from "@/lib/land-leads/queries";
import { buildLeadRows, diffAgainstExisting } from "@/lib/land-leads/refresh";
import type { LandLeadCounty } from "@/lib/land-leads/types";

const LAND_LEADS_PATH = "/admin/land-leads";

function landLeadsUrl(params: Record<string, string>) {
  const url = new URL(LAND_LEADS_PATH, "http://localhost");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}`;
}

const validCounties = new Set<LandLeadCounty>(countyOptions.map((option) => option.value));

export async function uploadCountyCsv(formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(LAND_LEADS_PATH)}`);
  }

  const county = String(formData.get("county") ?? "") as LandLeadCounty;

  if (!validCounties.has(county)) {
    redirect(landLeadsUrl({ error: "Choose which county this file is for." }));
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect(landLeadsUrl({ error: "Attach a county CSV file to import." }));
  }

  if (file.size > LAND_LEAD_MAX_UPLOAD_BYTES) {
    redirect(
      landLeadsUrl({
        error: `CSV file is larger than the ${LAND_LEAD_MAX_UPLOAD_LABEL} upload limit. Split the county export and import it in smaller batches.`,
      }),
    );
  }

  const text = await (file as File).text();
  const { parcels, skipped, warnings, fatalError } = parseCountyCsv(text, county);

  if (fatalError) {
    redirect(landLeadsUrl({ error: fatalError }));
  }

  if (parcels.length === 0) {
    redirect(
      landLeadsUrl({
        error: `No usable rows found in the file. ${warnings.join(" ")}`.trim(),
      }),
    );
  }

  const now = new Date();
  const computed = buildLeadRows(parcels, now);
  const existing = await getExistingLeadHashes(county);

  if (!existing) {
    redirect(
      landLeadsUrl({
        error: "Could not read existing land leads before import. Please try again before re-uploading this file.",
      }),
    );
  }

  const diff = diffAgainstExisting(computed, existing);

  const upsertResult = await upsertLandLeads(diff.toUpsert, now);

  if (!upsertResult.ok) {
    redirect(landLeadsUrl({ error: upsertResult.reason }));
  }

  const touchResult = await touchUnchangedLeads(diff.unchangedIds, now);

  if (!touchResult.ok) {
    redirect(landLeadsUrl({ error: touchResult.reason }));
  }

  const countyLabel = county === "weld" ? "Weld" : "Larimer";
  const notice =
    `${countyLabel}: imported ${parcels.length} records — ` +
    `${diff.newCount} new, ${diff.updatedCount} updated` +
    (skipped > 0 ? `, ${skipped} skipped` : "") +
    ".";

  revalidatePath(LAND_LEADS_PATH);
  redirect(landLeadsUrl({ notice }));
}

export async function saveLandLeadStatus(leadId: string, formData: FormData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent(LAND_LEADS_PATH)}`);
  }

  let status;

  try {
    ({ status } = parseLandLeadStatusFormData(formData));
  } catch (error) {
    redirect(
      landLeadsUrl({
        error: error instanceof Error ? error.message : "Could not update the lead status.",
      }),
    );
  }

  const result = await updateLandLeadStatus(leadId, status);

  if (!result.ok) {
    redirect(landLeadsUrl({ error: result.reason }));
  }

  revalidatePath(LAND_LEADS_PATH);
  redirect(landLeadsUrl({ notice: "Lead status updated." }));
}
