import type { LandLeadCounty, LandLeadStatus, SaleWindowDays } from "./types";

export const countyOptions: Array<{ value: LandLeadCounty; label: string }> = [
  { value: "larimer", label: "Larimer" },
  { value: "weld", label: "Weld" },
];

export const landLeadStatusOptions: Array<{ value: LandLeadStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "contacted", label: "Contacted" },
  { value: "not_a_fit", label: "Not a Fit" },
  { value: "do_not_contact", label: "Do Not Contact" },
];

export const saleWindowOptions: Array<{ value: SaleWindowDays; label: string }> = [
  { value: 90, label: "Last 90 days" },
  { value: 180, label: "Last 180 days" },
  { value: 365, label: "Last 365 days" },
  { value: null, label: "All time" },
];

export const LAND_LEAD_MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
export const LAND_LEAD_MAX_UPLOAD_LABEL = "25 MB";

/**
 * Northern Colorado target markets for custom-home direct mail. Stored
 * normalized (lowercase, single-spaced) for comparison against situs city.
 */
export const TARGET_CITIES = new Set<string>([
  "timnath",
  "windsor",
  "fort collins",
  "loveland",
  "severance",
  "berthoud",
  "greeley",
  "wellington",
  "johnstown",
  "milliken",
  "eaton",
  "ault",
  "mead",
  "pierce",
  "evans",
  "laporte",
  "bellvue",
]);

/** Sale price at/above which a lead earns the price bonus. */
export const SALE_PRICE_BONUS_THRESHOLD = 150_000;

/** Total value below which a parcel is treated as a low-value / questionable record. */
export const LOW_VALUE_FLOOR = 30_000;

/** A sale is "recent" (worth the freshness bonus) within this many days. */
export const RECENT_SALE_DAYS = 180;

/** Desirable acreage range for a custom-home homesite (inclusive). */
export const DESIRABLE_ACREAGE = { min: 0.5, max: 35 } as const;

/** Point weights for the 0–100 lead score. Positive rewards, negative penalties. */
export const SCORE_WEIGHTS = {
  vacant: 35,
  recentSale: 25,
  mailingDiffers: 15,
  priceAboveThreshold: 10,
  desirableAcreage: 10,
  targetMarket: 5,
  entityOwner: -25,
  missingMailing: -15,
  missingSaleDate: -15,
  lowValue: -10,
} as const;
