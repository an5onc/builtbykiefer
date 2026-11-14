import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";
import { inventoryDigest, sha256, validatePolicy, verifyManifest } from "./inventory.mjs";
import { qualifyCandidate } from "./qualification.mjs";

const work = await mkdtemp(join(await realpath(tmpdir()), "kiefer-release-tests-"));
after(() => rm(work, { recursive: true, force: true }));
const scriptRoot = dirname(fileURLToPath(import.meta.url));
async function fixture() {
  const dir = await mkdtemp(join(work, "bundle-"));
  const candidateRoot = join(dir, "site");
  const policy = { schemaVersion: 1, includeDirectories: ["src", "public", "scripts/release"],
    includeFiles: ["package.json", "release-files.json"], excludedPaths: ["src/components/BuildStoryHero.tsx", "public/hero-build"],
    excludedExtensions: [".pem", ".mov"], excludedFileNames: [".DS_Store"], pendingReleaseDecisions: [] };
  const source = { "package.json": "{}", "release-files.json": JSON.stringify(policy), "src/example.ts": "export const answer = 42;",
    "public/image.txt": "image fixture", "scripts/release/example.mjs": "// fixture" };
  const files = [];
  for (const path of Object.keys(source).sort()) {
    await mkdir(dirname(join(candidateRoot, path)), { recursive: true });
    await writeFile(join(candidateRoot, path), source[path]);
    files.push({ path, bytes: Buffer.byteLength(source[path]), sha256: sha256(source[path]) });
  }
  const manifest = { schemaVersion: 1, kind: "local-uncommitted-website-candidate", candidateRoot, files,
    fileCount: files.length, digest: inventoryDigest(files) };
  const manifestPath = join(dir, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest));
  return { dir, candidateRoot, manifestPath, manifest };
}
async function rewrite(f, mutate) {
  mutate(f.manifest);
  await writeFile(f.manifestPath, JSON.stringify(f.manifest));
}

test("verifies exact inventory before and after known generated artifacts", async () => {
  const f = await fixture();
  await verifyManifest(f.manifestPath);
  await mkdir(join(f.candidateRoot, "node_modules"));
  await mkdir(join(f.candidateRoot, ".next"));
  await writeFile(join(f.candidateRoot, "next-env.d.ts"), "// generated");
  await writeFile(join(f.candidateRoot, "tsconfig.tsbuildinfo"), "{}");
  await verifyManifest(f.manifestPath);
});
test("historical TS and explicit ESM configs verify and restore without widening export", async () => {
  for (const name of ["vitest.config.ts", "vitest.config.mts"]) {
    const f = await fixture();
    const policyPath = join(f.candidateRoot, "release-files.json");
    const policy = JSON.parse(await readFile(policyPath, "utf8"));
    policy.includeFiles.push(name);
    await writeFile(policyPath, JSON.stringify(policy));
    await writeFile(join(f.candidateRoot, name), "export default {};\n");
    for (const entry of f.manifest.files) {
      const bytes = await readFile(join(f.candidateRoot, entry.path));
      entry.bytes = bytes.length; entry.sha256 = sha256(bytes);
    }
    const bytes = await readFile(join(f.candidateRoot, name));
    f.manifest.files.push({ path: name, bytes: bytes.length, sha256: sha256(bytes) });
    f.manifest.files.sort((a, b) => a.path < b.path ? -1 : 1);
    f.manifest.fileCount = f.manifest.files.length;
    f.manifest.digest = inventoryDigest(f.manifest.files);
    await writeFile(f.manifestPath, JSON.stringify(f.manifest));
    await verifyManifest(f.manifestPath);
    const restored = JSON.parse(execFileSync(process.execPath, [join(scriptRoot, "restore.mjs"), f.manifestPath], { encoding: "utf8" }));
    try { assert.equal((await verifyManifest(restored.manifestPath)).manifest.digest, f.manifest.digest); }
    finally { await rm(dirname(restored.manifestPath), { recursive: true, force: true }); }
    assert.throws(() => validatePolicy({ ...policy, includeFiles: [...policy.includeFiles, name === "vitest.config.ts" ? "vitest.config.mts" : "vitest.config.ts"] }));
    assert.throws(() => validatePolicy({ ...policy, includeFiles: [...policy.includeFiles, "private.config.mts"] }));
  }
});
test("rejects changed and missing files", async () => {
  for (const action of ["change", "remove"]) {
    const f = await fixture();
    if (action === "change") await writeFile(join(f.candidateRoot, "src/example.ts"), "changed");
    else await rm(join(f.candidateRoot, "src/example.ts"));
    await assert.rejects(verifyManifest(f.manifestPath));
  }
});
test("rejects extra public/source files, secrets, operations and preserved upgrade assets", async () => {
  for (const path of ["public/extra.txt", "src/extra.ts", ".env.local", "src/.env.private", "scripts/land-leads/run.mjs", "public/hero-build/frame.jpg", "src/components/BuildStoryHero.tsx"]) {
    const f = await fixture();
    await mkdir(dirname(join(f.candidateRoot, path)), { recursive: true });
    await writeFile(join(f.candidateRoot, path), "must not qualify");
    await assert.rejects(verifyManifest(f.manifestPath));
  }
});
test("rejects corrupt counts/digests, duplicates and unsafe paths", async () => {
  for (const mutate of [m => m.fileCount++, m => m.digest = "invalid", m => m.files.push(m.files[0]),
    ...["../outside", "/outside", "src/../outside", "src\\outside", "src//outside"].map(path => m => m.files[0].path = path)]) {
    const f = await fixture(); await rewrite(f, mutate);
    await assert.rejects(verifyManifest(f.manifestPath));
  }
});
test("rejects forbidden entries even if the manifest is rehashed", async () => {
  for (const path of [".env", "scripts/land-leads/run.mjs", "public/hero-build/frame.jpg"]) {
    const f = await fixture();
    await rewrite(f, m => { m.files[0].path = path; m.files.sort((a,b) => a.path < b.path ? -1 : 1); m.digest = inventoryDigest(m.files); });
    await assert.rejects(verifyManifest(f.manifestPath));
  }
});
test("rejects symlinks in source, generated roots, manifest and ancestor directories", async () => {
  for (const kind of ["source", "generated", "manifest", "ancestor"]) {
    const f = await fixture();
    if (kind === "source") { await rm(join(f.candidateRoot, "src/example.ts")); await symlink(join(f.candidateRoot, "package.json"), join(f.candidateRoot, "src/example.ts")); }
    if (kind === "generated") await symlink(work, join(f.candidateRoot, "node_modules"));
    if (kind === "manifest") { const original = await readFile(f.manifestPath); await rm(f.manifestPath); await writeFile(join(f.dir,"original.json"), original); await symlink(join(f.dir,"original.json"), f.manifestPath); }
    if (kind === "ancestor") { await rm(join(f.candidateRoot,"src"), { recursive:true }); await symlink(work, join(f.candidateRoot,"src")); }
    await assert.rejects(verifyManifest(f.manifestPath));
  }
});
test("rejects metadata redirecting qualification into a different directory", async () => {
  const f = await fixture(); await rewrite(f, m => m.candidateRoot = work);
  await assert.rejects(verifyManifest(f.manifestPath));
});
test("restores from the selected bundle without consulting another checkout", async () => {
  const f = await fixture();
  const checkout = join(f.dir, "later-checkout"); await mkdir(checkout); await writeFile(join(checkout,"example.ts"), "newer unqualified change");
  const restored = JSON.parse(execFileSync(process.execPath, [join(scriptRoot, "restore.mjs"), f.manifestPath], { cwd: checkout, encoding: "utf8" }));
  try {
    const selected = await verifyManifest(restored.manifestPath);
    assert.equal(selected.manifest.digest, f.manifest.digest);
    assert.deepEqual(selected.manifest.files, f.manifest.files);
    assert.notEqual(selected.candidateRoot, f.candidateRoot);
    assert.equal(await readFile(join(selected.candidateRoot,"src/example.ts"),"utf8"), "export const answer = 42;");
  } finally { await rm(dirname(restored.manifestPath), { recursive: true, force: true }); }
});
test("passed receipt records outcomes/runtime only after completion", async () => {
  const f = await fixture();
  const result = await qualifyCandidate(f.manifestPath, [{ name: "fixture check", run: async () => {} }], { node: process.version, npm: "fixture" });
  const report = JSON.parse(await readFile(join(result.runRoot,"qualification.json"),"utf8"));
  assert.equal(report.digest, f.manifest.digest); assert.equal(report.status,"passed");
  assert.equal(report.outcomes[0].check,"fixture check"); assert.equal(report.liveEmail,false);
});
test("failed, incomplete and source-mutating checks cannot produce a passed receipt", async () => {
  for (const kind of ["throw", "source", "manifest"]) {
    const f = await fixture();
    await assert.rejects(qualifyCandidate(f.manifestPath, [{name: "fixture failure", run: async () => {
      const records = await readdir(join(f.dir,"checks"));
      assert.ok(!(await readdir(join(f.dir,"checks",records[0]))).includes("qualification.json"));
      if (kind === "throw") throw new Error("fixture failed");
      if (kind === "source") await writeFile(join(f.candidateRoot,"src/example.ts"),"mutation");
      if (kind === "manifest") await rewrite(f, m => m.note = "changed after checking");
    }}], {node:process.version}));
    const records = await readdir(join(f.dir,"checks"));
    assert.deepEqual(await readdir(join(f.dir,"checks",records[0])), ["failure.json"]);
  }
});
