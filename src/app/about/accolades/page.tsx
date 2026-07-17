import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.accolades, "/about/accolades");

export default function AccoladesPage() {
  return <PublicPage content={publicPages.accolades} />;
}
