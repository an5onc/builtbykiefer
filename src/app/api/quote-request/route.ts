import { NextResponse } from "next/server";
import { createLead } from "@/lib/admin/queries";
import { parseQuoteRequestPayload } from "@/lib/contact/quote-request";
import { processQuoteRequest } from "@/lib/contact/process-quote-request";

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

  // Honeypot: silently accept bot submissions.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO ?? defaultRecipient;

  const result = await processQuoteRequest(parsed.data, {
    createLead,
    emailConfigured: Boolean(apiKey && from),
    sendEmail: async ({ subject, html, text, replyTo }) => {
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, reply_to: replyTo, subject, html, text }),
      });
      return { ok: response.ok };
    },
  });

  return NextResponse.json(result.body, { status: result.status });
}
