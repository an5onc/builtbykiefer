import RenovationsShowcasePage from "@/components/public-site/RenovationsShowcasePage";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Renovations and Additions | Kiefer Built Contracting",
  description:
    "Explore Kiefer Built renovation work across kitchens, bathrooms, living spaces, exteriors, and custom elevators with interactive project galleries.",
  pathname: "/projects/renovations-additions",
  image: "/images/project-1/kitchen-8.jpg",
  imageAlt: "Renovated kitchen by Kiefer Built Contracting",
});

export default function RenovationsAndAdditionsPage() {
  return <RenovationsShowcasePage />;
}
