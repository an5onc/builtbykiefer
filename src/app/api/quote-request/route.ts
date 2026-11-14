import { NextResponse } from "next/server";
import { parseQuoteRequestPayload } from "@/lib/contact/quote-request";
import { processQuoteRequest } from "@/lib/contact/process-quote-request";
import { QUOTE_EMAIL_TIMEOUT_MS, QUOTE_MAX_BODY_BYTES } from "@/lib/contact/quote-request-limits";
import { rejectUnsafeQuoteRequest } from "@/lib/contact/quote-request-guard";
import { websiteNotificationRecipients } from "@/lib/contact/notification-recipients";
import { QUOTE_ACCEPTED_COOKIE, QUOTE_CONFIRMATION_MAX_AGE } from "@/lib/contact/quote-confirmation";
import { QUOTE_ATTEMPT_HEADER, quoteAttemptIdPattern } from "@/lib/contact/quote-attempt";

const resendEndpoint = "https://api.resend.com/emails";

class RequestTooLarge extends Error {}

async function readPayload(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > QUOTE_MAX_BODY_BYTES) {
    throw new RequestTooLarge();
  }
  if (!request.body) throw new SyntaxError("Empty request body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > QUOTE_MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function POST(request: Request) {
  const rejection = rejectUnsafeQuoteRequest(request);
  if (rejection) {
    return NextResponse.json({ ok: false, error: rejection.error, code: rejection.code }, { status: rejection.status });
  }
  const attemptId = request.headers.get(QUOTE_ATTEMPT_HEADER);
  if (attemptId !== null && !quoteAttemptIdPattern.test(attemptId)) {
    return NextResponse.json({ ok: false, error: "We couldn't safely identify this request. Please call or use the recovery options below.", code: "invalid_quote_attempt" }, { status: 400 });
  }
  let payload: unknown;

  try {
    payload = await readPayload(request);
  } catch (error) {
    if (error instanceof RequestTooLarge) {
      return NextResponse.json(
        { ok: false, error: "Your request is too large. Please shorten the project details.", code: "request_too_large" },
        { status: 413 },
      );
    }
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseQuoteRequestPayload(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please complete the required fields.",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  // Honeypot: silently accept bot submissions.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_EMAIL_FROM?.trim();

  const result = await processQuoteRequest(parsed.data, {
    emailConfigured: Boolean(apiKey && from),
    sendEmail: async ({ subject, html, text, replyTo }) => {
      const response = await fetch(resendEndpoint, {
        method: "POST",
        signal: AbortSignal.timeout(QUOTE_EMAIL_TIMEOUT_MS),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(attemptId ? { "Idempotency-Key": `quote-request/${attemptId.toLowerCase()}` } : {}),
        },
        body: JSON.stringify({ from, to: websiteNotificationRecipients, reply_to: replyTo, subject, html, text }),
      });
      if (response.status === 409) {
        const conflict: unknown = await response.json().catch(() => null);
        const inProgress = conflict && typeof conflict === "object" && "name" in conflict
          && conflict.name === "concurrent_idempotent_requests";
        return { ok: false, failure: inProgress ? "retry_in_progress" : "retry_conflict" };
      }
      if (!response.ok) return { ok: false };
      const receipt: unknown = await response.json();
      // Resend acceptance includes an email UUID. HTTP 200 alone does not confirm a send.
      const emailId = receipt && typeof receipt === "object" && "id" in receipt ? receipt.id : undefined;
      if (typeof emailId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(emailId)) {
        throw new Error("Unconfirmed provider response");
      }
      return { ok: true, emailId };
    },
  });

  const requestId = crypto.randomUUID();
  // Do not log the request, recipient, API key, provider body or raw exception.
  console.info(JSON.stringify({
    event: "quote_request_delivery",
    requestId,
    status: result.status,
    code: result.body.code ?? "email_accepted",
    ...(result.emailId ? { emailId: result.emailId } : {}),
  }));
  const response = NextResponse.json({ ...result.body, requestId }, { status: result.status });
  if (result.ok && result.body.emailSent === true) {
    response.cookies.set(QUOTE_ACCEPTED_COOKIE, "accepted", {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/thank-you",
      maxAge: QUOTE_CONFIRMATION_MAX_AGE,
    });
  }
  return response;
}
