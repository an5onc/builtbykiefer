# Marketing Site Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Built by Kiefer into a pure marketing site — a `/why-kiefer-built` education series, a database-free contact path, and no public route to the dormant backend.

**Architecture:** Next.js App Router. New education pages are thin `page.tsx` wrappers that pass a content object to the existing data-driven `PublicPage` template — no new UI components. Navigation data moves to a testable module. The contact route's CRM write becomes best-effort so email (Resend) alone determines success. Backend routes stay on disk but are unlinked from all public navigation.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind, Resend (email), Vitest (`vitest run`).

## Global Constraints

- Backend code (`src/app/admin`, `src/app/portal`, `src/app/vendor`, `src/app/auth`, land-leads, Supabase) is **kept dormant** — never delete routes, never uninstall Supabase.
- No new database or authenticated feature on the public site.
- All page copy lives in `src/lib/public-site/` data objects, never inline in JSX.
- New education pages reuse the existing `PublicPage` component; do **not** create new presentational components.
- Brand red is `#c9281c`; the CTA object is `{ label: "Start A Project", href: "/#contact" }` (reuse the existing `cta` const in `content.ts`).
- Contact email recipient default: `info@kbuiltco.com`. Env vars: `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`.
- Test runner: `npx vitest run <path>`. Build check: `npm run build`.

---

### Task 1: Education content data

Add the five education-page content objects to the public content module. Each is a `PublicPageContent` consumed by the `PublicPage` template. A test asserts every page exists with the required fields and correct internal links.

**Files:**
- Modify: `src/lib/public-site/content.ts` (append five entries to the `publicPages` object, before its closing `};`)
- Test: `src/lib/public-site/education.test.ts` (create)

**Interfaces:**
- Consumes: `PublicPageContent`, `publicPages`, and the `cta` const — all already exported/defined in `src/lib/public-site/content.ts`.
- Produces: `publicPages.whyKieferBuilt`, `publicPages.sips`, `publicPages.energyEfficiency`, `publicPages.quality`, `publicPages.costOfOwnership` — each a `PublicPageContent`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/public-site/education.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { publicPages } from "./content";

const EDUCATION_KEYS = [
  "whyKieferBuilt",
  "sips",
  "energyEfficiency",
  "quality",
  "costOfOwnership",
] as const;

describe("why-kiefer-built education content", () => {
  it("defines every education page with required fields", () => {
    for (const key of EDUCATION_KEYS) {
      const page = publicPages[key];
      expect(page, `missing page: ${key}`).toBeDefined();
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.description.length).toBeGreaterThan(0);
      expect(page.heroImage).toMatch(/^\/images\//);
      expect(page.heroAlt.length).toBeGreaterThan(0);
    }
  });

  it("hub links to each of the four child pages", () => {
    const hrefs = (publicPages.whyKieferBuilt.cards ?? []).map((card) => card.href);
    expect(hrefs).toContain("/why-kiefer-built/sips");
    expect(hrefs).toContain("/why-kiefer-built/energy-efficiency");
    expect(hrefs).toContain("/why-kiefer-built/quality");
    expect(hrefs).toContain("/why-kiefer-built/cost-of-ownership");
  });

  it("cites the 2025 SIPA award on the SIPs page", () => {
    const proofValues = (publicPages.sips.proof ?? []).map((p) => p.label + p.value).join(" ");
    const bodyText = (publicPages.sips.sections ?? []).map((s) => s.body).join(" ");
    expect(`${proofValues} ${bodyText}`).toMatch(/SIPA/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/public-site/education.test.ts`
Expected: FAIL — `missing page: whyKieferBuilt` (pages not defined yet).

- [ ] **Step 3: Add the content objects**

In `src/lib/public-site/content.ts`, add these five entries inside the `publicPages` object (immediately before the final `};` that closes `publicPages`). They reuse the existing `cta` const:

```typescript
  whyKieferBuilt: {
    title: "Why Build With Kiefer Built",
    description:
      "A family builder using SIPs construction to deliver homes that are tighter, quieter, more efficient, and built to last — here is exactly why that matters.",
    heroImage: "/images/project-2/exterior-wide-property.jpg",
    heroAlt: "Energy-efficient mountain modern home built by Kiefer Built Contracting",
    primaryCta: cta,
    secondaryCta: { label: "See The Work", href: "/projects" },
    proof: [
      { value: "SIPs", label: "Structural insulated panels" },
      { value: "2025", label: "SIPA Building Excellence Award" },
      { value: "Family", label: "Owner-led accountability" },
    ],
    intro: {
      title: "Better building science, not just better finishes.",
      body:
        "Most builders compete on finishes. Kiefer Built competes on the parts of the home you never see — the envelope, the air-tightness, and the details that decide how comfortable and affordable a home is to live in for decades. Explore the four reasons the difference is real.",
    },
    cards: [
      {
        title: "SIPs 101",
        meta: "How we build",
        description:
          "What structural insulated panels are, and why they outperform conventional stick framing on strength, speed, and insulation.",
        href: "/why-kiefer-built/sips",
        image: "/images/project-2/exterior-solar-shed.jpg",
      },
      {
        title: "Energy Efficiency",
        meta: "Comfort & savings",
        description:
          "How a tighter, better-insulated envelope holds temperature, cuts utility bills, and stays comfortable through Colorado winters.",
        href: "/why-kiefer-built/energy-efficiency",
        image: "/images/project-2/exterior-winter-wide.jpg",
      },
      {
        title: "Quality & Craftsmanship",
        meta: "The details",
        description:
          "Owner-led builds, careful material selection, and a family standard that puts durable work ahead of shortcuts.",
        href: "/why-kiefer-built/quality",
        image: "/images/project-3/interior-great-room-wide.jpg",
      },
      {
        title: "Cost Of Ownership",
        meta: "Value over time",
        description:
          "Why the right build costs less to own — lower energy bills, less maintenance, and lasting resale value.",
        href: "/why-kiefer-built/cost-of-ownership",
        image: "/images/project-2/exterior-panoramic.jpg",
      },
    ],
  },
  sips: {
    title: "SIPs 101: A Stronger, Tighter Shell",
    description:
      "Structural insulated panels replace the studs-and-batts of conventional framing with a single engineered panel — stronger, faster to erect, and dramatically better insulated.",
    heroImage: "/images/project-2/exterior-solar-shed.jpg",
    heroAlt: "Kiefer Built home under construction using structural insulated panels",
    primaryCta: cta,
    secondaryCta: { label: "See Energy Efficiency", href: "/why-kiefer-built/energy-efficiency" },
    proof: [
      { value: "1 panel", label: "Foam core bonded between two skins" },
      { value: "Fewer gaps", label: "Continuous insulation, minimal thermal bridging" },
      { value: "2025", label: "SIPA Building Excellence Award winner" },
    ],
    intro: {
      title: "One engineered panel does the work of many parts.",
      body:
        "A structural insulated panel is a thick foam core bonded between two structural skins. That single component carries load and insulates at the same time — so the wall is stronger and far more airtight than a stick-framed wall full of studs, gaps, and seams.",
    },
    sections: [
      {
        title: "SIPs vs. stick framing.",
        body:
          "Conventional framing insulates only the cavities between studs, and every stud is a thermal bridge that leaks heat. SIPs insulate the whole plane continuously, with far fewer seams for air to move through. The result is a quieter, tighter, more consistent shell.",
        image: "/images/project-2/exterior-front-facade.jpg",
        points: ["Continuous insulation", "Fewer thermal bridges", "Faster to dry-in"],
      },
      {
        title: "Recognized building excellence.",
        body:
          "Kiefer Built's SIPs work earned the 2025 SIPA (Structural Insulated Panel Association) Building Excellence Award for single family homes under 3,000 square feet — independent recognition of how well these homes are engineered and executed.",
        image: "/images/project-2/exterior-winter-detail.jpg",
        points: ["SIPA award winner", "Engineered envelope", "Proven execution"],
        dark: true,
      },
    ],
  },
  energyEfficiency: {
    title: "Energy Efficiency That You Feel And Bank",
    description:
      "A tighter envelope does two things at once: it keeps the home comfortable in every season and it lowers what you pay to heat and cool it.",
    heroImage: "/images/project-2/exterior-winter-wide.jpg",
    heroAlt: "Kiefer Built home holding temperature through a Colorado winter",
    primaryCta: cta,
    secondaryCta: { label: "Understand Cost Of Ownership", href: "/why-kiefer-built/cost-of-ownership" },
    proof: [
      { value: "Lower bills", label: "Less energy lost through the envelope" },
      { value: "Even temps", label: "Fewer drafts and cold spots" },
      { value: "Quieter", label: "The tight shell blocks outside noise" },
    ],
    intro: {
      title: "Comfort is a building-science outcome.",
      body:
        "When the envelope is airtight and continuously insulated, the mechanical system does less work and the interior temperature stays even. That is why a well-built SIPs home feels calm and quiet — and why the utility bills are smaller month after month.",
    },
    sections: [
      {
        title: "Built for the Colorado climate.",
        body:
          "Northern Colorado swings from hard winters to hot, dry summers. A leaky home fights that swing all year. A tight, well-insulated Kiefer Built home holds its conditioned air, so the furnace and AC run less and the house stays comfortable from the coldest morning to the hottest afternoon.",
        image: "/images/project-2/exterior-winter-snow.jpg",
        points: ["Holds heat in winter", "Stays cool in summer", "Less mechanical run-time"],
      },
      {
        title: "Savings that compound.",
        body:
          "Energy efficiency is not a one-time rebate — it is a lower bill every single month for as long as you own the home. Over the life of a mortgage, the difference between a leaky build and a tight one adds up to real money.",
        image: "/images/project-2/exterior-solar-shed.jpg",
        points: ["Monthly savings", "Predictable costs", "Lower carbon footprint"],
        dark: true,
      },
    ],
  },
  quality: {
    title: "Quality And Craftsmanship In Every Detail",
    description:
      "Kiefer Built is a family company. The people who own it are on the job, choosing the materials and standing behind the details.",
    heroImage: "/images/project-3/interior-great-room-wide.jpg",
    heroAlt: "Finished great room showing Kiefer Built craftsmanship and detail",
    primaryCta: cta,
    secondaryCta: { label: "Meet The Team", href: "/about/team" },
    proof: [
      { value: "Owner-led", label: "Family on the job, not just on the sign" },
      { value: "Material-first", label: "Durable selections over shortcuts" },
      { value: "Accountable", label: "Direct line to the decision makers" },
    ],
    intro: {
      title: "The details decide how a home ages.",
      body:
        "Finishes photograph well on day one. Craftsmanship shows up in year ten — in the trim that still lines up, the doors that still close true, and the systems that still perform. Kiefer Built builds for the long version of the story.",
    },
    sections: [
      {
        title: "A family standard.",
        body:
          "Mark and Mindy Kiefer built the company around direct communication and durable work, with Miles involved in estimating and project management. Decisions stay close to the people who own the outcome, so quality is not delegated away.",
        image: "/images/project-3/interior-open-plan.jpg",
        points: ["Owner involvement", "Clear communication", "Long-term durability"],
      },
      {
        title: "Materials chosen to last.",
        body:
          "The envelope, the mechanicals, and the finishes are selected to hold up to Colorado conditions and daily life. The goal is a home that keeps performing and looking right long after the build is done.",
        image: "/images/project-1/kitchen-8.jpg",
        points: ["Durable materials", "Careful coordination", "Built to perform"],
        dark: true,
      },
    ],
  },
  costOfOwnership: {
    title: "The Real Cost Is What You Pay To Own It",
    description:
      "A home's price tag is only the down payment on decades of energy, maintenance, and resale. A better build wins on all three.",
    heroImage: "/images/project-2/exterior-panoramic.jpg",
    heroAlt: "Kiefer Built custom home on a Northern Colorado property",
    primaryCta: cta,
    secondaryCta: { label: "Start With SIPs 101", href: "/why-kiefer-built/sips" },
    proof: [
      { value: "Lower energy", label: "A tight envelope pays back monthly" },
      { value: "Less upkeep", label: "Durable systems mean fewer repairs" },
      { value: "Strong resale", label: "Efficient, well-built homes hold value" },
    ],
    intro: {
      title: "Cheaper to build is not cheaper to own.",
      body:
        "The lowest bid usually hides its cost in the years after move-in — higher utility bills, earlier repairs, and weaker resale. A Kiefer Built home front-loads quality so the ownership years cost less.",
    },
    sections: [
      {
        title: "Add up the ownership years.",
        body:
          "Energy, maintenance, and repairs run every month for as long as you own the home. A tighter, better-built house shrinks all three, so the total you spend over the years you actually live there comes out lower.",
        image: "/images/project-2/exterior-winter-wide.jpg",
        points: ["Lower utilities", "Fewer repairs", "Predictable costs"],
      },
      {
        title: "Value that holds.",
        body:
          "Efficiency and build quality are increasingly what buyers look for. A documented, award-winning SIPs home is an easier home to resell — and one that holds its value against cheaper, leakier competition.",
        image: "/images/project-3/aerial-front-twilight.jpg",
        points: ["Buyer demand", "Documented quality", "Lasting value"],
        dark: true,
      },
    ],
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/public-site/education.test.ts`
Expected: PASS (3 tests).

Note: image paths above all exist under `public/images/project-2` and `project-3`. If any path fails a later build, swap for a sibling file in the same directory.

- [ ] **Step 5: Commit**

```bash
git add src/lib/public-site/content.ts src/lib/public-site/education.test.ts
git commit -m "feat: add why-kiefer-built education page content"
```

---

### Task 2: Education page routes

Create the hub route and four child routes as thin wrappers around `PublicPage`, each with SEO metadata. Verified by a successful production build (thin wrappers need no unit test — their data is already tested in Task 1).

**Files:**
- Create: `src/app/why-kiefer-built/page.tsx`
- Create: `src/app/why-kiefer-built/sips/page.tsx`
- Create: `src/app/why-kiefer-built/energy-efficiency/page.tsx`
- Create: `src/app/why-kiefer-built/quality/page.tsx`
- Create: `src/app/why-kiefer-built/cost-of-ownership/page.tsx`

**Interfaces:**
- Consumes: `PublicPage` (default export of `src/components/public-site/PublicPage.tsx`, prop `{ content: PublicPageContent }`) and `publicPages.*` from Task 1.
- Produces: routes `/why-kiefer-built`, `/why-kiefer-built/sips`, `/why-kiefer-built/energy-efficiency`, `/why-kiefer-built/quality`, `/why-kiefer-built/cost-of-ownership`.

- [ ] **Step 1: Create the hub page**

Create `src/app/why-kiefer-built/page.tsx`:

```tsx
import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Why Build With Kiefer Built | SIPs, Efficiency & Craftsmanship",
  description: publicPages.whyKieferBuilt.description,
};

export default function WhyKieferBuiltPage() {
  return <PublicPage content={publicPages.whyKieferBuilt} />;
}
```

- [ ] **Step 2: Create the SIPs page**

Create `src/app/why-kiefer-built/sips/page.tsx`:

```tsx
import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "SIPs 101 | Structural Insulated Panels | Kiefer Built",
  description: publicPages.sips.description,
};

export default function SipsPage() {
  return <PublicPage content={publicPages.sips} />;
}
```

- [ ] **Step 3: Create the energy-efficiency page**

Create `src/app/why-kiefer-built/energy-efficiency/page.tsx`:

```tsx
import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Energy Efficiency | Lower Bills, Even Comfort | Kiefer Built",
  description: publicPages.energyEfficiency.description,
};

export default function EnergyEfficiencyPage() {
  return <PublicPage content={publicPages.energyEfficiency} />;
}
```

- [ ] **Step 4: Create the quality page**

Create `src/app/why-kiefer-built/quality/page.tsx`:

```tsx
import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Quality & Craftsmanship | Family-Built Homes | Kiefer Built",
  description: publicPages.quality.description,
};

export default function QualityPage() {
  return <PublicPage content={publicPages.quality} />;
}
```

- [ ] **Step 5: Create the cost-of-ownership page**

Create `src/app/why-kiefer-built/cost-of-ownership/page.tsx`:

```tsx
import type { Metadata } from "next";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "@/lib/public-site/content";

export const metadata: Metadata = {
  title: "Cost Of Ownership | Build Cost vs. Lifetime Cost | Kiefer Built",
  description: publicPages.costOfOwnership.description,
};

export default function CostOfOwnershipPage() {
  return <PublicPage content={publicPages.costOfOwnership} />;
}
```

- [ ] **Step 6: Verify the routes build**

Run: `npm run build`
Expected: Build succeeds and the route list includes all five `/why-kiefer-built` paths.

- [ ] **Step 7: Commit**

```bash
git add src/app/why-kiefer-built
git commit -m "feat: add why-kiefer-built hub and child page routes"
```

---

### Task 3: Navigation — add hub, remove backend links

Move the header's nav data into a testable module, add the "Why Kiefer Built" dropdown, and remove the "Client Portal" and "Vendors" entries so no public link reaches the dormant backend.

**Files:**
- Create: `src/lib/public-site/nav.ts`
- Create: `src/lib/public-site/nav.test.ts`
- Modify: `src/components/Header.tsx` (replace the inline `NavLink` type + `navLinks` const with an import from the new module)

**Interfaces:**
- Produces: `export type NavLink` and `export const navLinks: NavLink[]` from `src/lib/public-site/nav.ts`.
- Consumes (Header): imports `navLinks` and `NavLink` from `@/lib/public-site/nav`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/public-site/nav.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { navLinks } from "./nav";

function allHrefs(): string[] {
  return navLinks.flatMap((link) => [link.href, ...(link.children ?? []).map((c) => c.href)]);
}

describe("public navigation", () => {
  it("includes the Why Kiefer Built hub and its child pages", () => {
    const hrefs = allHrefs();
    expect(hrefs).toContain("/why-kiefer-built");
    expect(hrefs).toContain("/why-kiefer-built/sips");
    expect(hrefs).toContain("/why-kiefer-built/energy-efficiency");
    expect(hrefs).toContain("/why-kiefer-built/quality");
    expect(hrefs).toContain("/why-kiefer-built/cost-of-ownership");
  });

  it("never links to the dormant backend", () => {
    const hrefs = allHrefs().join(" ");
    expect(hrefs).not.toMatch(/\/portal/);
    expect(hrefs).not.toMatch(/\/vendor(s)?\b/);
    expect(hrefs).not.toMatch(/\/admin/);
    expect(hrefs).not.toMatch(/\/login/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/public-site/nav.test.ts`
Expected: FAIL — cannot resolve `./nav` (module does not exist yet).

- [ ] **Step 3: Create the nav module**

Create `src/lib/public-site/nav.ts` (this is the current header nav, minus Client Portal and Vendors, plus the new dropdown):

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/public-site/nav.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Point Header at the new module**

In `src/components/Header.tsx`: delete the inline `type NavLink = { ... }` block and the `const navLinks: NavLink[] = [ ... ]` array (currently lines ~10–65), and add this import next to the other imports at the top:

```tsx
import { navLinks, type NavLink } from "@/lib/public-site/nav";
```

Leave everything else in `Header.tsx` unchanged — it already renders `navLinks` and their `children` as dropdowns, so the new "Why Kiefer Built" entry renders automatically and the removed entries disappear. If `NavLink` is not referenced anywhere else in the file after removal, drop `, type NavLink` from the import.

- [ ] **Step 6: Verify build and full test suite**

Run: `npm run build && npx vitest run`
Expected: Build succeeds; all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/public-site/nav.ts src/lib/public-site/nav.test.ts src/components/Header.tsx
git commit -m "feat: add education nav dropdown and remove backend links from header"
```

---

### Task 4: Decouple contact route from the CRM

Extract the quote-request processing into a testable, dependency-injected function so email (Resend) determines success and the CRM (`createLead`) write becomes best-effort. Rewire the route to call it.

**Files:**
- Create: `src/lib/contact/process-quote-request.ts`
- Create: `src/lib/contact/process-quote-request.test.ts`
- Modify: `src/app/api/quote-request/route.ts`

**Interfaces:**
- Consumes: `QuoteRequestPayload` type, `buildQuoteRequestEmail`, and `buildQuoteRequestLeadInput` from `src/lib/contact/quote-request` (all already exported); `LeadCreateInput` from `@/lib/admin/leads`; `createLead` from `@/lib/admin/queries` (best-effort only). Note: `QuoteRequestPayload` (a zod-inferred type) is the shape the route's `parsed.data` and the email/lead helpers all use — **not** the `QuoteRequest` type in `quote-email.ts`.
- Produces:
  ```typescript
  type ProcessResult = { ok: boolean; status: number; body: Record<string, unknown> };
  type ProcessDeps = {
    createLead: (input: LeadCreateInput) => Promise<{ ok: boolean; leadId?: string }>;
    sendEmail: (args: { subject: string; html: string; text: string; replyTo: string }) => Promise<{ ok: boolean }>;
    emailConfigured: boolean;
  };
  async function processQuoteRequest(request: QuoteRequestPayload, deps: ProcessDeps): Promise<ProcessResult>;
  ```

- [ ] **Step 1: Write the failing test**

Create `src/lib/contact/process-quote-request.test.ts`:

```typescript
import { describe, expect, it, vi } from "vitest";
import { processQuoteRequest, type ProcessDeps } from "./process-quote-request";
import type { QuoteRequestPayload } from "./quote-request";

const request: QuoteRequestPayload = {
  name: "Jordan Client",
  email: "jordan@example.com",
  phone: "(970) 555-0199",
  projectType: "Custom home",
  location: "Windsor, CO",
  budget: "$900k-$1.2M",
  timeline: "This year",
  message: "We want to discuss a SIPs custom home.",
  company: "",
};

function deps(overrides: Partial<ProcessDeps> = {}): ProcessDeps {
  return {
    createLead: vi.fn(async () => ({ ok: true, leadId: "lead_1" })),
    sendEmail: vi.fn(async () => ({ ok: true })),
    emailConfigured: true,
    ...overrides,
  };
}

describe("processQuoteRequest", () => {
  it("succeeds when the email sends", async () => {
    const result = await processQuoteRequest(request, deps());
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.body.emailSent).toBe(true);
  });

  it("still succeeds when the CRM write fails", async () => {
    const createLead = vi.fn(async () => ({ ok: false }));
    const result = await processQuoteRequest(request, deps({ createLead }));
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.body.emailSent).toBe(true);
  });

  it("still succeeds when the CRM write throws", async () => {
    const createLead = vi.fn(async () => {
      throw new Error("supabase unreachable");
    });
    const result = await processQuoteRequest(request, deps({ createLead }));
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
  });

  it("fails clearly when email is not configured", async () => {
    const result = await processQuoteRequest(request, deps({ emailConfigured: false }));
    expect(result.ok).toBe(false);
    expect(result.status).toBe(500);
    expect(result.body.code).toBe("email_not_configured");
  });

  it("fails when the email send fails", async () => {
    const sendEmail = vi.fn(async () => ({ ok: false }));
    const result = await processQuoteRequest(request, deps({ sendEmail }));
    expect(result.ok).toBe(false);
    expect(result.status).toBe(502);
    expect(result.body.code).toBe("email_send_failed");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/contact/process-quote-request.test.ts`
Expected: FAIL — cannot resolve `./process-quote-request`.

- [ ] **Step 3: Implement the function**

Create `src/lib/contact/process-quote-request.ts`:

```typescript
import type { LeadCreateInput } from "@/lib/admin/leads";
import { buildQuoteRequestEmail, buildQuoteRequestLeadInput, type QuoteRequestPayload } from "./quote-request";

export type ProcessResult = { ok: boolean; status: number; body: Record<string, unknown> };

export type ProcessDeps = {
  createLead: (input: LeadCreateInput) => Promise<{ ok: boolean; leadId?: string }>;
  sendEmail: (args: { subject: string; html: string; text: string; replyTo: string }) => Promise<{ ok: boolean }>;
  emailConfigured: boolean;
};

export async function processQuoteRequest(request: QuoteRequestPayload, deps: ProcessDeps): Promise<ProcessResult> {
  // Best-effort CRM write: never blocks or fails the request.
  let leadId: string | undefined;
  try {
    const leadResult = await deps.createLead(buildQuoteRequestLeadInput(request));
    if (leadResult.ok) {
      leadId = leadResult.leadId;
    } else {
      console.error("[quote-request] CRM lead write failed (non-blocking)");
    }
  } catch (error) {
    console.error("[quote-request] CRM lead write threw (non-blocking)", error);
  }

  if (!deps.emailConfigured) {
    return {
      ok: false,
      status: 500,
      body: {
        ok: false,
        error: "Contact delivery is not configured. Please call or email Kiefer Built directly.",
        code: "email_not_configured",
      },
    };
  }

  const email = buildQuoteRequestEmail(request);
  const sent = await deps.sendEmail({
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: request.email,
  });

  if (!sent.ok) {
    return {
      ok: false,
      status: 502,
      body: {
        ok: false,
        error: "Could not send your message. Please call or email Kiefer Built directly.",
        code: "email_send_failed",
      },
    };
  }

  return { ok: true, status: 200, body: { ok: true, emailSent: true, leadId } };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/contact/process-quote-request.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Rewire the route to use the function**

Replace the entire body of `src/app/api/quote-request/route.ts` with:

```typescript
import { NextResponse } from "next/server";
import { createLead } from "@/lib/admin/queries";
import { parseQuoteRequestPayload } from "@/lib/contact/quote-request";
import { processQuoteRequest } from "@/lib/contact/process-quote-request";

const resendEndpoint = "https://api.resend.com/emails";
const defaultRecipient = "info@kbuiltco.com";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseQuoteRequestPayload(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please complete the required fields.",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  // Honeypot: silently accept bot submissions.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO ?? defaultRecipient;

  const result = await processQuoteRequest(parsed.data, {
    createLead,
    emailConfigured: Boolean(apiKey && from),
    sendEmail: async ({ subject, html, text, replyTo }) => {
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, reply_to: replyTo, subject, html, text }),
      });
      return { ok: response.ok };
    },
  });

  return NextResponse.json(result.body, { status: result.status });
}
```

Note: `parsed.data` is a `QuoteRequestPayload`, exactly the type `processQuoteRequest` expects — pass it directly. The honeypot short-circuit above still runs before any email/CRM work, so spam protection is preserved.

- [ ] **Step 6: Verify build and full suite**

Run: `npm run build && npx vitest run`
Expected: Build succeeds; all tests pass. The Contact form (`src/components/Contact.tsx`) only checks `response.ok` and reads `error`/`code`, so it needs no change.

- [ ] **Step 7: Commit**

```bash
git add src/lib/contact/process-quote-request.ts src/lib/contact/process-quote-request.test.ts src/app/api/quote-request/route.ts
git commit -m "feat: make contact email the source of truth, CRM write best-effort"
```

---

### Task 5: Homepage teaser and public-surface audit

Add a teaser into the main funnel (a services card + a homepage section) linking to the education hub, then audit the public surface so no rendered link reaches the dormant backend.

**Files:**
- Modify: `src/lib/public-site/content.ts` (add one card to `publicPages.services.cards`)
- Modify: `src/app/page.tsx` (add a teaser section linking to `/why-kiefer-built`)
- Modify: `src/lib/public-site/education.test.ts` (extend with the services-teaser assertion)

**Interfaces:**
- Consumes: `publicPages.services` (Task 1 area), `/why-kiefer-built` routes (Task 2).
- Produces: a services card and homepage section linking to the hub.

- [ ] **Step 1: Extend the test (services teaser)**

Add this `it` block inside the existing `describe("why-kiefer-built education content", ...)` in `src/lib/public-site/education.test.ts`:

```typescript
  it("teases the education hub from the services page", () => {
    const cards = publicPages.services.cards ?? [];
    const teaser = cards.find((card) => card.href === "/why-kiefer-built");
    expect(teaser, "services page should link to the education hub").toBeDefined();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/public-site/education.test.ts`
Expected: FAIL — "services page should link to the education hub".

- [ ] **Step 3: Add the services teaser card**

In `src/lib/public-site/content.ts`, add this card to the `cards` array of the `services` entry (append as the last card):

```typescript
      {
        title: "Why Build With Kiefer Built",
        meta: "The difference",
        description:
          "SIPs construction, real energy efficiency, and family craftsmanship — see exactly why a Kiefer Built home is built better.",
        href: "/why-kiefer-built",
        image: "/images/project-2/exterior-wide-property.jpg",
      },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/public-site/education.test.ts`
Expected: PASS.

- [ ] **Step 5: Add the homepage teaser section**

In `src/app/page.tsx`, add a teaser section that links to the hub. Place it after the hero/intro area (find an existing top-level `</section>` in the main content and insert this block after it):

```tsx
        <section className="bg-[#f9f6f0] px-6 py-20 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9281c]">The difference</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#171717] md:text-5xl">
                Built better, from the envelope in.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#655c52]">
                SIPs construction, measurable energy efficiency, and family craftsmanship. See exactly why a Kiefer
                Built home outperforms a conventional build.
              </p>
            </div>
            <Link
              href="/why-kiefer-built"
              className="inline-flex items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
            >
              Why Kiefer Built
            </Link>
          </div>
        </section>
```

If `src/app/page.tsx` does not already import `Link`, add `import Link from "next/link";` to its imports.

- [ ] **Step 6: Audit the public surface for backend links**

Run this grep over the public surface (components + non-backend app routes):

```bash
grep -rnE '/admin|/portal|/vendor|/login|/auth|land-lead|Client Portal|Vendor Login|Sign In|Log In' \
  src/components/*.tsx src/components/public-site \
  src/app/page.tsx src/app/about src/app/services src/app/projects \
  src/app/process src/app/products src/app/careers src/app/contact \
  src/app/estimate src/app/testimonials src/app/blog src/app/why-kiefer-built \
  2>/dev/null
```

Expected: **no output.** If any line appears, remove or unlink that reference (the backend file itself stays; only the public link is removed). Re-run until clean.

- [ ] **Step 7: Verify build and full suite**

Run: `npm run build && npx vitest run`
Expected: Build succeeds; all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/public-site/content.ts src/lib/public-site/education.test.ts src/app/page.tsx
git commit -m "feat: add education teasers and verify no public backend links"
```

---

## Verification (whole plan)

- [ ] `npm run build` succeeds with all five `/why-kiefer-built` routes present.
- [ ] `npx vitest run` passes (education, nav, process-quote-request, plus existing suites).
- [ ] Manual: from the running site, every header dropdown and the homepage teaser reach real pages; nothing links to `/admin`, `/portal`, `/vendor`, `/auth`, or `/login`.
- [ ] Manual: submit the contact form with Resend env set → email arrives, visitor sees success; with the CRM write forced to fail, email still sends and success still shows.
- [ ] The audit grep in Task 5 Step 6 returns no output.
