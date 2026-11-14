import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";
import { inventoryDigest, sha256 } from "../../scripts/release/inventory.mjs";
import { assertLocalOrigin, assertOwnedRequest, assertQualification, childEnvironment, selectCandidate } from "./guards.mjs";
import { simulateProvider } from "./provider.mjs";
import { stopOwned, waitReady } from "./runner.mjs";
import { installBrowserContainment, drainBrowserContainment } from "./browser-policy.mjs";

const root = await mkdtemp(join(await realpath(tmpdir()), "kiefer-browser-guards-"));
after(() => rm(root, { recursive: true, force: true }));
const toolRoot = dirname(fileURLToPath(import.meta.url));
const names = ["ci --no-fund", "run lint", "run release:test", "test", "run build", "run typecheck", "audit --omit=dev", "GET-only loopback smoke"];
const receipt = (digest) => ({ schemaVersion: 1, status: "passed", digest, runtime: { node: "v24.21.0", npm: "11.17.0" }, outcomes: names.map((check) => ({ check, status: "passed" })), liveEmail: false, deployed: false });
async function fixture() {
  const base = await mkdtemp(join(root, "candidate-"));
  const candidateRoot = join(base, "site");
  const policy = { schemaVersion: 1, includeDirectories: ["src", "public", "scripts/release"], includeFiles: ["package.json", "release-files.json"], excludedPaths: [], excludedExtensions: [], excludedFileNames: [], pendingReleaseDecisions: [] };
  const source = { "package.json": "{}", "release-files.json": JSON.stringify(policy), "src/fixture.ts": "// guard fixture", "public/fixture.txt": "local", "scripts/release/fixture.mjs": "// local" };
  const files = [];
  for (const path of Object.keys(source).sort()) {
    await mkdir(dirname(join(candidateRoot, path)), { recursive: true });
    await writeFile(join(candidateRoot, path), source[path]);
    files.push({ path, bytes: Buffer.byteLength(source[path]), sha256: sha256(source[path]) });
  }
  const manifest = { schemaVersion: 1, kind: "local-uncommitted-website-candidate", candidateRoot, files, fileCount: files.length, digest: inventoryDigest(files) };
  const manifestPath = join(base, "manifest.json");
  const receiptPath = join(base, "checks/run-fixture/qualification.json");
  await mkdir(dirname(receiptPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest));
  await writeFile(receiptPath, JSON.stringify(receipt(manifest.digest)));
  await mkdir(join(candidateRoot, ".next"));
  await writeFile(join(candidateRoot, ".next/BUILD_ID"), "fixture-only");
  return { manifestPath, receiptPath, candidateRoot, manifest };
}

test("only exact owned loopback origins/requests are accepted", () => {
  assert.equal(assertLocalOrigin("http://127.0.0.1:3000"), "http://127.0.0.1:3000");
  assertOwnedRequest("http://127.0.0.1:3000/contact", "http://127.0.0.1:3000");
  for (const value of ["https://kbuiltco.com", "http://localhost:3000", "http://127.0.0.1", "http://127.0.0.1:3000/path", "http://user@127.0.0.1:3000", "http://127.0.0.1:3000?url=remote"]) assert.throws(() => assertLocalOrigin(value));
  for (const value of ["https://api.resend.com/emails", "http://127.0.0.1:3001", "mailto:fixture@example.com"]) assert.throws(() => assertOwnedRequest(value, "http://127.0.0.1:3000"));
});
test("actual browser refuses both direct foreign requests and redirected foreign destinations", async () => {
  let trapRequests = 0;
  const trap = createServer((_request, response) => { trapRequests++; response.end("must not connect"); });
  await new Promise(resolve => trap.listen(0, "127.0.0.1", resolve));
  const foreign = `http://127.0.0.1:${trap.address().port}`;
  const source = createServer((_request, response) => { response.writeHead(302, { location: foreign }); response.end(); });
  await new Promise(resolve => source.listen(0, "127.0.0.1", resolve));
  const owned = `http://127.0.0.1:${source.address().port}`;
  let browser;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext({ serviceWorkers: "block" });
    const denied = await installBrowserContainment(context, owned);
    const page = await context.newPage();
    await assert.rejects(page.goto(foreign));
    await assert.rejects(page.goto(owned));
    assert.deepEqual(denied, [foreign, foreign]); assert.equal(trapRequests, 0);
  } finally {
    await browser?.close();
    await Promise.all([new Promise(resolve => source.close(resolve)), new Promise(resolve => trap.close(resolve))]);
  }
});
test("failed/incomplete/wrong-version qualification cannot qualify browser checks", () => {
  assertQualification(receipt("digest"), "digest");
  for (const mutation of [r => r.status = "failed", r => r.digest = "other", r => r.outcomes.pop(), r => r.outcomes[0].status = "failed", r => r.runtime.node = "v26.0.0", r => r.liveEmail = true]) {
    const r = receipt("digest"); mutation(r); assert.throws(() => assertQualification(r, "digest"));
  }
});
test("only a closed-page lifecycle cancellation is discarded by browser containment", async () => {
  for (const [closed, message, allowed] of [[true, "Fetch response has been disposed", true], [false, "Fetch response has been disposed", false], [true, "Unexpected fixture error", false]]) {
    let handler;
    const context = { route: async (_pattern, callback) => { handler = callback; }, routeWebSocket: async () => {} };
    await installBrowserContainment(context, "http://127.0.0.1:1");
    const route = { request: () => ({ url: () => "http://127.0.0.1:1/allowed", frame: () => ({ page: () => ({ isClosed: () => closed }) }) }),
      fetch: async () => ({ headers: () => ({}), status: () => 200, body: async () => Buffer.from("allowed") }), fulfill: async () => { throw new Error(message); } };
    if (allowed) await handler(route); else await assert.rejects(handler(route), new RegExp(message));
  }
});
test("owned response bytes are copied before fulfillment, without a disposable fetch handle", async () => {
  let handler, copied = false, fulfilled;
  const context = { route: async (_pattern, callback) => { handler = callback; }, routeWebSocket: async () => {} };
  await installBrowserContainment(context, "http://127.0.0.1:1");
  const response = { headers: () => ({ "content-type": "text/plain" }), status: () => 200,
    body: async () => { copied = true; return Buffer.from("actual response bytes"); } };
  await handler({ request: () => ({ url: () => "http://127.0.0.1:1/owned" }), fetch: async () => response,
    fulfill: async options => { assert.equal(copied, true); assert.equal(options.response, undefined); fulfilled = options; } });
  assert.deepEqual(fulfilled, { status: 200, headers: { "content-type": "text/plain" }, body: Buffer.from("actual response bytes") });
});
test("teardown drains in-flight owned responses before context disposal and refuses new fetches", async () => {
  let handler, release, fulfilled = false, fetches = 0, aborted = false;
  const gate = new Promise(resolve => { release = resolve; });
  const context = { route: async (_pattern, callback) => { handler = callback; }, routeWebSocket: async () => {} };
  await installBrowserContainment(context, "http://127.0.0.1:1");
  const request = () => ({ url: () => "http://127.0.0.1:1/owned" });
  const pending = handler({ request, fetch: async () => { fetches++; await gate; return { headers: () => ({}), status: () => 200, body: async () => Buffer.from("safe") }; }, fulfill: async () => { fulfilled = true; } });
  const closing = drainBrowserContainment(context);
  await handler({ request, abort: async () => { aborted = true; }, fetch: async () => { throw new Error("No new fetch during teardown"); } });
  assert.equal(fulfilled, false); assert.equal(aborted, true); release(); await pending; await closing;
  assert.equal(fulfilled, true); assert.equal(fetches, 1);
});
test("selected manifest is verified before startup; tampering/missing receipt/build/foreign URL refused", async () => {
  const f = await fixture();
  assert.equal((await selectCandidate(f.manifestPath, f.receiptPath)).buildId, "fixture-only");
  await mkdir(join(f.candidateRoot, "tools/browser-checks"), { recursive: true });
  await writeFile(join(f.candidateRoot, "tools/browser-checks/private-fixture.txt"), "must not ship");
  await assert.rejects(selectCandidate(f.manifestPath, f.receiptPath));
  await rm(join(f.candidateRoot, "tools"), { recursive: true });
  await assert.rejects(selectCandidate("https://kbuiltco.com", f.receiptPath));
  await assert.rejects(selectCandidate(f.manifestPath, join(root, "unrelated.json")));
  await rm(f.receiptPath); await assert.rejects(selectCandidate(f.manifestPath, f.receiptPath));
  await writeFile(f.receiptPath, JSON.stringify(receipt(f.manifest.digest)));
  await rm(join(f.candidateRoot, ".next/BUILD_ID")); await assert.rejects(selectCandidate(f.manifestPath, f.receiptPath));
  await writeFile(join(f.candidateRoot, ".next/BUILD_ID"), "fixture");
  await writeFile(join(f.candidateRoot, "src/fixture.ts"), "changed"); await assert.rejects(selectCandidate(f.manifestPath, f.receiptPath));
});
test("child environment strips secrets, proxies and unapproved preload options", () => {
  const original = process.env.NODE_OPTIONS;
  process.env.NODE_OPTIONS = "--require private";
  try { const env = childEnvironment(); assert.equal(env.NODE_OPTIONS, undefined); assert.equal(env.HTTPS_PROXY, undefined); assert.equal(env.RESEND_API_KEY, ""); assert.equal(env.CONTACT_EMAIL_FROM, ""); assert.equal(env.CONTACT_EMAIL_TO, ""); }
  finally { if (original === undefined) delete process.env.NODE_OPTIONS; else process.env.NODE_OPTIONS = original; }
});
test("provider fixture models lost receipt, stable acceptance and changed intent without sending", async () => {
  const state = { calls: [], records: {}, acceptedEmails: 0 };
  const init = { method: "POST", headers: { "idempotency-key": "quote-request/11111111-2222-4333-8444-555555555555" }, body: JSON.stringify({ from: "Kiefer Built <fixture@example.com>", to: ["info@kbuiltco.com", "lauren@kbuiltco.com", "mark@kbuiltco.com"], reply_to: "fixture@example.com", text: "Project type: Custom home" }) };
  const lost = simulateProvider(state, { mode: "lose-response" }, init); await assert.rejects(lost.json());
  const accepted = await simulateProvider(state, { mode: "accept" }, init).json(); assert.match(accepted.id, /^[0-9a-f-]{36}$/);
  assert.equal(state.acceptedEmails, 1); assert.equal(state.calls[0].bodyHash, state.calls[1].bodyHash);
  const edited = { ...init, body: init.body.replace("Custom home", "Custom elevator") };
  assert.equal(simulateProvider(state, { mode: "accept" }, edited).status, 409);
  edited.headers = { "idempotency-key": "quote-request/11111111-2222-4333-8444-666666666666" };
  assert.equal(simulateProvider(state, { mode: "accept" }, edited).status, 200); assert.equal(state.acceptedEmails, 2);
  assert.throws(() => simulateProvider(state, { mode: "accept" }, { ...init, body: init.body.replace("fixture@example.com", "real@invalid.example") }));
});
test("missing fixture interception fails startup and owned children are stopped", async () => {
  const child = spawn(process.execPath, ["--import", join(toolRoot, "provider-preload.mjs"), "-e", "setInterval(()=>{},1000)"], { env: childEnvironment(), stdio: "ignore" });
  await assert.rejects(waitReady(child, "http://127.0.0.1:1", join(root, "missing.json"), 500));
  await stopOwned(child); assert.ok(child.exitCode !== null || child.signalCode !== null);
});
test("bounded readiness failure cleans up an owned running process", async () => {
  const child = spawn(process.execPath, ["-e", "setInterval(()=>{},1000)"], { env: childEnvironment(), stdio: "ignore" });
  await assert.rejects(waitReady(child, "http://127.0.0.1:1", join(root, "missing.json"), 250));
  await stopOwned(child); assert.ok(child.exitCode !== null || child.signalCode !== null);
});
test("preload refuses external fetch and legacy HTTPS before network connection", async () => {
  const base = await mkdtemp(join(root, "preload-")); await writeFile(join(base, "control.json"), '{"mode":"accept"}');
  const code = `import https from 'node:https'; try { await fetch('https://api.resend.com/other'); } catch {} try { https.get('https://api.resend.com/emails'); } catch {}`;
  const child = spawn(process.execPath, ["--import", join(toolRoot, "provider-preload.mjs"), "--input-type=module", "-e", code], { env: { ...childEnvironment(), KIEFER_BROWSER_RUN_ROOT: base, KIEFER_BROWSER_ORIGIN: "http://127.0.0.1:1" }, stdio: "ignore" });
  assert.equal(await new Promise(resolve => child.once("exit", resolve)), 0);
  const state = JSON.parse(await readFile(join(base, "provider-state.json"), "utf8")); assert.equal(state.blockedOutbound, 2); assert.equal(state.acceptedEmails, 0);
});

test("career fixture permits only the approved recipient set and exact selected synthetic attachment bytes", () => {
  const bytes = Buffer.from("synthetic-only");
  const control = { mode: "accept", careerHashes: { "resume.pdf": sha256(bytes) } };
  const state = { calls: [], records: {}, acceptedEmails: 0 };
  const data = { from: "Kiefer Built <fixture@example.com>", to: ["info@kbuiltco.com", "lauren@kbuiltco.com", "mark@kbuiltco.com"], reply_to: "fixture@example.com", text: "Career application", attachments: [{ filename: "resume.pdf", content: bytes.toString("base64") }] };
  const init = value => ({ method: "POST", headers: { "idempotency-key": "career-application/11111111-2222-4333-8444-555555555555" }, body: JSON.stringify(value) });
  assert.equal(simulateProvider(state, control, init(data)).status, 200);
  for (const edited of [{ ...data, to: "other@example.com" }, { ...data, to: data.to.slice(0, 1) }, { ...data, to: [...data.to, "extra@example.com"] }, { ...data, to: [...data.to, data.to[0]] }, { ...data, cc: "other@example.com" }, { ...data, bcc: "other@example.com" }, { ...data, attachments: [{ filename: "resume.pdf", content: Buffer.from("different").toString("base64") }] }]) assert.throws(() => simulateProvider(state, control, init(edited)));
  assert.throws(() => simulateProvider(state, { mode: "accept" }, init(data)));
  assert.equal(state.acceptedEmails, 1);
});
