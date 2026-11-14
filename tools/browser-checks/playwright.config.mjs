import assert from "node:assert/strict";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";
import { assertLocalOrigin } from "./guards.mjs";

assert.ok(process.env.KIEFER_BROWSER_RUN_ROOT, "Use the guarded runner, not the raw Playwright CLI.");
export default defineConfig({
  testDir: "./scenarios",
  testMatch: "**/*.spec.mjs",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  expect: { timeout: 7000 },
  outputDir: join(process.env.KIEFER_BROWSER_RUN_ROOT, "artifacts"),
  reporter: [["list"], ["json", { outputFile: join(process.env.KIEFER_BROWSER_RUN_ROOT, "playwright-results.json") }]],
  use: {
    browserName: "chromium",
    headless: true,
    baseURL: assertLocalOrigin(process.env.KIEFER_BROWSER_ORIGIN),
    viewport: { width: 1440, height: 1000 },
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { args: ["--disable-background-networking", "--no-first-run"] },
  },
});
