import type { LandLead, LandLeadCounty, LandLeadStatus } from "./types";

export interface LandLeadRow {
  id: string;
  county: LandLeadCounty;
  parcel_number: string;
  account_number: string;
  owner_name: string;
  owner_name_secondary: string;
  mailing_address1: string;
  mailing_address2: string;
  mailing_city: string;
  mailing_state: string;
  mailing_zip: string;
  situs_address: string;
  situs_city: string;
  situs_state: string;
  situs_zip: string;
  acreage: number | string | null;
  property_class: string;
  land_use: string;
  zoning: string;
  sale_date: string | null;
  sale_price: number | string | null;
  deed_type: string;
  land_actual_value: number | string | null;
  improvement_actual_value: number | string | null;
  total_actual_value: number | string | null;
  is_likely_vacant: boolean;
  is_entity_owner: boolean;
  mailing_differs_from_situs: boolean;
  in_target_market: boolean;
  lead_score: number;
  lead_reason: string;
  source_row_hash: string;
  first_seen_at: string;
  last_seen_at: string;
  last_refreshed_at: string;
  status: LandLeadStatus;
  notes: string;
  source_dataset: string;
}

function toNumberOrNull(value: number | string | null): number | null {
  if (value === null || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** The list of DB columns to select for a LandLead. */
export const LAND_LEAD_COLUMNS =
  "id, county, parcel_number, account_number, owner_name, owner_name_secondary, " +
  "mailing_address1, mailing_address2, mailing_city, mailing_state, mailing_zip, " +
  "situs_address, situs_city, situs_state, situs_zip, acreage, property_class, land_use, " +
  "zoning, sale_date, sale_price, deed_type, land_actual_value, improvement_actual_value, " +
  "total_actual_value, is_likely_vacant, is_entity_owner, mailing_differs_from_situs, " +
  "in_target_market, lead_score, lead_reason, source_row_hash, first_seen_at, last_seen_at, " +
  "last_refreshed_at, status, notes, source_dataset";

export function mapLandLeadRow(row: LandLeadRow): LandLead {
  return {
    id: row.id,
    county: row.county,
    parcelNumber: row.parcel_number,
    accountNumber: row.account_number,
    ownerName: row.owner_name,
    ownerNameSecondary: row.owner_name_secondary,
    mailingAddress1: row.mailing_address1,
    mailingAddress2: row.mailing_address2,
    mailingCity: row.mailing_city,
    mailingState: row.mailing_state,
    mailingZip: row.mailing_zip,
    situsAddress: row.situs_address,
    situsCity: row.situs_city,
    situsState: row.situs_state,
    situsZip: row.situs_zip,
    acreage: toNumberOrNull(row.acreage),
    propertyClass: row.property_class,
    landUse: row.land_use,
    zoning: row.zoning,
    saleDate: row.sale_date,
    salePrice: toNumberOrNull(row.sale_price),
    deedType: row.deed_type,
    landActualValue: toNumberOrNull(row.land_actual_value),
    improvementActualValue: toNumberOrNull(row.improvement_actual_value),
    totalActualValue: toNumberOrNull(row.total_actual_value),
    isLikelyVacant: row.is_likely_vacant,
    isEntityOwner: row.is_entity_owner,
    mailingDiffersFromSitus: row.mailing_differs_from_situs,
    inTargetMarket: row.in_target_market,
    leadScore: row.lead_score,
    leadReason: row.lead_reason,
    sourceRowHash: row.source_row_hash,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    lastRefreshedAt: row.last_refreshed_at,
    status: row.status,
    notes: row.notes,
    sourceDataset: row.source_dataset,
  };
}
