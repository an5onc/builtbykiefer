import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { assertNoSymlinks, verifyManifest } from "../../scripts/release/inventory.mjs";

export function assertLocalOrigin(value) {
  const url = new URL(value);
  assert.equal(url.protocol, "http:", "Only owned HTTP loopback servers are allowed.");
  assert.equal(url.hostname, "127.0.0.1", "Only explicit loopback is allowed.");
  assert.ok(url.port && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash);
  return url.origin;
}

export function assertOwnedRequest(value, origin) {
  assert.equal(new URL(value).origin, assertLocalOrigin(origin), "Non-owned network destination refused.");
}

export function assertQualification(receipt, digest) {
  assert.equal(receipt.schemaVersion, 1);
  assert.equal(receipt.status, "passed", "Candidate qualification must pass first.");
  assert.equal(receipt.digest, digest, "Qualification belongs to a different candidate.");
  assert.equal(receipt.liveEmail, false);
  assert.equal(receipt.deployed, false);
  assert.match(receipt.runtime?.node ?? "", /^v24\./);
  assert.match(receipt.runtime?.npm ?? "", /^11\./);
  const required = ["ci --no-fund", "run lint", "run release:test", "test", "run build", "run typecheck", "audit --omit=dev", "GET-only loopback smoke"];
  assert.equal(receipt.outcomes?.length, required.length);
  assert.deepEqual(receipt.outcomes.map((item) => item.check), required);
  assert.ok(receipt.outcomes.every((item) => item.status === "passed"));
}

export async function selectCandidate(manifestPath, receiptPath) {
  // URLs must never be mistaken for local file paths.
  assert.ok(!/^[a-z][a-z\d+.-]*:/i.test(manifestPath) && !/^[a-z][a-z\d+.-]*:/i.test(receiptPath));
  const selected = await verifyManifest(manifestPath);
  const receipt = resolve(receiptPath);
  assert.ok(receipt.startsWith(resolve(dirname(selected.manifestPath), "checks") + sep), "Use this candidate's own qualification receipt.");
  await assertNoSymlinks(receipt);
  assertQualification(JSON.parse(await readFile(receipt, "utf8")), selected.manifest.digest);
  // A passed receipt does not make an unbuilt source directory runnable.
  const buildId = (await readFile(resolve(selected.candidateRoot, ".next/BUILD_ID"), "utf8")).trim();
  assert.ok(buildId);
  return { ...selected, receiptPath: receipt, buildId };
}

export function childEnvironment() {
  // Do not inherit application secrets, NODE_OPTIONS, proxies or arbitrary preload settings.
  const env = {};
  for (const key of ["PATH", "HOME", "TMPDIR", "LANG", "LC_ALL", "SYSTEMROOT", "COMSPEC"]) {
    if (process.env[key]) env[key] = process.env[key];
  }
  return { ...env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", RESEND_API_KEY: "", CONTACT_EMAIL_FROM: "", CONTACT_EMAIL_TO: "" };
}
