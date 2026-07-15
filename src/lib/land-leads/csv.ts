import Papa from "papaparse";
import { mapCsvRow } from "./normalize";
import type { LandLead, LandLeadCounty, NormalizedParcel } from "./types";

export interface ParsedCountyCsv {
  parcels: NormalizedParcel[];
  skipped: number;
  warnings: string[];
  fatalError?: string;
}

const COUNTY_HEADER_GROUPS: Record<
  LandLeadCounty,
  {
    identity: string[];
    scoring: string[];
  }
> = {
  weld: {
    identity: ["PARCEL", "PARCELNB", "PARCEL_NO", "ACCOUNTNO", "ACCOUNT_NO", "ACCOUNT"],
    scoring: ["ACCTTYPE", "ACCOUNTTYP", "LANDUSE", "ASSRCODE", "CLASS", "LANDACT", "IMPACT"],
  },
  larimer: {
    identity: ["PARCELNUM", "PARCEL", "PARCEL_NO", "parcel_number", "SCHEDNUM", "ACCOUNT", "ACCT", "account_number"],
    scoring: [
      "LANDUSE",
      "ABSTRACT",
      "land_use",
      "PROPERTYCLASS",
      "CLASS_CODE",
      "CLASS",
      "property_class",
      "LANDVALUE",
      "LAND_VALUE",
      "land_value",
      "IMPVALUE",
      "IMPROVEMENT_VALUE",
      "improvement_value",
    ],
  },
};

function normalizeHeader(header: string): string {
  return header.replace(/^\uFEFF/, "").trim();
}

function hasAnyHeader(headers: Set<string>, aliases: string[]): boolean {
  return aliases.some((alias) => headers.has(alias));
}

function validateCountyCsvHeaders(
  fields: string[] | undefined,
  county: LandLeadCounty,
): string | undefined {
  const headers = new Set((fields ?? []).map(normalizeHeader).filter(Boolean));
  const groups = COUNTY_HEADER_GROUPS[county];

  if (!hasAnyHeader(headers, groups.identity)) {
    return "CSV is missing recognized parcel/account identity columns for this county.";
  }

  if (!hasAnyHeader(headers, groups.scoring)) {
    return "CSV is missing land-use, class, or value columns needed for vacancy detection and scoring.";
  }

  return undefined;
}

/**
 * Parse an uploaded county CSV into normalized parcels. County is supplied by
 * the admin's upload form (not sniffed) so the correct field mapping is always
 * used. Rows lacking both a parcel number and an account number are skipped.
 */
export function parseCountyCsv(text: string, county: LandLeadCounty): ParsedCountyCsv {
  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normalizeHeader,
  });

  const warnings: string[] = [];
  const fatalError = validateCountyCsvHeaders(result.meta.fields, county);

  if (fatalError) {
    return { parcels: [], skipped: result.data.length, warnings, fatalError };
  }

  if (result.errors.length > 0) {
    const sample = result.errors.slice(0, 3).map((error) => error.message);
    warnings.push(
      `CSV parser reported ${result.errors.length} issue(s): ${sample.join("; ")}`,
    );
  }

  const parcels: NormalizedParcel[] = [];
  let skipped = 0;

  for (const row of result.data) {
    if (!row || typeof row !== "object") {
      skipped += 1;
      continue;
    }

    const parcel = mapCsvRow(county, row);

    if (parcel.parcelNumber === "" && parcel.accountNumber === "") {
      skipped += 1;
      continue;
    }

    parcels.push(parcel);
  }

  if (parcels.length === 0) {
    warnings.push("No usable rows found. Check that the file is the right county export.");
  }

  return { parcels, skipped, warnings };
}

/** Column order for the mailing/postcard-vendor export. */
export const MAILING_CSV_COLUMNS = [
  "Owner Name",
  "Owner Name 2",
  "Mailing Address 1",
  "Mailing Address 2",
  "City",
  "State",
  "ZIP",
  "Property Address",
  "Property City",
  "County",
  "Parcel Number",
  "Account Number",
  "Acreage",
  "Sale Date",
  "Sale Price",
  "Lead Score",
  "Lead Reason",
] as const;

function titleCaseCounty(county: LandLeadCounty): string {
  return county === "weld" ? "Weld" : "Larimer";
}

/** Serialize leads to a mailing-vendor-formatted CSV string. */
export function serializeMailingCsv(leads: LandLead[]): string {
  const rows = leads.map((lead) => ({
    "Owner Name": lead.ownerName,
    "Owner Name 2": lead.ownerNameSecondary,
    "Mailing Address 1": lead.mailingAddress1,
    "Mailing Address 2": lead.mailingAddress2,
    City: lead.mailingCity,
    State: lead.mailingState,
    ZIP: lead.mailingZip,
    "Property Address": lead.situsAddress,
    "Property City": lead.situsCity,
    County: titleCaseCounty(lead.county),
    "Parcel Number": lead.parcelNumber,
    "Account Number": lead.accountNumber,
    Acreage: lead.acreage ?? "",
    "Sale Date": lead.saleDate ?? "",
    "Sale Price": lead.salePrice ?? "",
    "Lead Score": lead.leadScore,
    "Lead Reason": lead.leadReason,
  }));

  return Papa.unparse(
    { fields: [...MAILING_CSV_COLUMNS], data: rows },
    { columns: [...MAILING_CSV_COLUMNS] },
  );
}
