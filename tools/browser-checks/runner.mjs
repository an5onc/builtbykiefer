import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:net";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyManifest } from "../../scripts/release/inventory.mjs";
import { selectCandidate, childEnvironment } from "./guards.mjs";
import { contentFixture } from "./content-fixture.mjs";

const toolRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(toolRoot, "../..");

export async function stopOwned(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const closed = new Promise((resolve) => child.once("exit", resolve));
  child.kill("SIGTERM");
  let timer;
  await Promise.race([closed, new Promise((resolve) => { timer = setTimeout(resolve, 3000); })]);
  clearTimeout(timer);
  if (child.exitCode === null && child.signalCode === null) { child.kill("SIGKILL"); await closed; }
}

export async function waitReady(child, origin, statePath, timeoutMs = 20000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    assert.ok(!child.startupError && child.exitCode === null && child.signalCode === null, "Owned local server exited during startup.");
    const state = await readFile(statePath, "utf8").then(JSON.parse).catch(() => null);
    if (state?.ready === true) {
      const response = await fetch(origin, { redirect: "error", signal: AbortSignal.timeout(1000) }).catch(() => null);
      if (response?.ok) return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Owned server/provider interception was not ready within the bounded startup window.");
}

async function main(args) {
  assert.ok(args.length === 4 && args[0] === "--manifest" && args[2] === "--qualification",
    "Usage: npm run check -- --manifest <manifest.json> --qualification <checks/run-*/qualification.json>");
  assert.match(process.version, /^v24\./, "Use Node 24.");
  const npmVersion = execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["--version"], { encoding: "utf8" }).trim();
  assert.match(npmVersion, /^11\./, "Use npm 11.");
  const selected = await selectCandidate(args[1], args[3]);
  const manifestBefore = JSON.stringify(selected.manifest);
  const outputRoot = join(repoRoot, "output/browser-checks");
  await mkdir(outputRoot, { recursive: true });
  const runRoot = await mkdtemp(join(outputRoot, "run-"));
  await writeFile(join(runRoot, "control.json"), JSON.stringify({ mode: "accept" }));
  const probe = createServer();
  await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(0, "127.0.0.1", resolve); });
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  const env = { ...childEnvironment(), KIEFER_BROWSER_RUN_ROOT: runRoot, KIEFER_BROWSER_ORIGIN: origin };
  const playwrightVersion = JSON.parse(await readFile(join(toolRoot, "node_modules/@playwright/test/package.json"), "utf8")).version;
  assert.equal(playwrightVersion, JSON.parse(await readFile(join(toolRoot, "package.json"), "utf8")).devDependencies["@playwright/test"], "Install the pinned browser-tool lockfile first.");
  const careerHashes = {};
  for (const name of ["resume.pdf", "resume.docx"]) {
    const path = `src/lib/careers/__fixtures__/${name}`;
    const expected = selected.manifest.files.find(file => file.path === path);
    assert.ok(expected, "Selected candidate must include the synthetic careers fixture");
    const bytes = await readFile(join(selected.candidateRoot, path));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected.sha256);
    await writeFile(join(runRoot, name), bytes);
    careerHashes[name] = expected.sha256;
  }
  await writeFile(join(runRoot, "career-fixtures.json"), JSON.stringify(careerHashes));
  const log = createWriteStream(join(runRoot, "server.log"), { flags: "wx" });
  const server = spawn(process.execPath, ["--import", join(toolRoot, "provider-preload.mjs"), join(selected.candidateRoot, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd: selected.candidateRoot, env, stdio: ["ignore", "pipe", "pipe"] });
  server.once("error", (error) => { server.startupError = error; });
  server.stdout.pipe(log); server.stderr.pipe(log);
  let tests;
  const interrupted = () => { tests?.kill("SIGTERM"); server.kill("SIGTERM"); };
  process.on("SIGINT", interrupted); process.on("SIGTERM", interrupted);
  const record = { schemaVersion: 1, status: "running", startedAt: new Date().toISOString(), digest: selected.manifest.digest,
    fileCount: selected.manifest.fileCount, manifestPath: selected.manifestPath, qualificationPath: selected.receiptPath,
    buildId: selected.buildId, runtime: { node: process.version, npm: npmVersion },
    playwright: playwrightVersion,
    origin, serverPid: server.pid, liveEmail: false, deployed: false, fixture: "server-side simulated provider; loopback-only browser" };
  try {
    await waitReady(server, origin, join(runRoot, "provider-state.json"));
    await writeFile(join(runRoot, "image-content-fixture.json"), JSON.stringify(await contentFixture(selected.candidateRoot)));
    const videoSource = await readFile(join(selected.candidateRoot, "src/lib/public-site/project-video.ts"), "utf8");
    const video = JSON.parse(videoSource.match(/export const mountainVideo = (.+) as const;/s)[1]);
    const paths = [video.source, video.captions, video.descriptions, "/guides/kiefer-built-homeowner-guide-2026.pdf"];
    const assets = selected.manifest.files.filter(file => paths.includes("/" + file.path.slice(7)) && file.path.startsWith("public/"));
    assert.equal(assets.length, 4, "Selected media fixture must match all four manifest assets.");
    await writeFile(join(runRoot, "media-fixture.json"), JSON.stringify({ video, assets }));
    const encodedAssets = selected.manifest.files.filter(file => file.path.startsWith("public/images/") && /\.(?:jpe?g|png)$/i.test(file.path)).slice(0, 2);
    assert.equal(encodedAssets.length, 2, "Encoded filename regressions require two real preserved images.");
    await writeFile(join(runRoot, "encoded-route-assets.json"), JSON.stringify(encodedAssets.map(file => ({
      url: file.path.slice(6).split("/").map((segment, index, parts) => {
        const encoded = encodeURIComponent(segment);
        return index === parts.length - 1 ? encoded.replace(/[a-z]/i, char => `%${char.charCodeAt(0).toString(16)}`) : encoded;
      }).join("/"), sha256: file.sha256,
    }))));
    tests = spawn(process.execPath, [join(toolRoot, "node_modules/@playwright/test/cli.js"), "test", "--config", join(toolRoot, "playwright.config.mjs")], { cwd: toolRoot, env, stdio: "inherit" });
    const exitCode = await new Promise((resolve, reject) => { tests.once("error", reject); tests.once("exit", resolve); });
    assert.equal(exitCode, 0, "Required browser regression failed.");
    const state = JSON.parse(await readFile(join(runRoot, "provider-state.json"), "utf8"));
    assert.equal(state.blockedOutbound, 0, "Unexpected server outbound attempt.");
    const browserReport = JSON.parse(await readFile(join(runRoot, "playwright-results.json"), "utf8"));
    assert.equal(browserReport.stats.unexpected, 0);
    assert.equal(browserReport.stats.flaky, 0);
    assert.equal(browserReport.stats.expected, 29, "Required scenario groups/sensitivity checks are missing.");
    assert.equal(browserReport.stats.skipped, 0);
    assert.equal(JSON.stringify((await verifyManifest(selected.manifestPath)).manifest), manifestBefore);
    record.status = "passed";
    record.stats = browserReport.stats;
    record.chromium = JSON.parse(await readFile(join(runRoot, "browser-version.json"), "utf8")).version;
    record.simulatedProviderCalls = state.calls.length;
    record.simulatedAcceptances = state.acceptedEmails;
    record.serverOutboundAttempts = state.blockedOutbound;
  } catch (error) {
    record.status = "failed";
    // No entered data or raw provider body is copied into the summary.
    record.error = "A required startup, browser or integrity check failed; inspect local logs/results.";
    throw error;
  } finally {
    await stopOwned(tests);
    await stopOwned(server);
    process.off("SIGINT", interrupted); process.off("SIGTERM", interrupted);
    log.end();
    record.serverStopped = server.exitCode !== null || server.signalCode !== null;
    record.completedAt = new Date().toISOString();
    await writeFile(join(runRoot, "browser-receipt.json"), JSON.stringify(record, null, 2) + "\n", { flag: "wx" });
    console.log(`Local browser receipt: ${join(runRoot, "browser-receipt.json")} (${record.status})`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv.slice(2));
}
