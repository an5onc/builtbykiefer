import ServiceLandingPage from "@/components/public-site/ServiceLandingPage";
import { remodelingService } from "@/lib/public-site/remodeling-services";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

const service = remodelingService("cabinet-replacement");
export const metadata = createMarketingMetadata({
  title: `${service.title} in Northern Colorado | Kiefer Built`,
  description: service.description,
  pathname: `/services/${service.slug}`,
  image: service.hero.src,
  imageAlt: service.hero.alt,
});

export default function ServicePage() {
  return <ServiceLandingPage service={service} />;
}
