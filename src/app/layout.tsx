import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado",
  description:
    "Kiefer Built Contracting — custom home building, renovations, and commercial construction in Northern Colorado. Quality craftsmanship since 1999. Serving Windsor, Fort Collins, Greeley, Loveland & surrounding areas.",
  keywords: [
    "custom homes",
    "Northern Colorado",
    "home builder",
    "Kiefer Built",
    "construction",
    "renovation",
    "Windsor Colorado",
    "custom home builder",
    "custom home builder Windsor CO",
    "home builder Northern Colorado",
    "Kiefer Built Contracting",
    "new home construction Windsor",
    "custom homes Fort Collins",
    "home renovation Greeley",
    "commercial construction Northern Colorado",
  ],
  metadataBase: new URL("https://builtbykiefer.com"),
  alternates: {
    canonical: "https://builtbykiefer.com",
  },
  openGraph: {
    title: "Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado",
    description:
      "Custom home building, renovations, and commercial construction in Northern Colorado. Quality craftsmanship since 1999.",
    url: "https://builtbykiefer.com",
    siteName: "Built by Kiefer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/project-1/exterior-1.jpg",
        width: 1200,
        height: 630,
        alt: "Custom craftsman home built by Kiefer Built Contracting in Northern Colorado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado",
    description:
      "Custom home building, renovations, and commercial construction in Northern Colorado. Quality craftsmanship since 1999.",
    images: ["/images/project-1/exterior-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

// LocalBusiness + FAQ structured data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://builtbykiefer.com/#business",
      name: "Kiefer Built Contracting",
      alternateName: "Built by Kiefer",
      url: "https://builtbykiefer.com",
      telephone: "+19705155059",
      email: "info@kbuiltco.com",
      description:
        "Custom home building, renovations, and commercial construction in Northern Colorado. Quality craftsmanship since 1999.",
      foundingDate: "1999",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Windsor",
        addressRegion: "CO",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 40.4775,
        longitude: -104.9014,
      },
      areaServed: [
        { "@type": "City", name: "Windsor", containedInPlace: { "@type": "State", name: "Colorado" } },
        { "@type": "City", name: "Fort Collins", containedInPlace: { "@type": "State", name: "Colorado" } },
        { "@type": "City", name: "Greeley", containedInPlace: { "@type": "State", name: "Colorado" } },
        { "@type": "City", name: "Loveland", containedInPlace: { "@type": "State", name: "Colorado" } },
        { "@type": "City", name: "Timnath", containedInPlace: { "@type": "State", name: "Colorado" } },
        { "@type": "City", name: "Johnstown", containedInPlace: { "@type": "State", name: "Colorado" } },
        { "@type": "City", name: "Evans", containedInPlace: { "@type": "State", name: "Colorado" } },
      ],
      sameAs: [
        "https://www.facebook.com/KieferBuiltContracting",
        "https://www.instagram.com/kieferbuiltcontracting",
        "https://kbuiltco.com",
      ],
      image: "https://builtbykiefer.com/images/project-1/exterior-1.jpg",
      priceRange: "$$$",
      serviceType: [
        "Custom Home Building",
        "Home Renovation",
        "Commercial Construction",
        "Home Additions",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://builtbykiefer.com/#website",
      url: "https://builtbykiefer.com",
      name: "Built by Kiefer",
      publisher: { "@id": "https://builtbykiefer.com/#business" },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": "https://builtbykiefer.com/#webpage",
      url: "https://builtbykiefer.com",
      name: "Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado",
      isPartOf: { "@id": "https://builtbykiefer.com/#website" },
      about: { "@id": "https://builtbykiefer.com/#business" },
      description:
        "Custom home building, renovations, and commercial construction in Northern Colorado. Quality craftsmanship since 1999.",
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the process for building a custom home with Kiefer Built?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our process has four steps: (1) Consultation — we meet in person to discuss your vision, needs, and budget. (2) Design & Plan — our team creates detailed plans and 3D renderings so you can see your dream home before ground is broken. (3) Build — track every detail through our BuilderTrend portal with full transparency. (4) Final Walkthrough — we walk every inch together before handing you the keys.",
          },
        },
        {
          "@type": "Question",
          name: "What areas does Kiefer Built Contracting serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We serve all of Northern Colorado including Windsor, Fort Collins, Greeley, Loveland, Timnath, Johnstown, Evans, and surrounding communities. We've been building custom homes in the region since 1999.",
          },
        },
        {
          "@type": "Question",
          name: "What types of projects does Kiefer Built handle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We specialize in custom home building, home renovations, commercial construction, and home additions. Whether it's a custom new build, renovation, or commercial space, we bring over 25 years of craftsmanship to every project.",
          },
        },
        {
          "@type": "Question",
          name: "How can I track my home building project?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All our clients get access to our BuilderTrend portal where you can track every detail of your project from foundation to finishing touches. Full transparency is a core part of how we work.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
