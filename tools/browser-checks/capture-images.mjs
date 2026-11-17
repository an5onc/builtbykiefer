// Fixed, exact-candidate local image QA. No arbitrary URL and no lead submissions.
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
import { observeImages, measureImage } from "./image-measurement.mjs";

const tool = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
assert.equal(args.length, 3, "Supply manifest, qualification and baseline/current label; no URLs.");
assert.ok(["baseline", "current"].includes(args[2])); assert.match(process.version, /^v24\./);
const selected = await selectCandidate(args[0], args[1]);
const output = resolve(tool, "../../output/image-measurements"); await mkdir(output, { recursive: true });
const runRoot = await mkdtemp(join(output, "run-")); await writeFile(join(runRoot, "control.json"), '{"mode":"accept"}');
const probe = createServer(); await new Promise((res, rej) => { probe.once("error", rej); probe.listen(0, "127.0.0.1", res); });
const origin = `http://127.0.0.1:${probe.address().port}`; await new Promise(res => probe.close(res));
const log = createWriteStream(join(runRoot, "server.log"));
const server = spawn(process.execPath, ["--import", join(tool, "provider-preload.mjs"), join(selected.candidateRoot, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", new URL(origin).port],
  { cwd: selected.candidateRoot, env: { ...childEnvironment(), KIEFER_BROWSER_RUN_ROOT: runRoot, KIEFER_BROWSER_ORIGIN: origin }, stdio: ["ignore", "pipe", "pipe"] });
server.once("error", error => { server.startupError = error; }); server.stdout.pipe(log); server.stderr.pipe(log);
let browser;
const record = { status: "running", label: args[2], digest: selected.manifest.digest, startedAt: new Date().toISOString(), images: [], liveEmail: false, deployed: false };
const interrupted = () => server.kill("SIGTERM"); process.on("SIGINT", interrupted); process.on("SIGTERM", interrupted);
try {
  await waitReady(server, origin, join(runRoot, "provider-state.json"));
  browser = await chromium.launch({ headless: true, args: ["--disable-background-networking", "--no-first-run"] }); record.chromium = browser.version();
  const views = [320, 390, 767, 768, 1024, 1279, 1280, 1440].map(width => ({ width, height: 1000, dpr: 1 }));
  views.push({ width: 390, height: 844, dpr: 2 }, { width: 390, height: 844, dpr: 3 }, { width: 844, height: 390, dpr: 3 }, { width: 1440, height: 1000, dpr: 2 });
  for (const view of views) {
    const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: view.dpr, reducedMotion: "reduce", serviceWorkers: "block" });
    try {
      const denied = await installBrowserContainment(context, origin); const page = await context.newPage();
      const responses = observeImages(page), errors = []; page.on("pageerror", error => errors.push(error.message));
      const paths = ["/", "/services", "/about/team", "/about", "/projects/greeley", "/services/custom-elevators"];
      if (view.width === 390) paths.push(...["sips", "energy-efficiency", "indoor-air-quality", "built-for-colorado", "cost-of-ownership", "quality"].map(key => `/why-kiefer-built/${key}`));
      for (const path of paths) {
        assert.equal((await page.goto(origin + path)).status(), 200);
        const hero = page.locator("main img").first();
        const heroRecord = { viewportWidth: view.width, viewportHeight: view.height, path, kind: "hero", ...await measureImage(hero, responses) }; record.images.push(heroRecord);
        if ([390, 1440].includes(view.width) && view.dpr === 1) {
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({ path: join(runRoot, `${path === "/" ? "home" : path.slice(1).replaceAll("/", "-")}-${view.width}.png`) });
        }
        if (["/services", "/about/team", "/services/custom-elevators"].includes(path)) {
          const cards = page.locator("main article img");
          for (let i = 0; i < await cards.count(); i++) record.images.push({ viewportWidth: view.width, viewportHeight: view.height, path, kind: "card", index: i, ...await measureImage(cards.nth(i), responses) });
          if ([390, 1440].includes(view.width) && view.dpr === 1) await cards.first().locator("../..").screenshot({ path: join(runRoot, `cards-${path.slice(1).replaceAll("/", "-")}-${view.width}.png`) });
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      }
      assert.deepEqual(errors, []); assert.deepEqual(denied, []);
    } finally { await context.close(); }
    await writeFile(join(runRoot, "measurements.json"), JSON.stringify(record, null, 2));
  }
  const state = JSON.parse(await readFile(join(runRoot, "provider-state.json"), "utf8"));
  assert.equal(state.calls.length, 0); assert.equal(state.blockedOutbound, 0);
  await verifyManifest(selected.manifestPath);
  record.status = "passed"; record.providerCalls = 0; record.serverOutboundAttempts = 0;
} catch (error) { record.status = "failed"; throw error; }
finally {
  await browser?.close(); await stopOwned(server); log.end(); process.off("SIGINT", interrupted); process.off("SIGTERM", interrupted);
  record.cleanup = server.exitCode !== null || server.signalCode !== null; record.serverPid = server.pid; record.completedAt = new Date().toISOString();
  await writeFile(join(runRoot, "measurements.json"), JSON.stringify(record, null, 2)); console.log(`Image measurements: ${join(runRoot, "measurements.json")} (${record.status})`);
}
