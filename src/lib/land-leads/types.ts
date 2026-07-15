export type LandLeadCounty = "larimer" | "weld";

export type LandLeadStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "not_a_fit"
  | "do_not_contact";

/**
 * Shared internal shape every county adapter / CSV parser emits, before
 * vacancy detection and scoring run. Numeric fields are `null` when the
 * source has no value (distinct from a real zero).
 */
export interface NormalizedParcel {
  county: LandLeadCounty;
  parcelNumber: string;
  accountNumber: string;
  ownerName: string;
  ownerNameSecondary: string;
  mailingAddress1: string;
  mailingAddress2: string;
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
  situsAddress: string;
  situsCity: string;
  situsState: string;
  situsZip: string;
  acreage: number | null;
  propertyClass: string;
  landUse: string;
  zoning: string;
  saleDate: string | null; // ISO YYYY-MM-DD
  salePrice: number | null;
  deedType: string;
  landActualValue: number | null;
  improvementActualValue: number | null;
  totalActualValue: number | null;
  sourceDataset: string;
}

/** Derived boolean signals computed from a NormalizedParcel. */
export interface LeadSignals {
  isLikelyVacant: boolean;
  isEntityOwner: boolean;
  mailingDiffersFromSitus: boolean;
  inTargetMarket: boolean;
}

/** A parcel enriched with signals, score, hash, and dedupe key — ready to persist. */
export interface ComputedLandLead extends NormalizedParcel, LeadSignals {
  leadScore: number;
  leadReason: string;
  sourceRowHash: string;
  dedupeKey: string;
}

/** Camel-cased domain object read back from the database. */
export interface LandLead extends NormalizedParcel, LeadSignals {
  id: string;
  leadScore: number;
  leadReason: string;
  sourceRowHash: string;
  firstSeenAt: string;
  lastSeenAt: string;
  lastRefreshedAt: string;
  status: LandLeadStatus;
  notes: string;
}

export type SaleWindowDays = 90 | 180 | 365 | null;

export interface LandLeadFilters {
  county: LandLeadCounty | null;
  saleWindowDays: SaleWindowDays;
  minSalePrice: number | null;
  minAcreage: number | null;
  excludeLikelyDevelopers: boolean;
  requireDifferentMailingAddress: boolean;
  status: LandLeadStatus | null;
}

export interface CountyImportSummary {
  recordsImported: number;
  newLeads: number;
  updatedLeads: number;
  skippedRecords: number;
}

export interface RefreshResult {
  success: boolean;
  summary: Record<LandLeadCounty, CountyImportSummary>;
  errors: string[];
  warnings: string[];
}

export function emptyCountyImportSummary(): CountyImportSummary {
  return { recordsImported: 0, newLeads: 0, updatedLeads: 0, skippedRecords: 0 };
}

export function emptyRefreshResult(): RefreshResult {
  return {
    success: true,
    summary: {
      larimer: emptyCountyImportSummary(),
      weld: emptyCountyImportSummary(),
    },
    errors: [],
    warnings: [],
  };
}
