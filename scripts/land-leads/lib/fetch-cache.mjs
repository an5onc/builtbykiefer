/**
 * Downloads a county file to the local cache.
 *
 * Uses a conditional request so an unchanged county file is not re-downloaded:
 * the three Larimer files total ~170 MB, and they only change once a day.
 */

import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

async function readMeta(metaPath) {
  try {
    return JSON.parse(await readFile(metaPath, 'utf8'));
  } catch {
    return {};
  }
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetch `url` into `destPath` unless the server reports it unchanged.
 * Returns { path, cached, bytes, lastModified }.
 */
export async function fetchToCache(url, destPath, { log = () => {} } = {}) {
  await mkdir(path.dirname(destPath), { recursive: true });
  const metaPath = `${destPath}.meta.json`;
  const meta = await readMeta(metaPath);
  const haveFile = await exists(destPath);

  const headers = {};
  if (haveFile && meta.etag) headers['If-None-Match'] = meta.etag;
  if (haveFile && meta.lastModified) headers['If-Modified-Since'] = meta.lastModified;

  const res = await fetch(url, { headers, redirect: 'follow' });

  if (res.status === 304 && haveFile) {
    const { size } = await stat(destPath);
    log(`  cached (unchanged): ${path.basename(destPath)}`);
    return { path: destPath, cached: true, bytes: size, lastModified: meta.lastModified };
  }

  if (!res.ok) {
    throw new Error(`Download failed ${res.status} ${res.statusText} for ${url}`);
  }

  // Write to a temp file first so an interrupted run never leaves a truncated
  // county file that would look like "everything disappeared" on the next run.
  const tmpPath = `${destPath}.partial`;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(tmpPath));

  const { rename } = await import('node:fs/promises');
  await rename(tmpPath, destPath);

  const lastModified = res.headers.get('last-modified') || '';
  await writeFile(
    metaPath,
    JSON.stringify({ etag: res.headers.get('etag') || '', lastModified, fetchedAt: new Date().toISOString() }, null, 2)
  );

  const { size } = await stat(destPath);
  log(`  downloaded ${(size / 1e6).toFixed(1)} MB: ${path.basename(destPath)}`);
  return { path: destPath, cached: false, bytes: size, lastModified };
}
