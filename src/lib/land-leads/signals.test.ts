import { describe, expect, it } from "vitest";
import { mailingDiffersFromSitus } from "./signals";
import type { NormalizedParcel } from "./types";

function parcel(overrides: Partial<NormalizedParcel>): NormalizedParcel {
  return {
    county: "weld",
    parcelNumber: "1",
    accountNumber: "",
    ownerName: "OWNER",
    ownerNameSecondary: "",
    mailingAddress1: "123 Main St",
    mailingAddress2: "",
    mailingCity: "Windsor",
    mailingState: "CO",
    mailingZip: "80550",
    situsAddress: "123 Main St",
    situsCity: "Windsor",
    situsState: "CO",
    situsZip: "80550",
    acreage: null,
    propertyClass: "",
    landUse: "",
    zoning: "",
    saleDate: null,
    salePrice: null,
    deedType: "",
    landActualValue: null,
    improvementActualValue: null,
    totalActualValue: null,
    sourceDataset: "test",
    ...overrides,
  };
}

describe("mailingDiffersFromSitus", () => {
  it("does not treat a missing situs ZIP as an absentee-owner signal when street and city match", () => {
    expect(mailingDiffersFromSitus(parcel({ situsZip: "" }))).toBe(false);
  });

  it("still detects different street addresses in the same city", () => {
    expect(mailingDiffersFromSitus(parcel({ situsAddress: "5000 County Road 13" }))).toBe(true);
  });
});
