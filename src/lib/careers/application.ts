import { z } from "zod";

export const RESUME_MAX_BYTES = 3 * 1024 * 1024;
export const APPLICATION_MAX_BYTES = RESUME_MAX_BYTES + 256 * 1024;
export const CAREER_ATTEMPT_HEADER = "X-Careers-Attempt";
export const careerAttemptPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const careerPositions = ["Project Manager", "Carpenter", "Other / General application"] as const;
const singleLine = (max: number) => z.string().trim().min(1).max(max).refine(v => !/[\r\n\u0000-\u001f\u007f]/.test(v), "Please use a single line.");
export const careerSchema = z.object({
  name: singleLine(120),
  email: singleLine(254).pipe(z.email()),
  phone: singleLine(50).refine(v => v.replace(/\D/g, "").length >= 7, "Please enter a phone number."),
  position: z.enum(careerPositions),
  note: z.string().trim().max(3000).refine(v => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v), "Please remove control characters."),
  company: z.string().trim().max(120),
}).strict();
export type CareerFields = z.infer<typeof careerSchema>;

export function resumeInputError(file: File | null): string | null {
  if (!file || !file.size) return "Please choose your résumé.";
  if (file.size > RESUME_MAX_BYTES) return "Your résumé must be 3 MB or smaller.";
  if (file.name.length > 180 || /[\u0000-\u001f\u007f]/.test(file.name)) return "Please rename your résumé using a shorter, plain filename.";
  const ext = file.name.split(".").at(-1)?.toLowerCase();
  const expected = ext === "pdf" ? "application/pdf" : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : null;
  if (!expected || (file.type && file.type !== expected)) return "Please choose a PDF or DOCX résumé.";
  return null;
}

export function careerDetails(fields: CareerFields, filename: string, includeRecovery = true) {
  return ["Career application — Kiefer Built Contracting", "", `Name: ${fields.name}`, `Email: ${fields.email}`, `Phone: ${fields.phone}`, `Position: ${fields.position}`, `Note: ${fields.note || "Not provided"}`, `Résumé: ${filename}`, ...(includeRecovery ? ["", "Please attach the résumé manually if you email these details. Copying does not submit an application."] : [])].join("\n");
}
