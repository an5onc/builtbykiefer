import type { Metadata } from "next";
import type { PublicPageContent } from "./content";

type MarketingMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  image: string;
  imageAlt: string;
};

export function createMarketingMetadata({
  title,
  description,
  pathname,
  image,
  imageAlt,
}: MarketingMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: "Built by Kiefer",
      locale: "en_US",
      type: "website",
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function createPublicPageMetadata(
  content: PublicPageContent,
  pathname: string,
  title = `${content.title} | Kiefer Built`,
): Metadata {
  return createMarketingMetadata({
    title,
    description: content.description,
    pathname,
    image: content.heroImage,
    imageAlt: content.heroAlt,
  });
}
