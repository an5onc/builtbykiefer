import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <div className="bg-[#151515] text-white">
      <Header />
      <main id="main-content">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
