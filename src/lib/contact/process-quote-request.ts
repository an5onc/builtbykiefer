import type { LeadCreateInput } from "@/lib/admin/leads";
import { buildQuoteRequestEmail, buildQuoteRequestLeadInput, type QuoteRequestPayload } from "./quote-request";

export type ProcessResult = { ok: boolean; status: number; body: Record<string, unknown> };

export type ProcessDeps = {
  createLead: (input: LeadCreateInput) => Promise<{ ok: boolean; leadId?: string }>;
  sendEmail: (args: { subject: string; html: string; text: string; replyTo: string }) => Promise<{ ok: boolean }>;
  emailConfigured: boolean;
};

export async function processQuoteRequest(request: QuoteRequestPayload, deps: ProcessDeps): Promise<ProcessResult> {
  // Best-effort CRM write: never blocks or fails the request.
  let leadId: string | undefined;
  try {
    const leadResult = await deps.createLead(buildQuoteRequestLeadInput(request));
    if (leadResult.ok) {
      leadId = leadResult.leadId;
    } else {
      console.error("[quote-request] CRM lead write failed (non-blocking)");
    }
  } catch (error) {
    console.error("[quote-request] CRM lead write threw (non-blocking)", error);
  }

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

  return { ok: true, status: 200, body: { ok: true, emailSent: true, leadId } };
}
