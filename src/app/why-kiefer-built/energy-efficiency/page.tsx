import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Energy Efficiency | Lower Bills, Even Comfort | Kiefer Built",
  description: publicPages.energyEfficiency.description,
};

export default function EnergyEfficiencyPage() {
  return <PublicPage content={publicPages.energyEfficiency} />;
}
