import { AsyncLocalStorage } from "node:async_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "./proxy";

describe("routing boundary", () => {
  beforeAll(() => { Object.assign(globalThis, { AsyncLocalStorage }); });

  it.each(["/api/%71uote-request", "/%61pi/quote-request", "/api%2Fquote-request", "/api/%2571uote-request", "/api/%ZZuote-request"])("matches and rejects the raw spelling %s without body or network work", async (path) => {
    const { unstable_doesMiddlewareMatch } = await import("next/experimental/testing/server");
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: path })).toBe(true);
    const request = new NextRequest(`http://localhost${path}`, { method: "POST", body: "{}" });
    const bodyRead = vi.spyOn(request, "json");
    const network = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network forbidden"));
    try {
      const response = proxy(request);
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ ok: false, code: "invalid_api_path" });
      expect(response.headers.get("cache-control")).toBe("no-store");
      for (const header of ["set-cookie", "location", "x-middleware-rewrite", "x-middleware-next"]) expect(response.headers.get(header)).toBeNull();
      expect(request.bodyUsed).toBe(false); expect(bodyRead).not.toHaveBeenCalled(); expect(network).not.toHaveBeenCalled();
    } finally { bodyRead.mockRestore(); network.mockRestore(); }
  });

  it.each(["/api/quote-request", "/api/quote-request?source=%71", "/api/quote-request/", "/images/photo%20one.jpg", "/im%61ges/photo.jpg"])("passes %s without redirect, rewrite, URL mutation or body consumption", (path) => {
    const request = new NextRequest(`http://localhost${path}`, { method: "POST", body: "{}" });
    const original = request.url;
    const response = proxy(request);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("location")).toBeNull(); expect(response.headers.get("x-middleware-rewrite")).toBeNull();
    expect(request.url).toBe(original); expect(request.bodyUsed).toBe(false);
  });

  it.each(["/", "/process", "/projects/greeley", "/_next/static/script.js", "/_next/image?url=%2Fimages%2Fphoto.jpg"])("does not invoke the boundary for %s", async (path) => {
    const { unstable_doesMiddlewareMatch } = await import("next/experimental/testing/server");
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: path })).toBe(false);
  });
});
