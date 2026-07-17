import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(
  publicPages.indoorAirQuality,
  "/why-kiefer-built/indoor-air-quality",
  "Indoor Air Quality | Airtight Homes & Ventilation | Kiefer Built",
);

export default function IndoorAirQualityPage() {
  return <PublicPage content={publicPages.indoorAirQuality} />;
}
