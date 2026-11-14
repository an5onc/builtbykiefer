import { NextResponse } from "next/server";
import { APPLICATION_MAX_BYTES, CAREER_ATTEMPT_HEADER, careerAttemptPattern, careerSchema, careerDetails } from "@/lib/careers/application";
import { ApplicationError, validateResume } from "@/lib/careers/resume";
import { businessContact } from "@/lib/public-site/business";
import { websiteNotificationRecipients } from "@/lib/contact/notification-recipients";

const reply = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
const failure = (status: number, error: string, code: string) => reply(status, { ok: false, error, code });

async function readForm(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.length > 250 || !/^multipart\/form-data;\s*boundary=(?:[A-Za-z0-9'()+_,.\/:=?-]{1,70}|"[A-Za-z0-9'()+_,.\/:=?-]{1,70}")$/i.test(contentType)) throw new ApplicationError(415, "Please use the application form to upload your résumé.");
  const length = request.headers.get("content-length");
  if (length && (!/^\d{1,10}$/.test(length) || Number(length) > APPLICATION_MAX_BYTES)) throw new ApplicationError(413, "Your application is too large. Please choose a résumé of 3 MB or smaller.");
  if (!request.body) throw new ApplicationError(400, "Please complete the application and choose your résumé.");
  const reader = request.body.getReader(), chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > APPLICATION_MAX_BYTES) { await reader.cancel(); throw new ApplicationError(413, "Your application is too large. Please choose a résumé of 3 MB or smaller."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset);offset += chunk.byteLength; }
  try { return await new Response(bytes, { headers: { "Content-Type": contentType } }).formData(); }
  catch { throw new ApplicationError(400, "We couldn't read the upload. Please choose your résumé again and try once more."); }
}

function validOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(request.url), parsed = new URL(origin), target = new URL(`${url.protocol}//${request.headers.get("host") || url.host}`);
    return parsed.origin === origin && parsed.origin === target.origin && !target.username && !target.password && target.pathname === "/" && !target.search && !target.hash;
  } catch { return false; }
}
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

export async function POST(request: Request) {
  if (!validOrigin(request)) return failure(403, "Please apply from this website, or contact Kiefer Built directly.", "origin_rejected");
  const attemptId = request.headers.get(CAREER_ATTEMPT_HEADER);
  if (!attemptId || !careerAttemptPattern.test(attemptId)) return failure(400, "We couldn't safely identify this application. Your details are still here; please call for help.", "invalid_attempt");
  try {
    const form = await readForm(request), allowed = ["name", "email", "phone", "position", "note", "company", "resume"];
    for (const [key] of form) if (!allowed.includes(key) || form.getAll(key).length !== 1) throw new ApplicationError(400, "Please submit one complete application with one résumé.");
    const fields: Record<string, string> = {};
    for (const name of allowed.filter(name => name !== "resume")) {
      const value = form.get(name);
      if (value !== null && typeof value !== "string") throw new ApplicationError(400, "Please check the application fields.");
      fields[name] = value || "";
    }
    const parsed = careerSchema.safeParse(fields);
    if (!parsed.success) return failure(400, "Please check your name, email, phone and position. Keep your note under 3,000 characters.", "invalid_fields");
    if (parsed.data.company) return reply(200, { ok: true });
    const file = form.get("resume");
    if (!(file instanceof File)) throw new ApplicationError(400, "Please choose your résumé.");
    const resume = await validateResume(file);
    const apiKey = process.env.RESEND_API_KEY?.trim(), from = process.env.CONTACT_EMAIL_FROM?.trim();
    if (!apiKey || !from) return failure(503, "Online applications are temporarily unavailable. Your details and résumé are still here. Please call or email the team.", "email_not_configured");
    const text = careerDetails(parsed.data, resume.filename, false);
    const payload = { from, to: websiteNotificationRecipients, reply_to: parsed.data.email,
      subject: `Career application — ${parsed.data.position} — ${parsed.data.name}`,
      text: `${text}\n\nSource: ${businessContact.clientWebsite}/careers`,
      html: `<div style="font-family:Arial,sans-serif;color:#171717"><h1>Career application</h1><pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${escape(text)}</pre><p>Submitted through the Kiefer Built careers page. Résumé attached.</p></div>`,
      attachments: [{ filename: resume.filename, content: resume.bytes.toString("base64") }],
    };
    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, "Idempotency-Key": `career-application/${attemptId.toLowerCase()}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(11000) });
    } catch { return failure(502, "We couldn't confirm your application. It may already have reached the team. Your details and résumé are still here; please call to check or retry this unchanged application.", "email_unconfirmed"); }
    if (response.status === 409) return failure(409, "We couldn't confirm this retry. Your earlier application may already have reached the team. Please wait or call to check; your details and résumé are still here.", "email_retry_conflict");
    if (!response.ok) return failure(502, "We couldn't send your application. Your details and résumé are still here. Please try again later or contact the team.", "email_rejected");
    const receipt: unknown = await response.json().catch(() => null);
    if (!receipt || typeof receipt !== "object" || !("id" in receipt) || typeof receipt.id !== "string" || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(receipt.id)) return failure(502, "We couldn't confirm your application. It may already have reached the team. Please call to check, or retry this unchanged application.", "email_unconfirmed");
    // No applicant data, filename, attachment, key or raw provider error is logged.
    console.info(JSON.stringify({ event: "career_application_delivery", status: "accepted", requestId: crypto.randomUUID() }));
    return reply(200, { ok: true, emailSent: true });
  } catch (error) {
    if (error instanceof ApplicationError) return failure(error.status, error.message, "invalid_application");
    return failure(400, "We couldn't read your application. Your details are still here. Please check the file and try again.", "invalid_application");
  }
}
