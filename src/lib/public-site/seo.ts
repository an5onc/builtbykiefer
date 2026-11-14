import type { Metadata } from "next";
import { businessContact } from "./business";
import { serviceAreaCities } from "./service-areas";

/**
 * Canonical origin for absolute URLs in metadata and structured data.
 */
export const SITE_URL = businessContact.clientWebsite;

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
  title: "Kiefer Built Contracting | Custom Home Builder in Windsor & Northern Colorado",
  description:
    `Kiefer Built Contracting builds custom homes, renovations, and commercial spaces in Windsor and Northern Colorado. 25+ years of quality craftsmanship. Call ${businessContact.phone}.`,
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
    title: "Kiefer Built Contracting | Custom Home Builder in Windsor & Northern Colorado",
    description:
      `Custom homes built with precision and purpose. 25+ years of quality craftsmanship in Windsor and Northern Colorado. Call ${businessContact.phone}.`,
    url: SITE_URL,
    siteName: businessContact.name,
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
    title: "Kiefer Built Contracting | Custom Home Builder in Northern Colorado",
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
      { url: "/favicon.png", sizes: "268x268", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "geo.region": "US-CO",
    "geo.placename": "Windsor, Colorado",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeBuilder",
  "@id": `${SITE_URL}/#business`,
  name: businessContact.name,
  alternateName: "Kiefer Built",
  description:
    "Custom home building, renovations, and commercial construction in Windsor and Northern Colorado. Quality craftsmanship with an owner-led approach.",
  url: SITE_URL,
  telephone: businessContact.telephone,
  email: businessContact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Windsor",
    addressRegion: "CO",
    addressCountry: "US",
  },
  areaServed: serviceAreaCities.map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: "Colorado" },
  })),
  sameAs: [
    businessContact.facebook,
    businessContact.instagram,
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
  name: businessContact.name,
  url: SITE_URL,
  publisher: {
    "@id": `${SITE_URL}/#business`,
  },
};
