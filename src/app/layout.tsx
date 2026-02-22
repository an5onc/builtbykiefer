import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado",
  description:
    "Kiefer Built Contracting builds custom homes, renovations, and commercial spaces in Windsor and Northern Colorado. 25+ years of quality craftsmanship. Call (970) 515-5059.",
  keywords: [
    "custom homes Windsor Colorado",
    "Northern Colorado home builder",
    "custom home builder",
    "Kiefer Built Contracting",
    "home construction Windsor CO",
    "renovation contractor Northern Colorado",
    "luxury home builder Colorado",
    "new home construction",
    "commercial construction Northern Colorado",
    "Windsor CO contractor",
  ],
  metadataBase: new URL("https://www.builtbykiefer.com"),
  alternates: {
    canonical: "https://www.builtbykiefer.com",
  },
  openGraph: {
    title: "Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado",
    description:
      "Custom homes built with precision and purpose. 25+ years of quality craftsmanship in Windsor and Northern Colorado. Call (970) 515-5059.",
    url: "https://www.builtbykiefer.com",
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
    title: "Built by Kiefer | Custom Home Builder in Northern Colorado",
    description:
      "Custom homes built with precision and purpose in Windsor & Northern Colorado. 25+ years of quality craftsmanship.",
    images: ["/images/project-1/exterior-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    "geo.region": "US-CO",
    "geo.placename": "Windsor, Colorado",
    "geo.position": "40.4775;-104.9014",
    "ICBM": "40.4775, -104.9014",
  },
};

// JSON-LD structured data
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeBuilder",
  "@id": "https://www.builtbykiefer.com/#business",
  name: "Kiefer Built Contracting",
  alternateName: "Built by Kiefer",
  description:
    "Custom home building, renovations, and commercial construction in Windsor and Northern Colorado. Quality craftsmanship since 1999.",
  url: "https://www.builtbykiefer.com",
  telephone: "+19705155059",
  email: "info@kbuiltco.com",
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
    {
      "@type": "City",
      name: "Windsor",
      containedInPlace: { "@type": "State", name: "Colorado" },
    },
    {
      "@type": "City",
      name: "Fort Collins",
      containedInPlace: { "@type": "State", name: "Colorado" },
    },
    {
      "@type": "City",
      name: "Loveland",
      containedInPlace: { "@type": "State", name: "Colorado" },
    },
    {
      "@type": "City",
      name: "Greeley",
      containedInPlace: { "@type": "State", name: "Colorado" },
    },
    {
      "@type": "City",
      name: "Timnath",
      containedInPlace: { "@type": "State", name: "Colorado" },
    },
  ],
  sameAs: [
    "https://www.facebook.com/KieferBuiltContracting",
    "https://www.instagram.com/kieferbuiltcontracting",
    "https://kbuiltco.com",
  ],
  image: "https://www.builtbykiefer.com/images/project-1/exterior-1.jpg",
  priceRange: "$$$",
  knowsAbout: [
    "Custom Home Building",
    "Home Renovation",
    "Commercial Construction",
    "Interior Design",
    "Luxury Homes",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Built by Kiefer",
  url: "https://www.builtbykiefer.com",
  publisher: {
    "@id": "https://www.builtbykiefer.com/#business",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the process for building a custom home with Kiefer Built Contracting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our process has four steps: (1) Consultation — we meet in person to discuss your vision, needs, and budget. (2) Design & Plan — our team creates detailed plans and 3D renderings. (3) Build — track every detail through our BuilderTrend portal with full transparency. (4) Final Walkthrough — we walk every inch together before handing you the keys.",
      },
    },
    {
      "@type": "Question",
      name: "What areas does Kiefer Built Contracting serve in Northern Colorado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We build custom homes throughout Northern Colorado, including Windsor, Fort Collins, Loveland, Greeley, and Timnath. We're based in Windsor, CO.",
      },
    },
    {
      "@type": "Question",
      name: "What types of construction projects does Kiefer Built Contracting handle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We specialize in custom new home construction, home renovations, and commercial construction projects. With over 25 years of experience, we bring quality craftsmanship to every project.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Kiefer Built Contracting for a quote?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can reach us by phone at (970) 515-5059, email at info@kbuiltco.com, or submit a request through our website contact form. We'd love to hear about your project.",
      },
    },
  ],
};

import FloatingCTA from "@/components/FloatingCTA";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://buildertrend.net" />
        <link rel="dns-prefetch" href="https://buildertrend.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessSchema, websiteSchema, faqSchema]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FloatingCTA />
      </body>
    </html>
  );
}
