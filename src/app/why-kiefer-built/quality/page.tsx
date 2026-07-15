import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Quality & Craftsmanship | Family-Built Homes | Kiefer Built",
  description: publicPages.quality.description,
};

export default function QualityPage() {
  return <PublicPage content={publicPages.quality} />;
}
