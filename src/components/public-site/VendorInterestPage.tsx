"use client";

import { type FormEvent, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function buildVendorMailto(formData: FormData) {
  const lines = [
    "Vendor / Supplier Inquiry",
    "",
    `Company Name: ${field(formData, "companyName")}`,
    `Company Website: ${field(formData, "companyWebsite")}`,
    `Contact Name: ${field(formData, "contactName")}`,
    `Contact Job Title: ${field(formData, "jobTitle")}`,
    `Contact Phone: ${field(formData, "phone")}`,
    `Email Address: ${field(formData, "email")}`,
    "",
    "Address:",
    field(formData, "address"),
    `${field(formData, "city")}, ${field(formData, "state")} ${field(formData, "zip")}`,
    "",
    "Company Description / Goods or Services Being Offered:",
    field(formData, "description"),
  ];

  return `mailto:marlys@kbuiltco.com?cc=info@kbuiltco.com&subject=${encodeURIComponent(
    `Vendor inquiry from ${field(formData, "companyName") || "new supplier"}`,
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export default function VendorInterestPage() {
  const [mailtoHref, setMailtoHref] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextHref = buildVendorMailto(new FormData(event.currentTarget));
    setMailtoHref(nextHref);
    window.location.href = nextHref;
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
                Submit your company information so the Kiefer Built team can understand your products, services, service area, and best contact person.
              </p>
              <div className="mt-8 rounded-md border border-black/10 bg-white p-6">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c9281c]">Vendor contact</p>
                <a href="mailto:marlys@kbuiltco.com" className="mt-3 block text-xl font-bold text-[#171717] transition hover:text-[#c9281c]">
                  marlys@kbuiltco.com
                </a>
                <p className="mt-3 text-sm leading-6 text-[#655c52]">
                  The form opens a prepared email to Marlys with a copy to Kiefer Built&apos;s main inbox.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-md border border-black/10 bg-white p-5 shadow-sm md:p-6">
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
                className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#c9281c] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#a91f16]"
              >
                Send Vendor Information
              </button>

              {mailtoHref ? (
                <a className="mt-4 inline-flex text-sm font-bold text-[#c9281c] underline" href={mailtoHref}>
                  Open prepared vendor email again
                </a>
              ) : null}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
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
