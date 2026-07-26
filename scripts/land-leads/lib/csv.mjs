/**
 * RFC 4180 CSV reader/writer.
 *
 * County exports embed commas, quotes and newlines inside legal-description
 * fields, so a split(',') parser corrupts rows. This handles quoting properly
 * and streams line-by-line so a 100 MB file never lands in memory at once.
 */

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

/** Parse a single CSV line into fields. */
export function parseLine(line) {
  const out = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      out.push(field);
      field = '';
    } else {
      field += c;
    }
  }
  out.push(field);
  return { fields: out, unterminated: inQuotes };
}

/**
 * Stream a CSV file, yielding one object per row keyed by header name.
 * Handles quoted fields containing embedded newlines by joining continuation
 * lines until the quotes balance.
 */
export async function* readCsv(filePath) {
  const rl = createInterface({
    input: createReadStream(filePath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let headers = null;
  let pending = '';

  for await (const rawLine of rl) {
    // Strip UTF-8 BOM from the very first line.
    const line = headers === null && pending === '' ? rawLine.replace(/^﻿/, '') : rawLine;
    const candidate = pending === '' ? line : `${pending}\n${line}`;
    const { fields, unterminated } = parseLine(candidate);

    if (unterminated) {
      // Quoted field spans into the next physical line.
      pending = candidate;
      continue;
    }
    pending = '';

    if (headers === null) {
      headers = fields.map((h) => h.trim());
      continue;
    }

    const row = {};
    for (let i = 0; i < headers.length; i++) row[headers[i]] = fields[i] ?? '';
    yield row;
  }
}

/** Escape one value for CSV output. */
export function escapeCsvValue(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a CSV document from column names and row objects. */
export function toCsv(columns, rows) {
  const lines = [columns.map(escapeCsvValue).join(',')];
  for (const row of rows) {
    lines.push(columns.map((c) => escapeCsvValue(row[c])).join(','));
  }
  return `${lines.join('\n')}\n`;
}
