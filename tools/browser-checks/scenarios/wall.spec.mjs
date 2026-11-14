import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { test, expect, contain, origin, runRoot, providerState } from "./helpers.mjs";

const path = "/why-kiefer-built/sips#wall-comparison";
const comparison = page => page.locator('#wall-comparison [data-variant="full"]');
const overflow = page => page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);

test("20 homepage removal preserves preview, commercial transition and separate Process page", async ({ page }) => {
  const before = await providerState(), records = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    expect((await page.goto("/")).status()).toBe(200);
    await expect(page.locator("main > section#process")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "A disciplined process from consultation to closeout.", exact: true })).toHaveCount(0);
    const preview = page.locator('[data-wall-preview]');
    await expect(preview.getByRole("link", { name: "See how SIPs work", exact: true })).toHaveAttribute("href", path);
    await expect(preview.locator("button,input")).toHaveCount(0);
    await expect(preview.locator('img[src*="sip.webp"]')).toHaveCount(0);
    const boundary = await page.locator("#commercial").evaluate(c => {
      const w = c.previousElementSibling;
      return { title: w.querySelector("h2").textContent.trim(), gap: c.getBoundingClientRect().top - w.getBoundingClientRect().bottom, hasPreview: !!w.querySelector("[data-wall-preview]") };
    });
    expect(boundary).toEqual({ title: "Built better, from the envelope in.", gap: 0, hasPreview: true });
    expect(await overflow(page)).toBe(false);
    await expect(page.locator("#contact form")).toHaveCount(1);
    await preview.getByRole("link", { name: "See how SIPs work", exact: true }).click();
    await expect(page).toHaveURL(origin + path); await expect(comparison(page)).toBeVisible();
    await page.goto("/process"); await expect(page.getByRole("heading", { name: "A Design-Build Approach", exact: true })).toBeVisible();
    records.push({ width, homepageStatus: 200, processStatus: 200, boundary });
  }
  expect((await providerState()).calls.length).toBe(before.calls.length);
  await writeFile(join(runRoot, "homepage-wall-transition.json"), JSON.stringify(records, null, 2));
});

test("21 wall mode, keyboard, zoom focus, citations and responsive drawing remain coherent", async ({ browser }) => {
  test.setTimeout(150000);
  const records = [];
  for (const width of [320, 390, 768, 1440]) for (const reducedMotion of ["no-preference", "reduce"]) {
    const context = await browser.newContext({ baseURL: origin, viewport: { width, height: 1000 }, reducedMotion, serviceWorkers: "block" });
    const guard = await contain(context);
    try {
      const page = await context.newPage(), errors = []; page.on("pageerror", error => errors.push(error.message));
      await page.goto(path); const wall = comparison(page);
      const stick = wall.getByRole("radio", { name: "Stick frame", exact: true }), sip = wall.getByRole("radio", { name: "SIP panel", exact: true });
      await expect(stick).toBeEnabled(); await expect(stick).toBeChecked();
      await expect(wall).toHaveAttribute("data-mode", "stick");
      await expect(wall.getByRole("img")).toHaveAccessibleName(/Rendered cutaway.*stick-framed/);
      await wall.scrollIntoViewIfNeeded();
      for (const image of await wall.locator("img").all()) await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(wall.locator("ol[aria-live='polite'] li")).toHaveCount(2);
      await stick.focus(); await page.keyboard.press("ArrowRight"); await expect(sip).toBeChecked(); await expect(sip).toBeFocused();
      await expect(wall).toHaveAttribute("data-mode", "sip");
      await expect(wall.getByRole("img")).toHaveAccessibleName(/structural insulated panels/);
      await expect.poll(() => wall.locator('[data-layer="sip"]').evaluate(el => {
        const values = getComputedStyle(el).clipPath.match(/[-\d.]+(?=%)/g)?.map(Number) ?? [];
        return values.length > 0 && values.every(value => Math.abs(value) < 0.1);
      })).toBe(true);
      await expect.poll(() => wall.locator('[data-layer="air-stick"]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(0.01);
      await expect.poll(() => wall.locator('[data-layer="air-sip"]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.99);
      await expect(wall.locator("ol")).toContainText("best-sealed SIP room leaked about 15× less air");
      await expect(wall.locator('ol a[href="#source-1"]')).toHaveAttribute("aria-label", "Source 1");
      await expect(wall.locator('ol a[href="#source-2"]')).toHaveAttribute("aria-label", "Source 2");
      const citation = wall.locator('ol a[href="#source-1"]'); await citation.click();
      await expect(page).toHaveURL(origin + "/why-kiefer-built/sips#source-1"); await expect(page.locator("#source-1")).toContainText("ORNL");
      await wall.getByRole("button", { name: "Look inside the wall", exact: true }).click();
      const back = wall.getByRole("button", { name: "Back to the house", exact: true });
      await expect(back).toBeFocused(); await expect(wall.locator("[data-view]")).toHaveAttribute("data-view", "wall");
      await expect(wall.getByRole("img")).toHaveAccessibleName(/Close-up illustration of a structural insulated panel wall/);
      await sip.focus(); await page.keyboard.press("ArrowLeft"); await expect(stick).toBeChecked();
      await expect(wall.getByRole("img")).toHaveAccessibleName(/Close-up illustration of a stick-framed wall/);
      await back.click(); const zoom = wall.getByRole("button", { name: "Look inside the wall", exact: true });
      await expect(zoom).toBeFocused(); await expect(wall.locator("[data-view]")).toHaveAttribute("data-view", "house");
      // AnimatePresence retains the outgoing close-up until its exit finishes.
      // Wait for that actual removal before asserting the single settled image.
      await expect(wall.getByRole("img")).toHaveCount(1);
      await expect(wall.getByRole("img")).toHaveAccessibleName(/Rendered cutaway.*stick-framed/);
      if (reducedMotion === "reduce") {
        expect(await wall.locator(".kb-air-flow").count()).toBeGreaterThan(0);
        expect(await wall.locator(".kb-air-flow").evaluateAll(nodes => nodes.every(el => getComputedStyle(el).animationName === "none"))).toBe(true);
        expect(await wall.locator(".kb-zoom-ping").evaluateAll(nodes => nodes.every(el => getComputedStyle(el).animationName === "none"))).toBe(true);
      }
      expect(await overflow(page)).toBe(false); expect(errors).toEqual([]); expect(guard.outbound).toEqual([]);
      if ([390, 1440].includes(width) && reducedMotion === "reduce") await wall.screenshot({ path: join(runRoot, `wall-${width}.png`) });
      records.push({ width, reducedMotion, states: ["stick-house", "sip-house", "sip-wall", "stick-wall", "stick-house"], keyboard: true, citations: true, focusReturn: true, overflow: false });
    } finally { await guard.drain(); await context.close(); }
  }
  await writeFile(join(runRoot, "wall-interactions.json"), JSON.stringify(records, null, 2));
});

test("22 no-JS and blocked-JS wall stays readable with honest disabled controls", async ({ browser }) => {
  test.setTimeout(90000);
  const records = [];
  for (const width of [320, 390, 1440]) for (const scripts of ["disabled", "blocked"]) {
    const context = await browser.newContext({ baseURL: origin, viewport: { width, height: 1000 }, javaScriptEnabled: scripts !== "disabled", reducedMotion: "reduce", serviceWorkers: "block" });
    const guards = await contain(context);
    if (scripts === "blocked") await context.route("**/_next/static/**/*.js", route => route.abort());
    try {
      const page = await context.newPage(); await page.goto(path); const wall = comparison(page);
      await expect(wall).toHaveAttribute("data-mode", "stick");
      await expect(wall.getByRole("heading", { name: "See where a wall loses heat", exact: true })).toBeVisible();
      await expect(wall.locator("ol")).toBeVisible(); await expect(wall.locator("ol")).toContainText("Joints, outlets and openings");
      await expect(wall.getByRole("radio", { name: "Stick frame", exact: true })).toBeChecked();
      for (const name of ["Stick frame", "SIP panel"]) await expect(wall.getByRole("radio", { name, exact: true })).toBeDisabled();
      await expect(wall.getByRole("button", { name: "Look inside the wall", exact: true })).toBeDisabled();
      await expect(wall.getByRole("img")).toHaveAccessibleName(/Rendered cutaway.*stick-framed/);
      await expect(wall.locator('ol a[href="#source-2"]')).toHaveAttribute("href", "#source-2");
      expect(await overflow(page)).toBe(false);
      await page.goto("/"); await expect(page.locator("main > section#process")).toHaveCount(0);
      await page.locator('[data-wall-preview] a').click(); await expect(page).toHaveURL(origin + path);
      expect(guards.outbound).toEqual([]); records.push({ width, scripts, disabledControls: true, previewLinkWorks: true, overflow: false });
    } finally { await guards.drain(); await context.close(); }
  }
  await writeFile(join(runRoot, "wall-script-failure.json"), JSON.stringify(records, null, 2));
});
