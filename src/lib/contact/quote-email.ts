export type QuoteRequest = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  budget: string;
  timeline: string;
  message: string;
};

export type QuoteRequestEmail = {
  subject: string;
  text: string;
  html: string;
};

const fallback = "Not provided";

function clean(value: string) {
  return value.trim() || fallback;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function detailRows(request: QuoteRequest) {
  return [
    ["Name", clean(request.name)],
    ["Email", clean(request.email)],
    ["Phone", clean(request.phone)],
    ["Project type", clean(request.projectType)],
    ["Project location", clean(request.location)],
    ["Budget range", clean(request.budget)],
    ["Timeline", clean(request.timeline)],
    ["Project details", clean(request.message)],
  ] as const;
}

export function formatQuoteRequestEmail(request: QuoteRequest): QuoteRequestEmail {
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Denver",
  });
  const subject = `New Kiefer Built quote request from ${clean(request.name)}`;
  const text = [
    "New Kiefer Built website quote request",
    "",
    ...detailRows(request).flatMap(([label, value]) => [`${label}: ${value}`]),
    "",
    `Submitted: ${submittedAt} Mountain Time`,
    "Source: builtbykiefer.com contact form",
    "",
    `Reply directly to ${clean(request.email)} or call ${clean(request.phone)}.`,
  ].join("\n");
  const htmlRows = detailRows(request)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e6dfd6;color:#655c52;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e6dfd6;color:#171717;font-size:15px;line-height:1.5;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return {
    subject,
    text,
    html: `
      <div style="margin:0;padding:0;background:#f4efe7;font-family:Arial,Helvetica,sans-serif;color:#171717;">
        <div style="max-width:680px;margin:0 auto;padding:28px;">
          <div style="background:#151515;color:#fff;padding:22px 24px;border-radius:8px 8px 0 0;">
            <p style="margin:0 0 8px;color:#ffb4a8;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;">Kiefer Built Contracting</p>
            <h1 style="margin:0;font-size:26px;line-height:1.2;">New Website Quote Request</h1>
          </div>
          <div style="background:#fff;border:1px solid #e6dfd6;border-top:0;border-radius:0 0 8px 8px;overflow:hidden;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              ${htmlRows}
            </table>
            <div style="padding:18px 24px;color:#655c52;font-size:13px;line-height:1.6;">
              <p style="margin:0;">Submitted ${escapeHtml(submittedAt)} Mountain Time from the builtbykiefer.com contact form.</p>
              <p style="margin:8px 0 0;">Reply directly to ${escapeHtml(clean(request.email))} or call ${escapeHtml(clean(request.phone))}.</p>
            </div>
          </div>
        </div>
      </div>`,
  };
}

export function buildQuoteRequestMailto(request: QuoteRequest) {
  const email = formatQuoteRequestEmail(request);
  return `mailto:info@kbuiltco.com?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.text)}`;
}
