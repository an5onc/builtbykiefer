import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Request a Quote | Kiefer Built Contracting",
  description:
    "Tell Kiefer Built about your custom home, renovation, addition, elevator, or commercial project in Northern Colorado.",
  pathname: "/contact",
  image: "/images/project-1/exterior-2.jpg",
  imageAlt: "Kiefer Built home in Northern Colorado",
});

export default function ContactPage() {
  return (
    <div className="bg-[#151515] text-white">
      <Header />
      <main id="main-content">
        <Contact headingLevel="h1" />
      </main>
      <Footer />
    </div>
  );
}
