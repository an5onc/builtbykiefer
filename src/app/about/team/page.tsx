import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export default function TeamPage() {
  return <PublicPage content={publicPages.team} />;
}
