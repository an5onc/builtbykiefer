import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join, isAbsolute } from "node:path";
import http from "node:http";
import https from "node:https";
import { assertLocalOrigin, assertOwnedRequest } from "./guards.mjs";
import { simulateProvider } from "./provider.mjs";

const runRoot = process.env.KIEFER_BROWSER_RUN_ROOT;
assert.ok(runRoot && isAbsolute(runRoot), "Missing owned fixture directory.");
const origin = assertLocalOrigin(process.env.KIEFER_BROWSER_ORIGIN);
const controlPath = join(runRoot, "control.json");
assert.equal(JSON.parse(readFileSync(controlPath, "utf8")).mode, "accept", "Provider interception must be ready before startup.");
process.env.RESEND_API_KEY = "local-fixture-no-live-key";
process.env.CONTACT_EMAIL_FROM = "Kiefer Built <fixture@example.com>";
// Conflicting legacy setting proves it cannot redirect the fixed website list.
process.env.CONTACT_EMAIL_TO = "fixture-inbox@example.com";
const state = { ready: true, calls: [], records: {}, acceptedEmails: 0, blockedOutbound: 0 };
const save = () => writeFileSync(join(runRoot, "provider-state.json"), JSON.stringify(state, null, 2));
save();
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url === "https://api.resend.com/emails") {
    const control = JSON.parse(readFileSync(controlPath, "utf8"));
    if (new Headers(init?.headers).get("idempotency-key")?.startsWith("career-application/")) {
      control.careerHashes = JSON.parse(readFileSync(join(runRoot, "career-fixtures.json"), "utf8"));
    }
    const result = simulateProvider(state, control, init);
    save();
    return result;
  }
  try { assertOwnedRequest(url, origin); }
  catch (error) { state.blockedOutbound++; save(); throw error; }
  return originalFetch(input, init);
};
// Also refuse non-loopback legacy HTTP clients; only fetch's exact provider path is simulated.
for (const [module, protocol] of [[http, "http:"], [https, "https:"]]) {
  const original = module.request;
  module.request = function (input, ...args) {
    const url = typeof input === "string" || input instanceof URL ? String(input)
      : `${input.protocol ?? protocol}//${input.hostname ?? input.host ?? "localhost"}:${input.port ?? (protocol === "https:" ? 443 : 80)}${input.path ?? "/"}`;
    try { assertOwnedRequest(url, origin); }
    catch (error) { state.blockedOutbound++; save(); throw error; }
    return original.call(this, input, ...args);
  };
  module.get = function (...args) { const request = module.request(...args); request.end(); return request; };
}
