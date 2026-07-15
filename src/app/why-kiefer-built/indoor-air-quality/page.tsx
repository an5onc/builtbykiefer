import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Indoor Air Quality | Airtight Homes & Ventilation | Kiefer Built",
  description: publicPages.indoorAirQuality.description,
};

export default function IndoorAirQualityPage() {
  return <PublicPage content={publicPages.indoorAirQuality} />;
}
