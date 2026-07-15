import {
  DESIRABLE_ACREAGE,
  LOW_VALUE_FLOOR,
  RECENT_SALE_DAYS,
  SALE_PRICE_BONUS_THRESHOLD,
  SCORE_WEIGHTS,
} from "./constants";
import type { LeadSignals, NormalizedParcel } from "./types";

export interface ScoreResult {
  score: number; // clamped 0–100
  rawScore: number;
  reasons: string[];
  leadReason: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function daysBetween(fromIso: string, now: Date): number {
  const then = new Date(`${fromIso}T00:00:00Z`).getTime();

  if (Number.isNaN(then)) {
    return Number.POSITIVE_INFINITY;
  }

  return (now.getTime() - then) / DAY_MS;
}

/**
 * Score a parcel 0–100 for custom-home direct-mail fit and build a
 * human-readable reason string. `now` is injected so scoring is deterministic
 * and testable.
 */
export function scoreLead(
  parcel: NormalizedParcel,
  signals: LeadSignals,
  now: Date,
): ScoreResult {
  const reasons: string[] = [];
  let score = 0;

  if (signals.isLikelyVacant) {
    score += SCORE_WEIGHTS.vacant;
    reasons.push("Likely vacant land");
  }

  const soldRecently =
    parcel.saleDate !== null && daysBetween(parcel.saleDate, now) <= RECENT_SALE_DAYS;
  if (soldRecently) {
    score += SCORE_WEIGHTS.recentSale;
    reasons.push(`Sold within the last ${RECENT_SALE_DAYS} days`);
  }

  if (signals.mailingDiffersFromSitus) {
    score += SCORE_WEIGHTS.mailingDiffers;
    reasons.push("Owner mailing address differs from the property address");
  }

  if (parcel.salePrice !== null && parcel.salePrice >= SALE_PRICE_BONUS_THRESHOLD) {
    score += SCORE_WEIGHTS.priceAboveThreshold;
    reasons.push("Sale price above threshold");
  }

  if (
    parcel.acreage !== null &&
    parcel.acreage >= DESIRABLE_ACREAGE.min &&
    parcel.acreage <= DESIRABLE_ACREAGE.max
  ) {
    score += SCORE_WEIGHTS.desirableAcreage;
    reasons.push("Acreage in the desirable custom-home range");
  }

  if (signals.inTargetMarket) {
    score += SCORE_WEIGHTS.targetMarket;
    reasons.push("In a target Northern Colorado market");
  }

  if (signals.isEntityOwner) {
    score += SCORE_WEIGHTS.entityOwner;
    reasons.push("Owner looks like a company, developer, or government entity");
  }

  if (parcel.mailingAddress1.trim() === "") {
    score += SCORE_WEIGHTS.missingMailing;
    reasons.push("No mailing address on record");
  }

  if (parcel.saleDate === null) {
    score += SCORE_WEIGHTS.missingSaleDate;
    reasons.push("No sale date on record");
  }

  if (parcel.totalActualValue !== null && parcel.totalActualValue < LOW_VALUE_FLOOR) {
    score += SCORE_WEIGHTS.lowValue;
    reasons.push("Very low parcel value");
  }

  const clamped = Math.max(0, Math.min(100, score));

  return {
    score: clamped,
    rawScore: score,
    reasons,
    leadReason: reasons.length > 0 ? `${reasons.join("; ")}.` : "No scoring signals matched.",
  };
}
