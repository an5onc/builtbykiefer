import { landLeadStatusOptions } from "./constants";
import type {
  LandLead,
  LandLeadCounty,
  LandLeadFilters,
  LandLeadStatus,
  SaleWindowDays,
} from "./types";

const statusValues = new Set<LandLeadStatus>(
  landLeadStatusOptions.map((option) => option.value),
);
const countyValues = new Set<LandLeadCounty>(["larimer", "weld"]);

type RawParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parsePositiveNumber(value: string): number | null {
  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  const parsed = Number(trimmed.replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseSaleWindow(value: string): SaleWindowDays {
  if (value === "90") return 90;
  if (value === "180") return 180;
  if (value === "365") return 365;
  return null;
}

/** Parse URL search params (GET filter form) into typed filters. */
export function parseLandLeadFilters(params: RawParams): LandLeadFilters {
  const countyRaw = firstValue(params.county);
  const statusRaw = firstValue(params.status);

  return {
    county: countyValues.has(countyRaw as LandLeadCounty)
      ? (countyRaw as LandLeadCounty)
      : null,
    saleWindowDays: parseSaleWindow(firstValue(params.saleWindow)),
    minSalePrice: parsePositiveNumber(firstValue(params.minSalePrice)),
    minAcreage: parsePositiveNumber(firstValue(params.minAcreage)),
    excludeLikelyDevelopers: firstValue(params.excludeDevelopers) === "1",
    requireDifferentMailingAddress: firstValue(params.mailingDiffers) === "1",
    status: statusValues.has(statusRaw as LandLeadStatus)
      ? (statusRaw as LandLeadStatus)
      : null,
  };
}

/** Re-encode filters into a query string (for the export link + form state). */
export function filtersToQueryString(filters: LandLeadFilters): string {
  const params = new URLSearchParams();

  if (filters.county) params.set("county", filters.county);
  if (filters.saleWindowDays !== null) params.set("saleWindow", String(filters.saleWindowDays));
  if (filters.minSalePrice !== null) params.set("minSalePrice", String(filters.minSalePrice));
  if (filters.minAcreage !== null) params.set("minAcreage", String(filters.minAcreage));
  if (filters.excludeLikelyDevelopers) params.set("excludeDevelopers", "1");
  if (filters.requireDifferentMailingAddress) params.set("mailingDiffers", "1");
  if (filters.status) params.set("status", filters.status);

  return params.toString();
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Apply filters to an in-memory lead list (used by the demo-mode fallback and
 * tests; the live path pushes equivalent predicates down to Postgres).
 */
export function applyLeadFilters(
  leads: LandLead[],
  filters: LandLeadFilters,
  now: Date,
): LandLead[] {
  const saleCutoff =
    filters.saleWindowDays !== null
      ? now.getTime() - filters.saleWindowDays * DAY_MS
      : null;

  return leads.filter((lead) => {
    if (filters.county && lead.county !== filters.county) return false;
    if (filters.status && lead.status !== filters.status) return false;
    if (filters.excludeLikelyDevelopers && lead.isEntityOwner) return false;
    if (filters.requireDifferentMailingAddress && !lead.mailingDiffersFromSitus) return false;

    if (filters.minSalePrice !== null) {
      if (lead.salePrice === null || lead.salePrice < filters.minSalePrice) return false;
    }

    if (filters.minAcreage !== null) {
      if (lead.acreage === null || lead.acreage < filters.minAcreage) return false;
    }

    if (saleCutoff !== null) {
      if (lead.saleDate === null) return false;
      const saleTime = new Date(`${lead.saleDate}T00:00:00Z`).getTime();
      if (Number.isNaN(saleTime) || saleTime < saleCutoff) return false;
    }

    return true;
  });
}

/** Parse the inline status-change form (list + detail pages). */
export function parseLandLeadStatusFormData(formData: FormData): { status: LandLeadStatus } {
  const status = String(formData.get("status") ?? "");

  if (!statusValues.has(status as LandLeadStatus)) {
    throw new Error("Choose a valid lead status.");
  }

  return { status: status as LandLeadStatus };
}

/** Parse the detail-page status + notes form. */
export function parseLandLeadNotesFormData(formData: FormData): {
  status: LandLeadStatus;
  notes: string;
} {
  const { status } = parseLandLeadStatusFormData(formData);
  const notes = String(formData.get("notes") ?? "").trim();

  return { status, notes };
}
