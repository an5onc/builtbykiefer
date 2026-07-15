import { describe, expect, it } from "vitest";
import {
  buildLeadRows,
  dedupeKeyFor,
  diffAgainstExisting,
  existingKey,
  type ExistingLead,
} from "./refresh";
import type { NormalizedParcel } from "./types";

const NOW = new Date("2026-07-07T00:00:00Z");

function parcel(overrides: Partial<NormalizedParcel>): NormalizedParcel {
  return {
    county: "weld",
    parcelNumber: "",
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
    sourceDataset: "test",
    ...overrides,
  };
}

describe("dedupeKeyFor", () => {
  it("prefers parcel number, falls back to account", () => {
    expect(dedupeKeyFor({ parcelNumber: "P1", accountNumber: "A1" })).toBe("P1");
    expect(dedupeKeyFor({ parcelNumber: "", accountNumber: "A1" })).toBe("acct:A1");
  });
});

describe("buildLeadRows", () => {
  it("dedupes within a batch by county + key, last write wins", () => {
    const rows = buildLeadRows(
      [
        parcel({ parcelNumber: "P1", ownerName: "OLD OWNER" }),
        parcel({ parcelNumber: "P1", ownerName: "NEW OWNER" }),
        parcel({ parcelNumber: "P2" }),
      ],
      NOW,
    );

    expect(rows).toHaveLength(2);
    const p1 = rows.find((r) => r.parcelNumber === "P1");
    expect(p1?.ownerName).toBe("NEW OWNER");
  });

  it("drops parcels with no identity and computes score + hash", () => {
    const rows = buildLeadRows([parcel({ parcelNumber: "", accountNumber: "" })], NOW);
    expect(rows).toHaveLength(0);
  });

  it("attaches a dedupe key and non-empty hash", () => {
    const [row] = buildLeadRows([parcel({ parcelNumber: "P1" })], NOW);
    expect(row.dedupeKey).toBe("P1");
    expect(row.sourceRowHash).toMatch(/^[0-9a-f]{64}$/);
    expect(row.leadScore).toBeGreaterThan(0);
  });
});

describe("diffAgainstExisting", () => {
  it("splits new, updated, and unchanged", () => {
    const computed = buildLeadRows(
      [
        parcel({ parcelNumber: "NEW" }),
        parcel({ parcelNumber: "CHANGED", ownerName: "UPDATED OWNER" }),
        parcel({ parcelNumber: "SAME" }),
      ],
      NOW,
    );

    const sameHash = computed.find((r) => r.parcelNumber === "SAME")!.sourceRowHash;

    const existing = new Map<string, ExistingLead>([
      [existingKey("weld", "CHANGED"), { id: "id-changed", hash: "stale-hash" }],
      [existingKey("weld", "SAME"), { id: "id-same", hash: sameHash }],
    ]);

    const diff = diffAgainstExisting(computed, existing);

    expect(diff.newCount).toBe(1);
    expect(diff.updatedCount).toBe(1);
    expect(diff.unchangedIds).toEqual(["id-same"]);
    expect(diff.toUpsert.map((r) => r.parcelNumber).sort()).toEqual(["CHANGED", "NEW"]);
  });
});
