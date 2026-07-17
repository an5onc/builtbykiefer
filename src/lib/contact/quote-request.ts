import { z } from "zod";
import { formatQuoteRequestEmail } from "./quote-email";

const quoteRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  email: z.string().trim().email("A valid email is required.").max(160),
  phone: z.string().trim().min(7, "Phone number is required.").max(60),
  projectType: z.string().trim().min(2, "Project type is required.").max(120),
  location: z.string().trim().min(2, "Project location is required.").max(160),
  budget: z.string().trim().min(1, "Budget range is required.").max(120),
  timeline: z.string().trim().min(1, "Timeline is required.").max(120),
  message: z.string().trim().min(10, "Project details are required.").max(2500),
  company: z.string().trim().optional().default(""),
});

export type QuoteRequestPayload = z.infer<typeof quoteRequestSchema>;

export function parseQuoteRequestPayload(payload: unknown) {
  return quoteRequestSchema.safeParse(payload);
}

export function buildQuoteRequestEmail(payload: QuoteRequestPayload) {
  return formatQuoteRequestEmail(payload);
}
