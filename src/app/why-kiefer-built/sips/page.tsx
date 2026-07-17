import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(
  publicPages.sips,
  "/why-kiefer-built/sips",
  "SIPs 101 | Structural Insulated Panels | Kiefer Built",
);

export default function SipsPage() {
  return <PublicPage content={publicPages.sips} />;
}
