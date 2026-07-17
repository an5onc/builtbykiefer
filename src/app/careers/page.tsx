import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.careers, "/careers");

export default function CareersPage() {
  return <PublicPage content={publicPages.careers} />;
}
