import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Why Build With Kiefer Built | SIPs, Efficiency & Craftsmanship",
  description: publicPages.whyKieferBuilt.description,
};

export default function WhyKieferBuiltPage() {
  return <PublicPage content={publicPages.whyKieferBuilt} />;
}
