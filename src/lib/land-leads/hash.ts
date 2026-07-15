import { createHash } from "node:crypto";
import type { NormalizedParcel } from "./types";

/**
 * Stable hash of the source data fields of a parcel — used for change
 * detection across refreshes. Excludes provenance (sourceDataset), derived
 * scores, admin status/notes, and timestamps so only genuine source changes
 * flip the hash. Field order is fixed, so the digest is order-independent of
 * the incoming object.
 */
export function sourceRowHash(parcel: NormalizedParcel): string {
  const canonical = [
    parcel.county,
    parcel.parcelNumber,
    parcel.accountNumber,
    parcel.ownerName,
    parcel.ownerNameSecondary,
    parcel.mailingAddress1,
    parcel.mailingAddress2,
    parcel.mailingCity,
    parcel.mailingState,
    parcel.mailingZip,
    parcel.situsAddress,
    parcel.situsCity,
    parcel.situsState,
    parcel.situsZip,
    parcel.acreage,
    parcel.propertyClass,
    parcel.landUse,
    parcel.zoning,
    parcel.saleDate,
    parcel.salePrice,
    parcel.deedType,
    parcel.landActualValue,
    parcel.improvementActualValue,
    parcel.totalActualValue,
  ];

  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}
