import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { businessContact } from "@/lib/public-site/business";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Inquiry & Site Data Use | Kiefer Built Contracting",
  description: "How Kiefer Built Contracting uses website inquiries, email delivery and a temporary confirmation cookie.",
  pathname: "/privacy-policy",
  image: "/og-image.jpg",
  imageAlt: "Kiefer Built Contracting custom home",
});

// Inquiry wording approved October 13; analytics paragraph removed with local tracking removal.
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f9f6f0] text-[#171717]">
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-20 pt-36 md:pt-44">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">Inquiry and site data use</h1>
        <div className="mt-8 space-y-6 text-base leading-8">
          <p>When you request a quote, we use the contact details and project information you provide to review your inquiry and contact you about it. Please leave out sensitive personal information.</p>
          <p>The website sends your inquiry by email using Resend. The normal inquiry destination is {businessContact.email}. A successful submission means the email service accepted the request for delivery; it does not prove that someone has read the inbox. If sending cannot be confirmed, the form keeps your details on the current page and offers copyable details, a prepared email and direct contact.</p>
          <p>After an accepted request, a first-party confirmation cookie lets the thank-you page recognize your recent submission for five minutes. The cookie contains no contact or project details. The website does not save a personal-data draft in browser storage or an application database; leaving or refreshing an unsuccessful form can lose the on-page draft. Emails, provider records and hosting records are separate from that draft.</p>
          <p>Career applications use the contact details, position, note and résumé you provide for recruitment review. They are emailed through Resend to {businessContact.email}, with the résumé attached. The website does not create a public download link or store résumés in an application database. The selected file and unfinished details remain only on the current page; leaving or refreshing can lose them. A successful application means the email service accepted it for delivery, not that it has been read or that a hiring decision has been made. Emails, provider records and hosting records are separate. Please leave out sensitive personal information.</p>
          <p>For questions about information you provide, contact <a href={businessContact.mailtoHref} className="font-semibold underline underline-offset-4">{businessContact.email}</a> or <a href={businessContact.telHref} className="font-semibold underline underline-offset-4">{businessContact.phone}</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
