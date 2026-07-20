import type { Metadata } from "next";

/**
 * Canonical origin for absolute URLs in metadata and structured data.
 */
export const SITE_URL = "https://www.builtbykiefer.com";

/**
 * The single homepage social-sharing image.
 *
 * Open Graph, Twitter cards, and the LocalBusiness JSON-LD all derive from
 * this constant so the three surfaces cannot drift apart. The asset must
 * exist at `public${SOCIAL_IMAGE}` and be exactly
 * SOCIAL_IMAGE_WIDTH x SOCIAL_IMAGE_HEIGHT, because those dimensions are
 * declared to crawlers in `og:image:width` / `og:image:height` — clients such
 * as iMessage lay out the preview from the declared values, so a mismatch
 * mis-crops the card.
 */
export const SOCIAL_IMAGE = "/og-image.jpg";
export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;

export const SOCIAL_IMAGE_URL = `${SITE_URL}${SOCIAL_IMAGE}`;

const SOCIAL_IMAGE_ALT =
  "Custom modern home at twilight built by Kiefer Built Contracting in Northern Colorado";

export const homeMetadata: Metadata = {
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
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado",
    description:
      "Custom homes built with precision and purpose. 25+ years of quality craftsmanship in Windsor and Northern Colorado. Call (970) 515-5059.",
    url: SITE_URL,
    siteName: "Built by Kiefer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE,
        width: SOCIAL_IMAGE_WIDTH,
        height: SOCIAL_IMAGE_HEIGHT,
        alt: SOCIAL_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Built by Kiefer | Custom Home Builder in Northern Colorado",
    description:
      "Custom homes built with precision and purpose in Windsor & Northern Colorado. 25+ years of quality craftsmanship.",
    images: [SOCIAL_IMAGE],
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
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "geo.region": "US-CO",
    "geo.placename": "Windsor, Colorado",
    "geo.position": "40.4775;-104.9014",
    ICBM: "40.4775, -104.9014",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeBuilder",
  "@id": `${SITE_URL}/#business`,
  name: "Kiefer Built Contracting",
  alternateName: "Built by Kiefer",
  description:
    "Custom home building, renovations, and commercial construction in Windsor and Northern Colorado. Quality craftsmanship since 1999.",
  url: SITE_URL,
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
  image: SOCIAL_IMAGE_URL,
  priceRange: "$$$",
  knowsAbout: [
    "Custom Home Building",
    "Home Renovation",
    "Commercial Construction",
    "Interior Design",
    "Luxury Homes",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Built by Kiefer",
  url: SITE_URL,
  publisher: {
    "@id": `${SITE_URL}/#business`,
  },
};
