/**
 * Shared lead shape and field-level cleanup.
 *
 * Both county adapters emit this shape so qualify/sheet/notify never need to
 * know which county a record came from.
 */

/** Parse the assorted county date formats into a Date, or null. */
export function parseDate(value) {
  const s = (value || '').trim();
  if (!s) return null;

  // "2026-07-06 00:00:00", "2026-07-06", "2008/09/19 00:00:00+00", "07/06/2026"
  const iso = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (iso) {
    const d = new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const us = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (us) {
    const d = new Date(Date.UTC(+us[3], +us[1] - 1, +us[2]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** Parse a currency-ish string into a number. */
export function parseMoney(value) {
  const n = Number(String(value ?? '').replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Parse an acreage string into a number. */
export function parseAcres(value) {
  const n = Number(String(value ?? '').replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Collapse whitespace and trim. */
export function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Title-case a SHOUTING county name for postcard use:
 * "SMITH JOHN A" -> "Smith John A".
 *
 * Initialisms are restored afterwards. TBD matters most: the county uses it for
 * parcels with no street number assigned yet ("TBD DEWCLAW RD"), which is a
 * common and useful signal that the land is genuinely raw.
 */
const KEEP_UPPERCASE = /\b(Llc|Llp|Lp|Inc|Ii|Iii|Iv|Tbd|Po|Ne|Nw|Se|Sw)\b/g;

export function titleCase(value) {
  return clean(value)
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(KEEP_UPPERCASE, (m) => m.toUpperCase());
}

/** ISO date (YYYY-MM-DD) or empty string. */
export function isoDate(date) {
  return date ? date.toISOString().slice(0, 10) : '';
}

/**
 * A normalized lead.
 * `key` is the stable identity used for deduplication across runs.
 */
export function makeLead(fields) {
  const {
    county,
    accountNo = '',
    receptionNo = '',
    parcelNo = '',
    buyerName = '',
    sellerName = '',
    mailName = '',
    mailAddress1 = '',
    mailAddress2 = '',
    mailCity = '',
    mailState = '',
    mailZip = '',
    situsAddress = '',
    situsCity = '',
    situsZip = '',
    subdivision = '',
    acres = 0,
    buildingCount = null,
    salePrice = 0,
    saleDate = null,
    deedCode = '',
    deedDescription = '',
    accountType = '',
  } = fields;

  return {
    key: `${county}:${accountNo}:${receptionNo}`,
    county,
    accountNo,
    receptionNo,
    parcelNo,
    buyerName: clean(buyerName),
    sellerName: clean(sellerName),
    mailName: clean(mailName) || clean(buyerName),
    mailAddress1: clean(mailAddress1),
    mailAddress2: clean(mailAddress2),
    mailCity: clean(mailCity),
    mailState: clean(mailState),
    mailZip: clean(mailZip),
    situsAddress: clean(situsAddress),
    situsCity: clean(situsCity),
    situsZip: clean(situsZip),
    subdivision: clean(subdivision),
    acres,
    buildingCount,
    salePrice,
    saleDate,
    deedCode: clean(deedCode),
    deedDescription: clean(deedDescription),
    accountType: clean(accountType),
  };
}
