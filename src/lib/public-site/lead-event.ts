import { quoteAttemptIdPattern } from "@/lib/contact/quote-attempt";

export const GA4_MEASUREMENT_ID = "G-0W0SW6FW4G";
const services = new Set(["kitchen-remodeling", "bathroom-remodeling", "cabinet-replacement", "basement-remodeling"]);
const acceptedAttempts = new Set<string>();

type LeadWindow = Window & { gtag?: (...args: unknown[]) => void };

// Called only from the submitting form, never from a thank-you page visit.
// The server requires a provider receipt before it returns emailSent=true.
// No name, email, phone, location, free text or provider IDs enter this event.
export function trackAcceptedServiceLead(service: string, attemptId: string, responseOk: boolean, result: unknown): boolean {
  if (typeof window === "undefined" || !["kbuiltco.com", "www.kbuiltco.com"].includes(window.location.hostname)) return false;
  if (!services.has(service) || !quoteAttemptIdPattern.test(attemptId) || !responseOk) return false;
  if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true
    || !("emailSent" in result) || result.emailSent !== true
    || !("requestId" in result) || typeof result.requestId !== "string" || !quoteAttemptIdPattern.test(result.requestId)) return false;
  const gtag = (window as LeadWindow).gtag;
  if (typeof gtag !== "function" || acceptedAttempts.has(attemptId)) return false;
  try {
    gtag("event", "generate_lead", {
      send_to: GA4_MEASUREMENT_ID,
      service_type: service,
      form_name: "service_consultation",
      delivery_status: "email_accepted",
    });
    acceptedAttempts.add(attemptId);
    return true;
  } catch {
    // Measurement must never turn an accepted inquiry into a form error.
    return false;
  }
}
