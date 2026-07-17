import FlipbookPage from "@/components/public-site/FlipbookPage";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Project Lookbook | Kiefer Built Contracting",
  description:
    "Browse a digital lookbook of Kiefer Built custom homes, SIP and EPS builds, commercial spaces, renovations, finish details, and process highlights.",
  pathname: "/flipbook",
  image: "/images/project-3/aerial-front-twilight.jpg",
  imageAlt: "Aerial twilight view of a Kiefer Built custom home",
});

export default function FlipbookRoutePage() {
  return <FlipbookPage />;
}
