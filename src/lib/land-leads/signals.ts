import { TARGET_CITIES } from "./constants";
import { isLikelyEntityOwner } from "./entities";
import { isLikelyVacant } from "./vacancy";
import type { LeadSignals, NormalizedParcel } from "./types";

/** Normalize an address blob to a comparable key: uppercase, alnum + spaces. */
function addressKey(...parts: string[]): string {
  return parts
    .join(" ")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when the owner's mailing address differs from the property (situs)
 * address — a strong "absentee owner" signal. Requires both a mailing line and
 * a situs line to compare; returns false when either is missing.
 */
export function mailingDiffersFromSitus(parcel: NormalizedParcel): boolean {
  const mailingAddress = addressKey(parcel.mailingAddress1);
  const situsAddress = addressKey(parcel.situsAddress);

  if (mailingAddress === "" || situsAddress === "") {
    return false;
  }

  if (mailingAddress !== situsAddress) {
    return true;
  }

  const mailingCity = addressKey(parcel.mailingCity);
  const situsCity = addressKey(parcel.situsCity);

  if (mailingCity !== "" && situsCity !== "" && mailingCity !== situsCity) {
    return true;
  }

  const mailingZip = addressKey(parcel.mailingZip);
  const situsZip = addressKey(parcel.situsZip);

  return mailingZip !== "" && situsZip !== "" && mailingZip !== situsZip;
}

/** True when the parcel's situs city is one of the target NoCo markets. */
export function inTargetMarket(parcel: NormalizedParcel): boolean {
  return TARGET_CITIES.has(parcel.situsCity.toLowerCase().trim());
}

export function deriveSignals(parcel: NormalizedParcel): LeadSignals {
  return {
    isLikelyVacant: isLikelyVacant(parcel),
    isEntityOwner: isLikelyEntityOwner(parcel.ownerName),
    mailingDiffersFromSitus: mailingDiffersFromSitus(parcel),
    inTargetMarket: inTargetMarket(parcel),
  };
}
