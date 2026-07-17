import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.commercialProjects, "/projects/commercial");

export default function CommercialProjectsPage() {
  return <PublicPage content={publicPages.commercialProjects} />;
}
