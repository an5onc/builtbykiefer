import { describe, expect, it } from "vitest";
import {
  cleanText,
  mapLarimerAssessorCsvRow,
  mapLarimerGisRow,
  mapWeldAttributes,
  parseMoney,
  parseSaleDate,
} from "./normalize";

describe("normalize helpers", () => {
  it("cleans whitespace and null-ish values", () => {
    expect(cleanText("  Smith   John  ")).toBe("Smith John");
    expect(cleanText(null)).toBe("");
    expect(cleanText(undefined)).toBe("");
  });

  it("parses money while preserving real zeros", () => {
    expect(parseMoney("$1,250,000")).toBe(1_250_000);
    expect(parseMoney(0)).toBe(0);
    expect(parseMoney("")).toBeNull();
    expect(parseMoney("N/A")).toBeNull();
  });

  it("parses sale dates from epoch ms, ISO, and US formats", () => {
    // 2026-01-15 UTC
    expect(parseSaleDate(1_768_435_200_000)).toBe("2026-01-15");
    expect(parseSaleDate("2025-11-03")).toBe("2025-11-03");
    expect(parseSaleDate("3/9/2025")).toBe("2025-03-09");
    expect(parseSaleDate("")).toBeNull();
    expect(parseSaleDate("not a date")).toBeNull();
  });

  it("does not treat a bare numeric year as epoch milliseconds", () => {
    expect(parseSaleDate("2025")).toBeNull();
  });
});

describe("mapWeldAttributes", () => {
  it("maps the Weld ArcGIS parcel shape into a NormalizedParcel", () => {
    const parcel = mapWeldAttributes({
      PARCEL: "096310400017",
      ACCOUNTNO: "R1234567",
      NAME: "DOE JANE",
      ADDRESS1: "123 Elsewhere Ln",
      CITY: "Denver",
      STATE: "CO",
      ZIPCODE: "80202",
      SITUS: "5000 County Road 13",
      LOCCITY: "Windsor",
      ACCTTYPE: "Vacant Land",
      LANDACT: "180000",
      IMPACT: "0",
      TOTALACT: "180000",
      SALEP: "195000",
      SALEDT: 1_768_435_200_000,
      DEEDTYPE: "WD",
      GIS_Acres: "4.2",
    });

    expect(parcel).toMatchObject({
      county: "weld",
      parcelNumber: "096310400017",
      accountNumber: "R1234567",
      ownerName: "DOE JANE",
      mailingAddress1: "123 Elsewhere Ln",
      mailingCity: "Denver",
      situsAddress: "5000 County Road 13",
      situsCity: "Windsor",
      landUse: "Vacant Land",
      landActualValue: 180_000,
      improvementActualValue: 0,
      totalActualValue: 180_000,
      salePrice: 195_000,
      saleDate: "2026-01-15",
      acreage: 4.2,
    });
  });
});

describe("mapLarimerGisRow", () => {
  it("maps parcel + joined sale, leaving value fields null (GIS has none)", () => {
    const parcel = mapLarimerGisRow(
      {
        PARCELNUM: "8712300005",
        SCHEDNUM: "R001122",
        NAME: "OWNER FAMILY",
        MAILINGADDRESS: "PO Box 55",
        MAILINGCITY: "Fort Collins",
        MAILINGSTATE: "CO",
        MAILINGZIPCODE: "80525",
        LOCADDRESS: "1200 Vacant Way",
        LOCCITY: "Timnath",
        ACCTTYPE: "Residential",
      },
      { SALEDATE: "2025-12-01", SALEPRICE: "220000", DEEDTYPE: "WD" },
    );

    expect(parcel).toMatchObject({
      county: "larimer",
      parcelNumber: "8712300005",
      accountNumber: "R001122",
      situsCity: "Timnath",
      saleDate: "2025-12-01",
      salePrice: 220_000,
      landActualValue: null,
      improvementActualValue: null,
      totalActualValue: null,
    });
  });
});

describe("mapLarimerAssessorCsvRow", () => {
  it("maps assessor bulk-table columns including values and class", () => {
    const parcel = mapLarimerAssessorCsvRow({
      PARCELNUM: "8712300005",
      OWNER: "OWNER FAMILY",
      CLASS_CODE: "0100",
      LAND_VALUE: "150000",
      IMPROVEMENT_VALUE: "0",
      TOTAL_VALUE: "150000",
    });

    expect(parcel).toMatchObject({
      county: "larimer",
      parcelNumber: "8712300005",
      propertyClass: "0100",
      landActualValue: 150_000,
      improvementActualValue: 0,
      totalActualValue: 150_000,
    });
  });
});
