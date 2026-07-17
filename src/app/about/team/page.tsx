import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.team, "/about/team");

export default function TeamPage() {
  return <PublicPage content={publicPages.team} />;
}
