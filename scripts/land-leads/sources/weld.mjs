/**
 * Weld County adapter.
 *
 * Weld's assessor download is behind a CDN that blocks automated retrieval, and
 * their recorder's terms explicitly prohibit automated searches and scrapers.
 * So this adapter never touches the network: it reads whatever CSV you drop in
 * .land-leads-data/inbox/weld/ after downloading it in your browser.
 *
 * Because the exact Weld export format depends on which file you download, the
 * column mapping is resolved by matching header aliases rather than assuming
 * fixed names.
 */

import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { readCsv } from '../lib/csv.mjs';
import { makeLead, parseAcres, parseDate, parseMoney, clean } from '../normalize.mjs';

/** Candidate header names for each field we need, lowest-priority last. */
const ALIASES = {
  accountNo: ['accountno', 'account_no', 'account', 'accountnumber', 'parcelid', 'schedule', 'schedno'],
  receptionNo: ['recptno', 'receptionno', 'reception_no', 'reception', 'docno', 'documentno'],
  parcelNo: ['parcelno', 'parcel_no', 'parcelnumber', 'parcel'],
  buyerName: ['grantee', 'buyer', 'ownername', 'owner_name', 'owner', 'name1'],
  sellerName: ['grantor', 'seller'],
  mailAddress1: ['mailaddress1', 'mailingaddress1', 'mailaddr1', 'mailingaddress', 'mailaddress', 'address1'],
  mailAddress2: ['mailaddress2', 'mailingaddress2', 'mailaddr2', 'address2'],
  mailCity: ['mailcity', 'mailingcity', 'city'],
  mailState: ['mailstate', 'mailingstate', 'state'],
  mailZip: ['mailzipcode', 'mailzip', 'mailingzip', 'zipcode', 'zip'],
  situsAddress: ['situsaddress', 'situs', 'propertyaddress', 'locationaddress', 'situsaddr'],
  situsCity: ['situscity', 'propertycity'],
  situsZip: ['situszipcode', 'situszip', 'propertyzip'],
  subdivision: ['subdivisionname', 'subdivision', 'subname'],
  acres: ['landgrossacres', 'grossacres', 'acres', 'acreage', 'totalacres', 'deededacres'],
  buildingCount: ['buildingcount', 'bldgcount', 'buildings', 'improvementcount'],
  salePrice: ['saleprice', 'salep', 'price', 'saleamount', 'considerationamount'],
  saleDate: ['saledate', 'saledt', 'dateofsale', 'recordingdate', 'docdt'],
  deedCode: ['deedcode', 'deedtype', 'instrumenttype', 'doctype'],
  deedDescription: ['deeddescription', 'deeddesc', 'instrumentdescription'],
  accountType: ['accttype', 'accounttype', 'propertytype', 'classcode', 'proptype'],
  impvac: ['impvac', 'improvedvacant', 'vacantimproved', 'improvementstatus'],
};

/** Build header -> canonical field mapping for an actual file's headers. */
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

/** Read every CSV in the Weld inbox and normalize it. */
export async function loadWeldLeads({ config, since, log = () => {} }) {
  const dir = config.paths.weldInbox;
  let files = [];
  try {
    files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith('.csv'));
  } catch {
    log(`Weld: inbox ${dir} not found, skipping`);
    return [];
  }

  if (files.length === 0) {
    log(`Weld: no CSV in ${dir} - download this week's file and drop it there (see README)`);
    return [];
  }

  const leads = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    let mapping = null;
    let rows = 0;
    let kept = 0;

    for await (const row of readCsv(filePath)) {
      if (!mapping) {
        mapping = resolveColumns(Object.keys(row));
        const missing = ['buyerName', 'saleDate'].filter((f) => !mapping[f]);
        if (missing.length) {
          log(`Weld: ${file} is missing required column(s): ${missing.join(', ')} - skipping file`);
          break;
        }
      }
      rows++;
      const get = (field) => (mapping[field] ? row[mapping[field]] : '');

      const saleDate = parseDate(get('saleDate'));
      if (!saleDate || saleDate < since) continue;

      // Some Weld exports carry a Vacant/Improved string instead of a count.
      let buildingCount = null;
      const bc = clean(get('buildingCount'));
      const iv = clean(get('impvac')).toLowerCase();
      if (bc !== '') buildingCount = Number(bc);
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
    log(`Weld: ${file} - ${rows.toLocaleString()} rows, ${kept.toLocaleString()} within lookback window`);
  }

  return leads;
}
