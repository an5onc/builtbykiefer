import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(
  publicPages.costOfOwnership,
  "/why-kiefer-built/cost-of-ownership",
  "Cost Of Ownership | Build Cost vs. Lifetime Cost | Kiefer Built",
);

export default function CostOfOwnershipPage() {
  return <PublicPage content={publicPages.costOfOwnership} />;
}
