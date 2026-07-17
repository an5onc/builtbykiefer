import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Northern Colorado Service Areas | Kiefer Built Contracting",
  description:
    "Kiefer Built serves Windsor, Fort Collins, Loveland, Greeley, Johnstown, Wellington, and surrounding Northern Colorado communities.",
  pathname: "/service-areas",
  image: "/images/project-2/exterior-wide-property.jpg",
  imageAlt: "Kiefer Built home on a Northern Colorado property",
});

export default function ServiceAreasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
