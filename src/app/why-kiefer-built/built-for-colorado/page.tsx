import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Built for Colorado | Hail, Wildfire, Snow & Wind | Kiefer Built",
  description: publicPages.builtForColorado.description,
};

export default function BuiltForColoradoPage() {
  return <PublicPage content={publicPages.builtForColorado} />;
}
