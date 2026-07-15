export type NavLink = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
};

export const navLinks: NavLink[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Our Team", href: "/about/team" },
      { label: "Accolades", href: "/about/accolades" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Why Kiefer Built",
    href: "/why-kiefer-built",
    children: [
      { label: "Overview", href: "/why-kiefer-built" },
      { label: "SIPs 101", href: "/why-kiefer-built/sips" },
      { label: "Energy Efficiency", href: "/why-kiefer-built/energy-efficiency" },
      { label: "Indoor Air Quality", href: "/why-kiefer-built/indoor-air-quality" },
      { label: "Built for Colorado", href: "/why-kiefer-built/built-for-colorado" },
      { label: "Quality & Craftsmanship", href: "/why-kiefer-built/quality" },
      { label: "Cost Of Ownership", href: "/why-kiefer-built/cost-of-ownership" },
    ],
  },
  {
    label: "Service",
    href: "/services",
    children: [
      { label: "Our Services", href: "/services" },
      { label: "Our Products", href: "/products" },
      { label: "Our Process", href: "/process" },
      { label: "Home Builds", href: "/services/home-building" },
      { label: "Custom Elevators", href: "/services/custom-elevators" },
      { label: "EPS Homes", href: "https://epsbuildings.com/" },
    ],
  },
  {
    label: "Our Work",
    href: "/projects",
    children: [
      { label: "Gallery", href: "/projects" },
      { label: "Flipbook", href: "/flipbook" },
      { label: "New Builds", href: "/projects/new-builds" },
      { label: "Commercial", href: "/projects/commercial" },
      { label: "Renovations & Additions", href: "/projects/renovations-additions" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  { label: "Careers", href: "/careers" },
  {
    label: "Contact Us",
    href: "/contact",
    children: [{ label: "Contact", href: "/contact" }],
  },
];
