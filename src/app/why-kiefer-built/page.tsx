import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(
  publicPages.whyKieferBuilt,
  "/why-kiefer-built",
  "Why Build With Kiefer Built | SIPs, Efficiency & Craftsmanship",
);

export default function WhyKieferBuiltPage() {
  return <PublicPage content={publicPages.whyKieferBuilt} />;
}
