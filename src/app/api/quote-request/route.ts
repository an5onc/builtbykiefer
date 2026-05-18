import { NextResponse } from "next/server";
import { createLead } from "@/lib/admin/queries";
import { buildQuoteRequestEmail, buildQuoteRequestLeadInput, parseQuoteRequestPayload } from "@/lib/contact/quote-request";

const resendEndpoint = "https://api.resend.com/emails";
const defaultRecipient = "info@kbuiltco.com";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
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

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const leadResult = await createLead(buildQuoteRequestLeadInput(parsed.data));

  if (!leadResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Could not save the quote request in the CRM. Please call or email Kiefer Built directly.",
        code: "lead_capture_failed",
      },
      { status: 502 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO ?? defaultRecipient;

  if (!apiKey || !from) {
    return NextResponse.json(
      {
        ok: true,
        leadId: leadResult.leadId,
        emailSent: false,
        warning: "Lead saved in the CRM. Email delivery is not configured yet.",
        code: "email_not_configured",
      },
    );
  }

  const email = buildQuoteRequestEmail(parsed.data);
  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: parsed.data.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: true,
        leadId: leadResult.leadId,
        emailSent: false,
        warning: "Lead saved in the CRM, but email notification could not be sent.",
        code: "email_send_failed",
      },
    );
  }

  return NextResponse.json({ ok: true, leadId: leadResult.leadId, emailSent: true });
}
