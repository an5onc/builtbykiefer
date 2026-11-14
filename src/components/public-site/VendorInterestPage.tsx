"use client";

import { type FormEvent, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prepareVendorEmail, vendorRecipient, type PreparedVendorEmail } from "@/lib/contact/vendor-email";

const subscribeToHydration = () => () => {};

export default function VendorInterestPage() {
  const clientReady = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const attemptRef = useRef(0);
  const [prepared, setPrepared] = useState<(PreparedVendorEmail & { attempt: number }) | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientReady) return;
    setPrepared({ ...prepareVendorEmail(new FormData(event.currentTarget)), attempt: ++attemptRef.current });
  }

  return (
    <div className="bg-white text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#151515] px-6 pb-16 pt-32 text-white md:pb-20">
          <div className="absolute inset-0 bg-[url('/images/kiefer-commercial-agfinity.jpg')] bg-cover bg-center opacity-18" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-[#151515]/96 to-[#151515]/76" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold leading-[0.96] md:text-7xl">Become a Vendor or Supplier</h1>
              <p className="mt-6 text-lg leading-8 text-white/74">
                Kiefer Built works with suppliers who provide reliable goods, services, and materials without directly performing project labor on the jobsite.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f9f6f0] px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">Tell Kiefer Built what your company provides.</h2>
              <p className="mt-5 text-lg leading-8 text-[#655c52]">
                Prepare your company information for an email to the Kiefer Built team, including your products, services, service area, and best contact person.
              </p>
              <div className="mt-8 rounded-md border border-black/10 bg-white p-6">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c9281c]">Vendor contact</p>
                <a href={`mailto:${vendorRecipient}`} className="mt-3 block text-xl font-bold text-[#171717] transition hover:text-[#c9281c]">
                  {vendorRecipient}
                </a>
                <p className="mt-3 text-sm leading-6 text-[#655c52]">
                  The form prepares an email to Marlys with a copy to Kiefer Built&apos;s main inbox. You can open it in your email app or copy the details, then send it yourself.
                </p>
              </div>
            </div>

            <form action="/vendors" method="post" onSubmit={handleSubmit} className="rounded-md border border-black/10 bg-white p-5 shadow-sm md:p-6">
              <p className="mb-5 text-sm leading-6 text-[#655c52]">
                The form needs JavaScript to prepare an email. If it is unavailable, email Marlys directly using the contact link on this page.
              </p>
              <fieldset disabled={!clientReady} className="min-w-0">
                <legend className="sr-only">Your company and contact details</legend>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input id="linkedin" name="linkedin" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Company Name" name="companyName" required />
                  <Field label="Company Website" name="companyWebsite" type="url" placeholder="https://" />
                  <Field label="Contact Name" name="contactName" required />
                  <Field label="Contact Job Title" name="jobTitle" />
                  <Field label="Contact Phone" name="phone" type="tel" required />
                  <Field label="Email Address" name="email" type="email" required />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.5fr_0.32fr]">
                  <Field label="Street Address" name="address" />
                  <Field label="City" name="city" />
                  <Field label="State" name="state" defaultValue="Colorado" />
                </div>
                <div className="mt-4 max-w-xs">
                  <Field label="ZIP Code" name="zip" inputMode="numeric" />
                </div>

                <label htmlFor="description" className="mt-4 block text-sm font-bold text-[#171717]">
                  Company Description / Goods or Services Being Offered
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#c9281c] focus:bg-white"
                  placeholder="Describe your products, services, delivery area, lead times, and how you support builders."
                />

                <button
                  type="submit"
                  disabled={!clientReady}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#c9281c] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#a91f16] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Prepare vendor email
                </button>
              </fieldset>

              {prepared ? <VendorEmailRecovery key={prepared.attempt} prepared={prepared} /> : null}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function VendorEmailRecovery({ prepared }: { prepared: PreparedVendorEmail }) {
  const id = useId();
  const panelRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const copyingRef = useRef(false);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "unavailable">("idle");

  useEffect(() => { panelRef.current?.focus(); }, []);
  useEffect(() => {
    if (copyState === "unavailable") {
      detailsRef.current?.focus();
      detailsRef.current?.select();
    }
  }, [copyState]);

  async function copyDetails() {
    if (copyingRef.current) return;
    copyingRef.current = true;
    setCopyState("copying");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(prepared.recoveryText);
      setCopyState("copied");
    } catch {
      setCopyState("unavailable");
    } finally {
      copyingRef.current = false;
    }
  }

  return (
    <section ref={panelRef} tabIndex={-1} aria-labelledby={`${id}-heading`} className="mt-5 rounded-md border border-black/10 bg-[#f9f6f0] p-4 text-sm leading-6 text-[#171717] focus:outline-2 focus:outline-offset-2 focus:outline-[#c9281c]">
      <h2 id={`${id}-heading`} className="font-bold">Your vendor email is prepared</h2>
      <p className="mt-1">These are the details from your last prepared email. This website has not sent them. Send the email from your email app, or copy the details into an email yourself.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <a href={prepared.mailtoHref} className="inline-flex min-h-11 items-center rounded-md bg-[#c9281c] px-3 py-2 font-bold text-white hover:bg-[#a91f16]">Open prepared vendor email</a>
        <button type="button" disabled={copyState === "copying"} onClick={copyDetails} className="min-h-11 rounded-md border border-[#c9281c] px-3 py-2 font-bold text-[#a91f16] hover:bg-white disabled:opacity-70">
          {copyState === "copying" ? "Copying details" : "Copy vendor details"}
        </button>
      </div>
      <p className="mt-2" role="status">
        {copyState === "copied" ? "Vendor details copied. Copying does not send your email."
          : copyState === "unavailable" ? "Automatic copying is unavailable. Select and copy the details below, then paste them into your email."
            : "Preparing, opening or copying these details does not confirm that your email was sent."}
      </p>
      <label htmlFor={`${id}-details`} className="mt-3 block font-bold">Vendor email details to copy</label>
      <textarea id={`${id}-details`} ref={detailsRef} value={prepared.recoveryText} readOnly rows={12} spellCheck={false} onFocus={(event) => event.currentTarget.select()} className="mt-2 w-full rounded-md border border-black/20 bg-white p-3 text-sm leading-6 focus:outline-2 focus:outline-offset-2 focus:outline-[#c9281c]" />
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  inputMode?: "numeric";
}) {
  return (
    <label className="block text-sm font-bold text-[#171717]">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        inputMode={inputMode}
        className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#c9281c] focus:bg-white"
      />
    </label>
  );
}
