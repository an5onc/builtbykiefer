import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export default function CareersPage() {
  return <PublicPage content={publicPages.careers} />;
}
