import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export default function ServicesPage() {
  return <PublicPage content={publicPages.services} />;
}
