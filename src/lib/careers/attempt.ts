import { careerAttemptPattern, type CareerFields } from "./application";
export type CareerAttempt = { id: string; intent: string; createdAt: number };
export async function selectCareerAttempt(previous: CareerAttempt | null, fields: CareerFields, file: File, now = Date.now(), makeId = () => crypto.randomUUID()): Promise<CareerAttempt> {
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", await file.arrayBuffer())), byte => byte.toString(16).padStart(2, "0")).join("");
  const intent = JSON.stringify([fields.name, fields.email, fields.phone, fields.position, fields.note, fields.company, file.name, file.type, hash]);
  if (previous?.intent === intent) {
    if (now < previous.createdAt || now - previous.createdAt >= 23 * 60 * 60 * 1000) throw new Error("This earlier application can no longer be safely retried online. It may already have reached the team. Please call to check.");
    return previous;
  }
  const id = makeId();
  if (!careerAttemptPattern.test(id)) throw new Error("We couldn't safely prepare your application. Please call for help.");
  return Object.freeze({ id, intent, createdAt: now });
}
