import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test as base, expect } from "@playwright/test";
import { installBrowserContainment, drainBrowserContainment } from "../browser-policy.mjs";

export const origin = process.env.KIEFER_BROWSER_ORIGIN;
export const runRoot = process.env.KIEFER_BROWSER_RUN_ROOT;
export const cities = ["Windsor", "Fort Collins", "Loveland", "Greeley", "Timnath", "Johnstown", "Wellington"];

export async function contain(context) {
  const outbound = await installBrowserContainment(context, origin);
  const externalActions = [];
  // These actions remain unsent and do not launch an OS mail/phone app or external tab.
  await context.exposeBinding("recordExternalAction", (_source, value) => { externalActions.push(value); });
  await context.addInitScript(() => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest?.("a[href]");
      if (link && /^(mailto:|tel:|https?:)/i.test(link.getAttribute("href"))) {
        event.preventDefault();
        window.recordExternalAction(link.getAttribute("href").split("?")[0]);
      }
    }, true);
  });
  return { outbound, externalActions, drain: () => drainBrowserContainment(context) };
}

export const test = base.extend({
  containment: [async ({ context }, useFixture) => {
    const guards = await contain(context);
    try { await useFixture(guards); } finally { await guards.drain(); }
    expect(guards.outbound, "No external browser network attempt is allowed").toEqual([]);
  }, { auto: true }],
});
export { expect };

export async function mode(value) { await writeFile(join(runRoot, "control.json"), JSON.stringify({ mode: value })); }
export async function providerState() { return JSON.parse(await readFile(join(runRoot, "provider-state.json"), "utf8")); }

export async function fillQuote(page, project = "Custom home") {
  await expect(page.getByRole("button", { name: "Send Quote Request", exact: true })).toBeEnabled();
  for (const [name, value] of [["Name", "QA Fictional Client"], ["Email", "fixture@example.com"], ["Phone", "9705550100"], ["Project location", "Windsor"], ["Project details", "A fictional browser regression inquiry. No customer information."]]) {
    await page.getByLabel(name, { exact: true }).fill(value);
  }
  await page.getByLabel("Project type", { exact: true }).selectOption(project);
  await page.getByLabel("Budget range", { exact: true }).selectOption("Still planning");
  await page.getByLabel("Timeline", { exact: true }).selectOption("Still planning");
}

export async function sendQuote(page) {
  const response = page.waitForResponse((response) => response.url() === `${origin}/api/quote-request` && response.request().method() === "POST");
  await page.getByRole("button", { name: "Send Quote Request", exact: true }).click();
  return response;
}

export async function assertCoverageBounds(page) {
  const panel = page.getByText("Northern Colorado Service Territory", { exact: true }).locator("..");
  await expect(panel).toBeVisible();
  const result = await panel.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const failures = [...element.querySelectorAll("p, span")].filter((child) => {
      const box = child.getBoundingClientRect();
      return box.left < bounds.left - 1 || box.right > bounds.right + 1 || box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1;
    }).map((child) => child.textContent);
    return { failures, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  assert.deepEqual(result.failures, [], "Coverage children must stay inside the panel");
  assert.equal(result.overflow, false, "Page must not overflow horizontally");
}

export async function assertVendorURL(page) {
  assert.equal(new URL(page.url()).search, "", "Native submission must not put entered vendor fields in a URL");
  assert.equal(new URL(page.url()).pathname, "/vendors");
}

export async function seedVendor(page) {
  await page.locator("form").evaluate((form) => {
    for (const [name, value] of Object.entries({ companyName: "QA Fictional Vendor", contactName: "QA Fictional Person", phone: "9705550100", email: "fixture@example.com", description: "Fictional supplied materials for local checks." })) form.elements.namedItem(name).value = value;
  });
}
