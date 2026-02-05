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
            __html: JSON.stringify([localBusinessSchema, websiteSchema]),
          }}
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
