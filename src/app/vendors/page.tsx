import VendorInterestPage from "@/components/public-site/VendorInterestPage";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Vendor and Supplier Interest | Kiefer Built Contracting",
  description:
    "Share your company, products, and services with the Kiefer Built team for potential supplier and vendor opportunities in Northern Colorado.",
  pathname: "/vendors",
  image: "/images/kiefer-commercial-agfinity.jpg",
  imageAlt: "Commercial project by Kiefer Built Contracting",
});

export default function VendorsPage() {
  return <VendorInterestPage />;
}
