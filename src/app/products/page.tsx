import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(publicPages.products, "/products");

export default function ProductsPage() {
  return <PublicPage content={publicPages.products} />;
}
