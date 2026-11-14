import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test, expect, contain, origin, runRoot, providerState } from "./helpers.mjs";
import { assertOwnedRequest } from "../guards.mjs";

const fixture = async () => JSON.parse(await readFile(join(runRoot, "media-fixture.json"), "utf8"));
const digest = bytes => createHash("sha256").update(bytes).digest("hex");

test("23 approved guide downloads and selected media bytes preserve old URL recovery", async ({ page }) => {
  const { assets, video } = await fixture(), records = [];
  const guide = assets.find(file => file.path.endsWith(".pdf"));
  for (const path of ["/why-kiefer-built", "/why-kiefer-built/cost-of-ownership"]) {
    await page.goto(path);
    const link = page.getByRole("link", { name: "Download The Guide", exact: true });
    await expect(link).toHaveAttribute("href", "/" + guide.path.slice(7));
    await expect(link).toHaveAttribute("download", "");
    const waiting = page.waitForEvent("download"); await link.click();
    const download = await waiting;
    expect(await download.failure()).toBeNull();
    const saved = join(runRoot, path.endsWith("cost-of-ownership") ? "guide-cost.pdf" : "guide-hub.pdf");
    await download.saveAs(saved); expect(digest(await readFile(saved))).toBe(guide.sha256);
    records.push({ route: path, downloadedHash: guide.sha256 });
  }
  for (const file of assets) {
    const url = origin + "/" + file.path.slice(7); assertOwnedRequest(url, origin);
    const response = await page.request.get(url, { maxRedirects: 0 });
    expect(response.status()).toBe(200); expect(digest(await response.body())).toBe(file.sha256);
    expect(response.headers()["content-type"]).toMatch(file.path.endsWith(".pdf") ? /application\/pdf/ : file.path.endsWith(".mp4") ? /video\/mp4/ : /text\/vtt/);
  }
  for (const [old, selected] of [["/guides/kiefer-built-homeowner-guide.pdf", "/" + guide.path.slice(7)], ["/images/project-2/build-timelapse.mp4", video.source]]) {
    const response = await page.request.get(origin + old + "?review=local", { maxRedirects: 0 });
    expect(response.status()).toBe(308); expect(new URL(response.headers().location, origin).href).toBe(origin + selected + "?review=local");
  }
  const range = await page.request.get(origin + video.source, { headers: { range: "bytes=0-1023" }, maxRedirects: 0 });
  expect(range.status()).toBe(206); expect((await range.body()).length).toBe(1024);
  expect(range.headers()["content-range"]).toMatch(/^bytes 0-1023\//);
  await writeFile(join(runRoot, "selected-media-downloads.json"), JSON.stringify(records, null, 2));
});

test("24 video playback, music captions and visual transcript remain usable without scripts", async ({ browser }) => {
  test.setTimeout(90000);
  const { video: data } = await fixture(), records = [], before = await providerState();
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ baseURL: origin, viewport: { width, height: 1000 }, serviceWorkers: "block" });
    const guards = await contain(context), errors = [];
    try {
      const page = await context.newPage(); page.on("pageerror", error => errors.push(error.message));
      await page.goto("/projects/mountain-modern#timelapse");
      const video = page.getByLabel("Mountain Modern construction slideshow", { exact: true });
      await expect(video).toHaveAttribute("controls", "");
      await expect(video).toHaveAttribute("preload", "metadata");
      await expect(video).toHaveAttribute("poster", "/images/project-2/exterior-front-facade.jpg");
      await expect(video.locator("source")).toHaveAttribute("src", data.source);
      await expect.poll(() => video.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(1);
      const metadata = await video.evaluate(v => ({ width: v.videoWidth, height: v.videoHeight, duration: v.duration, tracks: [...v.textTracks].map(t => ({ kind: t.kind, language: t.language })) }));
      expect(metadata.width).toBe(1280); expect(metadata.height).toBe(720); expect(metadata.duration).toBeCloseTo(data.duration, 2);
      expect(metadata.tracks).toEqual([{ kind: "captions", language: "en" }, { kind: "descriptions", language: "en" }]);
      await video.evaluate(v => { v.muted = true; v.textTracks[0].mode = "showing"; v.textTracks[1].mode = "hidden"; });
      await expect.poll(() => video.evaluate(v => [...v.textTracks].map(t => t.cues?.length ?? 0))).toEqual([1, 16]);
      const cues = await video.evaluate(v => [...v.textTracks].map(t => [...t.cues].map(c => ({ start: c.startTime, end: c.endTime, text: c.text }))));
      expect(cues[0]).toEqual([{ start: 0, end: data.duration, text: "Background music" }]);
      expect(cues[1]).toEqual(data.transcript.map(c => ({ start: c.start, end: c.end, text: c.text })));
      await video.focus(); await page.keyboard.press("Space");
      await expect.poll(() => video.evaluate(v => !v.paused && v.currentTime > .1)).toBe(true);
      await page.keyboard.press("Space"); await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
      await video.evaluate(v => { v.currentTime = 21.9; });
      await expect.poll(() => video.evaluate(v => !v.seeking && v.currentTime >= 21.89)).toBe(true);
      await video.evaluate(v => { v.textTracks[0].mode = "disabled"; });
      expect(await video.evaluate(v => v.textTracks[0].mode)).toBe("disabled");
      await video.evaluate(v => { v.textTracks[0].mode = "showing"; });
      const summary = page.getByText("Read the video transcript", { exact: true });
      await summary.focus(); await page.keyboard.press("Enter");
      await expect(page.locator("#timelapse details")).toHaveAttribute("open", "");
      expect(await page.locator("#timelapse details li").allTextContents()).toEqual(data.transcript.map(c => `${c.time}: ${c.text}`));
      await expect(page.locator("#build-video-audio")).toContainText("background music only; no narration");
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
      expect(errors).toEqual([]); expect(guards.outbound).toEqual([]);
      await page.locator("#timelapse").screenshot({ path: join(runRoot, `selected-video-${width}.png`) });
      records.push({ viewportWidth: width, mode: "scripts", ...metadata, playback: true, seek: true, keyboard: true, captions: true, transcript: true });
    } finally { await guards.drain(); await context.close(); }
    for (const failure of ["disabled", "blocked"]) {
      const fallback = await browser.newContext({ baseURL: origin, viewport: { width, height: 1000 }, javaScriptEnabled: failure !== "disabled", serviceWorkers: "block" });
      const fallbackGuards = await contain(fallback);
      try {
        if (failure === "blocked") await fallback.route("**/*.js*", route => route.abort("blockedbyclient"));
        const page = await fallback.newPage(); await page.goto("/projects/mountain-modern#timelapse");
        await expect(page.getByLabel("Mountain Modern construction slideshow", { exact: true })).toBeVisible();
        await page.getByText("Read the video transcript", { exact: true }).click();
        await expect(page.locator("#timelapse details")).toHaveAttribute("open", "");
        expect(await page.locator("#timelapse details li").allTextContents()).toEqual(data.transcript.map(c => `${c.time}: ${c.text}`));
        await expect(page.locator("#timelapse details li").last()).toContainText("kbuiltco.com");
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
        expect(fallbackGuards.outbound).toEqual([]); records.push({ viewportWidth: width, mode: failure, transcript: true });
      } finally { await fallbackGuards.drain(); await fallback.close(); }
    }
  }
  expect((await providerState()).calls.length).toBe(before.calls.length);
  await writeFile(join(runRoot, "selected-video-checks.json"), JSON.stringify(records, null, 2));
});
