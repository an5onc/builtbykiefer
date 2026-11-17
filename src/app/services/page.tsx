import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicPages } from "@/lib/public-site/content";
import { remodelingServices } from "@/lib/public-site/remodeling-services";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.services, "/services");

export default function ServicesPage() {
  const otherServices = publicPages.services.cards?.filter((card) => !remodelingServices.some((service) => card.href === `/services/${service.slug}`)) ?? [];
  return <div className="bg-[#f9f6f0] text-[#171717]">
    <Header />
    <main id="main-content">
      <section className="bg-[#171717] px-6 pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb4a8]">Windsor & Northern Colorado</p><h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">Construction services.<br />Built around your project.</h1><p className="mt-6 max-w-2xl leading-8 text-white/75">From a kitchen renovation to a custom home, find the right service, explore completed work and tell us what you have in mind.</p>
        <nav aria-label="Remodeling services" className="mt-8 flex flex-wrap gap-3">{remodelingServices.map((service) => <a key={service.slug} href={`#${service.slug}`} className="rounded-md border border-white/35 px-4 py-3 text-sm font-semibold hover:bg-white/10">{service.title}</a>)}</nav></div>
      </section>
      {remodelingServices.map((service, index) => <section key={service.slug} id={service.slug} aria-labelledby={`${service.slug}-heading`} className={`scroll-mt-24 px-6 py-14 md:py-20 ${index % 2 ? "bg-white" : ""}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-14">
          <figure className={index % 2 ? "md:order-2" : ""}>
            <Link href={`/services/${service.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#e7dfd5]" aria-label={`Explore ${service.title}`}><Image src={service.hero.src} alt={service.hero.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></Link>
            <figcaption className="mt-3 text-sm leading-6 text-[#655c52]">Pictured: <Link href={service.hero.project.href} className="font-semibold text-[#a5241a] underline underline-offset-4">{service.hero.project.name}</Link> · {service.hero.project.context}{service.slug === "basement-remodeling" ? " · Finished basement" : ""}</figcaption>
          </figure>
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5241a]">0{index + 1} / Remodeling</p><h2 id={`${service.slug}-heading`} className="mt-4 text-3xl font-bold md:text-4xl">{service.title}</h2><p className="mt-5 leading-8 text-[#655c52]">{service.intro}</p><p className="mt-4 text-sm leading-7 text-[#655c52]">{service.fit}</p><Link href={`/services/${service.slug}`} className="mt-6 inline-flex rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold text-white hover:bg-[#a91f16]">Explore {service.title} <span aria-hidden="true" className="ml-3">→</span></Link></div>
        </div>
      </section>)}
      <section className="border-t border-black/10 px-6 py-16 md:py-24" aria-labelledby="more-services"><div className="mx-auto max-w-7xl"><h2 id="more-services" className="text-3xl font-bold md:text-4xl">More ways to build with Kiefer</h2><div className="mt-9 grid gap-7 md:grid-cols-3">{otherServices.map((card) => <Link href={card.href!} key={card.title} className="overflow-hidden border border-black/10 bg-white">{card.image ? <div className="relative aspect-[4/3]"><Image src={card.image} alt={card.imageAlt ?? ""} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /></div> : null}<div className="p-6"><h3 className="text-2xl font-bold">{card.title}</h3><p className="mt-3 leading-7 text-[#655c52]">{card.description}</p><p className="mt-5 font-bold text-[#a5241a]">Explore service →</p></div></Link>)}</div></div></section>
      <section className="bg-[#171717] px-6 py-16 text-white"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-bold">Have a different project in mind?</h2><p className="mt-4 max-w-2xl leading-8 text-white/75">Tell us about additions, living spaces, exteriors or other construction work. We’ll talk through location, scope and the right next step.</p><Link href="/contact" className="mt-6 inline-flex rounded-md bg-[#c9281c] px-6 py-4 font-bold text-white">Request a Consultation</Link></div></section>
    </main><Footer />
  </div>;
}
