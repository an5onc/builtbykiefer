import { describe, expect, it } from "vitest";
import { isLikelyVacant } from "./vacancy";
import type { NormalizedParcel } from "./types";

function parcel(overrides: Partial<NormalizedParcel>): NormalizedParcel {
  return {
    county: "weld",
    parcelNumber: "1",
    accountNumber: "",
    ownerName: "OWNER",
    ownerNameSecondary: "",
    mailingAddress1: "",
    mailingAddress2: "",
    mailingCity: "",
    mailingState: "",
    mailingZip: "",
    situsAddress: "",
    situsCity: "",
    situsState: "CO",
    situsZip: "",
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

describe("isLikelyVacant", () => {
  it("flags Weld 'Vacant Land' land use", () => {
    expect(isLikelyVacant(parcel({ landUse: "Vacant Land" }))).toBe(true);
  });

  it("flags Larimer vacant (01xx) class codes", () => {
    expect(isLikelyVacant(parcel({ propertyClass: "0100" }))).toBe(true);
  });

  it("does not flag broad agricultural (4xxx) class codes without corroborating value data", () => {
    expect(isLikelyVacant(parcel({ propertyClass: "4117" }))).toBe(false);
    expect(
      isLikelyVacant(
        parcel({
          propertyClass: "4117",
          landActualValue: 120_000,
          improvementActualValue: 0,
        }),
      ),
    ).toBe(true);
  });

  it("flags land value present with zero improvement value", () => {
    expect(
      isLikelyVacant(parcel({ landActualValue: 120_000, improvementActualValue: 0 })),
    ).toBe(true);
  });

  it("does not flag an improved residential parcel", () => {
    expect(
      isLikelyVacant(
        parcel({
          landUse: "Residential",
          propertyClass: "1212",
          landActualValue: 90_000,
          improvementActualValue: 350_000,
        }),
      ),
    ).toBe(false);
  });
});
