import assert from "node:assert/strict";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { assertNoSymlinks, verifyManifest } from "./inventory.mjs";

// A fresh run directory distinguishes incomplete/failed attempts from a passed receipt.
export async function qualifyCandidate(manifestPath, checks, runtime) {
  const selected = await verifyManifest(manifestPath);
  assert.ok(checks.length > 0 && new Set(checks.map((check) => check.name)).size === checks.length);
  const originalManifest = JSON.stringify(selected.manifest);
  async function checkIntegrity() {
    const current = await verifyManifest(selected.manifestPath);
    assert.equal(JSON.stringify(current.manifest), originalManifest, "Manifest changed during qualification.");
  }
  const records = join(dirname(selected.manifestPath), "checks");
  await assertNoSymlinks(records);
  await mkdir(records, { recursive: true });
  const runRoot = await mkdtemp(join(records, "run-"));
  const outcomes = [];
  const startedAt = new Date().toISOString();
  try {
    for (const check of checks) {
      const start = Date.now();
      await check.run(selected);
      // Detect source mutations after every individual step, not just at the end.
      await checkIntegrity();
      outcomes.push({ check: check.name, status: "passed", elapsedMs: Date.now() - start });
    }
    const report = { schemaVersion: 1, status: "passed", digest: selected.manifest.digest,
      startedAt, completedAt: new Date().toISOString(), runtime, outcomes, liveEmail: false, deployed: false };
    const temporary = join(runRoot, "receipt.pending.json");
    await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
    await checkIntegrity();
    await rename(temporary, join(runRoot, "qualification.json"));
    return { ...selected, runRoot, report };
  } catch (error) {
    await rm(join(runRoot, "receipt.pending.json"), { force: true });
    await writeFile(join(runRoot, "failure.json"), JSON.stringify({ status: "failed", digest: selected.manifest.digest,
      startedAt, failedAt: new Date().toISOString(), completedChecks: outcomes, failedCheck: checks[outcomes.length]?.name ?? "final-integrity" }, null, 2) + "\n", { flag: "wx" });
    throw error;
  }
}
