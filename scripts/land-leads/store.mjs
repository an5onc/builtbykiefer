/**
 * Remembers which sales have already been surfaced.
 *
 * This is what makes a rerun safe: the county republishes the same sale in
 * every daily export, so without this the sheet would fill with duplicates and
 * the same buyer could receive a second postcard.
 */

import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';

export async function loadState(stateFile) {
  try {
    const parsed = JSON.parse(await readFile(stateFile, 'utf8'));
    return {
      seen: new Set(parsed.seen || []),
      mailed: new Set(parsed.mailed || []),
      lastRunAt: parsed.lastRunAt || null,
      runs: parsed.runs || 0,
    };
  } catch {
    return { seen: new Set(), mailed: new Set(), lastRunAt: null, runs: 0 };
  }
}

export async function saveState(stateFile, state) {
  await mkdir(path.dirname(stateFile), { recursive: true });
  const payload = JSON.stringify(
    {
      seen: [...state.seen],
      mailed: [...state.mailed],
      lastRunAt: new Date().toISOString(),
      runs: (state.runs || 0) + 1,
    },
    null,
    2
  );
  // Atomic write so an interrupted run cannot corrupt the dedupe record.
  const tmp = `${stateFile}.tmp`;
  await writeFile(tmp, payload);
  await rename(tmp, stateFile);
}

/** Split leads into those never seen before and those already surfaced. */
export function splitNew(leads, state) {
  const fresh = [];
  for (const lead of leads) {
    if (state.seen.has(lead.key)) continue;
    fresh.push(lead);
  }
  return fresh;
}

/** Record leads as surfaced so they never appear again. */
export function markSeen(leads, state) {
  for (const lead of leads) state.seen.add(lead.key);
}
