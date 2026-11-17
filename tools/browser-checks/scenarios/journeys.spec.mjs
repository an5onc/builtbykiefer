import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { test, expect, contain, origin, runRoot, cities, mode, providerState, fillQuote, sendQuote, assertCoverageBounds, assertVendorURL, seedVendor } from "./helpers.mjs";

test.beforeEach(async () => { await mode("accept"); });
test.beforeAll(async ({ browser }) => { await writeFile(join(runRoot, "browser-version.json"), JSON.stringify({ version: browser.version() })); });

test("1 desktop direct contact and disclosure keyboard Escape", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation", exact: true });
  const about = nav.getByRole("button", { name: "About", exact: true });
  await about.click(); await expect(about).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab"); await page.keyboard.press("Escape");
  await expect(about).toHaveAttribute("aria-expanded", "false"); await expect(about).toBeFocused();
  await nav.getByRole("link", { name: "Contact Us", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/contact`);
  await expect(page.getByRole("button", { name: "Send Quote Request", exact: true })).toBeEnabled();
});

test("2 mobile menu contact across routes and restored body scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/contact", "/service-areas"]) {
    await page.goto(path);
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await dialog.getByRole("link", { name: "Contact Us", exact: true }).click();
    await expect(page).toHaveURL(`${origin}/contact`); await expect(dialog).not.toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  }
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site navigation" })).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("3 nine original gallery links, keyboard containment, pause and reduced motion", async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const region = page.getByRole("region", { name: "Featured project photos" });
  const links = region.locator('article:not([aria-hidden="true"]) a');
  await expect(links).toHaveCount(9);
  expect(await region.locator('article[aria-hidden="true"] a').evaluateAll((elements) => elements.map((element) => element.tabIndex))).toEqual(Array(9).fill(-1));
  const pause = page.getByRole("button", { name: "Pause project gallery" });
  await pause.click(); await expect(region).toHaveAttribute("data-playing", "false");
  await page.getByRole("button", { name: "Play project gallery" }).click();
  await expect(region).toHaveAttribute("data-playing", "true");
  await region.focus();
  for (let index = 0; index < 9; index++) {
    await page.keyboard.press("Tab"); await expect(links.nth(index)).toBeFocused();
    await expect(region).toHaveAttribute("data-playing", "false");
    await expect.poll(() => links.nth(index).evaluate((element) => { const b = element.getBoundingClientRect(); return b.left >= -1 && b.right <= innerWidth + 1 && b.top >= 0 && b.bottom <= innerHeight; })).toBe(true);
  }
  await page.keyboard.press("Enter"); await expect(page).toHaveURL(`${origin}/services/custom-elevators`);
  await page.goto("/");
  // Select a repeatable point in the real CSS animation rather than waiting 48 seconds.
  await expect(region).toHaveAttribute("data-playing", "true");
  await region.scrollIntoViewIfNeeded();
  await expect.poll(() => region.locator(".kiefer-marquee").evaluate(element => element.getAnimations().length)).toBe(1);
  await region.locator(".kiefer-marquee").evaluate(element => { const animation = element.getAnimations()[0]; animation.pause(); animation.currentTime = 47900; });
  const pointerCopy = region.locator('article[aria-hidden="true"] a').first();
  await expect(pointerCopy).toBeInViewport({ ratio: 0.99 });
  await pointerCopy.click(); await expect(page).toHaveURL(`${origin}/projects/greeley`);
  const context = await browser.newContext({ baseURL: origin, reducedMotion: "reduce", viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
  const guards = await contain(context);
  try {
    const reduced = await context.newPage(); await reduced.goto("/");
    await expect(reduced.getByRole("button", { name: /project gallery/ })).not.toBeVisible();
    expect(await reduced.locator('article[aria-hidden="true"]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).display === "none"))).toBe(true);
    await reduced.locator('article:not([aria-hidden="true"]) .kiefer-project-link').first().click();
    await expect(reduced).toHaveURL(`${origin}/projects/greeley`);
    expect(guards.outbound).toEqual([]);
  } finally { await guards.drain(); await context.close(); }
});

test("4 elevator option and native required-field validation on both forms", async ({ page }) => {
  const before = await providerState();
  for (const path of ["/", "/contact"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Send Quote Request", exact: true })).toBeEnabled();
    await page.getByLabel("Project type", { exact: true }).selectOption("Custom elevator");
    await page.getByRole("button", { name: "Send Quote Request", exact: true }).click();
    expect(await page.locator("form").evaluate((form) => form.checkValidity())).toBe(false);
    expect(await page.getByLabel("Project type", { exact: true }).inputValue()).toBe("Custom elevator");
  }
  expect((await providerState()).calls.length).toBe(before.calls.length);
});

test("5 real route simulated acceptance, detail-free cookie and neutral direct confirmation", async ({ page, context }) => {
  await page.goto("/thank-you"); await expect(page.getByText(/Visiting this page does not confirm/)).toBeVisible();
  await page.goto("/contact"); await fillQuote(page, "Custom elevator");
  const before = await providerState();
  const response = await sendQuote(page); expect(response.status()).toBe(200); expect((await response.json()).emailSent).toBe(true);
  await expect(page).toHaveURL(`${origin}/thank-you`);
  await expect(page.getByText(/Your quote request was accepted for email delivery/)).toBeVisible();
  const cookie = (await context.cookies(`${origin}/thank-you`)).find((cookie) => cookie.name === "kiefer_quote_accepted");
  expect(cookie).toMatchObject({ value: "accepted", httpOnly: true, sameSite: "Lax", path: "/thank-you" });
  expect((await providerState()).acceptedEmails).toBe(before.acceptedEmails + 1);
  expect((await providerState()).calls.at(-1).projectType).toBe("Custom elevator");
  await context.clearCookies(); await page.goto("/thank-you"); await expect(page.getByText(/Visiting this page does not confirm/)).toBeVisible();
});

test("6 lost acceptance manual retry is duplicate-safe; edited intent gets a new key", async ({ page }) => {
  await page.goto("/contact"); await fillQuote(page);
  const before = await providerState(); await mode("lose-response");
  expect((await sendQuote(page)).status()).toBe(502);
  await expect(page.locator("#contact").getByRole("alert")).toContainText(/couldn't confirm/i);
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("QA Fictional Client");
  expect((await providerState()).calls.length).toBe(before.calls.length + 1);
  await mode("accept"); expect((await sendQuote(page)).status()).toBe(200);
  await expect(page).toHaveURL(`${origin}/thank-you`);
  const first = await providerState(); const pair = first.calls.slice(before.calls.length);
  expect(pair).toHaveLength(2); expect(pair[0].key).toBe(pair[1].key); expect(pair[0].bodyHash).toBe(pair[1].bodyHash);
  expect(first.acceptedEmails).toBe(before.acceptedEmails + 1);
  await page.goto("/contact"); await fillQuote(page); await mode("lose-response");
  await sendQuote(page); await expect(page.locator("#contact").getByRole("alert")).toBeVisible();
  await page.getByLabel("Project type", { exact: true }).selectOption("Custom elevator"); await mode("accept");
  expect((await sendQuote(page)).status()).toBe(200); await expect(page).toHaveURL(`${origin}/thank-you`);
  const edited = (await providerState()).calls.slice(first.calls.length);
  expect(edited).toHaveLength(2); expect(edited[0].key).not.toBe(edited[1].key); expect(edited[0].bodyHash).not.toBe(edited[1].bodyHash);
  expect(edited[1].projectType).toBe("Custom elevator");
});

test("7 rejected provider and denied copy preserve complete selectable last-attempt details", async ({ page, context }) => {
  await context.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Local denied fixture"); } } }); });
  await page.goto("/contact"); await fillQuote(page, "Custom elevator"); await mode("reject");
  const before = await providerState(); expect((await sendQuote(page)).status()).toBe(502);
  await expect(page.locator("#contact").getByRole("alert")).toContainText(/Could not send/);
  await page.getByRole("button", { name: "Copy request details", exact: true }).click();
  await expect(page.getByText(/Automatic copying is unavailable/)).toBeVisible();
  const recovery = page.getByLabel("Request details to copy", { exact: true });
  await expect(recovery).toBeFocused(); expect(await recovery.inputValue()).toContain("Project type: Custom elevator");
  expect(await recovery.inputValue()).toContain("A fictional browser regression inquiry.");
  expect(await recovery.evaluate((element) => element.selectionStart === 0 && element.selectionEnd === element.value.length)).toBe(true);
  await page.getByLabel("Project details", { exact: true }).fill("Edited after failure, without resubmission.");
  expect(await recovery.inputValue()).not.toContain("Edited after failure");
  expect((await providerState()).acceptedEmails).toBe(before.acceptedEmails);
});

test("8 vendor Enter/click safe with disabled, blocked and delayed scripts; preparation stays unsent", async ({ page, browser }) => {
  for (const scriptState of ["disabled", "blocked", "delayed"]) {
    const context = await browser.newContext({ baseURL: origin, javaScriptEnabled: scriptState !== "disabled", viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    const guards = await contain(context); const documents = [];
    let release; const gate = new Promise((resolve) => { release = resolve; });
    if (scriptState !== "disabled") await context.route("**/_next/static/**/*.js", async (route) => { if (scriptState === "delayed") { await gate; await route.continue(); } else await route.abort(); });
    try {
      const vendor = await context.newPage(); vendor.on("request", request => { if (request.isNavigationRequest()) documents.push(request.url()); });
      await vendor.goto("/vendors", { waitUntil: "commit" }); await expect(vendor.locator("form fieldset")).toHaveAttribute("disabled", "");
      await seedVendor(vendor);
      const submit = vendor.locator('button[type="submit"]'); await expect(submit).toBeDisabled();
      await submit.scrollIntoViewIfNeeded(); const box = await submit.boundingBox(); await vendor.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await vendor.keyboard.press("Enter"); await assertVendorURL(vendor);
      expect(await vendor.locator('[name="companyName"]').inputValue()).toBe("QA Fictional Vendor");
      expect(documents.every(url => new URL(url).search === "")).toBe(true);
      expect(guards.outbound).toEqual([]);
    } finally { release(); await guards.drain(); await context.close(); }
  }
  const before = await providerState(); await page.goto("/vendors"); await expect(page.locator('button[type="submit"]')).toBeEnabled();
  await seedVendor(page); await page.locator('button[type="submit"]').click();
  await expect(page.getByRole("heading", { name: "Your vendor email is prepared" })).toBeVisible();
  await expect(page.getByText(/This website has not sent them/)).toBeVisible(); await assertVendorURL(page);
  const mail = new URL(await page.getByRole("link", { name: "Open prepared vendor email" }).getAttribute("href"));
  expect(mail.pathname).toBe("marlys@kbuiltco.com"); expect(mail.searchParams.get("cc")).toBe("info@kbuiltco.com");
  expect(mail.searchParams.get("body")).toContain("QA Fictional Vendor");
  await expect(page.locator('[name="companyName"]')).toHaveValue("QA Fictional Vendor");
  expect((await providerState()).calls.length).toBe(before.calls.length);
});

test("9 coverage bounds/initial content at 320,390,1440 with script failure and rendered SEO equality", async ({ browser }) => {
  for (const width of [320, 390, 1440]) for (const scriptState of ["enabled", "disabled", "blocked"]) {
    const context = await browser.newContext({ baseURL: origin, viewport: { width, height: 1000 }, javaScriptEnabled: scriptState !== "disabled", reducedMotion: "reduce", serviceWorkers: "block" });
    const guards = await contain(context);
    if (scriptState === "blocked") await context.route("**/_next/static/**/*.js", (route) => route.abort());
    try {
      const page = await context.newPage(); await page.goto("/service-areas");
      await assertCoverageBounds(page);
      for (const city of cities) await expect(page.getByRole("heading", { name: city, exact: true })).toBeVisible();
      expect(await page.locator("main").innerText()).not.toMatch(/miles from|drive times|°[NW]|numerous custom builds|six core communities/i);
      const hidden = await page.locator("main h1, main h2").evaluateAll((elements) => elements.some(element => { for (let node = element; node; node = node.parentElement) if (getComputedStyle(node).opacity === "0" || getComputedStyle(node).visibility === "hidden") return true; return false; }));
      expect(hidden).toBe(false);
      if (scriptState === "enabled") {
        await page.screenshot({ path: join(runRoot, `service-areas-${width}.png`), fullPage: true });
        await page.getByText("Northern Colorado Service Territory", { exact: true }).locator("../..").screenshot({ path: join(runRoot, `coverage-panel-${width}.png`) });
      }
      await page.goto("/");
      expect(await page.locator("#service-area p").allTextContents()).toEqual(expect.arrayContaining(cities));
      const schema = await page.locator('script[type="application/ld+json"]').evaluateAll((elements) => elements.flatMap(element => JSON.parse(element.textContent)).find(value => value["@type"] === "GeneralContractor"));
      expect(schema.areaServed.map(area => area.name)).toEqual(cities); expect(schema.geo).toBeUndefined();
      expect(await page.locator('meta[name="geo.position"],meta[name="ICBM"]').count()).toBe(0);
      if (scriptState === "enabled") {
        await page.screenshot({ path: join(runRoot, `home-${width}.png`), fullPage: true });
        await page.locator("#service-area").screenshot({ path: join(runRoot, `home-service-area-${width}.png`) });
      }
      for (const path of ["/projects/greeley", "/projects/mountain-modern"]) {
        await page.goto(path); await expect(page.locator("main h1")).toBeVisible();
        await expect(page.locator('main button[aria-label^="Open"]').first()).toBeVisible();
        const hiddenProjectContent = await page.locator('main h1,main h2,main img,main button[aria-label^="Open"]').evaluateAll((elements) => elements.some(element => {
          for (let node = element; node; node = node.parentElement) {
            const style = getComputedStyle(node);
            if (style.opacity === "0" || style.visibility === "hidden" || style.display === "none") return true;
          }
          return false;
        }));
        expect(hiddenProjectContent).toBe(false);
      }
      expect(guards.outbound).toEqual([]);
    } finally { await guards.drain(); await context.close(); }
  }
});

test("10 photo dialog keyboard/Escape and no analytics across navigation/fake inquiry", async ({ page, context }) => {
  const analytics = []; context.on("request", request => { if (/googletagmanager|google-analytics|google.*collect/.test(request.url())) analytics.push(new URL(request.url()).origin); });
  await page.goto("/projects/greeley"); await page.locator('button[aria-label^="Open"]').first().click();
  const dialog = page.locator(".yarl__root"); await expect(dialog).toBeVisible();
  for (let index = 0; index < 8; index++) { await page.keyboard.press("Tab"); expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true); }
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible();
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Contact Us", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/contact`); await fillQuote(page); await mode("reject"); await sendQuote(page);
  await page.goto("/privacy-policy"); expect(await page.locator("main").innerText()).not.toContain("Google Analytics");
  expect(analytics).toEqual([]); expect(await page.locator('script[src*="googletagmanager"],script[src*="google-analytics"]').count()).toBe(0);
});

test("sensitivity: unsafe native vendor GET in an isolated response copy is detected", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: origin, javaScriptEnabled: false, serviceWorkers: "block" }); const guards = await contain(context);
  try {
    await context.route(`${origin}/vendors`, async route => {
      const response = await route.fetch({ maxRedirects: 0 });
      const html = (await response.text()).replace(/(<form\b[^>]*method=")post("[^>]*>)/, "$1get$2").replace(/(<fieldset\b[^>]*|<button\b[^>]*)(?: disabled="")/g, "$1");
      await route.fulfill({ response, body: html });
    });
    const page = await context.newPage(); await page.goto("/vendors"); await seedVendor(page);
    const navigation = page.waitForURL(url => url.pathname === "/vendors" && url.search !== "");
    await page.locator('button[type="submit"]').click(); await navigation;
    await expect(async () => assertVendorURL(page)).rejects.toThrow(/Native submission/);
    expect(new URL(page.url()).searchParams.get("companyName")).toBe("QA Fictional Vendor"); expect(guards.outbound).toEqual([]);
  } finally { await guards.drain(); await context.close(); }
});

test("sensitivity: a clipped panel in an isolated response copy is detected", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: origin, javaScriptEnabled: false, viewport: { width: 320, height: 844 }, serviceWorkers: "block" }); const guards = await contain(context);
  try {
    await context.route(`${origin}/service-areas`, async route => {
      const response = await route.fetch({ maxRedirects: 0 }); const html = (await response.text()).replace('class="relative text-center"', 'class="relative text-center" style="height:80px;overflow:hidden"');
      await route.fulfill({ response, body: html });
    });
    const page = await context.newPage(); await page.goto("/service-areas");
    await expect(async () => assertCoverageBounds(page)).rejects.toThrow(/Coverage children/);
    expect(guards.outbound).toEqual([]);
  } finally { await guards.drain(); await context.close(); }
});
