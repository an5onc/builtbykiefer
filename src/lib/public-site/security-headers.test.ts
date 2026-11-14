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

  it("observes known static-site resources without claiming strict inline protection", () => {
    const headers = Object.fromEntries(publicSecurityHeaders().map(({ key, value }) => [key, value]));
    const policy = headers["Content-Security-Policy-Report-Only"];
    expect(policy.split("; ")).toEqual(["default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:", "font-src 'self'", "connect-src 'self'", "media-src 'self' blob:", "object-src 'none'",
      "base-uri 'self'", "frame-src 'none'", "frame-ancestors 'none'", "form-action 'self'"]);
    expect(policy).not.toMatch(/unsafe-eval|report-uri|report-to|report-sample|https?:|\*/);
  });

  it("isolates development HMR/eval allowances from the production policy", () => {
    const policy = publicSecurityHeaders(true).find(({ key }) => key === "Content-Security-Policy-Report-Only")?.value;
    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(policy).toContain("connect-src 'self' ws: wss:");
    expect(publicSecurityHeaders().some(({ value }) => /unsafe-eval|ws:|wss:/.test(value))).toBe(false);
  });
});
