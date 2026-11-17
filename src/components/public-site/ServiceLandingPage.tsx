import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { businessContact } from "@/lib/public-site/business";
import { serviceAreaCities, serviceAreaCityList } from "@/lib/public-site/service-areas";
import type { RemodelingService, ServiceProjectPhoto } from "@/lib/public-site/remodeling-services";

const consultationSteps = [
  { title: "Tell us about the project", body: "Send your location, the space you want to change and the work you have in mind." },
  { title: "Talk through fit", body: "The team follows up to discuss scope, priorities and timing, and whether a site visit is the right next step." },
  { title: "Define the path forward", body: "Review existing conditions, selections and construction needs before agreeing on a detailed scope and next steps." },
];

function PhotoCredit({ photo }: { photo: ServiceProjectPhoto }) {
  return (
    <figcaption className="mt-3 text-sm leading-6 text-[#655c52]">
      <p>{photo.caption}</p>
      <p className="mt-1"><span className="font-semibold text-[#171717]">{photo.project.name}</span> · {photo.project.context}</p>
      <Link href={photo.project.href} className="mt-1 inline-flex font-semibold text-[#a5241a] underline underline-offset-4">View {photo.project.name} project <span aria-hidden="true" className="ml-1">→</span></Link>
    </figcaption>
  );
}

export default function ServiceLandingPage({ service }: { service: RemodelingService }) {
  const schema = {
    "@context": "https://schema.org", "@type": "Service", name: service.title,
    serviceType: service.title, description: service.description,
    url: `${businessContact.clientWebsite}/services/${service.slug}`,
    provider: { "@type": "GeneralContractor", "@id": `${businessContact.clientWebsite}/#business`, name: businessContact.name, telephone: businessContact.telephone },
    areaServed: serviceAreaCities.map((name) => ({ "@type": "City", name: `${name}, Colorado` })),
  };
  return (
    <div className="bg-[#f9f6f0] text-[#171717]">
      <Header />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        <section className="px-6 pb-12 pt-32 md:pb-20 md:pt-40" aria-labelledby="service-heading">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-[#655c52]">
              <Link href="/services" className="underline underline-offset-4">Services</Link><span aria-hidden="true">/</span><span>{service.title}</span>
            </nav>
            <div className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5241a]">Windsor & Northern Colorado</p>
                <h1 id="service-heading" className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">{service.title}</h1>
                <p className="mt-5 text-2xl font-semibold leading-tight md:text-3xl">{service.headline}</p>
                <p className="mt-5 hidden max-w-xl text-base leading-7 text-[#655c52] lg:block">{service.intro}</p>
                <a href="#contact" className="mt-7 inline-flex rounded-md bg-[#c9281c] px-6 py-4 text-sm font-bold text-white hover:bg-[#a91f16]">Request a Consultation <span aria-hidden="true" className="ml-4">→</span></a>
                <p className="mt-4 text-sm text-[#655c52]">Prefer to talk? <a href={businessContact.telHref} className="font-semibold underline underline-offset-4">{businessContact.phone}</a></p>
              </div>
              <div>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#e7dfd5] lg:aspect-[5/6]">
                  <Image src={service.hero.src} alt={service.hero.alt} fill preload sizes="(max-width: 1023px) 100vw, 52vw" className="object-cover" />
                </div>
                <PhotoCredit photo={service.hero} />
              </figure>
              <p className="mt-5 text-base leading-7 text-[#655c52] lg:hidden">{service.intro}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="border-y border-black/10 bg-white px-6 py-16 md:py-24" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5241a]">Work by Kiefer Built</p>
            <div className="mt-4 grid gap-5 md:grid-cols-2 md:gap-12">
              <h2 id="proof-heading" className="text-3xl font-bold leading-tight md:text-4xl">{service.proofTitle}</h2>
              <div><p className="leading-7 text-[#655c52]">{service.proofDescription}</p><Link href={service.projectLink} className="mt-4 inline-flex font-bold text-[#a5241a] underline underline-offset-4">{service.projectLabel} →</Link></div>
            </div>
            <div className="mt-9 grid gap-6 md:grid-cols-3">
              {service.photos.map((photo) => <figure key={photo.src}>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e7dfd5]"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /></div>
                <PhotoCredit photo={photo} />
              </figure>)}
            </div>
            <aside className="mt-12 border-l-4 border-[#c9281c] bg-[#f9f6f0] p-6 md:p-8" aria-label="Customer experience">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#655c52]">Customer experience · {service.testimonial.project}</p>
              <p className="mt-3 max-w-3xl text-lg leading-8">{service.testimonial.summary}</p>
              <p className="mt-3 text-sm font-bold">{service.testimonial.name} <span className="font-normal text-[#655c52]">· Summary of customer feedback</span></p>
              <Link href="/testimonials" className="mt-4 inline-flex text-sm font-bold underline underline-offset-4">Read more customer experiences</Link>
            </aside>
          </div>
        </section>
        <section className="px-6 py-16 md:py-24" aria-labelledby="scope-heading">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5241a]">Plan the right project</p>
            <h2 id="scope-heading" className="mt-4 text-3xl font-bold md:text-4xl">What your {service.title.toLowerCase()} project can include</h2>
            <div className="mt-9 grid gap-8 md:grid-cols-3">{service.scope.map((item, index) => <div key={item.title}><p className="border-t border-black/20 pt-4 text-xs font-bold text-[#a5241a]">0{index + 1}</p><h3 className="mt-4 text-xl font-bold">{item.title}</h3><p className="mt-3 leading-7 text-[#655c52]">{item.body}</p></div>)}</div>
            <div className="mt-12 grid gap-8 border-t border-black/10 pt-9 md:grid-cols-2">
              <div><h3 className="text-2xl font-bold">Is this the right fit?</h3><p className="mt-4 leading-7 text-[#655c52]">{service.fit}</p><p className="mt-3 leading-7 text-[#655c52]">{service.qualification}</p>{service.slug === "kitchen-remodeling" || service.slug === "cabinet-replacement" ? <Link href={service.slug === "kitchen-remodeling" ? "/services/cabinet-replacement" : "/services/kitchen-remodeling"} className="mt-4 inline-flex font-bold underline underline-offset-4">{service.slug === "kitchen-remodeling" ? "Explore cabinet replacement" : "Explore a complete kitchen remodel"}</Link> : null}</div>
              <div><h3 className="text-2xl font-bold">Serving Northern Colorado</h3><p className="mt-4 leading-7 text-[#655c52]">We welcome project inquiries in {serviceAreaCityList}. Location, scope and scheduling are confirmed during the consultation.</p><Link href="/service-areas" className="mt-4 inline-flex font-bold underline underline-offset-4">Explore service areas</Link></div>
            </div>
          </div>
        </section>
        <section className="bg-[#eae3d9] px-6 py-16 md:py-20" aria-labelledby="consultation-heading">
          <div className="mx-auto max-w-7xl"><h2 id="consultation-heading" className="text-3xl font-bold md:text-4xl">What happens after you reach out</h2><ol className="mt-9 grid gap-8 md:grid-cols-3">{consultationSteps.map((step, index) => <li key={step.title}><p className="text-sm font-bold text-[#a5241a]">0{index + 1}</p><h3 className="mt-3 text-xl font-bold">{step.title}</h3><p className="mt-3 leading-7 text-[#655c52]">{step.body}</p></li>)}</ol></div>
        </section>
        <Contact service={{ slug: service.slug, title: service.title, projectType: service.projectType, question: service.question }} />
      </main>
      <Footer />
    </div>
  );
}
