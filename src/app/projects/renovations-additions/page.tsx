import type { Metadata } from "next";
import RenovationsShowcasePage from "@/components/public-site/RenovationsShowcasePage";

export const metadata: Metadata = {
  title: "Renovations and Additions | Kiefer Built Contracting",
  description:
    "Explore Kiefer Built renovation work across kitchens, bathrooms, living spaces, exteriors, and custom elevators with interactive project galleries.",
};

export default function RenovationsAndAdditionsPage() {
  return <RenovationsShowcasePage />;
}
