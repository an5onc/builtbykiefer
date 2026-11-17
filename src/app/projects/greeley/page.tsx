import ProjectTour from "@/components/ProjectTour";
import { greeleyPhotos, greeleyHero } from "@/lib/public-site/greeley";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Greeley | Kiefer Built Contracting",
  description: `Explore ${greeleyPhotos.length} photos of the Greeley home, from its stone entry and wood cabinetry to open living spaces, bathrooms and the finished basement.`,
  pathname: "/projects/greeley",
  image: greeleyHero.src,
  imageAlt: greeleyHero.alt,
});

export default function GreeleyProject() {
  return (
    <ProjectTour
      title="Greeley"
      description="Stone, warm wood and open living spaces — a Northern Colorado home with considered finish details and a generous finished basement."
      hero={greeleyHero}
      photos={greeleyPhotos}
      backHref="/projects/new-builds"
      moreHref="/projects/new-builds"
      galleryCategories={["All", "Exterior", "Aerial", "Kitchen", "Interior", "Baths", "Basement"]}
      galleryTitle="Inside Greeley"
      galleryDescription={`${greeleyPhotos.length} photographs across the exterior, aerial views, kitchen, living spaces, bathrooms and finished basement.`}
    />
  );
}
