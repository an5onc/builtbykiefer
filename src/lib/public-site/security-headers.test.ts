import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { publicSecurityHeaders } from "./security-headers";

describe("browser response safeguards", () => {
  it("applies baseline safeguards to all paths through Next's native headers", async () => {
    const rules = await nextConfig.headers?.();
    expect(rules).toHaveLength(1);
    expect(rules?.[0].source).toBe("/:path*");
    const headers = Object.fromEntries((rules?.[0].headers ?? []).map(({ key, value }) => [key, value]));
    expect(headers).toMatchObject({ "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=()" });
    expect(headers["Content-Security-Policy"]).toBeUndefined();
  });

  it("observes static-site resources and explicit Ads/Analytics hosts without enabling arbitrary origins", () => {
    const headers = Object.fromEntries(publicSecurityHeaders().map(({ key, value }) => [key, value]));
    const policy = headers["Content-Security-Policy-Report-Only"];
    const directives = Object.fromEntries(policy.split("; ").map((directive) => {
      const [name, ...sources] = directive.split(" ");
      return [name, sources];
    }));
    expect(directives["default-src"]).toEqual(["'self'"]);
    expect(directives["script-src"]).toEqual(["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.googleadservices.com", "https://www.google.com"]);
    expect(directives["connect-src"]).toContain("https://googleads.g.doubleclick.net");
    expect(directives["connect-src"]).toContain("https://ad.doubleclick.net");
    expect(directives["connect-src"]).toContain("https://www.google-analytics.com");
    expect(directives["connect-src"]).toContain("https://region1.google-analytics.com");
    expect(directives["img-src"]).toContain("https://pagead2.googlesyndication.com");
    expect(directives["frame-src"]).toEqual(["https://www.googletagmanager.com"]);
    expect(directives["frame-ancestors"]).toEqual(["'none'"]);
    expect(directives["form-action"]).toEqual(["'self'"]);
    expect(policy).not.toMatch(/unsafe-eval|report-uri|report-to|report-sample|\*/);
  });

  it("isolates development HMR/eval allowances from the production policy", () => {
    const policy = publicSecurityHeaders(true).find(({ key }) => key === "Content-Security-Policy-Report-Only")?.value;
    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(policy).toContain("connect-src 'self' ws: wss:");
    expect(publicSecurityHeaders().some(({ value }) => /unsafe-eval|ws:|wss:/.test(value))).toBe(false);
  });
});
