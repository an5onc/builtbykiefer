import { describe, expect, it } from "vitest";
import { scoreLead } from "./score";
import type { LeadSignals, NormalizedParcel } from "./types";

const NOW = new Date("2026-07-07T00:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

function isoDaysBefore(days: number): string {
  return new Date(NOW.getTime() - days * DAY_MS).toISOString().slice(0, 10);
}

function parcel(overrides: Partial<NormalizedParcel> = {}): NormalizedParcel {
  return {
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

function signals(overrides: Partial<LeadSignals> = {}): LeadSignals {
  return {
    isLikelyVacant: false,
    isEntityOwner: false,
    mailingDiffersFromSitus: false,
    inTargetMarket: false,
    ...overrides,
  };
}

describe("scoreLead", () => {
  it("awards each positive weight in isolation", () => {
    expect(
      scoreLead(parcel({ saleDate: isoDaysBefore(400) }), signals({ isLikelyVacant: true }), NOW).score,
    ).toBe(35);

    expect(
      scoreLead(parcel({ saleDate: isoDaysBefore(30) }), signals(), NOW).rawScore,
    ).toBe(25);

    expect(
      scoreLead(parcel({ saleDate: isoDaysBefore(400) }), signals({ mailingDiffersFromSitus: true }), NOW).rawScore,
    ).toBe(15);

    expect(
      scoreLead(parcel({ saleDate: isoDaysBefore(400), salePrice: 200_000 }), signals(), NOW).rawScore,
    ).toBe(10);

    expect(
      scoreLead(parcel({ saleDate: isoDaysBefore(400), acreage: 5 }), signals(), NOW).rawScore,
    ).toBe(10);

    expect(
      scoreLead(parcel({ saleDate: isoDaysBefore(400) }), signals({ inTargetMarket: true }), NOW).rawScore,
    ).toBe(5);
  });

  it("counts a sale exactly 180 days ago as recent, 181 days as not", () => {
    expect(scoreLead(parcel({ saleDate: isoDaysBefore(180) }), signals(), NOW).rawScore).toBe(25);
    expect(scoreLead(parcel({ saleDate: isoDaysBefore(181) }), signals(), NOW).rawScore).toBe(0);
  });

  it("applies penalties and clamps a poor record to zero", () => {
    const result = scoreLead(
      parcel({ mailingAddress1: "", saleDate: null, totalActualValue: 5_000 }),
      signals({ isEntityOwner: true }),
      NOW,
    );

    // -25 entity -15 missing mailing -15 missing sale date -10 low value = -65
    expect(result.rawScore).toBe(-65);
    expect(result.score).toBe(0);
  });

  it("clamps a strong record to 100 and lists reasons", () => {
    const result = scoreLead(
      parcel({
        saleDate: isoDaysBefore(30),
        salePrice: 300_000,
        acreage: 5,
        totalActualValue: 300_000,
      }),
      signals({ isLikelyVacant: true, mailingDiffersFromSitus: true, inTargetMarket: true }),
      NOW,
    );

    // 35 + 25 + 15 + 10 + 10 + 5 = 100
    expect(result.score).toBe(100);
    expect(result.leadReason).toContain("Likely vacant land");
    expect(result.leadReason).toContain("mailing address differs");
  });
});
