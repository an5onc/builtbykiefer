import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "SIPs 101 | Structural Insulated Panels | Kiefer Built",
  description: publicPages.sips.description,
};

export default function SipsPage() {
  return <PublicPage content={publicPages.sips} />;
}
