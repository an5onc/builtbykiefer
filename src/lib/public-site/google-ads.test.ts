import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { GOOGLE_ADS_ID, googleAdsBootstrap } from "./google-ads";

function browser(hostname: string) {
  const scripts: Record<string, unknown>[] = [];
  const window: { location: { hostname: string }; dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } = { location: { hostname } };
  const document = {
    getElementById: (id: string) => scripts.find((script) => script.id === id),
    createElement: () => ({}),
    head: { appendChild: (script: Record<string, unknown>) => scripts.push(script) },
  };
  return { window, scripts, run: () => runInNewContext(googleAdsBootstrap, { window, document }) };
}

describe("Google Ads activation boundaries", () => {
  it.each(["kbuiltco.com", "www.kbuiltco.com"])("initializes the owner's destination once on %s", (hostname) => {
    const state = browser(hostname);
    state.run();
    state.run();
    expect(state.scripts).toEqual([{ id: "google-ads-loader", async: true, src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}` }]);
    const commands = state.window.dataLayer?.map((args) => Array.from(args as ArrayLike<unknown>));
    expect(commands).toHaveLength(2);
    expect(commands?.[0][0]).toBe("js");
    expect(commands?.[1]).toEqual(["config", GOOGLE_ADS_ID]);
  });

  it.each(["localhost", "127.0.0.1", "builtbykiefer-preview.vercel.app", "kbuiltco.com.example.org"])("does not load or initialize tracking on %s", (hostname) => {
    const state = browser(hostname);
    state.run();
    expect(state.scripts).toHaveLength(0);
    expect(state.window.dataLayer).toBeUndefined();
    expect(state.window.gtag).toBeUndefined();
  });

  it("preserves an existing command queue and does not add conversion events or form data", () => {
    const state = browser("kbuiltco.com");
    const queue: unknown[] = [{ existing: true }];
    state.window.dataLayer = queue;
    const existingGtag = (...args: unknown[]) => queue.push(args);
    state.window.gtag = existingGtag;
    state.run();
    expect(state.window.dataLayer).toBe(queue);
    expect(state.window.gtag).toBe(existingGtag);
    expect(queue[0]).toEqual({ existing: true });
    expect(queue.slice(1)).toEqual([["js", expect.anything()], ["config", GOOGLE_ADS_ID]]);
  });
});
