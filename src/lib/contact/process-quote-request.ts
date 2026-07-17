import { buildQuoteRequestEmail, type QuoteRequestPayload } from "./quote-request";

export type ProcessResult = { ok: boolean; status: number; body: Record<string, unknown> };

export type ProcessDeps = {
  sendEmail: (args: { subject: string; html: string; text: string; replyTo: string }) => Promise<{ ok: boolean }>;
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
  const sent = await deps.sendEmail({
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: request.email,
  });

  if (!sent.ok) {
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

  return { ok: true, status: 200, body: { ok: true, emailSent: true } };
}
