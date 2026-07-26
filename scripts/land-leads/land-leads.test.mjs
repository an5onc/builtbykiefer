import { describe, it, expect } from 'vitest';
import { parseLine, toCsv } from './lib/csv.mjs';
import { parseDate, parseMoney, parseAcres, titleCase, makeLead } from './normalize.mjs';
import { classifyBuyer, isVacant, isMailable, evaluate, qualifyAll } from './qualify.mjs';
import { resolveColumns } from './sources/weld.mjs';
import { toRow, COLUMNS, formatZip, googleStatus, writeLocalCsv } from './sheet.mjs';
import { readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

let counter = 0;
import { buildEmail } from './notify.mjs';
import { splitNew, markSeen } from './store.mjs';
import { parseEnv, loadEnv } from './lib/env.mjs';
import { config } from './config.mjs';

/** Minimal qualifying lead; override fields per test. */
function lead(over = {}) {
  return makeLead({
    county: 'Larimer',
    accountNo: 'R123',
    receptionNo: '999',
    buyerName: 'SMITH JOHN A',
    mailAddress1: '',
    mailAddress2: '123 MAIN ST',
    mailCity: 'FORT COLLINS',
    mailState: 'CO',
    mailZip: '80521',
    acres: 5,
    buildingCount: 0,
    salePrice: 200_000,
    saleDate: new Date(Date.UTC(2026, 6, 20)),
    deedCode: 'WD',
    deedDescription: 'Warranty Deed',
    accountType: 'Residential',
    ...over,
  });
}
const NOW = new Date(Date.UTC(2026, 6, 26));

describe('CSV parsing', () => {
  it('handles quoted fields containing commas', () => {
    const { fields } = parseLine('1,"E 1/2 12-6-70, LESS 2206",3');
    expect(fields).toEqual(['1', 'E 1/2 12-6-70, LESS 2206', '3']);
  });

  it('handles escaped double quotes inside a quoted field', () => {
    const { fields } = parseLine('a,"he said ""hi""",c');
    expect(fields[1]).toBe('he said "hi"');
  });

  it('reports an unterminated quote so multi-line fields can be joined', () => {
    expect(parseLine('a,"start of legal desc').unterminated).toBe(true);
  });

  it('round-trips values needing escaping', () => {
    const csv = toCsv(['a', 'b'], [{ a: 'x,y', b: 'has "quote"' }]);
    expect(csv.split('\n')[1]).toBe('"x,y","has ""quote"""');
  });
});

describe('field normalization', () => {
  it('parses the live Larimer date format', () => {
    expect(parseDate('2026-07-06 00:00:00')?.toISOString().slice(0, 10)).toBe('2026-07-06');
  });

  it('parses the legacy slash format with timezone suffix', () => {
    expect(parseDate('2008/09/19 00:00:00+00')?.toISOString().slice(0, 10)).toBe('2008-09-19');
  });

  it('returns null for unusable dates', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate('not a date')).toBeNull();
  });

  it('parses money and acreage with separators', () => {
    expect(parseMoney('$1,296,000')).toBe(1_296_000);
    expect(parseAcres('35,000')).toBe(35_000);
    expect(parseMoney('')).toBe(0);
  });

  it('title-cases shouting county names but keeps LLC upper', () => {
    expect(titleCase('SMITH JOHN A')).toBe('Smith John A');
    expect(titleCase('SUNDANCE RANCH LLC')).toBe('Sundance Ranch LLC');
  });

  // TBD marks a parcel with no street number yet - a raw-land signal.
  it('keeps TBD uppercase in an unassigned address', () => {
    expect(titleCase('TBD DEWCLAW RD')).toBe('TBD Dewclaw Rd');
    expect(titleCase('TBD COUNTY ROAD 9')).toBe('TBD County Road 9');
  });

  it('keeps PO Box and directional initialisms uppercase', () => {
    expect(titleCase('PO BOX 271')).toBe('PO Box 271');
    expect(titleCase('1234 NE FRONTAGE RD')).toBe('1234 NE Frontage Rd');
  });
});

describe('vacancy', () => {
  // Larimer writes a blank rather than 0 for parcels with no structure.
  it('treats a building count of 0 as vacant', () => {
    expect(isVacant(lead({ buildingCount: 0 }))).toBe(true);
  });

  it('treats a building count of 1 as improved', () => {
    expect(isVacant(lead({ buildingCount: 1 }))).toBe(false);
  });

  it('returns null when no parcel record was found', () => {
    expect(isVacant(lead({ buildingCount: null }))).toBeNull();
  });
});

describe('mailability', () => {
  // Larimer puts the street in MAILADDRESS2 and leaves MAILADDRESS1 blank.
  it('accepts an address that only has line 2', () => {
    expect(isMailable(lead({ mailAddress1: '', mailAddress2: '1 EXAMPLE CIR' }))).toBe(true);
  });

  it('accepts an address that only has line 1', () => {
    expect(isMailable(lead({ mailAddress1: '2 SAMPLE ST', mailAddress2: '' }))).toBe(true);
  });

  it('does not require a state, so foreign addresses still mail', () => {
    expect(isMailable(lead({ mailState: '', mailCity: 'TORONTO ON CANADA', mailZip: 'M8V3W9' }))).toBe(true);
  });

  it('rejects when there is no street line at all', () => {
    expect(isMailable(lead({ mailAddress1: '', mailAddress2: '' }))).toBe(false);
  });

  it('rejects when the zip is missing', () => {
    expect(isMailable(lead({ mailZip: '' }))).toBe(false);
  });
});

describe('buyer classification', () => {
  it('identifies an individual', () => {
    expect(classifyBuyer('SMITH JOHN A').type).toBe('Individual');
  });

  it('identifies an LLC without flagging it', () => {
    const r = classifyBuyer('SUNDANCE RANCH LLC');
    expect(r.type).toBe('LLC / Entity');
    expect(r.flagged).toBe(false);
  });

  it.each([
    ['LENNAR HOMES LLC'],
    ['BAESSLER TOWNHOMES COLORADO 2 LLC'],
    ['CITY OF FORT COLLINS'],
    ['POUDRE SCHOOL DISTRICT'],
    ['WELLS FARGO BANK N A'],
    ['XYZ CONSTRUCTION INC'],
  ])('flags non-prospect %s', (name) => {
    expect(classifyBuyer(name).flagged).toBe(true);
  });

  it('flags a missing buyer name', () => {
    expect(classifyBuyer('').flagged).toBe(true);
  });
});

describe('evaluate', () => {
  it('qualifies a straightforward land purchase', () => {
    const r = evaluate(lead(), { config, now: NOW });
    expect(r.qualified).toBe(true);
    expect(r.reasons.join(' ')).toContain('Vacant land');
  });

  it('rejects an improved parcel', () => {
    const r = evaluate(lead({ buildingCount: 1 }), { config, now: NOW });
    expect(r.rejections.join(' ')).toContain('building');
  });

  it('rejects a quit claim as not arms-length', () => {
    const r = evaluate(lead({ deedCode: 'QC' }), { config, now: NOW });
    expect(r.qualified).toBe(false);
  });

  it('accepts joint-tenancy warranty deeds', () => {
    expect(evaluate(lead({ deedCode: 'WDJ' }), { config, now: NOW }).qualified).toBe(true);
  });

  it('rejects a nominal transfer', () => {
    expect(evaluate(lead({ salePrice: 1 }), { config, now: NOW }).qualified).toBe(false);
  });

  it('rejects a stale sale outside the lookback window', () => {
    const old = new Date(Date.UTC(2025, 0, 1));
    expect(evaluate(lead({ saleDate: old }), { config, now: NOW }).qualified).toBe(false);
  });

  // A finished production home the assessor has not booked yet looks vacant.
  it('rejects an implausible price per acre', () => {
    const r = evaluate(lead({ acres: 0.12, salePrice: 559_900 }), { config, now: NOW });
    expect(r.qualified).toBe(false);
    expect(r.rejections.join(' ')).toContain('/acre');
  });

  it('keeps genuine raw acreage', () => {
    expect(evaluate(lead({ acres: 35, salePrice: 207_500 }), { config, now: NOW }).qualified).toBe(true);
  });

  it('rejects mineral-rights and personal-property accounts', () => {
    expect(evaluate(lead({ accountType: 'Nat Resources' }), { config, now: NOW }).qualified).toBe(false);
    expect(evaluate(lead({ accountType: 'Personal' }), { config, now: NOW }).qualified).toBe(false);
  });
});

describe('qualifyAll', () => {
  it('sends only one postcard to a buyer who bought several parcels', () => {
    const batch = [
      lead({ accountNo: 'R1', receptionNo: '1' }),
      lead({ accountNo: 'R2', receptionNo: '2' }),
      lead({ accountNo: 'R3', receptionNo: '3' }),
    ];
    const { qualified, duplicates } = qualifyAll(batch, { config, now: NOW });
    expect(qualified).toHaveLength(1);
    expect(duplicates).toBe(2);
  });

  it('orders the newest sale first', () => {
    const batch = [
      lead({ accountNo: 'R1', receptionNo: '1', buyerName: 'OLDER BUYER', saleDate: new Date(Date.UTC(2026, 5, 1)) }),
      lead({ accountNo: 'R2', receptionNo: '2', buyerName: 'NEWER BUYER', saleDate: new Date(Date.UTC(2026, 6, 20)) }),
    ];
    const { qualified } = qualifyAll(batch, { config, now: NOW });
    expect(qualified[0].buyerName).toBe('NEWER BUYER');
  });
});

describe('deduplication across runs', () => {
  it('never surfaces the same sale twice', () => {
    const state = { seen: new Set(), mailed: new Set(), runs: 0 };
    const batch = [lead({ accountNo: 'R1', receptionNo: '1' })];

    const first = splitNew(batch, state);
    expect(first).toHaveLength(1);

    markSeen(first, state);
    expect(splitNew(batch, state)).toHaveLength(0);
  });

  it('builds a stable key from county, account and reception', () => {
    expect(lead().key).toBe('Larimer:R123:999');
  });
});

describe('sheet row', () => {
  it('joins both address lines into one mailing address', () => {
    const row = toRow({
      ...lead({ mailAddress1: 'C/O JANE', mailAddress2: '123 MAIN ST' }),
      buyerType: 'Individual',
      matchReasons: 'Vacant land',
    });
    expect(row['Mailing Address']).toBe('C/O JANE 123 MAIN ST');
  });

  it('formats a run-together ZIP+4 for mailing', () => {
    expect(formatZip('805387006')).toBe('80538-7006');
  });

  it('leaves a plain 5-digit ZIP alone', () => {
    expect(formatZip('80512')).toBe('80512');
  });

  it('leaves a foreign postal code alone', () => {
    expect(formatZip('M8V 3W9')).toBe('M8V 3W9');
  });

  it('leaves Postcard Sent blank for the user to fill in', () => {
    const row = toRow({ ...lead(), buyerType: 'Individual', matchReasons: '' });
    expect(row['Postcard Sent?']).toBe('');
    expect(COLUMNS).toContain('Postcard Sent?');
  });
});

describe('weld column resolution', () => {
  it('maps varied Weld header spellings onto canonical fields', () => {
    const m = resolveColumns(['Account_No', 'Grantee', 'Sale Date', 'SalePrice', 'Total Acres', 'Mailing Address']);
    expect(m.accountNo).toBe('Account_No');
    expect(m.buyerName).toBe('Grantee');
    expect(m.saleDate).toBe('Sale Date');
    expect(m.acres).toBe('Total Acres');
  });
});

describe('local CSV writing', () => {
  const tmp = () => path.join(os.tmpdir(), `land-leads-test-${counter++}.csv`);
  const row = (over = {}) =>
    toRow({ ...lead(), buyerType: 'Individual', matchReasons: 'Vacant land', ...over });

  it('writes a header plus rows on first run', async () => {
    const f = tmp();
    const r = await writeLocalCsv([row()], f);
    expect(r).toEqual({ written: 1, skipped: 0 });
    expect(readFileSync(f, 'utf8').split('\n').filter(Boolean)).toHaveLength(2);
    rmSync(f, { force: true });
  });

  // --reset clears the state file; without this guard every lead is appended
  // a second time and someone receives two postcards.
  it('skips rows already present instead of duplicating them', async () => {
    const f = tmp();
    await writeLocalCsv([row()], f);
    const second = await writeLocalCsv([row()], f);

    expect(second).toEqual({ written: 0, skipped: 1 });
    expect(readFileSync(f, 'utf8').split('\n').filter(Boolean)).toHaveLength(2);
    rmSync(f, { force: true });
  });

  it('still appends genuinely new rows alongside existing ones', async () => {
    const f = tmp();
    await writeLocalCsv([row()], f);
    const next = await writeLocalCsv(
      [row(), toRow({ ...lead({ accountNo: 'R999', receptionNo: '555' }), buyerType: 'Individual', matchReasons: '' })],
      f
    );

    expect(next).toEqual({ written: 1, skipped: 1 });
    expect(readFileSync(f, 'utf8').split('\n').filter(Boolean)).toHaveLength(3);
    rmSync(f, { force: true });
  });
});

describe('google sheet status', () => {
  const cfg = (google) => ({ google: { tabName: 'Leads', ...google } });

  it('is off when nothing is set', () => {
    expect(googleStatus(cfg({ keyFile: '', sheetId: '' })).ok).toBe(false);
  });

  it('explains a missing sheet id', () => {
    expect(googleStatus(cfg({ keyFile: '/tmp/k.json', sheetId: '' })).reason).toContain('SHEET_ID');
  });

  // The common setup mistake: the example path filled in before the key exists.
  it('reports a key file that does not exist rather than claiming it is on', () => {
    const s = googleStatus(cfg({ keyFile: '/nonexistent/key.json', sheetId: 'abc123' }));
    expect(s.ok).toBe(false);
    expect(s.reason).toContain('not found');
  });

  it('is on when the sheet id is set and the key file exists', () => {
    // package.json is guaranteed to exist; only presence is checked here.
    expect(googleStatus(cfg({ keyFile: 'package.json', sheetId: 'abc123' })).ok).toBe(true);
  });
});

describe('.env loading', () => {
  it('parses plain key=value pairs', () => {
    expect(parseEnv('RESEND_API_KEY=re_abc123')).toEqual({ RESEND_API_KEY: 're_abc123' });
  });

  it('ignores comments and blank lines', () => {
    expect(parseEnv('# a comment\n\nFOO=bar\n')).toEqual({ FOO: 'bar' });
  });

  it('strips surrounding quotes', () => {
    expect(parseEnv('FROM="Land Leads <a@b.com>"').FROM).toBe('Land Leads <a@b.com>');
    expect(parseEnv("FROM='single'").FROM).toBe('single');
  });

  it('tolerates a line copied from a shell profile', () => {
    expect(parseEnv('export RESEND_API_KEY=re_xyz').RESEND_API_KEY).toBe('re_xyz');
  });

  it('keeps = signs inside the value', () => {
    expect(parseEnv('TOKEN=abc=def==').TOKEN).toBe('abc=def==');
  });

  it('skips keys left blank in the template', () => {
    expect(parseEnv('RESEND_API_KEY=\nFOO=bar')).toEqual({ RESEND_API_KEY: '', FOO: 'bar' });
  });

  it('does nothing when the file does not exist', () => {
    expect(loadEnv('/nonexistent/.env')).toEqual({ loaded: false, keys: [] });
  });
});

describe('email', () => {
  it('summarizes the count in the subject', () => {
    const { subject } = buildEmail([lead(), lead()]);
    expect(subject).toContain('2 new land buyer');
  });

  it('still reports a successful run when nothing is new', () => {
    expect(buildEmail([]).subject).toContain('no new buyers');
  });

  it('escapes HTML in buyer names', () => {
    const { html } = buildEmail([{ ...lead({ buyerName: '<script>x</script>' }), acres: 1, salePrice: 1 }]);
    expect(html).not.toContain('<script>');
  });
});
