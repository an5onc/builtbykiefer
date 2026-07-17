import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.projects, "/projects");

export default function ProjectsPage() {
  return <PublicPage content={publicPages.projects} />;
}
