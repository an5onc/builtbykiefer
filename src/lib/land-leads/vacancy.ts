import type { NormalizedParcel } from "./types";

const VACANT_LAND_USE_PATTERNS = [
  /vacant/i,
  /undeveloped/i,
  /\bland\b/i,
  /agricultural/i,
];

/**
 * A parcel is likely vacant land when the land-use / class says so, or when it
 * has land value but no meaningful improvement value. Uses multiple signals so
 * one blank field doesn't produce a false positive or negative.
 *
 * - Weld: `landUse` (ACCTTYPE) is literally "Vacant Land"; class blank.
 * - Larimer: Colorado property class 01xx (vacant), plus any class with
 *   improvement value = 0 and land value present.
 */
export function isLikelyVacant(parcel: NormalizedParcel): boolean {
  const landUseSaysVacant = VACANT_LAND_USE_PATTERNS.some((pattern) =>
    pattern.test(parcel.landUse),
  );

  const cls = parcel.propertyClass.replace(/\D/g, "");
  const classSaysVacant = cls.startsWith("01");

  const { landActualValue, improvementActualValue } = parcel;
  const hasNoImprovementValue =
    (improvementActualValue === null || improvementActualValue === 0) &&
    landActualValue !== null &&
    landActualValue > 0;

  return landUseSaysVacant || classSaysVacant || hasNoImprovementValue;
}
