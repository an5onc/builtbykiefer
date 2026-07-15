import { describe, expect, it } from "vitest";
import { sourceRowHash } from "./hash";
import type { NormalizedParcel } from "./types";

function parcel(overrides: Partial<NormalizedParcel> = {}): NormalizedParcel {
  return {
    county: "weld",
    parcelNumber: "096310400017",
    accountNumber: "R123",
    ownerName: "DOE JANE",
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
    sourceDataset: "weld_arcgis",
    ...overrides,
  };
}

describe("sourceRowHash", () => {
  it("is stable for identical source data", () => {
    expect(sourceRowHash(parcel())).toBe(sourceRowHash(parcel()));
  });

  it("changes when a source data field changes", () => {
    expect(sourceRowHash(parcel())).not.toBe(sourceRowHash(parcel({ salePrice: 200_000 })));
  });

  it("ignores provenance (sourceDataset) so relabeling does not churn", () => {
    expect(sourceRowHash(parcel())).toBe(
      sourceRowHash(parcel({ sourceDataset: "weld_csv_upload" })),
    );
  });
});
