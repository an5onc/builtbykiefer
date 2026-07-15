import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Cost Of Ownership | Build Cost vs. Lifetime Cost | Kiefer Built",
  description: publicPages.costOfOwnership.description,
};

export default function CostOfOwnershipPage() {
  return <PublicPage content={publicPages.costOfOwnership} />;
}
