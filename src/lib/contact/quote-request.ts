import { z } from "zod";
import { formatQuoteRequestEmail } from "./quote-email";
import { quoteFieldLimits as limits } from "./quote-request-limits";

const quoteRequestSchema = z.object({
  name: z.string().trim().min(limits.name.min, "Please enter at least 2 characters for your name.").max(limits.name.max),
  email: z.string().trim().email("Please enter a valid email address.").max(limits.email.max),
  phone: z.string().trim().min(limits.phone.min, "Please enter a phone number with at least 7 characters.").max(limits.phone.max),
  projectType: z.string().trim().min(limits.projectType.min, "Please select a project type.").max(limits.projectType.max),
  location: z.string().trim().min(limits.location.min, "Please enter a project location with at least 2 characters.").max(limits.location.max),
  budget: z.string().trim().min(limits.budget.min, "Please select a budget range.").max(limits.budget.max),
  timeline: z.string().trim().min(limits.timeline.min, "Please select a timeline.").max(limits.timeline.max),
  message: z.string().trim().min(limits.message.min, "Please describe your project in at least 10 characters.").max(limits.message.max),
  company: z.string().trim().max(limits.company.max).optional().default(""),
});

export type QuoteRequestPayload = z.infer<typeof quoteRequestSchema>;

export function parseQuoteRequestPayload(payload: unknown) {
  return quoteRequestSchema.safeParse(payload);
}

export function buildQuoteRequestEmail(payload: QuoteRequestPayload) {
  return formatQuoteRequestEmail(payload);
}
