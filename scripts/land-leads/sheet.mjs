/**
 * Writes the lead queue.
 *
 * Always writes a local CSV (opens in Excel, Numbers, or Google Sheets).
 * Additionally appends to a live Google Sheet when credentials are configured.
 *
 * Google auth is done with a service-account JWT signed by node:crypto, so this
 * needs no googleapis dependency.
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { toCsv } from './lib/csv.mjs';
import { isoDate, titleCase } from './normalize.mjs';

/** Columns in the order they appear in the sheet. */
export const COLUMNS = [
  'Sale Date',
  'County',
  'Buyer Name',
  'Mail To',
  'Mailing Address',
  'City',
  'State',
  'ZIP',
  'Property Address',
  'Subdivision',
  'Acres',
  'Sale Price',
  'Buyer Type',
  'Why It Matched',
  'Postcard Sent?',
  'Notes',
  'Account No',
  'Reception No',
];

/**
 * Format a county ZIP for mailing.
 * The export stores ZIP+4 as nine run-together digits; USPS wants 12345-6789.
 */
export function formatZip(zip) {
  const digits = String(zip ?? '').replace(/\D/g, '');
  if (digits.length === 9) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  if (digits.length === 5) return digits;
  return String(zip ?? '').trim();
}

/** Turn a qualified lead into a sheet row object. */
export function toRow(lead) {
  return {
    'Sale Date': isoDate(lead.saleDate),
    County: lead.county,
    'Buyer Name': titleCase(lead.buyerName),
    'Mail To': titleCase(lead.mailName || lead.buyerName),
    'Mailing Address': [lead.mailAddress1, lead.mailAddress2].filter(Boolean).join(' '),
    City: titleCase(lead.mailCity),
    State: lead.mailState,
    ZIP: formatZip(lead.mailZip),
    'Property Address': titleCase(lead.situsAddress),
    Subdivision: titleCase(lead.subdivision),
    Acres: lead.acres,
    'Sale Price': lead.salePrice,
    'Buyer Type': lead.buyerType,
    'Why It Matched': lead.matchReasons,
    'Postcard Sent?': '',
    Notes: '',
    'Account No': lead.accountNo,
    'Reception No': lead.receptionNo,
  };
}

/* ------------------------------------------------------------------ *
 * Local CSV
 * ------------------------------------------------------------------ */

/** Append rows to the local CSV, preserving anything already there. */
export async function writeLocalCsv(rows, outputPath, { log = () => {} } = {}) {
  await mkdir(path.dirname(outputPath), { recursive: true });

  let existing = '';
  try {
    existing = await readFile(outputPath, 'utf8');
  } catch {
    /* first run */
  }

  if (!existing.trim()) {
    await writeFile(outputPath, toCsv(COLUMNS, rows));
  } else {
    // Append only the data lines, newest first under the existing header.
    const body = toCsv(COLUMNS, rows).split('\n').slice(1).filter(Boolean);
    const lines = existing.split('\n').filter(Boolean);
    const header = lines[0];
    const prior = lines.slice(1);
    await writeFile(outputPath, [header, ...body, ...prior].join('\n') + '\n');
  }
  log(`  wrote ${rows.length} row(s) to ${outputPath}`);
}

/* ------------------------------------------------------------------ *
 * Google Sheets
 * ------------------------------------------------------------------ */

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Exchange a service-account key for an access token (RS256 JWT grant). */
async function getAccessToken(keyFilePath) {
  const key = JSON.parse(await readFile(keyFilePath, 'utf8'));
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  );

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(key.private_key, 'base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const jwt = `${header}.${claims}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`Google auth failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function sheetsRequest(token, sheetId, endpoint, options = {}) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error(`Sheets API ${res.status}: ${await res.text()}`);
  return res.json();
}

/**
 * Read back the "Postcard Sent?" column so already-mailed buyers are never
 * re-surfaced, then append the new rows.
 * Returns the set of keys already marked as mailed.
 */
export async function readMailedKeys({ keyFile, sheetId, tabName }) {
  const token = await getAccessToken(keyFile);
  const data = await sheetsRequest(token, sheetId, `/values/${encodeURIComponent(tabName)}!A:R`);
  const values = data.values || [];
  if (values.length < 2) return new Set();

  const header = values[0];
  const sentIdx = header.indexOf('Postcard Sent?');
  const acctIdx = header.indexOf('Account No');
  const recptIdx = header.indexOf('Reception No');
  const countyIdx = header.indexOf('County');
  if (sentIdx === -1 || acctIdx === -1) return new Set();

  const mailed = new Set();
  for (const row of values.slice(1)) {
    const sent = (row[sentIdx] || '').trim();
    if (!sent) continue;
    mailed.add(`${row[countyIdx] || ''}:${row[acctIdx] || ''}:${row[recptIdx] || ''}`);
  }
  return mailed;
}

/** Ensure the tab exists with a header row, then append new leads at the top. */
export async function appendToGoogleSheet(rows, { keyFile, sheetId, tabName }, { log = () => {} } = {}) {
  const token = await getAccessToken(keyFile);

  const meta = await sheetsRequest(token, sheetId, '');
  const tab = (meta.sheets || []).find((s) => s.properties.title === tabName);

  if (!tab) {
    await sheetsRequest(token, sheetId, ':batchUpdate', {
      method: 'POST',
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tabName } } }] }),
    });
    log(`  created tab "${tabName}"`);
  }

  const existing = await sheetsRequest(token, sheetId, `/values/${encodeURIComponent(tabName)}!A1:R1`);
  if (!existing.values || existing.values.length === 0) {
    await sheetsRequest(
      token,
      sheetId,
      `/values/${encodeURIComponent(tabName)}!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      { method: 'POST', body: JSON.stringify({ values: [COLUMNS] }) }
    );
  }

  if (rows.length === 0) return;

  const values = rows.map((r) => COLUMNS.map((c) => r[c] ?? ''));
  await sheetsRequest(
    token,
    sheetId,
    `/values/${encodeURIComponent(tabName)}!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: 'POST', body: JSON.stringify({ values }) }
  );
  log(`  appended ${rows.length} row(s) to Google Sheet`);
}

/** True when Google Sheets output is configured. */
export function googleConfigured(config) {
  return Boolean(config.google.keyFile && config.google.sheetId);
}
