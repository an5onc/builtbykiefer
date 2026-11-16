import RenovationsShowcasePage from "@/components/public-site/RenovationsShowcasePage";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Renovations and Additions | Kiefer Built Contracting",
  description:
    "Explore Kiefer Built renovation work across kitchens, bathrooms, living spaces, speakeasies, exteriors, and custom elevators with interactive project galleries.",
  pathname: "/projects/renovations-additions",
  image: "/images/lakehouse-remodel/DSC05814-HDR.webp",
  imageAlt: "Lakehouse Remodel kitchen with wood cabinetry and a dark waterfall island by Kiefer Built",
});

export default function RenovationsAndAdditionsPage() {
  return <RenovationsShowcasePage />;
}
