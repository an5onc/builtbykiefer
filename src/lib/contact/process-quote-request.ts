import { buildQuoteRequestEmail, type QuoteRequestPayload } from "./quote-request";

export type ProcessResult = { ok: boolean; status: number; body: Record<string, unknown>; emailId?: string };

export type ProcessDeps = {
  sendEmail: (args: { subject: string; html: string; text: string; replyTo: string }) => Promise<{ ok: boolean; emailId?: string; failure?: "retry_in_progress" | "retry_conflict" }>;
  emailConfigured: boolean;
};

export async function processQuoteRequest(request: QuoteRequestPayload, deps: ProcessDeps): Promise<ProcessResult> {
  if (!deps.emailConfigured) {
    return {
      ok: false,
      status: 500,
      body: {
        ok: false,
        error: "Contact delivery is not configured. Please call or email Kiefer Built directly.",
        code: "email_not_configured",
      },
    };
  }

  const email = buildQuoteRequestEmail(request);
  let sent: Awaited<ReturnType<ProcessDeps["sendEmail"]>>;
  try {
    sent = await deps.sendEmail({
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: request.email,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    // A transport error can happen after acceptance. Never retry automatically or claim rejection.
    return {
      ok: false,
      status: timedOut ? 504 : 502,
      body: {
        ok: false,
        error: "We couldn't confirm your request. Please call or use the prepared email below.",
        code: timedOut ? "email_timeout" : "email_send_unconfirmed",
      },
    };
  }

  if (!sent.ok) {
    if (sent.failure) {
      return {
        ok: false, status: 409,
        body: { ok: false, code: `email_${sent.failure}`, error: sent.failure === "retry_in_progress"
          ? "Your earlier request is still being processed. Delivery hasn't been confirmed. Your details are still here. Please wait before trying again, or call or use the recovery options below."
          : "We couldn't confirm this retry. Your earlier request may already have reached Kiefer Built. Your details are still here; please call to check, or use the recovery options below." },
      };
    }
    return {
      ok: false,
      status: 502,
      body: {
        ok: false,
        error: "Could not send your message. Please call or email Kiefer Built directly.",
        code: "email_send_failed",
      },
    };
  }

  return { ok: true, status: 200, body: { ok: true, emailSent: true }, emailId: sent.emailId };
}
