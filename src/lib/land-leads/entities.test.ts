import { describe, expect, it } from "vitest";
import { isLikelyEntityOwner } from "./entities";

describe("isLikelyEntityOwner", () => {
  it("flags company / developer / government / utility owners", () => {
    for (const name of [
      "SUMMIT CREEK HOLDINGS LLC",
      "NORTHERN HOMES INC",
      "BIG SKY DEVELOPMENT CORP",
      "CITY OF GREELEY",
      "WELD COUNTY SCHOOL DISTRICT",
      "POUDRE VALLEY UTILITIES",
      "FIRST NATIONAL BANK",
      "RIDGELINE PROPERTIES",
    ]) {
      expect(isLikelyEntityOwner(name), name).toBe(true);
    }
  });

  it("does not flag ordinary household owners", () => {
    for (const name of [
      "DOE JANE",
      "SMITH JOHN & MARY",
      "GARCIA LUIS",
      "MCCORMICK PATRICK",
    ]) {
      expect(isLikelyEntityOwner(name), name).toBe(false);
    }
  });

  it("does not flag family or living trusts", () => {
    expect(isLikelyEntityOwner("DOE FAMILY TRUST")).toBe(false);
    expect(isLikelyEntityOwner("SMITH LIVING TRUST")).toBe(false);
  });

  it("returns false for empty owner names", () => {
    expect(isLikelyEntityOwner("")).toBe(false);
    expect(isLikelyEntityOwner("   ")).toBe(false);
  });
});
