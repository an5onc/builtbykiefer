// One-off image compressor for public/images photo galleries.
// Resizes JPEGs to a max 2400px on the long edge and re-encodes at
// quality 80 (mozjpeg), stripping metadata. Originals live in git history.
// Usage: node scripts/compress-images.mjs [glob-dir]   (default: public/images)
import sharp from "sharp";
import { readdir, stat, rename } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOT = process.argv[2] ?? "public/images";
const MAX_EDGE = 2400;
const QUALITY = 80;
// Skip frame-sequence dirs whose alignment/count matters for scroll effects.
const SKIP_DIRS = new Set(["explode-frames", "earth-frames"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(p);
    } else if (/\.jpe?g$/i.test(entry.name)) {
      yield p;
    }
  }
}

let count = 0, before = 0, after = 0;
for await (const file of walk(ROOT)) {
  const orig = (await stat(file)).size;
  const tmp = file + ".tmp";
  await sharp(file)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);
  const next = (await stat(tmp)).size;
  await rename(tmp, file);
  count++; before += orig; after += next;
  const pct = ((1 - next / orig) * 100).toFixed(0);
  console.log(`${file}  ${(orig / 1e6).toFixed(1)}MB → ${(next / 1e6).toFixed(2)}MB  (-${pct}%)`);
}

console.log(`\n${count} files: ${(before / 1e6).toFixed(0)}MB → ${(after / 1e6).toFixed(0)}MB  (saved ${((before - after) / 1e6).toFixed(0)}MB)`);
