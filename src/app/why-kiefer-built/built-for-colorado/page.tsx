import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";
import { createPublicPageMetadata } from "@/lib/public-site/metadata";

export const metadata = createPublicPageMetadata(
  publicPages.builtForColorado,
  "/why-kiefer-built/built-for-colorado",
  "Built for Colorado | Hail, Wildfire, Snow & Wind | Kiefer Built",
);

export default function BuiltForColoradoPage() {
  return <PublicPage content={publicPages.builtForColorado} />;
}
