// Resource restrictions are observation only; framing is enforced by X-Frame-Options.
// Keep Next's inline bootstrap/JSON-LD and React styles compatible with static pages.
// Explicit hosts for the shared Ads/Analytics tag; no arbitrary-origin wildcard.
const googleAdsScripts = "https://www.googletagmanager.com https://www.googleadservices.com https://www.google.com";
const googleAnalyticsHosts = "https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com";
const googleAdsImages = `${googleAdsScripts} https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com ${googleAnalyticsHosts}`;
const googleAdsConnections = `${googleAdsImages} https://ad.doubleclick.net`;

export function publicSecurityHeaders(development = false) {
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ""} ${googleAdsScripts}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${googleAdsImages}`,
    "font-src 'self'",
    `connect-src 'self'${development ? " ws: wss:" : ""} ${googleAdsConnections}`,
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-src https://www.googletagmanager.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join("; ");

  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Content-Security-Policy-Report-Only", value: policy },
  ];
}
