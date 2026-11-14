import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { test, expect, contain, origin, runRoot, providerState } from "./helpers.mjs";

const categories = { All: 29, Exterior: 8, Aerial: 3, Kitchen: 7, Interior: 11 };
const imagePath = (src) => new URL(src, origin).searchParams.get("url") || new URL(src, origin).pathname;
test.use({ actionTimeout: 7000, navigationTimeout: 20000 });

// Inspect actual rendered packing, independently of the span calculation.
export async function galleryBounds(page) {
  return page.locator("#gallery .grid").evaluate(grid => {
    const box = grid.getBoundingClientRect(), gap = parseFloat(getComputedStyle(grid).columnGap);
    const tiles = [...grid.children].map((el, index) => {
      const b = el.getBoundingClientRect();
      return { index, x: b.left, y: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height };
    });
    const rows = [];
    for (const tile of tiles) {
      let row = rows.find(r => Math.abs(r[0].y - tile.y) < 2);
      if (!row) { row = []; rows.push(row); }
      row.push(tile);
    }
    const failures = [];
    for (const row of rows) {
      if (Math.abs(row[0].x - box.left) > 2 || Math.abs(row.at(-1).right - box.right) > 2) failures.push("unfilled row");
      for (let i = 0; i < row.length; i++) {
        if (row[i].height < 199 || Math.abs(row[i].bottom - row[0].bottom) > 2) failures.push("uneven row");
        if (i && Math.abs(row[i].x - row[i - 1].right - gap) > 2) failures.push("interior gap");
      }
    }
    const visual = [...tiles].sort((a, b) => Math.abs(a.y - b.y) > 2 ? a.y - b.y : a.x - b.x);
    if (visual.some((tile, i) => tile.index !== i)) failures.push("visual/tab order differs");
    if (document.documentElement.scrollWidth > innerWidth + 1) failures.push("horizontal overflow");
    return { failures, tiles, rows: rows.length, grid: { left: box.left, right: box.right, top: box.top } };
  });
}

async function settledGallery(page) {
  let lastKey, stableSince = 0, settled;
  await page.mouse.move(0, 0);
  await expect.poll(async () => {
    const sample = await galleryBounds(page);
    const key = JSON.stringify(sample.tiles.map(t => [t.x, t.y - sample.grid.top, t.width, t.height].map(n => Math.round(n * 10))));
    if (sample.failures.length || key !== lastKey) { stableSince = Date.now(); lastKey = key; return false; }
    if (Date.now() - stableSince < 400) return false;
    settled = sample; return true;
  }, { intervals: [100, 200, 300] }).toBe(true);
  // Return the exact accepted sample; do not measure again during a reflow.
  return settled;
}

test("13 ranch row packing and filter counts at eight responsive widths", async ({ page }) => {
  test.setTimeout(180000);
  const results = [];
  await page.goto("/projects/contemporary-ranch");
  const grid = page.locator("#gallery .grid");
  for (const width of [1440, 1024, 900, 768, 600, 560, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [category, count] of Object.entries(categories)) {
      const filter = page.getByRole("button", { name: `${category} (${count})`, exact: true });
      await filter.click(); await expect(filter).toHaveAttribute("aria-pressed", "true");
      await expect(grid.locator('button[aria-label^="Open"]')).toHaveCount(count);
      results.push({ width, category, count, ...await settledGallery(page) });
      if (category === "All") await grid.screenshot({ path: join(runRoot, `ranch-packed-${width}.png`) });
    }
  }
  await writeFile(join(runRoot, "ranch-packing.json"), JSON.stringify(results, null, 2));
});

test("14 every filtered ranch tile opens its own image with keyboard order and accurate photo text", async ({ page }) => {
  test.setTimeout(240000);
  const before = await providerState();
  const records = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/projects/contemporary-ranch");
    for (const [category, count] of Object.entries(categories)) {
      await page.getByRole("button", { name: `${category} (${count})`, exact: true }).click();
      const tiles = page.locator('#gallery .grid button[aria-label^="Open"]');
      await expect(tiles).toHaveCount(count);
      const photos = await tiles.locator("img").evaluateAll(imgs => imgs.map(img => ({ src: img.getAttribute("src"), alt: img.alt })));
      await tiles.first().focus();
      for (let i = 0; i < count; i++) {
        await expect(tiles.nth(i)).toBeFocused();
        if (i < count - 1) await page.keyboard.press("Tab");
      }
      await expect(tiles.last()).toHaveCSS("outline-offset", "-4px");
      await expect(tiles.last()).toHaveCSS("outline-width", "2px");
      expect(await tiles.last().evaluate(el => {
        const ring = getComputedStyle(el, "::after");
        return [el.matches(":focus-visible"), ring.borderTopWidth, ring.borderTopColor, ring.zIndex];
      })).toEqual([true, "2px", "rgb(201, 40, 28)", "5"]);
      if (category === "All") await tiles.last().screenshot({ path: join(runRoot, `ranch-keyboard-focus-${width}.png`) });
      for (let i = 0; i < count; i++) {
        const tile = tiles.nth(i); await tile.click();
        const current = page.locator(".yarl__slide_current img.yarl__slide_image").first();
        await expect(current).toHaveAttribute("alt", photos[i].alt);
        await expect(current).toHaveAttribute("src", imagePath(photos[i].src));
        if (i === 0 && count > 1) {
          await page.keyboard.press("ArrowRight");
          await expect(current).toHaveAttribute("alt", photos[1].alt);
          await page.keyboard.press("ArrowLeft"); await expect(current).toHaveAttribute("alt", photos[0].alt);
        }
        await page.keyboard.press("Escape"); await expect(page.locator(".yarl__root")).not.toBeVisible();
        await expect(tile).toBeFocused();
        records.push({ width, category, index: i, src: imagePath(photos[i].src), alt: photos[i].alt });
      }
      await writeFile(join(runRoot, "ranch-clicked-photos.json"), JSON.stringify(records, null, 2));
    }
    await page.getByRole("button", { name: "All (29)", exact: true }).click();
    const exterior = page.locator('#gallery img[alt="Ranch front elevation at dusk with stone columns, wood siding and an arched entry"]');
    expect(imagePath(await exterior.getAttribute("src"))).toBe("/images/project-3/interior-great-room-fireplace.jpg");
    const dining = page.getByRole("img", { name: "Dining area with a terracotta accent wall, linear chandelier and large windows", exact: true });
    expect(imagePath(await dining.getAttribute("src"))).toBe("/images/project-3/interior-laundry.jpg");
    const hall = page.getByRole("img", { name: "Great room toward the hall with a stone fireplace, sliding glass doors and a black barn door", exact: true });
    expect(imagePath(await hall.getAttribute("src"))).toBe("/images/project-3/interior-dining.jpg");
    await page.goto("/projects/renovations-additions");
    const fireplace = page.locator('#living-spaces img[alt="Great room with a stacked-stone fireplace wall, wood flooring and sliding glass doors by Kiefer Built Contracting"]');
    expect(imagePath(await fireplace.getAttribute("src"))).toBe("/images/project-3/interior-great-room-wide.jpg");
    await fireplace.scrollIntoViewIfNeeded(); await expect.poll(() => fireplace.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await fireplace.screenshot({ path: join(runRoot, `fireplace-${width}.png`) });
    await page.goto("/projects/mountain-modern");
    await expect(page.getByRole("heading", { name: "From Foundation to Finished Home", exact: true })).toBeVisible();
    const progress = page.locator('#gallery img');
    const alts = await progress.evaluateAll(imgs => imgs.filter(img => /exterior-winter/.test(img.getAttribute("src"))).map(img => img.alt));
    expect(alts).toHaveLength(3); expect(alts.every(alt => /foundation/i.test(alt) && !/winter|snow|finished/i.test(alt))).toBe(true);
    for (const path of ["/why-kiefer-built/energy-efficiency", "/why-kiefer-built/built-for-colorado"]) {
      await page.goto(path);
      const hero = page.locator("main img").first();
      await expect(hero).toHaveAttribute("alt", /foundation/i);
      expect(await hero.getAttribute("alt")).not.toMatch(/winter|snow|finished/i);
    }
  }
  expect((await providerState()).calls.length).toBe(before.calls.length);
  await writeFile(join(runRoot, "ranch-clicked-photos.json"), JSON.stringify(records, null, 2));
});

test("15 all three project self-links stay on the owned homepage in the same tab", async ({ page, context, containment }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [path, selector] of [
      ["/projects/contemporary-ranch", 'footer a:has-text("kbuiltco.com")'],
      ["/projects/mountain-modern", 'a:has(img[alt="Kiefer Built Contracting"])'],
      ["/projects/mountain-modern", 'footer a:has-text("kbuiltco.com")'],
    ]) {
      await page.goto(path);
      for (const label of ["Facebook", "Instagram"]) {
        const social = page.locator("footer").getByRole("link", { name: label, exact: true });
        await expect(social).toHaveAttribute("target", "_blank");
        await expect(social).toHaveAttribute("rel", "noopener noreferrer");
      }
      if (path.includes("mountain")) await expect(page.locator('a[href="https://epsbuildings.com"]')).toHaveAttribute("target", "_blank");
      const link = page.locator(selector);
      await expect(link).toHaveAttribute("href", "/"); expect(await link.getAttribute("target")).toBeNull();
      const tabs = context.pages().length;
      await link.click(); await expect(page).toHaveURL(`${origin}/`);
      expect(context.pages()).toHaveLength(tabs);
    }
  }
  expect(containment.externalActions).toEqual([]);
});

test("16 ordered full ranch gallery remains visible when scripts are disabled or blocked", async ({ browser }) => {
  test.setTimeout(90000);
  const records = [];
  for (const width of [320, 768, 1440]) for (const state of ["disabled", "blocked"]) {
    const context = await browser.newContext({ baseURL: origin, javaScriptEnabled: state !== "disabled", viewport: { width, height: 1000 }, serviceWorkers: "block" });
    const guards = await contain(context);
    if (state === "blocked") await context.route("**/_next/static/**/*.js", route => route.abort());
    try {
      const page = await context.newPage(); await page.goto("/projects/contemporary-ranch");
      const tiles = page.locator('#gallery .grid button[aria-label^="Open"]');
      await expect(tiles).toHaveCount(29);
      records.push({ width, state, ...await settledGallery(page) });
      expect(await tiles.evaluateAll(elements => elements.every(element => {
        for (let node = element; node; node = node.parentElement) {
          const s = getComputedStyle(node); if (s.opacity === "0" || s.display === "none" || s.visibility === "hidden") return false;
        }
        return true;
      }))).toBe(true);
      expect(guards.outbound).toEqual([]);
    } finally { await guards.drain(); await context.close(); }
  }
  await writeFile(join(runRoot, "ranch-script-failure.json"), JSON.stringify(records, null, 2));
});
