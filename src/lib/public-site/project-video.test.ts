import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { mountainVideo } from "./project-video";
import redirects from "./legacy-redirects.json";
import { publicPages } from "./content";

const read = (path: string) => readFileSync(join(process.cwd(), "public", path));
const stamp = (seconds: number) => {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
};

describe("selected guide and project video editions", () => {
  it("keeps existing asset URLs mapped directly to the selected files", () => {
    expect(redirects["/images/project-2/build-timelapse.mp4"]).toBe(mountainVideo.source);
    const guide = publicPages.whyKieferBuilt.guideDownload!.href;
    expect(redirects["/guides/kiefer-built-homeowner-guide.pdf"]).toBe(guide);
    expect(publicPages.costOfOwnership.guideDownload!.href).toBe(guide);
    expect(read(guide).subarray(0, 5).toString()).toBe("%PDF-");
    expect(read(mountainVideo.source).subarray(4, 8).toString()).toBe("ftyp");
  });

  it("keeps the captions truthful to the owner-confirmed music-only audio", () => {
    const text = read(mountainVideo.captions).toString();
    expect(text).toBe(`WEBVTT\n\n00:00.000 --> ${stamp(mountainVideo.duration)}\nBackground music\n`);
  });

  it("keeps timed visual descriptions synchronized with the readable transcript", () => {
    const text = read(mountainVideo.descriptions).toString();
    const blocks = [...text.matchAll(/(\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}\.\d{3})\n([^\n]+)/g)];
    expect(blocks).toHaveLength(16);
    for (const [i, cue] of mountainVideo.transcript.entries()) {
      expect(cue.start).toBeLessThan(cue.end);
      expect(cue.end).toBeLessThanOrEqual(mountainVideo.duration);
      if (i) expect(cue.start).toBeGreaterThanOrEqual(mountainVideo.transcript[i - 1].end);
      expect(blocks[i].slice(1)).toEqual([stamp(cue.start), stamp(cue.end), cue.text]);
    }
    expect(mountainVideo.transcript.at(-1)!.text).toContain("kbuiltco.com");
    expect(text).not.toMatch(/review|unverified|builtbykiefer\.com/i);
  });

  it("exports selected editions while preserving superseded originals locally", () => {
    const policy = JSON.parse(readFileSync("release-files.json", "utf8"));
    expect(policy.excludedPaths).toContain("public/guides/kiefer-built-homeowner-guide.pdf");
    expect(policy.excludedPaths).toContain("public/images/project-2/build-timelapse.mp4");
    for (const path of [mountainVideo.source, mountainVideo.captions, mountainVideo.descriptions, publicPages.whyKieferBuilt.guideDownload!.href]) {
      expect(policy.excludedPaths).not.toContain(`public${path}`);
      expect(read(path).length).toBeGreaterThan(0);
    }
  });
});
