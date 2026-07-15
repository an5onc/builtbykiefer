import { RanchGallery } from "builtbykiefer-tmp";

const photos = [
  { src: "https://picsum.photos/seed/kiefer-ranch-1/1200/900", alt: "Custom ranch exterior at dusk", caption: "Timnath custom ranch — stone and timber exterior", category: "Exterior" },
  { src: "https://picsum.photos/seed/kiefer-ranch-2/900/1200", alt: "Great room with vaulted ceiling", caption: "Vaulted great room with walnut beams", category: "Interior" },
  { src: "https://picsum.photos/seed/kiefer-ranch-3/1000/1000", alt: "Chef's kitchen with island", caption: "Chef's kitchen, quartz island", category: "Kitchen" },
  { src: "https://picsum.photos/seed/kiefer-ranch-4/1200/800", alt: "Primary suite", caption: "Primary suite with mountain views", category: "Interior" },
  { src: "https://picsum.photos/seed/kiefer-ranch-5/1200/800", alt: "Covered patio", caption: "Covered patio and outdoor kitchen", category: "Exterior" },
  { src: "https://picsum.photos/seed/kiefer-ranch-6/1000/1000", alt: "Aerial site view", caption: "Aerial of the finished homesite", category: "Aerial" },
];

// Bento-style filterable project gallery, populated with a full photo set.
export function RanchProjectGallery() {
  return <RanchGallery photos={photos} />;
}
