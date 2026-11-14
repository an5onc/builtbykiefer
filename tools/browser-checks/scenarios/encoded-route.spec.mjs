import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { test, expect, origin, runRoot, providerState, fillQuote, mode } from "./helpers.mjs";
import { assertLocalOrigin } from "../guards.mjs";

// Native HTTP preserves malformed/encoded path spellings. No arbitrary target,
// payload, headers, redirect following or automatic retries are exposed.
function rawLocalRequest(path, method = "POST") {
  const target = new URL(assertLocalOrigin(origin));
  assert.ok(path.startsWith("/") && !/[\r\n#]/.test(path));
  assert.ok(["POST", "GET", "HEAD", "OPTIONS"].includes(method));
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const request = httpRequest({ hostname: target.hostname, port: target.port, path, method,
      headers: { origin, "Content-Type": "application/json", ...(method === "POST" ? { "Content-Length": "2" } : {}) } }, (response) => {
      const chunks = []; let size = 0;
      response.on("data", (chunk) => {
        size += chunk.length;
        if (size > 8 * 1024 * 1024) response.destroy(new Error("Bounded local response exceeded"));
        else chunks.push(chunk);
      });
      response.on("error", reject);
      response.on("end", () => resolve({ path, method, status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks), elapsedMs: performance.now() - started }));
    });
    request.setTimeout(10000, () => request.destroy(new Error("Owned loopback request timeout")));
    request.on("error", reject); request.end(method === "POST" ? "{}" : undefined);
  });
}

test.beforeEach(async () => { await mode("accept"); });

test("25 encoded API raw paths reject before quote dispatch; normal methods, redirects and encoded assets remain intact", async () => {
  const before = await providerState(); const samples = [];
  const paths = ["/api/%71uote-request", "/api/quote%2drequest", "/%61pi/quote-request", "/a%70i/quote-request", "/ap%69/quote-request", "/%61%70%69/quote-request", "/api%2Fquote-request", "/%2Fapi/quote-request", "/api%5cquote-request", "/api/%2571uote-request", "/%2561pi/quote-request", "/api/%ZZuote-request", "/api/%E0%A4%A", "/api/%", "/api/%00quote-request"];
  for (const path of paths) {
    const response = await rawLocalRequest(path);
    expect(response.status, path).toBe(400);
    expect(JSON.parse(response.body.toString())).toMatchObject({ ok: false, code: "invalid_api_path" });
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.headers["set-cookie"]).toBeUndefined(); expect(response.headers.location).toBeUndefined();
    samples.push({ path, status: response.status, elapsedMs: response.elapsedMs });
  }
  for (const [path, method, status] of [
    ["/api/quote-request", "POST", 400], ["/api/quote-request?source=%71", "POST", 400],
    ["/api/quote-request", "GET", 405], ["/api/quote-request", "HEAD", 405], ["/api/quote-request", "OPTIONS", 204],
    ["/api/quote-request/", "POST", 308], ["//api/quote-request", "POST", 308],
    ["/api%20photos/banner.jpg", "GET", 404],
  ]) {
    const response = await rawLocalRequest(path, method);
    expect(response.status, `${method} ${path}`).toBe(status);
    if (status === 308) expect(response.headers.location).toBe("/api/quote-request");
    else expect(response.headers.location).toBeUndefined();
    expect(response.headers["set-cookie"]).toBeUndefined(); samples.push({ path, method, status });
  }
  const assets = JSON.parse(await readFile(join(runRoot, "encoded-route-assets.json"), "utf8"));
  for (const asset of assets) {
    const response = await rawLocalRequest(asset.url, "GET");
    expect(response.status).toBe(200);
    expect(createHash("sha256").update(response.body).digest("hex")).toBe(asset.sha256);
    samples.push({ path: asset.url, status: 200, hashMatches: true, elapsedMs: response.elapsedMs });
  }
  const after = await providerState();
  expect(after.calls.length).toBe(before.calls.length); expect(after.acceptedEmails).toBe(before.acceptedEmails); expect(after.blockedOutbound).toBe(0);
  await writeFile(join(runRoot, "encoded-route-results.json"), JSON.stringify({ samples, providerCalls: 0, liveEmail: false }, null, 2));
});

test("26 actual encoded-path rejection preserves draft/recovery, then deliberate canonical retry uses only simulated delivery", async ({ page, context }) => {
  await context.addInitScript(() => {
    const original = window.fetch;
    window.__encodedAttempts = 0;
    window.fetch = function (input, init) {
      if (input === "/api/quote-request" && init?.method === "POST" && window.__encodedAttempts++ === 0) {
        return original("/api/%71uote-request", init);
      }
      return original(input, init);
    };
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Local denied-copy fixture"); } } });
  });
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/contact"); await fillQuote(page);
  const before = await providerState();
  const blocked = page.waitForResponse(response => response.url() === `${origin}/api/%71uote-request` && response.request().method() === "POST");
  await page.getByRole("button", { name: "Send Quote Request", exact: true }).click();
  expect((await blocked).status()).toBe(400);
  const alert = page.locator("#contact").getByRole("alert"); await expect(alert).toBeFocused();
  await expect(alert).toContainText(/website's quote form/i);
  const values = { Name: "QA Fictional Client", Email: "fixture@example.com", Phone: "9705550100", "Project location": "Windsor", "Project details": "A fictional browser regression inquiry. No customer information.", "Project type": "Custom home", "Budget range": "Still planning", Timeline: "Still planning" };
  for (const [label, value] of Object.entries(values)) await expect(page.getByLabel(label, { exact: true })).toHaveValue(value);
  await expect(page.getByRole("button", { name: "Send Quote Request", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Copy request details", exact: true }).click();
  const recovery = page.getByLabel("Request details to copy", { exact: true }); await expect(recovery).toBeFocused();
  for (const value of Object.values(values)) expect(await recovery.inputValue()).toContain(value);
  expect(await recovery.evaluate(element => element.selectionStart === 0 && element.selectionEnd === element.value.length)).toBe(true);
  await page.waitForTimeout(1000); expect(await page.evaluate(() => window.__encodedAttempts)).toBe(1);
  expect((await providerState()).calls.length).toBe(before.calls.length); expect(new URL(page.url()).pathname).toBe("/contact");
  await page.locator("#contact").screenshot({ path: join(runRoot, "encoded-route-recovery-mobile.png") });
  const accepted = page.waitForResponse(response => response.url() === `${origin}/api/quote-request` && response.request().method() === "POST");
  await page.getByRole("button", { name: "Send Quote Request", exact: true }).click(); expect((await accepted).status()).toBe(200);
  await expect(page).toHaveURL(`${origin}/thank-you`); expect((await providerState()).acceptedEmails).toBe(before.acceptedEmails + 1);
});
