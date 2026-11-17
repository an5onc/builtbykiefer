import { join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { test, expect, contain, origin, runRoot, providerState } from "./helpers.mjs";
import { observeImages, measureImage } from "../image-measurement.mjs";

const missing = ["/does-not-exist", "/not-a-retained-page", "/projects/does-not-exist", "/admin", "/login", "/portal", "/vendor", "/demo-slider", "/estimate", "/project-timelines"];
const loadFixture = async () => JSON.parse(await readFile(join(runRoot, "image-content-fixture.json"), "utf8"));

async function assertNotFound(page) {
  await expect(page).toHaveTitle("Page not found | Kiefer Built Contracting");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Page not found", exact: true })).toBeVisible();
  await expect(page.locator("header")).toBeVisible(); await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("#main-content")).toHaveCount(1);
  expect(await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.every(node => /\bnoindex\b/.test(node.content)))).toBe(true);
  await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute("content", /\bnoindex\b/);
  await expect(page.locator('link[rel="canonical"],meta[property="og:url"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

test("17 branded 404 retains status, metadata, keyboard/mobile and script-free recovery", async ({ page, browser }) => {
  test.setTimeout(120000);
  const before = await providerState(), records = [];
  for (const path of missing) {
    expect((await page.goto(path)).status()).toBe(404); await assertNotFound(page);
    records.push({ path, status: 404, title: await page.title() });
  }
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto("/does-not-exist");
    const nav = page.getByRole("navigation", { name: "Find your next page" });
    const links = nav.getByRole("link");
    await links.first().focus();
    for (let index = 0; index < 4; index++) {
      await expect(links.nth(index)).toBeFocused();
      expect(await links.nth(index).evaluate(link => parseFloat(getComputedStyle(link).outlineWidth))).toBeGreaterThan(0);
      if (index < 3) await page.keyboard.press("Tab");
    }
    await page.screenshot({ path: join(runRoot, `branded-404-${width}.png`) });
    for (const [label, path] of [["Home", "/"], ["Projects", "/projects"], ["Services", "/services"], ["Contact", "/#contact"]]) {
      await page.goto("/does-not-exist"); await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(origin + path);
      if (label === "Contact") await expect(page.getByRole("button", { name: "Send Quote Request", exact: true })).toBeVisible();
    }
    await page.goto("/does-not-exist");
    if (width < 1280) {
      await page.getByRole("button", { name: "Open menu", exact: true }).click();
      await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
      await page.keyboard.press("Escape"); await expect(page.getByRole("dialog", { name: "Site navigation" })).not.toBeVisible();
    } else {
      const about = page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("button", { name: "About", exact: true });
      await about.click(); await expect(about).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape"); await expect(about).toHaveAttribute("aria-expanded", "false");
    }
    const context = await browser.newContext({ baseURL: origin, javaScriptEnabled: false, viewport: { width, height: 1000 }, serviceWorkers: "block" });
    const guard = await contain(context);
    try {
      const plain = await context.newPage(); expect((await plain.goto("/does-not-exist")).status()).toBe(404);
      await assertNotFound(plain); await plain.getByRole("navigation", { name: "Find your next page" }).getByRole("link", { name: "Home", exact: true }).click();
      await expect(plain).toHaveURL(origin + "/"); expect(guard.outbound).toEqual([]);
    } finally { await guard.drain(); await context.close(); }
  }
  // Browser equivalent of the layout viewport at 200% desktop zoom; physical zoom remains separate.
  await page.setViewportSize({ width: 720, height: 450 }); await page.goto("/does-not-exist"); await assertNotFound(page);
  await page.getByRole("link", { name: "Skip to main content", exact: true }).focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(origin + "/does-not-exist#main-content");
  expect((await providerState()).calls.length).toBe(before.calls.length);
  await writeFile(join(runRoot, "branded-404.json"), JSON.stringify(records, null, 2));
});

test("18 crop-aware requests deliver usable pixels while respecting original resolution", async ({ browser }) => {
  test.setTimeout(120000);
  const { dimensions } = await loadFixture(), records = [];
  for (const view of [{ width: 1440, height: 1000, dpr: 1 }, { width: 390, height: 844, dpr: 3 }]) {
    const context = await browser.newContext({ baseURL: origin, viewport: { width: view.width, height: view.height }, deviceScaleFactor: view.dpr, reducedMotion: "reduce", serviceWorkers: "block" });
    const guards = await contain(context);
    try {
      const page = await context.newPage(), responses = observeImages(page);
      const paths = view.width === 1440 ? ["/services", "/about/team", "/services/custom-elevators"] : ["/", "/about", "/projects/greeley", "/services/custom-elevators", ...["sips", "energy-efficiency", "indoor-air-quality", "built-for-colorado", "cost-of-ownership", "quality"].map(key => `/why-kiefer-built/${key}`)];
      for (const path of paths) {
        await page.goto(path);
        const targets = view.width === 1440 ? page.locator("main article img") : page.locator("main img").first();
        for (let i = 0; i < await targets.count(); i++) {
          const sample = await measureImage(targets.nth(i), responses), original = dimensions[sample.imagePath];
          const ceiling = Math.min(original.width / sample.width, original.height / sample.height);
          const target = Math.min(view.width === 1440 ? 1 : 1.4, ceiling);
          expect(sample.density, `${path} ${sample.imagePath}: actual decoded cover density`).toBeGreaterThanOrEqual(target - 0.01);
          if (ceiling < 1.4 && view.width === 390) {
            expect(sample.decodedWidth).toBe(original.width); expect(sample.decodedHeight).toBe(original.height);
          }
          records.push({ path, viewportWidth: view.width, target, ceiling, ...sample });
        }
      }
      expect(guards.outbound).toEqual([]);
    } finally { await guards.drain(); await context.close(); }
  }
  await writeFile(join(runRoot, "image-density.json"), JSON.stringify(records, null, 2));
});

test("19 reviewed shared-content alt text, card names and favicon metadata reach the browser", async ({ page }) => {
  test.setTimeout(90000);
  const { routes } = await loadFixture(), records = [];
  expect(routes).toHaveLength(20);
  for (const route of routes) {
    await page.goto(route.path);
    const images = await page.locator("main img").evaluateAll(nodes => nodes.map(img => {
      const src = new URL(img.src); return { image: src.searchParams.get("url") ?? src.pathname, alt: img.getAttribute("alt") };
    }));
    expect(images).toEqual(route.images);
    for (const link of route.links) await expect(page.locator("main").getByRole("link", { name: link.label, exact: true })).toHaveAttribute("href", link.href);
    await expect(page.locator('link[rel="icon"][href="/favicon.png"]')).toHaveAttribute("sizes", "268x268");
    await expect(page.locator('link[rel="icon"][href="/favicon-32.png"]')).toHaveAttribute("sizes", "32x32");
    records.push({ path: route.path, images });
  }
  const dimensions = await page.evaluate(async () => {
    const values = [];
    for (const path of ["/favicon.png", "/favicon-32.png", "/apple-touch-icon.png"]) {
      const response = await fetch(path), bytes = await response.arrayBuffer(), header = new DataView(bytes);
      values.push({ path, status: response.status, width: header.getUint32(16), height: header.getUint32(20) });
    }
    return values;
  });
  expect(dimensions).toEqual([{ path: "/favicon.png", status: 200, width: 268, height: 268 }, { path: "/favicon-32.png", status: 200, width: 32, height: 32 }, { path: "/apple-touch-icon.png", status: 200, width: 180, height: 180 }]);
  await writeFile(join(runRoot, "rendered-image-descriptions.json"), JSON.stringify({ routes: records, icons: dimensions }, null, 2));
});
