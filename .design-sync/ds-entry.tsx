// design-sync bundle entry: re-exports every public-site component as a
// named export so esbuild assigns them to window.KieferBuilt.<Name>. The
// components are default exports in src/components; `export *` would miss
// them, hence explicit default→named re-exports here.
export { default as About } from "@/components/About";
export { default as BeforeAfterExample } from "@/components/BeforeAfterExample";
export { default as BeforeAfterShowcase } from "@/components/BeforeAfterShowcase";
export { default as BeforeAfterSlider } from "@/components/BeforeAfterSlider";
export { default as BudgetCalculator } from "@/components/BudgetCalculator";
export { default as Contact } from "@/components/Contact";
export { default as CostEstimator } from "@/components/CostEstimator";
export { default as CurrentlyBuilding } from "@/components/CurrentlyBuilding";
export { default as ExplodedHero } from "@/components/ExplodedHero";
export { default as FloatingCTA } from "@/components/FloatingCTA";
export { default as Footer } from "@/components/Footer";
export { default as GlobalFloatingAction } from "@/components/GlobalFloatingAction";
export { default as Header } from "@/components/Header";
export { default as Hero } from "@/components/Hero";
export { default as MaterialsShowcase } from "@/components/MaterialsShowcase";
export { default as Partnership } from "@/components/Partnership";
export { default as Process } from "@/components/Process";
export { default as ProjectGallery } from "@/components/ProjectGallery";
export { default as ProjectTimeline } from "@/components/ProjectTimeline";
export { default as ProjectUpdateNotification } from "@/components/ProjectUpdateNotification";
export { default as RanchGallery } from "@/components/RanchGallery";
export { default as ScrollFrameHero } from "@/components/ScrollFrameHero";
export { default as ServiceArea } from "@/components/ServiceArea";
export { default as Testimonials } from "@/components/Testimonials";
export { default as TestimonialsCarousel } from "@/components/TestimonialsCarousel";
export { default as WeatherImpactTracker } from "@/components/WeatherImpactTracker";
