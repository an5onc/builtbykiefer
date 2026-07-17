import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.homeBuilding, "/services/home-building");

export default function HomeBuildingPage() {
  return <PublicPage content={publicPages.homeBuilding} />;
}
