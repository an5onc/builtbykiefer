import { sourceRowHash } from "./hash";
import { scoreLead } from "./score";
import { deriveSignals } from "./signals";
import type { ComputedLandLead, LandLeadCounty, NormalizedParcel } from "./types";

/** Dedupe key matching the DB generated column: parcel, else `acct:<account>`. */
export function dedupeKeyFor(parcel: {
  parcelNumber: string;
  accountNumber: string;
}): string {
  const parcelNumber = parcel.parcelNumber.trim();

  if (parcelNumber !== "") {
    return parcelNumber;
  }

  return `acct:${parcel.accountNumber.trim()}`;
}

/** Composite map key across counties. */
export function existingKey(county: LandLeadCounty, dedupeKey: string): string {
  return `${county}::${dedupeKey}`;
}

/**
 * Enrich normalized parcels with signals, score, hash, and dedupe key, deduping
 * within the batch by county + dedupe key (last occurrence wins). Parcels with
 * no usable identity are dropped.
 */
export function buildLeadRows(parcels: NormalizedParcel[], now: Date): ComputedLandLead[] {
  const byKey = new Map<string, ComputedLandLead>();

  for (const parcel of parcels) {
    const parcelNumber = parcel.parcelNumber.trim();
    const accountNumber = parcel.accountNumber.trim();

    if (parcelNumber === "" && accountNumber === "") {
      continue;
    }

    const dedupeKey = dedupeKeyFor(parcel);
    const signals = deriveSignals(parcel);
    const { score, leadReason } = scoreLead(parcel, signals, now);

    byKey.set(existingKey(parcel.county, dedupeKey), {
      ...parcel,
      ...signals,
      leadScore: score,
      leadReason,
      sourceRowHash: sourceRowHash(parcel),
      dedupeKey,
    });
  }

  return Array.from(byKey.values());
}

export interface ExistingLead {
  id: string;
  hash: string;
}

export interface DiffResult {
  toUpsert: ComputedLandLead[];
  unchangedIds: string[];
  newCount: number;
  updatedCount: number;
}

/**
 * Split computed leads against what's already stored:
 * - not in the map            → new (upsert)
 * - in the map, hash changed  → updated (upsert)
 * - in the map, hash matches  → unchanged (just bump last_seen)
 */
export function diffAgainstExisting(
  computed: ComputedLandLead[],
  existing: Map<string, ExistingLead>,
): DiffResult {
  const toUpsert: ComputedLandLead[] = [];
  const unchangedIds: string[] = [];
  let newCount = 0;
  let updatedCount = 0;

  for (const lead of computed) {
    const key = existingKey(lead.county, lead.dedupeKey);
    const prior = existing.get(key);

    if (!prior) {
      toUpsert.push(lead);
      newCount += 1;
      continue;
    }

    if (prior.hash !== lead.sourceRowHash) {
      toUpsert.push(lead);
      updatedCount += 1;
      continue;
    }

    unchangedIds.push(prior.id);
  }

  return { toUpsert, unchangedIds, newCount, updatedCount };
}
