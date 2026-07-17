import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(
  publicPages.quality,
  "/why-kiefer-built/quality",
  "Quality & Craftsmanship | Family-Built Homes | Kiefer Built",
);

export default function QualityPage() {
  return <PublicPage content={publicPages.quality} />;
}
