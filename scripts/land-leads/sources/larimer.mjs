/**
 * Larimer County adapter.
 *
 * Larimer publishes free daily CSV exports. Three of them matter:
 *   sales    - who bought what, when, for how much
 *   account  - parcel facts: situs address, acreage, building count
 *   owner    - current owner mailing address (this is what the postcard needs)
 *
 * They join on ACCOUNTNO. Sales alone cannot address a postcard.
 */

import { readCsv } from '../lib/csv.mjs';
import { fetchToCache } from '../lib/fetch-cache.mjs';
import { makeLead, parseAcres, parseDate, parseMoney, clean } from '../normalize.mjs';
import path from 'node:path';

/**
 * Load account rows into a lookup keyed by ACCOUNTNO.
 * Only the fields needed downstream are retained so a 46 MB file does not
 * become a 46 MB object graph.
 */
async function loadAccounts(filePath, log) {
  const accounts = new Map();
  let n = 0;
  for await (const row of readCsv(filePath)) {
    n++;
    const id = clean(row.ACCOUNTNO);
    if (!id) continue;
    accounts.set(id, {
      situsAddress: row.SITUSADDRESS,
      situsCity: row.SITUSCITY,
      situsZip: row.SITUSZIPCODE,
      subdivision: row.SUBDIVISIONNAME,
      acres: parseAcres(row.LANDGROSSACRES),
      // Larimer leaves BUILDINGCOUNT blank rather than writing 0: the value is
      // never "0" anywhere in the export. A blank means no structure on the
      // parcel, which is exactly the vacant land we are looking for.
      buildingCount: clean(row.BUILDINGCOUNT) === '' ? 0 : Number(row.BUILDINGCOUNT),
      accountType: row.ACCTTYPE,
      parcelNo: row.PARCELNO,
    });
  }
  log(`  account rows: ${n.toLocaleString()} (${accounts.size.toLocaleString()} accounts)`);
  return accounts;
}

/** Load owner mailing addresses keyed by ACCOUNTNO. */
async function loadOwners(filePath, log) {
  const owners = new Map();
  let n = 0;
  for await (const row of readCsv(filePath)) {
    n++;
    const id = clean(row.ACCOUNTNO);
    if (!id || owners.has(id)) continue; // first owner record wins
    owners.set(id, {
      mailName: clean(row.NAME1),
      mailName2: clean(row.NAME2),
      mailAddress1: row.MAILADDRESS1,
      mailAddress2: row.MAILADDRESS2,
      mailCity: row.MAILCITY,
      mailState: row.MAILSTATE,
      mailZip: row.MAILZIPCODE,
    });
  }
  log(`  owner rows:   ${n.toLocaleString()} (${owners.size.toLocaleString()} accounts)`);
  return owners;
}

/**
 * Produce normalized Larimer leads for sales on/after `since`.
 * Reads the sales file as a stream and only materializes matching rows.
 */
export async function loadLarimerLeads({ config, since, log = () => {}, offline = false }) {
  const cacheDir = config.paths.cacheDir;
  const files = {
    sales: path.join(cacheDir, 'larimer-sales.csv'),
    owner: path.join(cacheDir, 'larimer-owner.csv'),
    account: path.join(cacheDir, 'larimer-account.csv'),
  };

  if (!offline) {
    log('Larimer: checking for updated county files...');
    for (const name of ['sales', 'owner', 'account']) {
      await fetchToCache(config.larimerUrls[name], files[name], { log });
    }
  } else {
    log('Larimer: offline mode, using cached files');
  }

  const accounts = await loadAccounts(files.account, log);
  const owners = await loadOwners(files.owner, log);

  const leads = [];
  let salesRows = 0;
  let inWindow = 0;

  for await (const row of readCsv(files.sales)) {
    salesRows++;
    const saleDate = parseDate(row.SALEDATE);
    if (!saleDate || saleDate < since) continue;
    inWindow++;

    const accountNo = clean(row.ACCOUNTNO);
    const acct = accounts.get(accountNo) || {};
    const own = owners.get(accountNo) || {};

    leads.push(
      makeLead({
        county: 'Larimer',
        accountNo,
        receptionNo: clean(row.RECEPTIONNO),
        parcelNo: clean(row.PARCELNO) || acct.parcelNo,
        buyerName: row.GRANTEE,
        sellerName: row.GRANTOR,
        mailName: own.mailName,
        mailAddress1: own.mailAddress1,
        mailAddress2: own.mailAddress2,
        mailCity: own.mailCity,
        mailState: own.mailState,
        mailZip: own.mailZip,
        situsAddress: acct.situsAddress,
        situsCity: acct.situsCity,
        situsZip: acct.situsZip,
        subdivision: acct.subdivision,
        acres: acct.acres ?? 0,
        buildingCount: acct.buildingCount ?? null,
        salePrice: parseMoney(row.SALEPRICE),
        saleDate,
        deedCode: row.DEEDCODE,
        deedDescription: row.DEEDDESCRIPTION,
        accountType: acct.accountType,
      })
    );
  }

  log(`  sales rows:   ${salesRows.toLocaleString()} (${inWindow.toLocaleString()} within lookback window)`);
  return leads;
}
