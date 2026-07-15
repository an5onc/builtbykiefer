import { describe, expect, it } from "vitest";
import {
  applyLeadFilters,
  parseLandLeadFilters,
  parseLandLeadNotesFormData,
  parseLandLeadStatusFormData,
} from "./filters";
import type { LandLead } from "./types";

function lead(overrides: Partial<LandLead>): LandLead {
  return {
    id: "1",
    county: "weld",
    parcelNumber: "1",
    accountNumber: "",
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
    acreage: 5,
    propertyClass: "",
    landUse: "Vacant Land",
    zoning: "",
    saleDate: "2026-06-01",
    salePrice: 200_000,
    deedType: "",
    landActualValue: 180_000,
    improvementActualValue: 0,
    totalActualValue: 180_000,
    isLikelyVacant: true,
    isEntityOwner: false,
    mailingDiffersFromSitus: true,
    inTargetMarket: true,
    leadScore: 90,
    leadReason: "",
    sourceRowHash: "h",
    firstSeenAt: "2026-07-07T00:00:00Z",
    lastSeenAt: "2026-07-07T00:00:00Z",
    lastRefreshedAt: "2026-07-07T00:00:00Z",
    status: "new",
    notes: "",
    sourceDataset: "weld_arcgis",
    ...overrides,
  };
}

describe("parseLandLeadFilters", () => {
  it("defaults everything to null / false with empty params", () => {
    expect(parseLandLeadFilters({})).toEqual({
      county: null,
      saleWindowDays: null,
      minSalePrice: null,
      minAcreage: null,
      excludeLikelyDevelopers: false,
      requireDifferentMailingAddress: false,
      status: null,
    });
  });

  it("parses valid params and ignores invalid enum values", () => {
    expect(
      parseLandLeadFilters({
        county: "larimer",
        saleWindow: "180",
        minSalePrice: "$150,000",
        minAcreage: "2",
        excludeDevelopers: "1",
        mailingDiffers: "1",
        status: "bogus",
      }),
    ).toEqual({
      county: "larimer",
      saleWindowDays: 180,
      minSalePrice: 150_000,
      minAcreage: 2,
      excludeLikelyDevelopers: true,
      requireDifferentMailingAddress: true,
      status: null,
    });
  });
});

describe("applyLeadFilters", () => {
  const now = new Date("2026-07-07T00:00:00Z");

  it("filters by county, min price, acreage, and entity exclusion", () => {
    const leads = [
      lead({ id: "keep" }),
      lead({ id: "other-county", county: "larimer" }),
      lead({ id: "cheap", salePrice: 50_000 }),
      lead({ id: "entity", isEntityOwner: true }),
    ];

    const result = applyLeadFilters(
      leads,
      {
        county: "weld",
        saleWindowDays: null,
        minSalePrice: 100_000,
        minAcreage: 1,
        excludeLikelyDevelopers: true,
        requireDifferentMailingAddress: false,
        status: null,
      },
      now,
    );

    expect(result.map((l) => l.id)).toEqual(["keep"]);
  });

  it("excludes leads outside the sale-date window", () => {
    const leads = [
      lead({ id: "recent", saleDate: "2026-06-01" }),
      lead({ id: "old", saleDate: "2024-01-01" }),
      lead({ id: "no-sale", saleDate: null }),
    ];

    const result = applyLeadFilters(
      leads,
      {
        county: null,
        saleWindowDays: 90,
        minSalePrice: null,
        minAcreage: null,
        excludeLikelyDevelopers: false,
        requireDifferentMailingAddress: false,
        status: null,
      },
      now,
    );

    expect(result.map((l) => l.id)).toEqual(["recent"]);
  });
});

describe("status / notes form parsers", () => {
  it("accepts a valid status", () => {
    const formData = new FormData();
    formData.set("status", "contacted");
    expect(parseLandLeadStatusFormData(formData)).toEqual({ status: "contacted" });
  });

  it("rejects an unknown status", () => {
    const formData = new FormData();
    formData.set("status", "archived");
    expect(() => parseLandLeadStatusFormData(formData)).toThrow("Choose a valid lead status.");
  });

  it("parses status + trimmed notes", () => {
    const formData = new FormData();
    formData.set("status", "reviewed");
    formData.set("notes", "  Called, left voicemail.  ");
    expect(parseLandLeadNotesFormData(formData)).toEqual({
      status: "reviewed",
      notes: "Called, left voicemail.",
    });
  });
});
