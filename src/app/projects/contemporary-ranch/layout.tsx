import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Contemporary Ranch | Kiefer Built Contracting",
  description:
    "Tour a Northern Colorado contemporary ranch with stacked stone, warm wood, an open great room, custom cabinetry, and detailed primary-suite finishes.",
  pathname: "/projects/contemporary-ranch",
  image: "/images/project-3/exterior-twilight-front.jpg",
  imageAlt: "Contemporary ranch front elevation at twilight",
});

export default function ContemporaryRanchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
