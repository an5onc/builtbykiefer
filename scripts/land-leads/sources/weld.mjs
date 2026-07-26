/**
 * Weld County adapter.
 *
 * Weld publishes its assessor data as a public ArcGIS open-data service - the
 * same layer behind the county's own Assessor Data Explorer. Querying it needs
 * no credentials and no manual download, and unlike Larimer it returns owner
 * name, mailing address, last sale and parcel facts from a single layer.
 *
 * The bulk CSV on the county website is served through a CDN that refuses
 * automated requests, and the recorder's self-service portal prohibits
 * automated searches outright. This adapter touches neither.
 *
 * Any CSV dropped in the inbox is still read and merged, so a manual export
 * remains usable if the service is ever unavailable.
 */

import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { readCsv } from '../lib/csv.mjs';
import { makeLead, parseAcres, parseDate, parseMoney, clean } from '../normalize.mjs';

const PAGE_SIZE = 2000; // the service's maxRecordCount

const FIELDS = [
  'ACCOUNTNO', 'RECEPTION_', 'PARCEL',
  'NAME', 'ADDRESS1', 'ADDRESS2', 'CITY', 'STATE', 'ZIPCODE',
  'SITUS', 'LOCCITY', 'SUBNAME',
  'GIS_Acres', 'IMPACT', 'SALEP', 'SALEDT', 'DEEDTYPE', 'ACCTTYPE',
].join(',');

/** Format a Date as the SQL literal the ArcGIS query endpoint expects. */
function sqlDate(date) {
  return `DATE '${date.toISOString().slice(0, 10)}'`;
}

/**
 * Fetch every parcel whose last sale is on or after `since`, following the
 * service's 2000-record page limit.
 */
async function queryWeldService(serviceUrl, since, log) {
  const leads = [];
  let offset = 0;

  for (;;) {
    const params = new URLSearchParams({
      where: `SALEDT >= ${sqlDate(since)}`,
      outFields: FIELDS,
      orderByFields: 'SALEDT DESC',
      returnGeometry: 'false',
      resultOffset: String(offset),
      resultRecordCount: String(PAGE_SIZE),
      f: 'json',
    });

    const res = await fetch(`${serviceUrl}/query?${params}`);
    if (!res.ok) throw new Error(`Weld service returned ${res.status} ${res.statusText}`);

    const body = await res.json();
    if (body.error) {
      throw new Error(`Weld service error: ${body.error.message || JSON.stringify(body.error)}`);
    }

    const features = body.features || [];
    for (const { attributes: a } of features) {
      // IMPACT is the assessed value of improvements. Zero means nothing is
      // built on the parcel, which is Weld's equivalent of a blank building
      // count in Larimer.
      const improvementValue = Number(a.IMPACT) || 0;

      leads.push(
        makeLead({
          county: 'Weld',
          accountNo: clean(a.ACCOUNTNO),
          receptionNo: clean(a.RECEPTION_),
          parcelNo: clean(a.PARCEL),
          buyerName: a.NAME,
          mailName: a.NAME,
          mailAddress1: a.ADDRESS1,
          mailAddress2: a.ADDRESS2,
          mailCity: a.CITY,
          mailState: a.STATE,
          mailZip: a.ZIPCODE,
          situsAddress: a.SITUS,
          situsCity: a.LOCCITY,
          subdivision: a.SUBNAME,
          acres: Number(a.GIS_Acres) || 0,
          buildingCount: improvementValue > 0 ? 1 : 0,
          salePrice: Number(a.SALEP) || 0,
          saleDate: a.SALEDT ? new Date(a.SALEDT) : null,
          deedCode: a.DEEDTYPE,
          accountType: a.ACCTTYPE,
        })
      );
    }

    offset += features.length;
    if (features.length < PAGE_SIZE || !body.exceededTransferLimit) break;
  }

  log(`  open-data service: ${leads.length.toLocaleString()} parcels sold since ${since.toISOString().slice(0, 10)}`);
  return leads;
}

/* ------------------------------------------------------------------ *
 * Manual CSV fallback
 * ------------------------------------------------------------------ */

/** Candidate header names for each field, highest priority first. */
const ALIASES = {
  accountNo: ['accountno', 'account_no', 'account', 'accountnumber', 'parcelid', 'schedule', 'schedno'],
  receptionNo: ['reception_', 'recptno', 'receptionno', 'reception', 'docno', 'documentno'],
  parcelNo: ['parcelno', 'parcel_no', 'parcelnumber', 'parcel'],
  buyerName: ['grantee', 'buyer', 'ownername', 'owner_name', 'owner', 'name1', 'name'],
  sellerName: ['grantor', 'seller'],
  mailAddress1: ['mailaddress1', 'mailingaddress1', 'mailaddr1', 'address1', 'mailingaddress', 'mailaddress'],
  mailAddress2: ['mailaddress2', 'mailingaddress2', 'mailaddr2', 'address2'],
  mailCity: ['mailcity', 'mailingcity', 'city'],
  mailState: ['mailstate', 'mailingstate', 'state'],
  mailZip: ['mailzipcode', 'mailzip', 'mailingzip', 'zipcode', 'zip'],
  situsAddress: ['situsaddress', 'situs', 'propertyaddress', 'locationaddress', 'situsaddr'],
  situsCity: ['situscity', 'propertycity', 'loccity'],
  situsZip: ['situszipcode', 'situszip', 'propertyzip'],
  subdivision: ['subdivisionname', 'subdivision', 'subname'],
  acres: ['gis_acres', 'landgrossacres', 'grossacres', 'acres', 'acreage', 'totalacres', 'deededacres'],
  buildingCount: ['buildingcount', 'bldgcount', 'buildings', 'improvementcount', 'impcount'],
  improvementValue: ['impact', 'impasd', 'improvementvalue'],
  salePrice: ['salep', 'saleprice', 'price', 'saleamount', 'considerationamount'],
  saleDate: ['saledt', 'saledate', 'dateofsale', 'recordingdate', 'docdt'],
  deedCode: ['deedtype', 'deedcode', 'instrumenttype', 'doctype'],
  deedDescription: ['deeddescription', 'deeddesc', 'instrumentdescription'],
  accountType: ['accttype', 'accounttype', 'propertytype', 'classcode', 'proptype'],
  impvac: ['impvac', 'improvedvacant', 'vacantimproved', 'improvementstatus'],
};

/** Map a file's actual headers onto canonical field names. */
export function resolveColumns(headers) {
  const norm = new Map();
  for (const h of headers) norm.set(h.toLowerCase().replace(/[^a-z0-9]/g, ''), h);

  const mapping = {};
  for (const [field, aliases] of Object.entries(ALIASES)) {
    for (const alias of aliases) {
      if (norm.has(alias)) {
        mapping[field] = norm.get(alias);
        break;
      }
    }
  }
  return mapping;
}

/** Read any CSV dropped in the Weld inbox. */
async function loadWeldInbox({ config, since, log }) {
  const dir = config.paths.weldInbox;
  let files = [];
  try {
    files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith('.csv'));
  } catch {
    return [];
  }
  if (files.length === 0) return [];

  const leads = [];
  for (const file of files) {
    let mapping = null;
    let kept = 0;

    for await (const row of readCsv(path.join(dir, file))) {
      if (!mapping) {
        mapping = resolveColumns(Object.keys(row));
        const missing = ['buyerName', 'saleDate'].filter((f) => !mapping[f]);
        if (missing.length) {
          log(`  ${file}: missing column(s) ${missing.join(', ')} - skipping file`);
          break;
        }
      }
      const get = (field) => (mapping[field] ? row[mapping[field]] : '');

      const saleDate = parseDate(get('saleDate'));
      if (!saleDate || saleDate < since) continue;

      let buildingCount = null;
      const bc = clean(get('buildingCount'));
      const impVal = clean(get('improvementValue'));
      const iv = clean(get('impvac')).toLowerCase();
      if (bc !== '') buildingCount = Number(bc);
      else if (impVal !== '') buildingCount = Number(impVal) > 0 ? 1 : 0;
      else if (iv.startsWith('vac')) buildingCount = 0;
      else if (iv.startsWith('imp')) buildingCount = 1;

      kept++;
      leads.push(
        makeLead({
          county: 'Weld',
          accountNo: clean(get('accountNo')),
          receptionNo: clean(get('receptionNo')),
          parcelNo: clean(get('parcelNo')),
          buyerName: get('buyerName'),
          sellerName: get('sellerName'),
          mailName: get('buyerName'),
          mailAddress1: get('mailAddress1'),
          mailAddress2: get('mailAddress2'),
          mailCity: get('mailCity'),
          mailState: get('mailState') || 'CO',
          mailZip: get('mailZip'),
          situsAddress: get('situsAddress'),
          situsCity: get('situsCity'),
          situsZip: get('situsZip'),
          subdivision: get('subdivision'),
          acres: parseAcres(get('acres')),
          buildingCount,
          salePrice: parseMoney(get('salePrice')),
          saleDate,
          deedCode: get('deedCode'),
          deedDescription: get('deedDescription'),
          accountType: get('accountType'),
        })
      );
    }
    log(`  inbox ${file}: ${kept.toLocaleString()} rows within lookback window`);
  }
  return leads;
}

/**
 * Produce normalized Weld leads.
 * Queries the open-data service, then merges anything in the manual inbox.
 */
export async function loadWeldLeads({ config, since, log = () => {}, offline = false }) {
  const leads = [];

  if (!offline && config.weldParcelService) {
    try {
      leads.push(...(await queryWeldService(config.weldParcelService, since, log)));
    } catch (err) {
      log(`  open-data service unavailable (${err.message})`);
      log('  falling back to the manual inbox; see README to download this week\'s CSV');
    }
  } else if (offline) {
    log('  offline mode, skipping the open-data service');
  }

  const inbox = await loadWeldInbox({ config, since, log });
  if (inbox.length) leads.push(...inbox);

  // A parcel present in both the service and a dropped CSV should appear once.
  const seen = new Set();
  return leads.filter((l) => {
    if (seen.has(l.key)) return false;
    seen.add(l.key);
    return true;
  });
}
