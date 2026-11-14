import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { QUOTE_MAX_BODY_BYTES } from "@/lib/contact/quote-request-limits";

const payload = {
  name: "Jordan Client",
  email: "jordan@example.com",
  phone: "9705550100",
  projectType: "Custom home",
  location: "Windsor",
  budget: "Still planning",
  timeline: "Still planning",
  message: "We would like to discuss our custom home.",
  company: "",
};
const emailId = "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794";
const request = (body = JSON.stringify(payload), headers?: HeadersInit) =>
  new Request("http://localhost/api/quote-request", { method: "POST", body, headers: { "content-type": "application/json", ...headers } });

describe("quote request route", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RESEND_API_KEY", "test-key-never-used-live");
    vi.stubEnv("CONTACT_EMAIL_FROM", "Kiefer Built <quotes@example.com>");
    vi.stubEnv("CONTACT_EMAIL_TO", "recipient@example.com");
    vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends validated details to all three approved recipients with reply-to and confirms acceptance", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const response = await POST(request());
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie");
    expect(cookie).toMatch(/kiefer_quote_accepted=accepted/);
    expect(cookie).toMatch(/Path=\/thank-you/);
    expect(cookie).toMatch(/Max-Age=300/);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=lax/i);
    expect(cookie).not.toContain(payload.email);
    expect(await response.json()).toMatchObject({ ok: true, emailSent: true, requestId: expect.any(String) });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [endpoint, init] = fetchMock.mock.calls[0];
    expect(endpoint).toBe("https://api.resend.com/emails");
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(String(init?.body))).toMatchObject({
      from: "Kiefer Built <quotes@example.com>",
      to: ["info@kbuiltco.com", "lauren@kbuiltco.com", "mark@kbuiltco.com"], reply_to: payload.email,
    });
    expect(JSON.parse(String(init?.body)).cc).toBeUndefined();
    expect(JSON.parse(String(init?.body)).bcc).toBeUndefined();
    const logs = JSON.stringify(vi.mocked(console.info).mock.calls);
    expect(logs).toContain(emailId);
    for (const secret of [payload.name, payload.email, payload.phone, payload.message, "test-key-never-used-live", "recipient@example.com", "info@kbuiltco.com", "lauren@kbuiltco.com", "mark@kbuiltco.com"]) {
      expect(logs).not.toContain(secret);
    }
  });

  it("forwards a validated attempt key and preserves header-free compatibility", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const attempt = "11111111-2222-4333-8444-555555555555";
    expect((await POST(request(undefined, { "x-quote-attempt": attempt }))).status).toBe(200);
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get("idempotency-key")).toBe(`quote-request/${attempt}`);
    await POST(request());
    expect(new Headers(fetchMock.mock.calls[1][1]?.headers).has("idempotency-key")).toBe(false);
  });

  it.each(["", "invalid", "a".repeat(300), "11111111-2222-1333-8444-555555555555", "one,two"])(
    "rejects malformed attempt metadata before body read/provider work: %s", async (attempt) => {
      const incoming = request(undefined, { "x-quote-attempt": attempt });
      const read = vi.spyOn(incoming.body!, "getReader");
      const response = await POST(incoming);
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ ok: false, code: "invalid_quote_attempt" });
      expect(response.headers.get("set-cookie")).toBeNull();
      expect(read).not.toHaveBeenCalled(); expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("retries acceptance with a lost response using one provider email and an identical body", async () => {
    const accepted = new Map<string, { body: string; id: string }>();
    let emails = 0;
    fetchMock.mockImplementation(async (_endpoint, init) => {
      const key = new Headers(init?.headers).get("idempotency-key")!;
      const body = String(init?.body);
      if (accepted.has(key)) {
        expect(accepted.get(key)?.body).toBe(body);
        return Response.json({ id: accepted.get(key)?.id });
      }
      accepted.set(key, { body, id: emailId }); emails++;
      // Provider accepted it; response transport failed before the app could confirm.
      throw new TypeError("fixture lost response after acceptance");
    });
    const attempt = "11111111-2222-4333-8444-555555555555";
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-10-13T10:00:00Z"));
      const first = await POST(request(undefined, { "x-quote-attempt": attempt }));
      expect(first.status).toBe(502); expect(first.headers.get("set-cookie")).toBeNull();
      expect(await first.json()).toMatchObject({ ok: false, code: "email_send_unconfirmed" });
      vi.setSystemTime(new Date("2026-10-13T11:00:00Z"));
      const retry = await POST(request(undefined, { "x-quote-attempt": attempt }));
      expect(retry.status).toBe(200); expect(retry.headers.get("set-cookie")).toContain("kiefer_quote_accepted=accepted");
      expect(fetchMock).toHaveBeenCalledTimes(2); expect(emails).toBe(1);
    } finally { vi.useRealTimers(); }
  });

  it("sends an edited intent under a new key; changed payload under an old key stays unconfirmed", async () => {
    const accepted = new Map<string,string>(); let emails = 0;
    fetchMock.mockImplementation(async (_endpoint, init) => {
      const key = new Headers(init?.headers).get("idempotency-key")!;
      const body = String(init?.body);
      if (accepted.has(key) && accepted.get(key) !== body) return Response.json({ name: "invalid_idempotent_request", message: "private provider body" }, { status: 409 });
      if (!accepted.has(key)) { accepted.set(key,body); emails++; }
      return Response.json({ id: emailId });
    });
    const firstKey = "11111111-2222-4333-8444-555555555555";
    const nextKey = "11111111-2222-4333-8444-666666666666";
    await POST(request(undefined, { "x-quote-attempt": firstKey }));
    const changed = JSON.stringify({ ...payload, message: "Edited fictitious project scope." });
    const conflict = await POST(request(changed, { "x-quote-attempt": firstKey }));
    expect(conflict.status).toBe(409); expect(conflict.headers.get("set-cookie")).toBeNull();
    const result = await conflict.json(); expect(result.code).toBe("email_retry_conflict"); expect(result.error).toContain("may already");
    expect(JSON.stringify(result)).not.toContain("private provider body");
    expect((await POST(request(changed, { "x-quote-attempt": nextKey }))).status).toBe(200);
    expect(emails).toBe(2); expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("keeps concurrent same-key processing unconfirmed without automatic replay", async () => {
    fetchMock.mockResolvedValue(Response.json({ name: "concurrent_idempotent_requests", message: "sensitive" }, { status: 409 }));
    const response = await POST(request(undefined, { "x-quote-attempt": "11111111-2222-4333-8444-555555555555" }));
    expect(response.status).toBe(409); expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.json()).toMatchObject({ ok: false, code: "email_retry_in_progress", error: expect.stringContaining("still being processed") });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(vi.mocked(console.info).mock.calls)).not.toContain("sensitive");
  });

  it("retains the fallback code when configuration is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", " ");
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.json()).toMatchObject({ ok: false, code: "email_not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("restricts the confirmation receipt to secure transport on HTTPS", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const response = await POST(new Request("https://kbuiltco.com/api/quote-request", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
    }));
    expect(response.headers.get("set-cookie")).toMatch(/Secure/);
  });

  it.each([undefined, " ", "other@example.com", "info@kbuiltco.com", "other@example.com,extra@example.com"])("keeps the approved recipients regardless of legacy CONTACT_EMAIL_TO: %s", async (legacy) => {
    vi.stubEnv("CONTACT_EMAIL_TO", legacy);
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    await POST(request());
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).to).toEqual([
      "info@kbuiltco.com", "lauren@kbuiltco.com", "mark@kbuiltco.com",
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not let visitor-supplied recipient fields redirect or expand delivery", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const response = await POST(request(JSON.stringify({ ...payload, to: "other@example.com", cc: "extra@example.com", bcc: "hidden@example.com" })));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(sent.to).toEqual(["info@kbuiltco.com", "lauren@kbuiltco.com", "mark@kbuiltco.com"]);
    expect(sent.cc).toBeUndefined();expect(sent.bcc).toBeUndefined();
  });

  it("does not send malformed or incomplete requests", async () => {
    expect((await POST(request("{"))).status).toBe(400);
    const response = await POST(request(JSON.stringify({ ...payload, phone: "short" })));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ issues: [expect.objectContaining({ field: "phone" })] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts the honeypot without sending or exposing a delivery receipt", async () => {
    const response = await POST(request(JSON.stringify({ ...payload, company: "automated" })));
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["text/plain", "application/x-www-form-urlencoded", "multipart/form-data", ""])(
    "rejects unsupported request content type %s before reading or sending", async (contentType) => {
      const incoming = request(JSON.stringify(payload), { "content-type": contentType });
      const read = vi.spyOn(incoming.body!, "getReader");
      const response = await POST(incoming);
      expect(response.status).toBe(415);
      expect(await response.json()).toMatchObject({ ok: false, code: "unsupported_request_format" });
      expect(read).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it.each<HeadersInit>([
    { origin: "https://other.example" },
    { origin: "null" },
    { origin: "not-an-origin" },
    { origin: "http://localhost/path" },
    { origin: "http://localhost", "sec-fetch-site": "cross-site" },
    { origin: "https://other.example", "x-forwarded-host": "other.example", "x-forwarded-proto": "https" },
  ])("rejects explicit cross-site/malformed origins without trusting forwarded headers: %j", async (headers) => {
    const incoming = request(JSON.stringify(payload), headers);
    const read = vi.spyOn(incoming.body!, "getReader");
    const response = await POST(incoming);
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ ok: false, code: "request_origin_rejected" });
    expect(read).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows same-origin JSON, charset parameters and browser metadata", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const response = await POST(request(JSON.stringify(payload), {
      "content-type": "application/json; charset=UTF-8", origin: "http://localhost", "sec-fetch-site": "same-origin",
    }));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("uses the HTTP Host for a legitimate origin when Next reconstructs an internal URL", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const response = await POST(request(JSON.stringify(payload), { host: "127.0.0.1", origin: "http://127.0.0.1" }));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each(["user@localhost", "localhost/unexpected"])("rejects a malformed Host %s", async (host) => {
    const response = await POST(request(JSON.stringify(payload), { host, origin: "http://localhost" }));
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["kbuiltco.com", "www.kbuiltco.com", "builtbykiefer.com", "www.builtbykiefer.com", "review.example.vercel.app"])("allows an HTTPS same-origin website host %s", async (host) => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const response = await POST(new Request(`https://${host}/api/quote-request`, {
      method: "POST", body: JSON.stringify(payload), headers: { "content-type": "application/json", host, origin: `https://${host}` },
    }));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects an oversized declared body before reading or sending", async () => {
    expect((await POST(request("{}", { "content-length": String(QUOTE_MAX_BODY_BYTES + 1) }))).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("limits bytes even when a streamed request has no size header", async () => {
    const cancel = vi.fn();
    let chunk = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (chunk++ < 3) controller.enqueue(new Uint8Array(16 * 1024));
        else controller.close();
      },
      cancel,
    });
    const streamed = new Request("http://localhost/api/quote-request", {
      method: "POST", body, duplex: "half", headers: { "content-type": "application/json" },
    } as RequestInit);
    const response = await POST(streamed);
    expect(response.status).toBe(413);
    expect(await response.json()).toMatchObject({ ok: false, code: "request_too_large" });
    expect(cancel).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not reject a valid maximum-length multi-byte request", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: emailId }));
    const response = await POST(request(JSON.stringify({ ...payload, message: "界".repeat(2500) })));
    expect(response.status).toBe(200);
  });

  it("returns a clear rejection without logging provider content", async () => {
    fetchMock.mockResolvedValue(Response.json({ error: "sensitive provider message" }, { status: 403 }));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ ok: false, code: "email_send_failed" });
    expect(JSON.stringify(vi.mocked(console.info).mock.calls)).not.toContain("sensitive provider message");
  });

  it.each([{}, { ok: false }, { id: "not-an-email-id" }, null])("does not treat an invalid HTTP 200 provider body as acceptance: %j", async (body) => {
    fetchMock.mockResolvedValue(Response.json(body));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ ok: false, code: "email_send_unconfirmed" });
  });

  it("does not treat malformed provider JSON as success", async () => {
    fetchMock.mockResolvedValue(new Response("not json"));
    expect((await POST(request())).status).toBe(502);
  });

  it("catches a provider network exception and never automatically retries", async () => {
    fetchMock.mockRejectedValue(new Error("Sensitive connection failure"));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ ok: false, code: "email_send_unconfirmed" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(vi.mocked(console.info).mock.calls)).not.toContain("Sensitive connection failure");
  });

  it("aborts a stalled provider request and returns an unconfirmed timeout", async () => {
    const timeout = AbortSignal.timeout.bind(AbortSignal);
    vi.spyOn(AbortSignal, "timeout").mockImplementation(() => timeout(10));
    fetchMock.mockImplementation(async (_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true });
    }));
    const response = await POST(request());
    expect(response.status).toBe(504);
    expect(await response.json()).toMatchObject({ ok: false, code: "email_timeout" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
