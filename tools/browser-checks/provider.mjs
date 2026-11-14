import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";

export function simulateProvider(state, control, init) {
  assert.ok(["accept", "reject", "lose-response"].includes(control.mode), "Invalid local provider mode.");
  assert.equal(init?.method, "POST");
  const key = new Headers(init.headers).get("idempotency-key");
  const career = key?.startsWith("career-application/");
  assert.match(key ?? "", career ? /^career-application\/[0-9a-f-]{36}$/ : /^quote-request\/[0-9a-f-]{36}$/);
  const body = String(init.body);
  const data = JSON.parse(body);
  assert.equal(data.from, "Kiefer Built <fixture@example.com>");
  assert.deepEqual(data.to, ["info@kbuiltco.com", "lauren@kbuiltco.com", "mark@kbuiltco.com"], "Only the approved website recipient set is allowed; all delivery is simulated");
  assert.equal(data.cc, undefined);assert.equal(data.bcc, undefined);
  let attachmentHash;
  if (career) {
    assert.equal(data.attachments?.length, 1);
    const attachment = data.attachments[0];
    assert.ok(["resume.pdf", "resume.docx"].includes(attachment.filename));
    attachmentHash = createHash("sha256").update(Buffer.from(attachment.content, "base64")).digest("hex");
    assert.equal(attachmentHash, control.careerHashes?.[attachment.filename], "Only exact selected synthetic attachment bytes are allowed");
  }
  assert.equal(data.reply_to, "fixture@example.com");
  const bodyHash = createHash("sha256").update(body).digest("hex");
  state.calls.push({ key, bodyHash, mode: control.mode, ...(career ? { career: true, attachmentHash } : {}), projectType: data.text.match(/^Project type: (.*)$/m)?.[1] });
  if (control.mode === "reject") return Response.json({ name: "fixture_rejected" }, { status: 403 });
  const prior = state.records[key];
  if (prior && prior.bodyHash !== bodyHash) return Response.json({ name: "invalid_idempotent_request" }, { status: 409 });
  const id = prior?.id ?? randomUUID();
  if (!prior) { state.records[key] = { id, bodyHash }; state.acceptedEmails++; }
  // Model acceptance followed by a lost/unreadable receipt; no real network/send.
  return control.mode === "lose-response"
    ? new Response("{local lost receipt", { status: 200, headers: { "content-type": "application/json" } })
    : Response.json({ id });
}
