import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, resolve } from "node:path";

const directories = ["src", "public", "scripts/release"];
const testConfigs = ["vitest.config.ts", "vitest.config.mts"];
const rootFiles = new Set(["package.json", "package-lock.json", "next.config.ts", "postcss.config.mjs", "tsconfig.json", "eslint.config.mjs", ...testConfigs, ".nvmrc", ".gitignore", ".vercelignore", "release-files.json", ".github/workflows/website-checks.yml"]);
const generatedDirectories = new Set(["node_modules", ".next"]);
const generatedFiles = new Set(["next-env.d.ts", "tsconfig.tsbuildinfo"]);
export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const inventoryDigest = (files) => sha256(JSON.stringify(files));

export function safePath(path) {
  assert.equal(typeof path, "string", "Release path must be a string.");
  assert.ok(path && !isAbsolute(path) && !path.includes("\\") && !path.includes("\0"), "Unsafe release path.");
  assert.ok(path.split("/").every((part) => part && part !== "." && part !== ".."), "Unsafe release path segment.");
  return path;
}

function withinBoundary(path) {
  const parts = path.split("/");
  return (rootFiles.has(path) || directories.some((dir) => path.startsWith(`${dir}/`)))
    && !parts.some((part) => part.startsWith(".env") || ["node_modules", ".git", ".next"].includes(part))
    && ![".mov", ".zip", ".pem", ".tsbuildinfo"].includes(extname(path).toLowerCase())
    && !parts.includes(".DS_Store")
    && path !== "src/components/BuildStoryHero.tsx" && !path.startsWith("public/hero-build/");
}

export function validatePolicy(policy) {
  assert.equal(policy.schemaVersion, 1);
  assert.deepEqual([...policy.includeDirectories].sort(), [...directories].sort(), "Release directory boundary changed.");
  for (const file of policy.includeFiles) assert.ok(rootFiles.has(safePath(file)), "Release file boundary changed.");
  assert.ok(policy.includeFiles.filter((file) => testConfigs.includes(file)).length <= 1, "Choose only one Vitest config.");
  assert.ok(policy.includeFiles.includes("package.json") && policy.includeFiles.includes("release-files.json"));
  for (const key of ["excludedPaths", "excludedExtensions", "excludedFileNames", "pendingReleaseDecisions"]) {
    assert.ok(Array.isArray(policy[key]) && policy[key].every((value) => typeof value === "string"), `Invalid policy ${key}.`);
  }
  policy.excludedPaths.forEach(safePath);
  return policy;
}

function allowed(path, policy) {
  return withinBoundary(path)
    && !policy.excludedPaths.some((excluded) => path === excluded || path.startsWith(`${excluded}/`))
    && !policy.excludedExtensions.includes(extname(path).toLowerCase())
    && !policy.excludedFileNames.includes(path.split("/").at(-1));
}

export async function assertNoSymlinks(path) {
  // Check every ancestor, including the site/manifest itself, before reading/copying.
  let current = resolve(path);
  while (true) {
    const stats = await lstat(current).catch((error) => { if (error.code === "ENOENT") return null; throw error; });
    assert.ok(!stats?.isSymbolicLink(), `Symlink is not allowed: ${current}`);
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

export async function collectSource(root, policy) {
  validatePolicy(policy);
  await assertNoSymlinks(root);
  const files = [];
  async function collect(path) {
    safePath(path);
    if (policy.excludedPaths.some((item) => path === item || path.startsWith(`${item}/`))) return;
    if (path.split("/").some((part) => part.startsWith(".env") || ["node_modules", ".git", ".next"].includes(part))) return;
    await assertNoSymlinks(join(root, path));
    const stats = await lstat(join(root, path));
    if (stats.isDirectory()) {
      for (const child of (await readdir(join(root, path))).sort()) await collect(`${path}/${child}`);
    } else if (stats.isFile()) {
      if (allowed(path, policy)) files.push(path);
    } else throw new Error(`Unsupported source entry: ${path}`);
  }
  for (const path of [...policy.includeDirectories, ...policy.includeFiles]) await collect(path);
  return [...new Set(files)].sort();
}

export async function verifyManifest(manifestPath) {
  const absolute = resolve(manifestPath);
  await assertNoSymlinks(absolute);
  const manifest = JSON.parse(await readFile(absolute, "utf8"));
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.kind, "local-uncommitted-website-candidate");
  const root = resolve(dirname(absolute), "site");
  assert.equal(manifest.candidateRoot, root, "Manifest must describe its sibling site directory.");
  await assertNoSymlinks(root);
  assert.ok(Array.isArray(manifest.files) && manifest.files.length > 0);
  assert.equal(manifest.fileCount, manifest.files.length);
  const names = manifest.files.map((file) => safePath(file.path));
  assert.equal(new Set(names).size, names.length, "Duplicate manifest paths.");
  assert.deepEqual(names, [...names].sort(), "Manifest inventory must be sorted.");
  assert.equal(manifest.digest, inventoryDigest(manifest.files), "Manifest digest mismatch.");
  for (const file of manifest.files) {
    assert.deepEqual(Object.keys(file).sort(), ["bytes", "path", "sha256"]);
    assert.ok(withinBoundary(file.path), `Forbidden release file: ${file.path}`);
    assert.ok(Number.isSafeInteger(file.bytes) && file.bytes >= 0);
    assert.match(file.sha256, /^[0-9a-f]{64}$/);
    await assertNoSymlinks(join(root, file.path));
    assert.ok((await lstat(join(root, file.path))).isFile());
    const bytes = await readFile(join(root, file.path));
    assert.equal(bytes.length, file.bytes, `File size changed: ${file.path}`);
    assert.equal(sha256(bytes), file.sha256, `File hash changed: ${file.path}`);
  }
  const policy = validatePolicy(JSON.parse(await readFile(join(root, "release-files.json"), "utf8")));
  assert.deepEqual(await collectSource(root, policy), names, "Manifest does not match selected source inventory.");
  const actual = [];
  async function scan(path = "") {
    for (const child of await readdir(join(root, path))) {
      const name = path ? `${path}/${child}` : child;
      const stats = await lstat(join(root, name));
      assert.ok(!stats.isSymbolicLink(), `Unexpected symlink: ${name}`);
      if (!path && generatedDirectories.has(child) && stats.isDirectory()) continue;
      if (!path && generatedFiles.has(child) && stats.isFile()) continue;
      if (stats.isDirectory()) await scan(name);
      else { assert.ok(stats.isFile()); actual.push(name); }
    }
  }
  await scan();
  assert.deepEqual(actual.sort(), names, "Unexpected or missing candidate source/public file.");
  return { manifest, manifestPath: absolute, candidateRoot: root };
}
