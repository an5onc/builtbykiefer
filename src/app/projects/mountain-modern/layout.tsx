import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mountain Modern | Built by Kiefer",
  description:
    "A custom mountain home built from the ground up in the Colorado mountains — dark metal panel siding, ICF foundation, standing seam metal roof, solar array, and boulder landscaping. Built by Kiefer Built Contracting.",
  openGraph: {
    title: "Mountain Modern | Built by Kiefer",
    description:
      "Custom mountain home featuring dark steel siding, ICF foundation, and solar array — built from excavation to finish by Kiefer Built Contracting in Northern Colorado.",
    url: "https://www.builtbykiefer.com/projects/mountain-modern",
    siteName: "Built by Kiefer",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/images/project-2/exterior-front-facade.jpg",
        width: 1200,
        height: 630,
        alt: "Mountain Modern custom home with dark metal siding against Colorado pine forest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mountain Modern | Built by Kiefer",
    description:
      "Custom mountain home built from the ground up — dark steel, natural stone, and Colorado pine.",
    images: ["/images/project-2/exterior-front-facade.jpg"],
  },
  alternates: {
    canonical: "https://www.builtbykiefer.com/projects/mountain-modern",
  },
};

const projectSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Mountain Modern Custom Home",
  description:
    "A custom mountain home built from the ground up in the Colorado mountains featuring dark metal panel siding, ICF insulated concrete form foundation, standing seam metal roof, solar array, cedar post balcony with cable railing, and boulder retaining wall landscaping.",
  url: "https://www.builtbykiefer.com/projects/mountain-modern",
  image: "https://www.builtbykiefer.com/images/project-2/exterior-front-facade.jpg",
  author: {
    "@type": "Organization",
    name: "Kiefer Built Contracting",
    url: "https://www.builtbykiefer.com",
  },
  locationCreated: {
    "@type": "Place",
    name: "Colorado Mountains",
    address: {
      "@type": "PostalAddress",
      addressRegion: "CO",
      addressCountry: "US",
    },
  },
  about: [
    "Custom Home Building",
    "Mountain Architecture",
    "ICF Construction",
    "Solar Energy",
    "Metal Panel Siding",
  ],
  keywords:
    "mountain modern home, custom home Colorado, ICF foundation, dark metal siding, standing seam metal roof, solar array, boulder landscaping",
};

export default function MountainModernLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema),
        }}
      />
      {children}
    </>
  );
}
