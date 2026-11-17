import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// GET-only loopback checks. Provider sending is tested separately using mocks.
const [manifestPath, originInput] = process.argv.slice(2);
const origin = new URL(originInput);
assert.equal(origin.protocol, "http:");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname), "Smoke checks are local only.");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const root = manifest.candidateRoot;
const routeSource = await readFile(join(root, "src/lib/public-site/routes.ts"), "utf8");
const routes = [...routeSource.matchAll(/"(\/[^"\n]*)"/g)].map((match) => match[1]);
const pages = new Map();
let checks = 0;
let headerResponses = 0;
let frameworkRedirectsWithoutHeaders = 0;
async function get(path, headers) {
  const response = await fetch(new URL(path, origin), { headers, redirect: "manual", signal: AbortSignal.timeout(15000) });
  // Next's redirect path returns before configured page/asset headers are applied.
  // Keep redirect destination/status assertions below; record this boundary explicitly.
  if (response.status === 308 && response.headers.get("x-content-type-options") === null) {
    assert.ok(response.headers.get("location"), `${path}: redirect destination`);
    frameworkRedirectsWithoutHeaders++;
    return { response, bytes: Buffer.from(await response.arrayBuffer()) };
  }
  for (const [key, value] of Object.entries({
    "x-content-type-options": "nosniff", "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
  })) assert.equal(response.headers.get(key), value, `${path}: ${key}`);
  const policy = response.headers.get("content-security-policy-report-only") ?? "";
  assert.match(policy, /(?:^|; )default-src 'self'(?:;|$)/, `${path}: report-only policy`);
  assert.match(policy, /(?:^|; )connect-src 'self' https:\/\/www\.googletagmanager\.com /, `${path}: same-origin and explicit Google Ads connections`);
  assert.ok(!policy.includes("unsafe-eval") && !/report-(?:uri|to)|report-sample/.test(policy), `${path}: no eval or report collector`);
  assert.equal(response.headers.get("content-security-policy"), null, `${path}: resource policy remains report-only`);
  headerResponses++;
  return { response, bytes: Buffer.from(await response.arrayBuffer()) };
}
for (const route of routes) {
  const { response, bytes } = await get(route);
  assert.equal(response.status, 200, route);
  const html = bytes.toString();
  assert.ok(html.includes("google-ads-tag") && html.includes("https://www.googletagmanager.com/gtag/js?id=AW-11035153313"), `${route}: shared Google Ads bootstrap`);
  assert.ok(!/google-analytics|G-BBCR31BJSM|_next-ga/.test(html), `${route}: obsolete Analytics tag stays removed`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: one main heading`);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /name="description" content="[^"]+"/);
  const expected = `https://kbuiltco.com${route === "/" ? "" : route}`;
  assert.ok(html.includes(`rel="canonical" href="${expected}"`), `${route}: canonical`);
  if (route !== "/thank-you") assert.ok(html.includes(`property="og:url" content="${expected}"`), `${route}: social URL`);
  assert.ok(!html.includes("www.builtbykiefer.com"), `${route}: stale domain`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${route}: duplicate ID`);
  pages.set(route, { html, ids: new Set(ids) });
  checks++;
}
const internal = new Set();
for (const [route, page] of pages) {
  for (const match of page.html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const url = new URL(href, new URL(route, origin));
    if (url.origin !== origin.origin) continue;
    if (url.hash && pages.has(url.pathname)) assert.ok(pages.get(url.pathname).ids.has(decodeURIComponent(url.hash.slice(1))), `${route}: missing ${href}`);
    internal.add(url.pathname + url.search);
  }
}
for (const path of internal) {
  assert.equal((await get(path)).response.status, 200, path);
  checks++;
}
for (const file of manifest.files.filter((file) => file.path.startsWith("public/"))) {
  const path = "/" + file.path.slice(7).split("/").map(encodeURIComponent).join("/");
  const { response, bytes } = await get(path);
  assert.equal(response.status, 200, path);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256, path);
  checks++;
}
const sitemap = (await get("/sitemap.xml")).bytes.toString();
for (const route of routes.filter((route) => route !== "/thank-you")) assert.ok(sitemap.includes(`https://kbuiltco.com${route === "/" ? "/" : route}`), `Missing sitemap ${route}`);
assert.ok(!sitemap.includes("/thank-you"));
assert.match(pages.get("/thank-you").html, /noindex, nofollow/);
assert.ok(pages.get("/thank-you").html.includes("Visiting this page does not confirm"));
const robots = await get("/robots.txt");
assert.equal(robots.response.status, 200);
assert.ok(robots.bytes.toString().includes("Sitemap: https://kbuiltco.com/sitemap.xml"));
const redirectMap = JSON.parse(await readFile(join(root, "src/lib/public-site/legacy-redirects.json"), "utf8"));
for (const [source, destination] of Object.entries(redirectMap)) {
  for (const suffix of ["?utm_source=migration&lead=check", "/?utm_source=migration&lead=check"]) {
    let url = new URL(source + suffix, origin);
    let hops = 0;
    while (true) {
      const result = await get(url.pathname + url.search);
      checks++;
      if (result.response.status === 200) {
        assert.equal(url.pathname, destination, source);
        assert.equal(url.search, "?utm_source=migration&lead=check", `${source}: query retained`);
        break;
      }
      assert.equal(result.response.status, 308, `${source}: permanent redirect`);
      assert.ok(++hops <= 2, `${source}: no loop or long chain`);
      url = new URL(result.response.headers.get("location"), origin);
      if (source === "/buildertrend" && url.origin !== origin.origin) {
        assert.equal(url.origin + url.pathname, "https://buildertrend.net/app/Login");
        assert.equal(url.search, "?utm_source=migration&lead=check");
        break; // Verify the external login destination without fetching or authenticating it.
      }
      assert.equal(url.origin, origin.origin, `${source}: stay on the active host`);
    }
  }
}
for (const route of ["/admin", "/login", "/portal", "/vendor", "/demo-slider", "/estimate", "/project-timelines", "/not-a-retained-page", "/does-not-exist", "/projects/does-not-exist"]) {
  const { response, bytes } = await get(route);
  assert.equal(response.status, 404, route);
  const html = bytes.toString();
  assert.match(html, /<title>Page not found \| Kiefer Built Contracting<\/title>/, `${route}: dedicated title`);
  assert.match(html, /name="robots" content="[^"]*noindex/, `${route}: noindex`);
  assert.ok(!/rel="canonical"|property="og:url"/.test(html), `${route}: no homepage URL inheritance`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: one main heading`);
  assert.ok(html.includes('id="main-content"') && html.includes('<header') && html.includes('<footer'), `${route}: public shell`);
}
const selectedVideo = pages.get("/projects/mountain-modern").html.match(/<source\b[^>]*src="([^"]+)"[^>]*type="video\/mp4"/)?.[1];
assert.ok(selectedVideo?.startsWith("/images/project-2/"), "Mountain Modern renders a local project video.");
assert.ok(manifest.files.some((file) => file.path === `public${selectedVideo}`), "Video range check targets the selected release asset.");
const range = await get(selectedVideo, { range: "bytes=0-1023" });
assert.equal(range.response.status, 206);
assert.equal(range.bytes.length, 1024);
assert.equal((await get("/api/quote-request")).response.status, 405);
assert.equal((await get("/api/career-application")).response.status, 405);
console.log(JSON.stringify({ pages: pages.size, publicAssets: manifest.files.filter((file) => file.path.startsWith("public/")).length, responseChecks: checks + 14, headerResponses, frameworkRedirectsWithoutHeaders, status: "passed", sending: "GET-only checks; no email submissions" }, null, 2));
