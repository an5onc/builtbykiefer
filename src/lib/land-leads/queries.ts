import { getPublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { logSupabaseFallback } from "@/lib/admin/supabase-fallback";
import { landLeads as demoLandLeads } from "./demo-data";
import { applyLeadFilters } from "./filters";
import { existingKey, type ExistingLead } from "./refresh";
import { LAND_LEAD_COLUMNS, mapLandLeadRow, type LandLeadRow } from "./supabase-mappers";
import type {
  ComputedLandLead,
  LandLead,
  LandLeadCounty,
  LandLeadFilters,
  LandLeadStatus,
} from "./types";

type MutationResult = { ok: true } | { ok: false; reason: string };

const DAY_MS = 24 * 60 * 60 * 1000;
const UPSERT_CHUNK = 500;
const SELECT_PAGE = 1000;

async function getSupabaseClientOrNull() {
  const env = getPublicEnv();

  if (env.demoMode || !env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createClient();
}

function emptyOnLiveReadFailure(errorContext: string, error: unknown) {
  logSupabaseFallback(errorContext, error);
  return [];
}

/** Sorted list of leads matching the filters (highest score first). */
export async function getLandLeads(
  filters: LandLeadFilters,
  now = new Date(),
): Promise<LandLead[]> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return applyLeadFilters(demoLandLeads, filters, now).sort(
      (a, b) => b.leadScore - a.leadScore,
    );
  }

  let query = supabase.from("land_leads").select(LAND_LEAD_COLUMNS);

  if (filters.county) query = query.eq("county", filters.county);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.excludeLikelyDevelopers) query = query.eq("is_entity_owner", false);
  if (filters.requireDifferentMailingAddress) {
    query = query.eq("mailing_differs_from_situs", true);
  }
  if (filters.minSalePrice !== null) query = query.gte("sale_price", filters.minSalePrice);
  if (filters.minAcreage !== null) query = query.gte("acreage", filters.minAcreage);
  if (filters.saleWindowDays !== null) {
    const cutoff = new Date(now.getTime() - filters.saleWindowDays * DAY_MS)
      .toISOString()
      .slice(0, 10);
    query = query.gte("sale_date", cutoff);
  }

  const { data, error } = await query.order("lead_score", { ascending: false });

  if (error) {
    return emptyOnLiveReadFailure("land-leads", error);
  }

  return (data ?? []).map((row) => mapLandLeadRow(row as unknown as LandLeadRow));
}

export async function getLandLead(id: string): Promise<LandLead | null> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoLandLeads.find((lead) => lead.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("land_leads")
    .select(LAND_LEAD_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logSupabaseFallback("land-lead", error);
    return null;
  }

  return data ? mapLandLeadRow(data as unknown as LandLeadRow) : null;
}

export async function updateLandLeadStatus(
  id: string,
  status: LandLeadStatus,
): Promise<MutationResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode status changes are not persisted." };
  }

  const { error } = await supabase
    .from("land_leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    logSupabaseFallback("land-lead-status", error);
    return { ok: false, reason: "Could not update the lead status. Please try again." };
  }

  return { ok: true };
}

export async function updateLandLeadNotes(
  id: string,
  input: { status: LandLeadStatus; notes: string },
): Promise<MutationResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode lead edits are not persisted." };
  }

  const { error } = await supabase
    .from("land_leads")
    .update({ status: input.status, notes: input.notes, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    logSupabaseFallback("land-lead-notes", error);
    return { ok: false, reason: "Could not save the lead. Please try again." };
  }

  return { ok: true };
}

/** Map of existing leads (id + source hash) for a county, keyed for diffing. */
export async function getExistingLeadHashes(
  county: LandLeadCounty,
): Promise<Map<string, ExistingLead> | null> {
  const supabase = await getSupabaseClientOrNull();
  const map = new Map<string, ExistingLead>();

  if (!supabase) {
    return map;
  }

  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from("land_leads")
      .select("id, dedupe_key, source_row_hash")
      .eq("county", county)
      .range(from, from + SELECT_PAGE - 1);

    if (error) {
      logSupabaseFallback("land-lead-hashes", error);
      return null;
    }

    const rows = (data ?? []) as Array<{
      id: string;
      dedupe_key: string;
      source_row_hash: string;
    }>;

    for (const row of rows) {
      map.set(existingKey(county, row.dedupe_key), {
        id: row.id,
        hash: row.source_row_hash,
      });
    }

    if (rows.length < SELECT_PAGE) {
      break;
    }

    from += SELECT_PAGE;
  }

  return map;
}

function toInsertRow(lead: ComputedLandLead, nowIso: string) {
  return {
    county: lead.county,
    parcel_number: lead.parcelNumber,
    account_number: lead.accountNumber,
    owner_name: lead.ownerName,
    owner_name_secondary: lead.ownerNameSecondary,
    mailing_address1: lead.mailingAddress1,
    mailing_address2: lead.mailingAddress2,
    mailing_city: lead.mailingCity,
    mailing_state: lead.mailingState,
    mailing_zip: lead.mailingZip,
    situs_address: lead.situsAddress,
    situs_city: lead.situsCity,
    situs_state: lead.situsState || "CO",
    situs_zip: lead.situsZip,
    acreage: lead.acreage,
    property_class: lead.propertyClass,
    land_use: lead.landUse,
    zoning: lead.zoning,
    sale_date: lead.saleDate,
    sale_price: lead.salePrice,
    deed_type: lead.deedType,
    land_actual_value: lead.landActualValue,
    improvement_actual_value: lead.improvementActualValue,
    total_actual_value: lead.totalActualValue,
    is_likely_vacant: lead.isLikelyVacant,
    is_entity_owner: lead.isEntityOwner,
    mailing_differs_from_situs: lead.mailingDiffersFromSitus,
    in_target_market: lead.inTargetMarket,
    lead_score: lead.leadScore,
    lead_reason: lead.leadReason,
    source_dataset: lead.sourceDataset,
    source_row_hash: lead.sourceRowHash,
    last_seen_at: nowIso,
    last_refreshed_at: nowIso,
    updated_at: nowIso,
  };
}

/**
 * Upsert new/changed leads in chunks. The payload deliberately omits status,
 * notes, and first_seen_at so admin edits and the original discovery date
 * survive a refresh (PostgREST only writes the columns provided).
 */
export async function upsertLandLeads(
  rows: ComputedLandLead[],
  now = new Date(),
): Promise<MutationResult> {
  if (rows.length === 0) {
    return { ok: true };
  }

  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode imports are not persisted." };
  }

  const nowIso = now.toISOString();

  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK).map((row) => toInsertRow(row, nowIso));
    const { error } = await supabase
      .from("land_leads")
      .upsert(chunk, { onConflict: "county,dedupe_key" });

    if (error) {
      logSupabaseFallback("land-lead-upsert", error);
      return { ok: false, reason: "Could not save imported leads. Please try again." };
    }
  }

  return { ok: true };
}

/** Bump last_seen / last_refreshed for leads whose source data is unchanged. */
export async function touchUnchangedLeads(
  ids: string[],
  now = new Date(),
): Promise<MutationResult> {
  if (ids.length === 0) {
    return { ok: true };
  }

  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode imports are not persisted." };
  }

  const nowIso = now.toISOString();

  for (let i = 0; i < ids.length; i += UPSERT_CHUNK) {
    const chunk = ids.slice(i, i + UPSERT_CHUNK);
    const { error } = await supabase
      .from("land_leads")
      .update({ last_seen_at: nowIso, last_refreshed_at: nowIso })
      .in("id", chunk);

    if (error) {
      logSupabaseFallback("land-lead-touch", error);
      return { ok: false, reason: "Could not update existing leads. Please try again." };
    }
  }

  return { ok: true };
}
