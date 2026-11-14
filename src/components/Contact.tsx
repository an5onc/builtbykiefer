"use client";

import { type FormEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { buildQuoteRequestRecovery, type QuoteRequest } from "@/lib/contact/quote-email";
import { QUOTE_SUBMIT_TIMEOUT_MS, quoteFieldLimits } from "@/lib/contact/quote-request-limits";
import QuoteRequestRecovery from "@/components/QuoteRequestRecovery";
import { businessContact } from "@/lib/public-site/business";
import { QUOTE_ATTEMPT_HEADER, selectQuoteAttempt, type QuoteAttempt } from "@/lib/contact/quote-attempt";

type SubmitState = "idle" | "submitting" | "success" | "error";

const projectTypes = [
  "Custom home",
  "Kitchen remodel",
  "Bathroom remodel",
  "Addition",
  "Basement finish",
  "Exterior work",
  "Custom elevator",
  "Commercial project",
  "Not sure yet",
];

const budgetRanges = [
  "Under $100k",
  "$100k-$250k",
  "$250k-$500k",
  "$500k-$900k",
  "$900k-$1.5M",
  "$1.5M+",
  "Still planning",
];

const timelines = [
  "As soon as possible",
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "More than a year",
  "Still planning",
];

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

const subscribeToHydration = () => () => {};

export default function Contact({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const router = useRouter();
  const sendingRef = useRef(false);
  const deliveryAttemptRef = useRef<QuoteAttempt | null>(null);
  const recoveryAttemptRef = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const clientReady = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [recovery, setRecovery] = useState<(ReturnType<typeof buildQuoteRequestRecovery> & { attempt: number }) | null>(null);

  useEffect(() => {
    if (message) statusRef.current?.focus();
  }, [message, recovery?.attempt]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const quoteRequest: QuoteRequest & { company: string } = {
      name: getField(formData, "name"),
      email: getField(formData, "email"),
      phone: getField(formData, "phone"),
      projectType: getField(formData, "projectType"),
      location: getField(formData, "location"),
      budget: getField(formData, "budget"),
      timeline: getField(formData, "timeline"),
      message: getField(formData, "message"),
      company: getField(formData, "company"),
    };

    sendingRef.current = true;
    setSubmitState("submitting");
    setMessage("");
    setRecovery({ ...buildQuoteRequestRecovery(quoteRequest), attempt: ++recoveryAttemptRef.current });

    try {
      const selected = selectQuoteAttempt(deliveryAttemptRef.current, quoteRequest);
      if (!selected.ok) {
        setSubmitState("error");
        setMessage(selected.reason === "expired"
          ? "We can no longer safely retry this earlier request online. It may already have reached Kiefer Built. Your details are still here; please call to check, or use the recovery options below."
          : "We couldn't safely prepare your online request. Your details are still here. Please call or use the recovery options below.");
        return;
      }
      deliveryAttemptRef.current = selected.attempt;
      const response = await fetch("/api/quote-request", {
        method: "POST",
        signal: AbortSignal.timeout(QUOTE_SUBMIT_TIMEOUT_MS),
        headers: { "Content-Type": "application/json", [QUOTE_ATTEMPT_HEADER]: selected.attempt.id },
        body: selected.attempt.body,
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: unknown; emailSent?: unknown; error?: unknown; code?: unknown; issues?: unknown;
      } | null;

      if (!response.ok || result?.ok !== true || result?.emailSent !== true) {
        setSubmitState("error");
        const firstIssue = Array.isArray(result?.issues)
          ? result.issues.find((issue: unknown): issue is { message: string } =>
              Boolean(issue && typeof issue === "object" && "message" in issue && typeof issue.message === "string"))
          : undefined;
        setMessage(
          response.status === 429
            ? "There have been too many recent requests. Your details are still here. Please wait before trying again, or call or use the recovery options below."
            : response.status === 403
              ? "Your online request was blocked. Your details are still here. Please call or use the recovery options below."
            : result?.code === "email_not_configured"
            ? "Online requests are temporarily unavailable. Your details are still here. Please call or use the prepared email below."
            : firstIssue?.message ?? (typeof result?.error === "string" && result.error
              ? result.error
              : "We couldn't confirm your request. Your details are still here. Please call or use the prepared email below."),
        );
        return;
      }

      setSubmitState("success");
      setMessage("Thanks. Your request was accepted for email delivery to Kiefer Built.");
      setRecovery(null);
      deliveryAttemptRef.current = null;
      form.reset();
      // The destination reads the server's short-lived acceptance cookie.
      // Keep the accepted inline state if navigation is unavailable.
      try { router.push("/thank-you"); } catch { /* Inline confirmation remains available. */ }
    } catch {
      setSubmitState("error");
      setMessage("We couldn't confirm your request. Your details are still here. Please call or use the prepared email below.");
    } finally {
      sendingRef.current = false;
    }
  }

  const isSubmitting = submitState === "submitting";
  const Heading = headingLevel;

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-[#151515] px-6 py-24 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: "url(/images/project-1/exterior-2.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#151515] via-[#151515]/95 to-black/78" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1fr] lg:items-start">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#ffb4a8]">
            Get a Free Quote
          </p>
          <Heading id="contact-heading" className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Tell Kiefer Built what you want to build.
          </Heading>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
            Share the project type, location, rough budget, and timing. The form sends a structured
            quote request to Kiefer Built so the first follow-up starts with the right details.
          </p>

          <address className="mt-10 space-y-5 not-italic text-white/72">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb4a8]">
                Phone
              </p>
              <a
                href={businessContact.telHref}
                className="text-lg font-semibold text-white transition-colors hover:text-[#ffb4a8]"
                aria-label={`Call ${businessContact.name} at ${businessContact.phone}`}
              >
                {businessContact.phone}
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb4a8]">
                Email
              </p>
              <a
                href={businessContact.mailtoHref}
                className="text-lg font-semibold text-white transition-colors hover:text-[#ffb4a8]"
                aria-label={`Email ${businessContact.name} at ${businessContact.email}`}
              >
                {businessContact.email}
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb4a8]">
                Location
              </p>
              <p>Windsor, Colorado</p>
            </div>
          </address>
        </div>

        <div
          className="rounded-md border border-white/10 bg-white p-5 shadow-2xl md:p-6"
        >
          <noscript>
            <p className="mb-5 text-sm leading-6 text-[#171717]">
              The online form needs JavaScript. Please call {businessContact.phone} or email {businessContact.email} using the links on this page.
            </p>
          </noscript>
          <p className="mb-5 text-sm leading-6 text-[#4d453d]">
            We use your details to respond to your project inquiry. Please leave out sensitive personal information. Read our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">privacy and data-use notice<span className="sr-only"> (opens a new tab)</span></a>.
          </p>
          <form action="/api/quote-request" method="post" onSubmit={handleSubmit} className="space-y-5" aria-busy={isSubmitting}>
            <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
              <legend className="sr-only">Your project and contact details</legend>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" maxLength={quoteFieldLimits.company.max} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" name="name" autoComplete="name" minLength={quoteFieldLimits.name.min} maxLength={quoteFieldLimits.name.max} required />
                <Field label="Email" name="email" type="email" autoComplete="email" maxLength={quoteFieldLimits.email.max} required />
                <Field label="Phone" name="phone" type="tel" autoComplete="tel" minLength={quoteFieldLimits.phone.min} maxLength={quoteFieldLimits.phone.max} required />
                <Field label="Project location" name="location" placeholder="City, neighborhood, or address" minLength={quoteFieldLimits.location.min} maxLength={quoteFieldLimits.location.max} required />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label="Project type" name="projectType" options={projectTypes} required />
                <SelectField label="Budget range" name="budget" options={budgetRanges} required />
                <SelectField label="Timeline" name="timeline" options={timelines} required />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-bold text-[#171717]">
                  Project details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  minLength={quoteFieldLimits.message.min}
                  maxLength={quoteFieldLimits.message.max}
                  placeholder="Tell us what you are building, what matters most, and any site or schedule details we should know."
                  className="w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#c9281c] focus:bg-white"
                />
              </div>
            </fieldset>

            {message ? (
              <div
                ref={statusRef}
                role={submitState === "success" ? "status" : "alert"}
                tabIndex={-1}
                className={`flex items-start gap-3 rounded-md border p-4 text-sm leading-6 ${
                  submitState === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-[#c9281c]/30 bg-[#c9281c]/10 text-[#7e1a13]"
                } focus:outline-2 focus:outline-offset-2 focus:outline-[#c9281c]`}
              >
                {submitState === "success" ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                )}
                <div>
                  <p>{message}</p>
                  {submitState === "error" && recovery ? (
                    <a className="mt-2 inline-flex font-bold underline" href={recovery.mailtoHref}>
                      Open this request in an email
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {submitState === "error" && recovery ? <QuoteRequestRecovery key={recovery.attempt} text={recovery.text} /> : null}

            <button
              type="submit"
              disabled={!clientReady || isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#c9281c] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#a91f16] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending Request
                </>
              ) : (
                <>
                  Send Quote Request
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  minLength,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-[#171717]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#c9281c] focus:bg-white"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-[#171717]">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#c9281c] focus:bg-white"
      >
        <option value="" disabled>
          Select one
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
