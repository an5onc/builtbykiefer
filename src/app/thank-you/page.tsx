import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { businessContact } from "@/lib/public-site/business";
import { QUOTE_ACCEPTED_COOKIE } from "@/lib/contact/quote-confirmation";

// Native quote confirmation after verified provider acceptance.
// Direct visits/expired receipts remain neutral; no Buildertrend integration.
// Intentionally noindex and excluded from the sitemap (see noindexRoutes in routes.ts).
export const metadata: Metadata = {
  title: "Thank You | Kiefer Built Contracting",
  description: "Contact Kiefer Built Contracting about your project or an inquiry you have submitted.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default async function ThankYouPage() {
  const accepted = (await cookies()).get(QUOTE_ACCEPTED_COOKIE)?.value === "accepted";
  return (
    <div className="bg-white text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#151515] px-6 pb-20 pt-32 text-white md:pb-28 md:pt-40">
          <div className="absolute inset-0 bg-[url('/images/kiefer-commercial-agfinity.jpg')] bg-cover bg-center opacity-18" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-[#151515]/96 to-[#151515]/76" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#ffb4a8]">{accepted ? "Request submitted" : "Kiefer Built Contracting"}</p>
              <h1 className="text-5xl font-bold leading-[0.96] md:text-7xl">{accepted ? "Thank you for reaching out." : "Let’s talk about your project."}</h1>
              <p className="mt-6 text-lg leading-8 text-white/74">
                {accepted
                  ? "Your quote request was accepted for email delivery to the Kiefer Built team. If you need to add details or check on your inquiry, contact us below."
                  : "Visiting this page does not confirm a request was sent. Check the confirmation on the form you used, or contact us directly if you are unsure."}
              </p>
              <div className="mt-8">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb4a8]">
                  Call our team
                </p>
                <a
                  href={businessContact.telHref}
                  className="text-2xl font-semibold text-white transition-colors hover:text-[#ffb4a8]"
                  aria-label={`Call ${businessContact.name} at ${businessContact.phone}`}
                >
                  {businessContact.phone}
                </a>
              </div>
              <a href={businessContact.mailtoHref} className="mt-4 inline-block text-white underline underline-offset-4">
                {businessContact.email}
              </a>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                >
                  Back To Home
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                >
                  View Our Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
