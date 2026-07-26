/**
 * Loads .env from the project root, if it exists.
 *
 * Kept dependency-free and deliberately simple. Values already present in the
 * real environment win, so a launchd plist or an inline
 * `RESEND_API_KEY=... npm run leads` still overrides the file.
 *
 * This is imported by config.mjs before it reads process.env, so ordering is
 * guaranteed regardless of how the entry point arranges its imports.
 */

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

/** Strip matching surrounding quotes from a value. */
function unquote(value) {
  const v = value.trim();
  if (v.length >= 2 && ((v[0] === '"' && v.at(-1) === '"') || (v[0] === "'" && v.at(-1) === "'"))) {
    return v.slice(1, -1);
  }
  return v;
}

/** Parse .env text into key/value pairs. */
export function parseEnv(text) {
  const out = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Tolerate "export FOO=bar" copied out of a shell profile.
    const withoutExport = line.startsWith('export ') ? line.slice(7).trim() : line;

    const eq = withoutExport.indexOf('=');
    if (eq === -1) continue;

    const key = withoutExport.slice(0, eq).trim();
    if (!key) continue;
    out[key] = unquote(withoutExport.slice(eq + 1));
  }
  return out;
}

/** Load .env into process.env without clobbering existing values. */
export function loadEnv(envPath = path.join(projectRoot, '.env')) {
  if (!existsSync(envPath)) return { loaded: false, keys: [] };

  const parsed = parseEnv(readFileSync(envPath, 'utf8'));
  const keys = [];
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined && value !== '') {
      process.env[key] = value;
      keys.push(key);
    }
  }
  return { loaded: true, keys };
}

export const envResult = loadEnv();
