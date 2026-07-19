"use client";

import { type FormEvent, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { buildQuoteRequestMailto, type QuoteRequest } from "@/lib/contact/quote-email";

type SubmitState = "idle" | "submitting" | "success" | "error";

const projectTypes = [
  "Custom home",
  "Kitchen remodel",
  "Bathroom remodel",
  "Addition",
  "Basement finish",
  "Exterior work",
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

export default function Contact({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

    setSubmitState("submitting");
    setMessage("");
    setMailtoHref(buildQuoteRequestMailto(quoteRequest));

    try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteRequest),
      });
      const result = (await response.json().catch(() => null)) as { error?: string; code?: string } | null;

      if (!response.ok) {
        setSubmitState("error");
        setMessage(
          result?.code === "email_not_configured"
            ? "The form is ready, but email delivery still needs to be configured for production. Use the email fallback below for now."
            : result?.error ?? "Could not send the quote request. Please try again or contact Kiefer Built directly.",
        );
        return;
      }

      setSubmitState("success");
      setMessage("Thanks. Your request was sent to the Kiefer Built team and they will follow up soon.");
      form.reset();
    } catch {
      setSubmitState("error");
      setMessage("Could not reach the quote request service. Please try again or use the email fallback below.");
    }
  }

  const isSubmitting = submitState === "submitting";
  const Heading = headingLevel;

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-[#151515] px-6 py-24 md:py-32"
      ref={ref}
      aria-labelledby="contact-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: "url(/images/project-1/exterior-2.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#151515] via-[#151515]/95 to-black/78" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
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
                href="tel:+19705155059"
                className="text-lg font-semibold text-white transition-colors hover:text-[#ffb4a8]"
                aria-label="Call Kiefer Built Contracting at (970) 515-5059"
              >
                (970) 515-5059
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb4a8]">
                Email
              </p>
              <a
                href="mailto:info@kbuiltco.com"
                className="text-lg font-semibold text-white transition-colors hover:text-[#ffb4a8]"
                aria-label="Email Kiefer Built Contracting at info@kbuiltco.com"
              >
                info@kbuiltco.com
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb4a8]">
                Location
              </p>
              <p>Windsor, Colorado</p>
            </div>
          </address>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-md border border-white/10 bg-white p-5 shadow-2xl md:p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" required />
              <Field label="Email" name="email" type="email" autoComplete="email" required />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
              <Field label="Project location" name="location" placeholder="City, neighborhood, or address" required />
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
                minLength={10}
                placeholder="Tell us what you are building, what matters most, and any site or schedule details we should know."
                className="w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#c9281c] focus:bg-white"
              />
            </div>

            {message ? (
              <div
                className={`flex items-start gap-3 rounded-md border p-4 text-sm leading-6 ${
                  submitState === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-[#c9281c]/30 bg-[#c9281c]/10 text-[#7e1a13]"
                }`}
              >
                {submitState === "success" ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                )}
                <div>
                  <p>{message}</p>
                  {submitState === "error" && mailtoHref ? (
                    <a className="mt-2 inline-flex font-bold underline" href={mailtoHref}>
                      Open this request in an email
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
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
        </motion.div>
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
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
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
