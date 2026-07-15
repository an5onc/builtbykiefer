import type { LandLeadCounty, NormalizedParcel } from "./types";

type RawAttributes = Record<string, unknown>;

/** Trim and collapse internal whitespace; returns "" for null/undefined. */
export function cleanText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/\s+/g, " ").trim();
}

/** Lowercased, single-spaced form used for city / market comparisons. */
export function normalizeCity(value: unknown): string {
  return cleanText(value).toLowerCase();
}

/**
 * Parse a currency-ish value to a number. Empty / non-numeric → null.
 * A real zero (e.g. improvement value on vacant land) is preserved as 0.
 */
export function parseMoney(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = String(value).replace(/[$,\s]/g, "");

  if (cleaned === "") {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Parse acreage to a number, or null when absent. */
export function parseAcreage(value: unknown): number | null {
  return parseMoney(value);
}

/**
 * Normalize a sale date to ISO `YYYY-MM-DD`. Accepts epoch milliseconds
 * (ArcGIS date fields), ISO strings, and `M/D/YYYY`. Returns null on failure.
 */
export function parseSaleDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  // ArcGIS returns dates as epoch milliseconds.
  if (typeof value === "number" && Number.isFinite(value)) {
    return epochToIsoIfPlausible(value);
  }

  const text = String(value).trim();

  if (text === "") {
    return null;
  }

  if (/^\d+$/.test(text)) {
    return epochToIsoIfPlausible(Number(text));
  }

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const us = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (us) {
    const month = us[1].padStart(2, "0");
    const day = us[2].padStart(2, "0");
    return `${us[3]}-${month}-${day}`;
  }

  return null;
}

function epochToIsoIfPlausible(epochMs: number): string | null {
  if (!Number.isFinite(epochMs)) {
    return null;
  }

  const earliest = Date.UTC(1990, 0, 1);
  const latest = Date.UTC(2100, 0, 1);

  if (epochMs < earliest || epochMs > latest) {
    return null;
  }

  const date = new Date(epochMs);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function pick(attrs: RawAttributes, ...keys: string[]): unknown {
  for (const key of keys) {
    if (key in attrs && attrs[key] !== null && attrs[key] !== undefined && attrs[key] !== "") {
      return attrs[key];
    }
  }

  return "";
}

/**
 * Weld County ArcGIS parcels layer (and its CSV export share the same field
 * names). SALEDT is epoch ms in the REST response, a date string in the CSV.
 * LANDACT / IMPACT / TOTALACT are dollar values; GIS_Acres is acreage.
 */
export function mapWeldAttributes(
  attrs: RawAttributes,
  sourceDataset = "weld_arcgis",
): NormalizedParcel {
  return {
    county: "weld",
    parcelNumber: cleanText(pick(attrs, "PARCEL", "PARCELNB", "PARCEL_NO")),
    accountNumber: cleanText(pick(attrs, "ACCOUNTNO", "ACCOUNT_NO", "ACCOUNT")),
    ownerName: cleanText(pick(attrs, "NAME", "OWNER", "OWNER_NAME")),
    ownerNameSecondary: cleanText(pick(attrs, "NAME2", "OWNER2", "CAREOF")),
    mailingAddress1: cleanText(pick(attrs, "ADDRESS1", "MAIL_ADDR1")),
    mailingAddress2: cleanText(pick(attrs, "ADDRESS2", "MAIL_ADDR2")),
    mailingCity: cleanText(pick(attrs, "CITY", "MAIL_CITY")),
    mailingState: cleanText(pick(attrs, "STATE", "MAIL_STATE")),
    mailingZip: cleanText(pick(attrs, "ZIPCODE", "ZIP", "MAIL_ZIP")),
    situsAddress: cleanText(pick(attrs, "SITUS", "SITUS_ADDR", "LOCADDRESS")),
    situsCity: cleanText(pick(attrs, "LOCCITY", "SITUS_CITY")),
    situsState: "CO",
    situsZip: cleanText(pick(attrs, "SITUSZIP", "SITUS_ZIP")),
    acreage: parseAcreage(pick(attrs, "GIS_Acres", "ACRES", "TOTALACRE")),
    propertyClass: cleanText(pick(attrs, "ASSRCODE", "CLASS")),
    landUse: cleanText(pick(attrs, "ACCTTYPE", "ACCOUNTTYP", "LANDUSE")),
    zoning: cleanText(pick(attrs, "ZONING", "ZONE")),
    saleDate: parseSaleDate(attrs.SALEDT ?? attrs.SALE_DATE ?? attrs.SALEDATE),
    salePrice: parseMoney(pick(attrs, "SALEP", "SALE_PRICE", "SALEPRICE")),
    deedType: cleanText(pick(attrs, "DEEDTYPE", "DEED_TYPE")),
    landActualValue: parseMoney(pick(attrs, "LANDACT", "LAND_VALUE")),
    improvementActualValue: parseMoney(pick(attrs, "IMPACT", "IMP_VALUE")),
    totalActualValue: parseMoney(pick(attrs, "TOTALACT", "TOTAL_VALUE")),
    sourceDataset,
  };
}

/**
 * Larimer County GIS Tax Parcels layer (layer 3), optionally joined to a most
 * recent sale row (layer 5). GIS has no value / acreage / class fields — those
 * arrive via the Assessor Public Data Center CSV upload.
 */
export function mapLarimerGisRow(
  parcelAttrs: RawAttributes,
  saleAttrs: RawAttributes | null = null,
  sourceDataset = "larimer_gis",
): NormalizedParcel {
  return {
    county: "larimer",
    parcelNumber: cleanText(pick(parcelAttrs, "PARCELNUM", "PARCEL_NUM", "PARCEL")),
    accountNumber: cleanText(pick(parcelAttrs, "SCHEDNUM", "SCHEDULE", "ACCOUNT")),
    ownerName: cleanText(pick(parcelAttrs, "NAME", "OWNER")),
    ownerNameSecondary: cleanText(pick(parcelAttrs, "NAME1", "NAME2", "OWNER2")),
    mailingAddress1: cleanText(pick(parcelAttrs, "MAILINGADDRESS", "MAIL_ADDR")),
    mailingAddress2: cleanText(pick(parcelAttrs, "MAILINGADDRESS2", "MAIL_ADDR2")),
    mailingCity: cleanText(pick(parcelAttrs, "MAILINGCITY", "MAIL_CITY")),
    mailingState: cleanText(pick(parcelAttrs, "MAILINGSTATE", "MAIL_STATE")),
    mailingZip: cleanText(pick(parcelAttrs, "MAILINGZIPCODE", "MAILINGZIP", "MAIL_ZIP")),
    situsAddress: cleanText(pick(parcelAttrs, "LOCADDRESS", "SITUS")),
    situsCity: cleanText(pick(parcelAttrs, "LOCCITY", "SITUS_CITY")),
    situsState: "CO",
    situsZip: cleanText(pick(parcelAttrs, "LOCZIP", "SITUS_ZIP")),
    acreage: parseAcreage(pick(parcelAttrs, "ACRES", "GIS_Acres")),
    propertyClass: cleanText(pick(parcelAttrs, "PROPERTYCLASS", "CLASS")),
    landUse: cleanText(pick(parcelAttrs, "ACCTTYPE", "LANDUSE")),
    zoning: cleanText(pick(parcelAttrs, "ZONING", "ZONE")),
    saleDate: parseSaleDate(saleAttrs?.SALEDATE ?? saleAttrs?.SALE_DATE ?? null),
    salePrice: parseMoney(saleAttrs?.SALEPRICE ?? saleAttrs?.SALE_PRICE ?? null),
    deedType: cleanText(saleAttrs?.DEEDTYPE ?? ""),
    landActualValue: null,
    improvementActualValue: null,
    totalActualValue: null,
    sourceDataset,
  };
}

/**
 * Larimer County Assessor Public Data Center bulk-table CSV (Account / Owner /
 * Value / Sales / Land joined into one row before upload). Column names follow
 * the assessor exports; adjust the aliases here when real files are obtained.
 */
export function mapLarimerAssessorCsvRow(
  row: RawAttributes,
  sourceDataset = "larimer_assessor_csv",
): NormalizedParcel {
  return {
    county: "larimer",
    parcelNumber: cleanText(pick(row, "PARCELNUM", "PARCEL", "PARCEL_NO", "parcel_number")),
    accountNumber: cleanText(pick(row, "SCHEDNUM", "ACCOUNT", "ACCT", "account_number")),
    ownerName: cleanText(pick(row, "OWNER", "OWNER_NAME", "NAME", "owner_name")),
    ownerNameSecondary: cleanText(pick(row, "OWNER2", "OWNER_NAME_2", "CAREOF")),
    mailingAddress1: cleanText(pick(row, "MAILINGADDRESS", "MAIL_ADDR1", "MAILING_ADDRESS")),
    mailingAddress2: cleanText(pick(row, "MAILINGADDRESS2", "MAIL_ADDR2")),
    mailingCity: cleanText(pick(row, "MAILINGCITY", "MAIL_CITY")),
    mailingState: cleanText(pick(row, "MAILINGSTATE", "MAIL_STATE")),
    mailingZip: cleanText(pick(row, "MAILINGZIP", "MAILINGZIPCODE", "MAIL_ZIP")),
    situsAddress: cleanText(pick(row, "LOCADDRESS", "SITUS", "SITUS_ADDRESS")),
    situsCity: cleanText(pick(row, "LOCCITY", "SITUS_CITY")),
    situsState: "CO",
    situsZip: cleanText(pick(row, "LOCZIP", "SITUS_ZIP")),
    acreage: parseAcreage(pick(row, "ACRES", "LAND_ACRES", "acreage")),
    propertyClass: cleanText(pick(row, "PROPERTYCLASS", "CLASS_CODE", "CLASS", "property_class")),
    landUse: cleanText(pick(row, "LANDUSE", "ABSTRACT", "land_use")),
    zoning: cleanText(pick(row, "ZONING", "ZONE", "zoning")),
    saleDate: parseSaleDate(row.SALEDATE ?? row.SALE_DATE ?? row.sale_date),
    salePrice: parseMoney(pick(row, "SALEPRICE", "SALE_PRICE", "sale_price")),
    deedType: cleanText(pick(row, "DEEDTYPE", "DEED_TYPE")),
    landActualValue: parseMoney(pick(row, "LANDVALUE", "LAND_VALUE", "land_value")),
    improvementActualValue: parseMoney(pick(row, "IMPVALUE", "IMPROVEMENT_VALUE", "improvement_value")),
    totalActualValue: parseMoney(pick(row, "TOTALVALUE", "TOTAL_VALUE", "total_value")),
    sourceDataset,
  };
}

/** Route a raw CSV row to the correct county mapper. */
export function mapCsvRow(county: LandLeadCounty, row: RawAttributes): NormalizedParcel {
  return county === "weld"
    ? mapWeldAttributes(row, "weld_csv_upload")
    : mapLarimerAssessorCsvRow(row, "larimer_csv_upload");
}
