#!/usr/bin/env node
/**
 * Land purchase lead alert - main entry point.
 *
 *   node scripts/land-leads/run.mjs                 normal daily run
 *   node scripts/land-leads/run.mjs --dry-run       show what would happen, write nothing
 *   node scripts/land-leads/run.mjs --offline       use cached county files, no download
 *   node scripts/land-leads/run.mjs --reset         forget history and re-surface everything
 *   node scripts/land-leads/run.mjs --lookback 30   override the lookback window
 */

import { rm } from 'node:fs/promises';
import { config as baseConfig } from './config.mjs';
import { loadLarimerLeads } from './sources/larimer.mjs';
import { loadWeldLeads } from './sources/weld.mjs';
import { qualifyAll } from './qualify.mjs';
import { loadState, saveState, splitNew, markSeen } from './store.mjs';
import { toRow, writeLocalCsv, appendToGoogleSheet, readMailedKeys, googleConfigured } from './sheet.mjs';
import { sendAlert } from './notify.mjs';

function parseArgs(argv) {
  const args = { dryRun: false, offline: false, reset: false, lookback: null, testEmail: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--offline') args.offline = true;
    else if (a === '--reset') args.reset = true;
    else if (a === '--test-email') args.testEmail = true;
    else if (a === '--lookback') args.lookback = Number(argv[++i]);
  }
  return args;
}

/** Report what is wired up, without ever printing a secret. */
function logConfiguration(config, log) {
  log('Configuration:');

  if (config.email.apiKey && config.email.to) {
    log(`  email alerts: ON  -> ${config.email.to}`);
  } else {
    const missing = [!config.email.apiKey && 'RESEND_API_KEY', !config.email.to && 'LAND_LEADS_ALERT_TO']
      .filter(Boolean)
      .join(' and ');
    log(`  email alerts: off (set ${missing} in .env)`);
  }

  log(
    googleConfigured(config)
      ? '  google sheet: ON'
      : `  google sheet: off (local CSV at ${config.paths.outputCsv})`
  );
  log('');
}

const log = (msg = '') => console.log(msg);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = { ...baseConfig };
  if (args.lookback) config.lookbackDays = args.lookback;

  const started = Date.now();
  const now = new Date();
  const since = new Date(now.getTime() - config.lookbackDays * 86_400_000);

  log('='.repeat(64));
  log(`Land purchase lead alert - ${now.toISOString().replace('T', ' ').slice(0, 19)}`);
  log(`Looking back ${config.lookbackDays} days (sales on/after ${since.toISOString().slice(0, 10)})`);
  if (args.dryRun) log('DRY RUN - nothing will be written or sent');
  log('='.repeat(64));
  logConfiguration(config, log);

  // Verify the Resend key end to end without waiting for real leads.
  if (args.testEmail) {
    log('Sending a test alert with two sample leads...');
    const sample = [
      {
        buyerName: 'SAMPLE BUYER ONE',
        situsAddress: '123 EXAMPLE RD',
        subdivision: 'Example Ranch',
        acres: 5,
        salePrice: 250000,
        saleDate: new Date(),
      },
      {
        buyerName: 'SAMPLE BUYER TWO',
        situsAddress: 'TBD COUNTY ROAD 9',
        subdivision: '',
        acres: 35,
        salePrice: 207500,
        saleDate: new Date(),
      },
    ];
    const result = await sendAlert(sample, config, { log });
    log('');
    log(
      result.sent
        ? 'Test email sent. Check your inbox (and spam) - if it arrived, the key works.'
        : `Test email NOT sent: ${result.reason}`
    );
    return;
  }

  if (args.reset && !args.dryRun) {
    await rm(config.paths.stateFile, { force: true });
    log('State reset - all matching sales will be treated as new.');
  }

  // --- 1. Pull county data ------------------------------------------------
  const allLeads = [];
  if (config.counties.larimer.enabled) {
    const larimer = await loadLarimerLeads({ config, since, log, offline: args.offline });
    log(`Larimer: ${larimer.length.toLocaleString()} sales in window`);
    allLeads.push(...larimer);
  }
  if (config.counties.weld.enabled) {
    const weld = await loadWeldLeads({ config, since, log });
    log(`Weld: ${weld.length.toLocaleString()} sales in window`);
    allLeads.push(...weld);
  }

  // --- 2. Drop anything already surfaced ----------------------------------
  const state = await loadState(config.paths.stateFile);
  log('');
  log(`Previously surfaced: ${state.seen.size.toLocaleString()} sale(s) across ${state.runs} run(s)`);

  // Respect the "Postcard Sent?" column so mailed buyers never come back.
  if (googleConfigured(config)) {
    try {
      const mailed = await readMailedKeys(config.google);
      for (const k of mailed) state.seen.add(k);
      if (mailed.size) log(`Marked sent in sheet: ${mailed.size.toLocaleString()}`);
    } catch (err) {
      log(`Could not read sheet (continuing): ${err.message}`);
    }
  }

  const fresh = splitNew(allLeads, state);
  log(`New since last run: ${fresh.length.toLocaleString()}`);

  // --- 3. Qualify ----------------------------------------------------------
  const { qualified, dropReasons, duplicates } = qualifyAll(fresh, { config, now });

  log('');
  log('Qualification:');
  log(`  qualified:        ${qualified.length}`);
  log(`  duplicate buyers: ${duplicates}`);
  // In a dry run show every drop reason: this is the view you need when tuning
  // config.mjs, and a truncated list hides the filter that is actually biting.
  const sorted = [...dropReasons.entries()].sort((a, b) => b[1] - a[1]);
  for (const [reason, count] of args.dryRun ? sorted : sorted.slice(0, 8)) {
    log(`  dropped ${String(count).padStart(6)}  ${reason}`);
  }

  if (args.dryRun) {
    log('');
    log('Top qualified leads (dry run):');
    for (const l of qualified.slice(0, 15)) {
      log(
        `  ${l.saleDate.toISOString().slice(0, 10)}  ${l.county.padEnd(7)}  ${String(l.acres).padStart(6)} ac  ` +
          `$${String(l.salePrice).padStart(9)}  ${l.buyerName.slice(0, 34).padEnd(34)}  ${l.buyerType}`
      );
    }
    log('');
    log(`DRY RUN complete in ${((Date.now() - started) / 1000).toFixed(1)}s - nothing written.`);
    return;
  }

  // --- 4. Write the queue --------------------------------------------------
  const rows = qualified.map(toRow);
  log('');
  log('Output:');
  await writeLocalCsv(rows, config.paths.outputCsv, { log });

  let sheetUrl = '';
  if (googleConfigured(config)) {
    try {
      await appendToGoogleSheet(rows, config.google, { log });
      sheetUrl = `https://docs.google.com/spreadsheets/d/${config.google.sheetId}`;
    } catch (err) {
      log(`  Google Sheet write failed: ${err.message}`);
    }
  } else {
    log('  Google Sheet not configured - local CSV only (see README to enable)');
  }

  // --- 5. Alert ------------------------------------------------------------
  await sendAlert(qualified, config, { log, sheetUrl });

  // --- 6. Remember ---------------------------------------------------------
  markSeen(fresh, state);
  await saveState(config.paths.stateFile, state);

  log('');
  log(`Done in ${((Date.now() - started) / 1000).toFixed(1)}s. ${qualified.length} new lead(s) ready to mail.`);
}

main().catch((err) => {
  console.error('\nRun failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
