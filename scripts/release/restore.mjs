import { copyFile, mkdir, mkdtemp, realpath, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { verifyManifest } from "./inventory.mjs";

const [manifestPath, ...extra] = process.argv.slice(2);
if (!manifestPath || extra.length) throw new Error("Usage: restore.mjs <retained-manifest.json>");
const selected = await verifyManifest(manifestPath);
const exportRoot = await mkdtemp(join(await realpath(tmpdir()), "kiefer-restored-"));
const candidateRoot = join(exportRoot, "site");
await mkdir(candidateRoot);
for (const file of selected.manifest.files) {
  const destination = join(candidateRoot, file.path);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(selected.candidateRoot, file.path), destination);
}
const restored = { ...selected.manifest, candidateRoot, restoredAt: new Date().toISOString() };
const restoredManifest = join(exportRoot, "manifest.json");
await writeFile(restoredManifest, `${JSON.stringify(restored, null, 2)}\n`, { flag: "wx" });
await verifyManifest(restoredManifest);
await verifyManifest(selected.manifestPath);
console.log(JSON.stringify({ candidateRoot, manifestPath: restoredManifest, fileCount: restored.fileCount, digest: restored.digest }, null, 2));
