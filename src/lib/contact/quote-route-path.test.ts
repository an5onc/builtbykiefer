import { describe, expect, it } from "vitest";
import { rejectEncodedApiPath } from "./quote-route-path";

describe("encoded API boundary policy", () => {
  it.each([
    "/api/%71uote-request", "/api/quote%2drequest", "/%61pi/quote-request",
    "/a%70i/quote-request", "/ap%69/quote-request", "/%61%70%69/quote-request",
    "/api%2Fquote-request", "/%2fapi/quote-request", "/api%5cquote-request",
    "/api/%2571uote-request", "/%2561pi/quote-request", "/api/%ZZuote-request",
    "/api/%E0%A4%A", "/API/%71uote-request", "/api/quote-request%3Fextra",
    "/api/unrelated%20path", "/api/%", "/api/%00quote-request",
  ])("rejects %s before dispatch", (path) => expect(rejectEncodedApiPath(path)).toBe(true));

  it.each([
    "/api/quote-request", "/api/quote-request/", "//api/quote-request",
    "/api/unrelated", "/", "/process", "/images/photo%20one.jpg",
    "/im%61ges/photo%20one.jpg", "/images/%ZZ.jpg", "/apiculture/photo%20one.jpg",
    "/%E2%9C%93", "/guides/guide%202026.pdf", "/not-api/%2571uote-request",
    "/api%20photos/banner.jpg", "/%61pi%20photos/banner.jpg", "/api%3Fphotos/banner.jpg",
  ])("preserves %s", (path) => expect(rejectEncodedApiPath(path)).toBe(false));

  it("bounds nested prefix inspection and fails closed for an unresolved prefix", () => {
    let nested = "%61";
    for (let count = 0; count < 32; count++) nested = nested.replaceAll("%", "%25");
    expect(rejectEncodedApiPath(`/${nested}pi/quote-request`)).toBe(true);
    expect(rejectEncodedApiPath(`/images/${nested}.jpg`)).toBe(false);
  });
});
