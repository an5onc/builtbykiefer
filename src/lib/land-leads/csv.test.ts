import { describe, expect, it } from "vitest";
import { parseCountyCsv, serializeMailingCsv } from "./csv";
import type { LandLead } from "./types";

describe("parseCountyCsv", () => {
  it("parses Weld rows, honoring quoted commas in owner names", () => {
    const csv = [
      "PARCEL,ACCOUNTNO,NAME,ADDRESS1,CITY,STATE,ZIPCODE,SITUS,LOCCITY,ACCTTYPE,LANDACT,IMPACT,TOTALACT,SALEP,SALEDT,GIS_Acres",
      '096310400017,R123,"SMITH, JOHN & JANE",123 Elsewhere Ln,Denver,CO,80202,5000 County Road 13,Windsor,Vacant Land,180000,0,180000,195000,2026-01-15,4.2',
    ].join("\n");

    const { parcels, skipped } = parseCountyCsv(csv, "weld");

    expect(skipped).toBe(0);
    expect(parcels).toHaveLength(1);
    expect(parcels[0]).toMatchObject({
      county: "weld",
      ownerName: "SMITH, JOHN & JANE",
      parcelNumber: "096310400017",
      landUse: "Vacant Land",
      salePrice: 195_000,
    });
  });

  it("skips rows with no parcel or account identity", () => {
    const csv = [
      "PARCEL,ACCOUNTNO,NAME,ACCTTYPE",
      ",,GHOST RECORD,Vacant Land",
      "12345,,REAL RECORD,Vacant Land",
    ].join("\n");

    const { parcels, skipped } = parseCountyCsv(csv, "weld");

    expect(parcels).toHaveLength(1);
    expect(skipped).toBe(1);
  });

  it("returns a fatal error when recognized Larimer headers cannot support scoring", () => {
    const csv = ["PARCELNUM,OWNER", "8712300005,OWNER FAMILY"].join("\n");

    const { fatalError } = parseCountyCsv(csv, "larimer");

    expect(fatalError).toContain("missing land-use, class, or value columns");
  });
});

describe("serializeMailingCsv", () => {
  it("emits vendor columns and quotes commas", () => {
    const lead = {
      id: "1",
      county: "weld",
      parcelNumber: "096310400017",
      accountNumber: "R123",
      ownerName: "SMITH, JOHN & JANE",
      ownerNameSecondary: "",
      mailingAddress1: "123 Elsewhere Ln",
      mailingAddress2: "",
      mailingCity: "Denver",
      mailingState: "CO",
      mailingZip: "80202",
      situsAddress: "5000 County Road 13",
      situsCity: "Windsor",
      situsState: "CO",
      situsZip: "80550",
      acreage: 4.2,
      propertyClass: "",
      landUse: "Vacant Land",
      zoning: "",
      saleDate: "2026-01-15",
      salePrice: 195_000,
      deedType: "WD",
      landActualValue: 180_000,
      improvementActualValue: 0,
      totalActualValue: 180_000,
      isLikelyVacant: true,
      isEntityOwner: false,
      mailingDiffersFromSitus: true,
      inTargetMarket: true,
      leadScore: 90,
      leadReason: "Likely vacant land.",
      sourceRowHash: "abc",
      firstSeenAt: "2026-07-07T00:00:00Z",
      lastSeenAt: "2026-07-07T00:00:00Z",
      lastRefreshedAt: "2026-07-07T00:00:00Z",
      status: "new",
      notes: "",
      sourceDataset: "weld_arcgis",
    } satisfies LandLead;

    const csv = serializeMailingCsv([lead]);
    const [header, row] = csv.split(/\r?\n/);

    expect(header).toBe(
      "Owner Name,Owner Name 2,Mailing Address 1,Mailing Address 2,City,State,ZIP,Property Address,Property City,County,Parcel Number,Account Number,Acreage,Sale Date,Sale Price,Lead Score,Lead Reason",
    );
    expect(row).toContain('"SMITH, JOHN & JANE"');
    expect(row).toContain("Weld");
    expect(row).toContain("90");
  });
});
