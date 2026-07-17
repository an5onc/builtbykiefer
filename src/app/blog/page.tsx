import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.blog, "/blog");

export default function BlogPage() {
  return <PublicPage content={publicPages.blog} />;
}
