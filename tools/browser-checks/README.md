# Local Browser Regression Checks

Permanent product checks for the prepared Kiefer Built website. This private package is outside the website runtime and release allowlist. It never deploys or sends email. Chromium runs headlessly in an isolated profile; it does not use the owner's browser or mail app. The root application dependencies remain unchanged.

## Setup

Use the repository's declared Node 24 and npm 11. In this directory:

```sh
npm ci --no-fund
npm run install:browser
npm run guards
```

The pinned Playwright version installs Chromium into its managed local cache. Its browser download and npm registry access are setup traffic, not website/provider traffic. No global package installation or credentials are required.

## Check an Exact Candidate

From the repository root, prepare and qualify a fresh retained candidate:

```sh
npm run release:retain
node scripts/release/qualify.mjs --manifest /absolute/path/to/manifest.json
```

Use the exact manifest and passing qualification receipt reported by those commands. From this test directory:

```sh
npm run check -- --manifest /absolute/path/to/manifest.json --qualification /absolute/path/to/checks/run-ID/qualification.json
```

There is intentionally no arbitrary URL option and no reuse of an existing server. The runner verifies the immutable selected-file inventory, expected Node/npm qualification outcomes and built production output, then starts its own server on a fresh `127.0.0.1` port. Child environments do not inherit delivery credentials, proxy settings or arbitrary preloads. A server-side preload supplies fixture-only settings and intercepts the exact provider call; unexpected outbound fetch/HTTP attempts are refused. Browser HTTP requests are restricted to the owned origin, WebSockets are refused, service workers are blocked, and external mail/phone/link actions are intercepted. Do not bypass these guards or point tests at a hosted site.

The real quote Route Handler still validates and formats every synthetic inquiry. The local provider models acceptance, rejection and lost acceptance receipts with key/body hashes and acceptance counts. These are simulated acceptance receipts, never actual delivery/inbox/reply evidence.

## Coverage and Results

Twenty-nine required tests cover ten original journey groups, four photo/gallery/navigation groups, three image/404/content groups, three wall/homepage groups, two guide/video groups, two encoded-route groups, three careers groups and two regression-sensitivity fixtures: contact/disclosures; mobile menu/scroll restoration; gallery keyboard/pause/reduced motion; elevator/native validation; quote acceptance/cookie/neutral confirmation; unchanged/edited manual retries; denied-copy recovery; vendor disabled/blocked/delayed scripts and unsent preparation; seven-city content/bounds/rendered SEO at 320/390/1440px; photo-dialog Escape/keyboard and analytics absence.

The photo checks cover all five ranch filters at eight widths, every filtered tile/lightbox identity at desktop/phone widths, corrected targeted descriptions, internal project home links, and gallery visibility/packing when scripts fail. `compare-photos.mjs <current manifest> <current qualification> <baseline manifest> <baseline qualification>` records paired local screenshots/DOM evidence at1440/768/390px using the same exact-manifest/provider/network containment and owned-process cleanup. It starts no external navigation or lead submission; comparison evidence stays outside export.

The image/404/content groups check ten missing/retired HTTP404 responses, dedicated noindex metadata, branded shell, keyboard/mobile/no-JS recovery, actual decoded cover-crop pixel density (including original-resolution ceilings), every shared-content rendered image/card name and actual icon dimensions. The runner derives a fixture from the verified selected source, so a stale dirty checkout cannot supply expected descriptions. The200% check uses equivalent viewport reflow; native browser zoom/physical-device/assistive coverage is not claimed.

`node capture-images.mjs <manifest> <qualification> baseline` (or `current`) records a fixed twelve-view/DPR matrix and actual optimized image response dimensions/bytes/screenshots in a fresh ignored `output/image-measurements/run-*/`. It takes no URL, starts only an owned loopback server with the existing provider/redirect/network guards, sends no inquiry, verifies source integrity and stops its processes. Compare the two records by viewport/DPR/route/kind/index; preserve crop/geometry/loading and report byte/quality tradeoffs. Decoding uses sharp already installed with Next; no dependency was added.

The encoded-route groups send bounded raw-target loopback requests to the owned production server. Encoded API letters/prefixes/separators/nested/malformed spellings return the explicit400 path-policy response before provider work; normal methods/query validation and308 normalization remain intact. Two percent-encoded image URLs must return bytes matching their candidate manifest. A mobile browser sends one fictitious request to the encoded path, checks focused error/eight preserved fields/denied-copy fallback/no automatic retry, then deliberately retries the canonical URL through the simulated provider. No hosted target or live delivery is used.

The wall groups verify the removed homepage process block, preserved /process page, preview→SIPs hash navigation, Stick/SIP radios with arrow keys, actual SIP wipe/air-layer state, zoom/back focus, descriptive image role/citations and final settled illustration. They cover320/390/768/1440 with normal/reduced motion and320/390/1440 with disabled/blocked scripts. The existing all-image comparison includes the four exact decorative wall layers in order, derived from the selected illustration source rather than dropping feature images from coverage.

The media groups verify both actual guide downloads against the selected manifest hash, all four selected media asset hashes/MIME types, old asset URL redirects/query preservation and video range responses. At320/390/1440 they check decoded metadata, keyboard native playback/pause, seek, caption cue loading/toggle, all sixteen description cues and the shared readable transcript. Disabled/blocked-script contexts retain visible video/native transcript access. Original audio is owner-confirmed background music only; browser tests do not claim listening, screen-reader/fullscreen or physical-device acceptance.

Owned browser requests are copied and drained before test-context disposal, with a bounded timeout; new owned requests are refused once teardown starts. This prevents SDK response-disposal races without discarding live-page failures, weakening origin/redirect/provider rules or enabling retries. Guards prove copying/draining, teardown refusal, foreign-origin traps and the preserved narrow closed-page error rule.

Sensitivity fixtures modify isolated copies of actual HTML responses in new no-JS browser contexts. One recreates an unsafe native vendor GET; the other clips the coverage panel. The same guards must detect both. They do not rewrite application source, compiled assets or the selected manifest, and are not additional product behavior.

Every run writes a fresh ignored `output/browser-checks/run-*/` directory with candidate digest, runtime/tool/browser version, qualification reference, production build ID, actual test results, provider key/body hashes/counts, screenshots and owned-process cleanup status. Failed runs retain diagnostic traces and a failed receipt. Traces contain fictitious data only. Required failures return nonzero; retries are disabled. Readiness and UI waits are bounded and state based. The current runner checks source integrity before/after tests; the qualification receipt/build ID is a local build reference, not an independently signed build attestation.

The separate thirteen guard tests prove origin/qualification/inventory/env safety, simulated duplicate handling, missing-preload refusal, startup cleanup and fetch/HTTPS refusal. An actual Chromium check also proves an unowned destination receives zero connections, both directly and through a local redirect; browser routing inspects redirects without following them. A teardown regression accepts only the known disposed-response cancellation after a page closes, while live-page/other errors still fail. Root Vitest excludes this package; root lint checks its JavaScript. Browser package/lockfile are checked separately by `npm ci`, `npm audit`, guard tests and actual journeys.

No CI workflow is enabled or changed here. A local Chromium pass does not establish Firefox/WebKit, physical device, assistive technology, hosted protection, inbox receipt or client acceptance. Add another engine/scenario only for a demonstrated risk or separately agreed scope.

Official tool references: [Playwright configuration](https://playwright.dev/docs/test-configuration), [network interception](https://playwright.dev/docs/network), [JavaScript and viewport options](https://playwright.dev/docs/api/class-testoptions).

The careers groups fill the real /careers form, select manifest-pinned synthetic PDF/DOCX files, and check exact-byte attachments in the simulated provider only. Both quote and careers fixtures require the exact approved To array (info@kbuiltco.com, lauren@kbuiltco.com, mark@kbuiltco.com), with no extra CC/BCC; all delivery remains intercepted with no real network. A deliberately conflicting legacy CONTACT_EMAIL_TO fixture value proves it cannot redirect the current handlers. Success remains inline with no quote receipt cookie. Rejection,429, uncertain acceptance/unchanged explicit retry, copy denial, replace/remove file,320/390/1440 layout, keyboard and disabled/blocked-script fallback are required. The project floating CTA is absent on careers and retained on other pages.

Playwright filesystem-backed file inputs lose file bytes when multipart requests are replayed through CDP route.fetch; private diagnostic evidence compares path-backed400 versus materialized-byte502 (simulated rejection). The career fixture therefore creates browser Files from the exact selected fixture bytes, without replacing the application request or relaxing origin/redirect/server-provider guards. Physical OS file-picker behavior is not certified by this automated setup. All original quote fixture assertions remain unchanged; career delivery uses a separate strict namespace, fixed recipient and exact synthetic-file hash allowlist. Synthetic fixture files are part of qualification source only and explicitly excluded from Vercel uploads by .vercelignore.
