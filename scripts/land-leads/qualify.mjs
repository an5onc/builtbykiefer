/**
 * Turns raw county sales into a mailable list.
 *
 * Larimer alone produces ~100 arms-length vacant-land sales per week. Nobody is
 * hand-addressing 100 postcards a week, so this stage narrows to the parcels
 * that actually look like "someone bought a homesite and needs a builder", and
 * records WHY each one matched so a human can sanity-check it in the sheet.
 */

import { config as defaultConfig } from './config.mjs';

/** Classify the buyer: Individual, LLC/Entity, or a flagged non-prospect. */
export function classifyBuyer(name, config = defaultConfig) {
  const n = String(name || '');
  if (!n.trim()) return { type: 'Unknown', flagged: true, flagReason: 'No buyer name' };

  for (const pattern of config.excludePatterns) {
    const m = n.match(pattern);
    if (m) {
      return { type: 'Entity', flagged: true, flagReason: `Looks like ${m[0]}` };
    }
  }
  const isEntity = config.entityPatterns.some((p) => p.test(n));
  return {
    type: isEntity ? 'LLC / Entity' : 'Individual',
    flagged: false,
    flagReason: '',
  };
}

/**
 * True when the parcel has no structure on it.
 * null means the county record could not be found at all.
 */
export function isVacant(lead) {
  if (lead.buildingCount === null || lead.buildingCount === undefined) return null;
  return Number(lead.buildingCount) === 0;
}

/**
 * Does this lead have enough of an address to actually mail a postcard?
 *
 * Larimer never populates MAILADDRESS1 on its own: for ~97% of records the
 * street address is in MAILADDRESS2 and MAILADDRESS1 is an optional first line
 * (care-of, suite, ranch name). Requiring MAILADDRESS1 discards nearly every
 * real address, so either line satisfies the street requirement.
 *
 * State is not required: foreign addresses carry the country in the city field
 * and leave state blank.
 */
export function isMailable(lead) {
  const street = lead.mailAddress1 || lead.mailAddress2;
  return Boolean(street && lead.mailCity && lead.mailZip);
}

/**
 * Evaluate one lead.
 * Returns { qualified, reasons[], rejections[], buyer }.
 */
export function evaluate(lead, { config = defaultConfig, now = new Date() } = {}) {
  const reasons = [];
  const rejections = [];

  // --- Recency -------------------------------------------------------------
  const days = lead.saleDate ? Math.floor((now - lead.saleDate) / 86_400_000) : null;
  if (days === null) {
    rejections.push('No sale date');
  } else if (days > config.lookbackDays) {
    rejections.push(`Sale is ${days} days old`);
  } else {
    reasons.push(`Sold ${days} day${days === 1 ? '' : 's'} ago`);
  }

  // --- Arms-length transaction --------------------------------------------
  const deed = (lead.deedCode || '').toUpperCase();
  if (!config.armsLengthDeedCodes.includes(deed)) {
    rejections.push(`Deed type ${deed || '(none)'} is not an arms-length sale`);
  } else {
    reasons.push(`${lead.deedDescription || deed}`);
  }

  // --- Real money changed hands -------------------------------------------
  if (lead.salePrice < config.minSalePrice) {
    rejections.push(`Sale price ${lead.salePrice ? `$${lead.salePrice.toLocaleString()}` : '$0'} below threshold`);
  } else {
    reasons.push(`$${lead.salePrice.toLocaleString()}`);
  }

  // --- Vacant land ---------------------------------------------------------
  const vacant = isVacant(lead);
  if (vacant === false) {
    rejections.push(`Has ${lead.buildingCount} building(s)`);
  } else if (vacant === null) {
    rejections.push('No matching parcel record');
  } else {
    reasons.push('Vacant land');
  }

  // --- Property is a homesite, not equipment or mineral rights ------------
  if (config.allowedAccountTypes?.length && lead.accountType) {
    if (!config.allowedAccountTypes.includes(lead.accountType)) {
      rejections.push(`Account type ${lead.accountType}`);
    }
  }

  // --- Buildable-size homesite --------------------------------------------
  if (lead.acres < config.acres.min) {
    rejections.push(`${lead.acres} acres is below minimum`);
  } else if (lead.acres > config.acres.max) {
    rejections.push(`${lead.acres} acres is above maximum`);
  } else {
    reasons.push(`${lead.acres} acres`);
  }

  // --- Price per acre sanity check ----------------------------------------
  // Catches finished homes the assessor has not recorded yet, and builders
  // buying blocks of platted lots. Both look like "vacant land" in the data.
  if (config.maxPricePerAcre && lead.acres > 0 && lead.salePrice > 0) {
    const perAcre = lead.salePrice / lead.acres;
    if (perAcre > config.maxPricePerAcre) {
      rejections.push(`$${Math.round(perAcre).toLocaleString()}/acre suggests a home, not bare land`);
    }
  }

  // --- Deliverable address -------------------------------------------------
  if (!isMailable(lead)) {
    rejections.push('No deliverable mailing address');
  }

  // --- Buyer type ----------------------------------------------------------
  const buyer = classifyBuyer(lead.buyerName, config);
  if (buyer.flagged) {
    rejections.push(buyer.flagReason);
  }

  return { qualified: rejections.length === 0, reasons, rejections, buyer };
}

/**
 * Run every lead through evaluate(), deduplicate multi-parcel sales, and
 * return the qualified ones plus a breakdown of why the rest were dropped.
 */
export function qualifyAll(leads, { config = defaultConfig, now = new Date() } = {}) {
  const qualified = [];
  const dropReasons = new Map();
  const seenInBatch = new Set();
  let duplicates = 0;

  for (const lead of leads) {
    const { qualified: ok, reasons, rejections, buyer } = evaluate(lead, { config, now });

    if (!ok) {
      // Attribute the drop to its first reason for the summary.
      const primary = rejections[0];
      dropReasons.set(primary, (dropReasons.get(primary) || 0) + 1);
      continue;
    }

    // One postcard per buyer+mailing address, even if they bought 6 parcels
    // in the same subdivision on the same day.
    const dedupeKey = `${lead.buyerName}|${lead.mailAddress1}|${lead.mailZip}`.toUpperCase();
    if (seenInBatch.has(dedupeKey)) {
      duplicates++;
      continue;
    }
    seenInBatch.add(dedupeKey);

    qualified.push({ ...lead, buyerType: buyer.type, matchReasons: reasons.join(' · ') });
  }

  qualified.sort((a, b) => (b.saleDate?.getTime() || 0) - (a.saleDate?.getTime() || 0));
  return { qualified, dropReasons, duplicates };
}
