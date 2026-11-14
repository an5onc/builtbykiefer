type RequestRejection = { status: 403 | 415; code: string; error: string };

// These reduce browser-driven cross-site submissions. They are not bot authentication or rate limiting.
export function rejectUnsafeQuoteRequest(request: Request): RequestRejection | null {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return { status: 415, code: "unsupported_request_format", error: "Please use the online quote form, or contact Kiefer Built directly." };
  }
  if (request.headers.get("sec-fetch-site")?.toLowerCase() === "cross-site") {
    return { status: 403, code: "request_origin_rejected", error: "Please submit your request from this website, or contact Kiefer Built directly." };
  }
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const parsed = new URL(origin);
      const routeUrl = new URL(request.url);
      // Next may reconstruct request.url with an internal hostname; browser Host identifies the actual target.
      // Do not take the target origin or client identity from arbitrary X-Forwarded-* values.
      const target = new URL(`${routeUrl.protocol}//${request.headers.get("host") || routeUrl.host}`);
      if (target.username || target.password || target.pathname !== "/" || target.search || target.hash
        || parsed.origin !== origin || parsed.origin !== target.origin) throw new Error("Origin mismatch");
    } catch {
      return { status: 403, code: "request_origin_rejected", error: "Please submit your request from this website, or contact Kiefer Built directly." };
    }
  }
  // Missing browser metadata remains allowed for compatible clients; never infer a trusted IP from arbitrary headers.
  return null;
}
