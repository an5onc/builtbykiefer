import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export default function HomeBuildingPage() {
  return <PublicPage content={publicPages.homeBuilding} />;
}
