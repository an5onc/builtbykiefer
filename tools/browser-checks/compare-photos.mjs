// Local before/after visual evidence; never accepts a hosted URL or sends leads.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { selectCandidate, childEnvironment } from "./guards.mjs";
import { installBrowserContainment } from "./browser-policy.mjs";
import { stopOwned, waitReady } from "./runner.mjs";
import { verifyManifest } from "../../scripts/release/inventory.mjs";

const tool = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
assert.equal(args.length, 4, "Supply current manifest/qualification then baseline manifest/qualification; no URLs.");
assert.match(process.version, /^v24\./);
const current = await selectCandidate(args[0], args[1]);
const baseline = await selectCandidate(args[2], args[3]);
const root = resolve(tool, "../../output/photo-comparisons"); await mkdir(root, { recursive: true });
const runRoot = await mkdtemp(join(root, "run-"));
const children = [], streams = [];
let browser;
const record = { status: "running", startedAt: new Date().toISOString(), node: process.version,
  digest: current.manifest.digest, baselineDigest: baseline.manifest.digest, pages: [], liveEmail: false, deployed: false };

async function start(selected, label) {
  const dir = join(runRoot, label); await mkdir(dir); await writeFile(join(dir, "control.json"), '{"mode":"accept"}');
  const probe = createServer(); await new Promise((res, rej) => { probe.once("error", rej); probe.listen(0, "127.0.0.1", res); });
  const origin = `http://127.0.0.1:${probe.address().port}`; await new Promise(res => probe.close(res));
  const stream = createWriteStream(join(dir, "server.log")); streams.push(stream);
  const child = spawn(process.execPath, ["--import", join(tool, "provider-preload.mjs"), join(selected.candidateRoot, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", new URL(origin).port],
    { cwd: selected.candidateRoot, env: { ...childEnvironment(), KIEFER_BROWSER_RUN_ROOT: dir, KIEFER_BROWSER_ORIGIN: origin }, stdio: ["ignore", "pipe", "pipe"] });
  child.once("error", error => { child.startupError = error; }); children.push(child); child.stdout.pipe(stream); child.stderr.pipe(stream);
  await waitReady(child, origin, join(dir, "provider-state.json")); return origin;
}
const interrupted = () => children.forEach(child => child.kill("SIGTERM"));
process.on("SIGINT", interrupted); process.on("SIGTERM", interrupted);
try {
  const oldOrigin = await start(baseline, "baseline");
  const newOrigin = await start(current, "current");
  browser = await chromium.launch({ headless: true, args: ["--disable-background-networking", "--no-first-run"] }); record.chromium = browser.version();
  for (const width of [1440, 768, 390]) for (const [label, origin] of [["baseline", oldOrigin], ["current", newOrigin]]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block", reducedMotion: "reduce" });
    try {
      const denied = await installBrowserContainment(context, origin);
      const page = await context.newPage(); const errors = []; page.on("pageerror", error => errors.push(error.message));
      for (const [path, selector] of [
        ["/projects/contemporary-ranch", "#gallery"], ["/projects/mountain-modern", "#gallery"],
        ["/projects/renovations-additions", "#living-spaces"], ["/services", "main"],
        ["/why-kiefer-built/energy-efficiency", null], ["/why-kiefer-built/built-for-colorado", null],
      ]) {
        const response = await page.goto(`${origin}${path}`); assert.equal(response.status(), 200);
        const region = selector ? page.locator(selector) : page.locator("main");
        const imgs = region.locator("img");
        for (let i = 0; i < await imgs.count(); i++) {
          await imgs.nth(i).scrollIntoViewIfNeeded();
          await expect.poll(() => imgs.nth(i).evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
        }
        const state = await region.evaluate(el => ({
          headings: [...el.querySelectorAll("h1,h2,h3")].map(h => h.textContent),
          images: [...el.querySelectorAll("img")].map(img => ({ alt: img.alt, src: new URL(img.src).searchParams.get("url") || new URL(img.src).pathname })),
          links: [...document.querySelectorAll("footer a,a:has(img[alt='Kiefer Built Contracting']),a[href^='https://epsbuildings.com']")].map(a => ({ label: a.textContent.trim(), href: a.getAttribute("href"), target: a.target, rel: a.rel })),
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        }));
        assert.equal(state.overflow, false);
        const filename = `${label}-${path.slice(1).replaceAll("/", "-")}-${width}.png`;
        if (selector) await region.screenshot({ path: join(runRoot, filename) });
        else { await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: join(runRoot, filename) }); }
        record.pages.push({ label, width, path, screenshot: filename, ...state });
        if (path === "/projects/contemporary-ranch") {
          for (const category of ["Exterior", "Aerial", "Kitchen", "Interior"]) {
            await page.getByRole("button", { name: new RegExp(`^${category} \\(`) }).click();
            const gallery = page.locator("#gallery .grid"), pictures = gallery.locator("img");
            for (let i = 0; i < await pictures.count(); i++) {
              await pictures.nth(i).scrollIntoViewIfNeeded();
              await expect.poll(() => pictures.nth(i).evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
            }
            const screenshot = `${label}-ranch-${category}-${width}.png`;
            await gallery.screenshot({ path: join(runRoot, screenshot) });
            record.pages.push({ label, width, path: `${path}#${category}`, screenshot, category,
              images: await pictures.evaluateAll(imgs => imgs.map(img => ({ alt: img.alt, src: new URL(img.src).searchParams.get("url") }))), links: state.links });
          }
        }
      }
      assert.deepEqual(errors, []); assert.deepEqual(denied, []);
    } finally { await context.close(); }
  }
  for (const label of ["baseline", "current"]) {
    const state = JSON.parse(await readFile(join(runRoot, label, "provider-state.json"), "utf8"));
    assert.equal(state.calls.length, 0); assert.equal(state.blockedOutbound, 0);
  }
  for (const page of record.pages.filter(p => p.label === "current")) {
    const old = record.pages.find(p => p.label === "baseline" && p.path === page.path && p.width === page.width);
    const external = p => p.links.filter(link => /^https?:/.test(link.href) && !/kbuiltco\.com/.test(link.href));
    assert.deepEqual(external(page), external(old));
  }
  await verifyManifest(current.manifestPath); await verifyManifest(baseline.manifestPath);
  record.status = "passed"; record.providerCalls = 0; record.serverOutboundAttempts = 0;
} catch (error) { record.status = "failed"; throw error; }
finally {
  await browser?.close(); for (const child of children) await stopOwned(child); for (const stream of streams) stream.end();
  process.off("SIGINT", interrupted); process.off("SIGTERM", interrupted);
  record.cleanup = children.every(child => child.exitCode !== null || child.signalCode !== null);
  record.serverPids = children.map(child => child.pid); record.completedAt = new Date().toISOString();
  await writeFile(join(runRoot, "comparison.json"), JSON.stringify(record, null, 2));
  console.log(`Photo comparison: ${join(runRoot, "comparison.json")} (${record.status})`);
}
