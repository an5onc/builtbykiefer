/**
 * Type definitions for Before/After Slider components
 *
 * These types ensure type safety when using the slider components
 * throughout the Built by Kiefer construction website.
 */

/**
 * Props for the BeforeAfterSlider component
 */
export interface BeforeAfterSliderProps {
  /** Path to the "before" image (relative to /public directory) */
  beforeImage: string;

  /** Path to the "after" image (relative to /public directory) */
  afterImage: string;

  /** Accessible alt text describing the before state */
  beforeAlt: string;

  /** Accessible alt text describing the after state */
  afterAlt: string;

  /** Optional additional CSS classes to apply to the container */
  className?: string;
}

/**
 * Project transformation data structure
 * Use this when creating multiple before/after comparisons for a project
 */
export interface ProjectTransformation {
  /** Unique identifier for this transformation */
  id: string;

  /** Display title (e.g., "Kitchen Remodel", "Exterior Facelift") */
  title: string;

  /** Detailed description of the transformation */
  description: string;

  /** Category (e.g., "Kitchen", "Bathroom", "Exterior", "Interior") */
  category: "Kitchen" | "Bathroom" | "Exterior" | "Interior" | "Landscape" | "Other";

  /** Before image path */
  beforeImage: string;

  /** After image path */
  afterImage: string;

  /** Before alt text */
  beforeAlt: string;

  /** After alt text */
  afterAlt: string;

  /** Optional project details/highlights */
  highlights?: string[];

  /** Optional project timeline (e.g., "3 months", "6 weeks") */
  timeline?: string;

  /** Optional budget range (e.g., "$50k-75k", "$100k+") */
  budgetRange?: string;
}

/**
 * Example usage:
 *
 * ```tsx
 * const transformations: ProjectTransformation[] = [
 *   {
 *     id: "kitchen-main",
 *     title: "Kitchen Transformation",
 *     description: "Complete gut renovation with custom cabinetry",
 *     category: "Kitchen",
 *     beforeImage: "/images/project-1/kitchen-before.jpg",
 *     afterImage: "/images/project-1/kitchen-after.jpg",
 *     beforeAlt: "Outdated kitchen with laminate countertops",
 *     afterAlt: "Modern kitchen with quartz countertops",
 *     highlights: [
 *       "Two-tone custom cabinetry",
 *       "Quartz countertops and backsplash",
 *       "Professional-grade appliances"
 *     ],
 *     timeline: "6 weeks",
 *     budgetRange: "$60k-80k"
 *   }
 * ];
 * ```
 */
