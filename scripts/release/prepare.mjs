import { copyFile, mkdir, mkdtemp, readFile, realpath, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertNoSymlinks, collectSource, inventoryDigest, sha256, verifyManifest } from "./inventory.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== "--retain")) throw new Error("Usage: prepare.mjs [--retain]");
await assertNoSymlinks(join(root, "release-files.json"));
const policy = JSON.parse(await readFile(join(root, "release-files.json"), "utf8"));
const paths = await collectSource(root, policy);
let parent = await realpath(tmpdir());
if (args[0] === "--retain") {
  parent = join(root, "output/website-releases");
  await assertNoSymlinks(parent);
  await mkdir(parent, { recursive: true });
}
// A fresh directory prevents overwriting user files; no secrets/config are pulled.
const exportRoot = await mkdtemp(join(parent, "kiefer-candidate-"));
const candidateRoot = join(exportRoot, "site");
await mkdir(candidateRoot);
const files = [];
for (const path of paths) {
  const source = join(root, path);
  await assertNoSymlinks(source);
  const bytes = await readFile(source);
  const hash = sha256(bytes);
  const destination = join(candidateRoot, path);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  if (sha256(await readFile(destination)) !== hash) throw new Error(`File changed while exporting: ${path}`);
  files.push({ path, bytes: bytes.length, sha256: hash });
}
const digest = inventoryDigest(files);
const manifest = {
  schemaVersion: 1,
  kind: "local-uncommitted-website-candidate",
  createdAt: new Date().toISOString(),
  node: process.version,
  candidateRoot,
  digest,
  fileCount: files.length,
  pendingReleaseDecisions: policy.pendingReleaseDecisions,
  files,
};
const manifestPath = join(exportRoot, "manifest.json");
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
await verifyManifest(manifestPath);
console.log(JSON.stringify({ candidateRoot, manifestPath, fileCount: files.length, digest }, null, 2));
