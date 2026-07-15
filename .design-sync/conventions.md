# Built by Kiefer — public-site component library

React section components for a custom-home builder's marketing site (Windsor /
Northern Colorado). Warm, editorial, construction-craft aesthetic. Components
are **full-width page sections** (`Hero`, `About`, `Process`, `Testimonials`,
`Footer`, …), composed top-to-bottom into a page — not small primitives.

## Setup

No provider or theme wrapper is required. Render a component directly and link
the stylesheet:

```jsx
import { Hero, Process, Testimonials, Footer } from "<pkg>";

<div>
  <Hero />
  <Process />
  <Testimonials />
  <Footer />
</div>
```

Link **`styles.css`** once — it `@import`s the tokens, the Tailwind utility
layer, and the component styles (`_ds_bundle.css`). Fonts (Geist / Geist Mono)
load via a remote `@import` inside it. Most components take **no props**; the
exceptions are noted in each `<Name>.d.ts` (e.g. `BeforeAfterSlider` takes
`beforeImage`/`afterImage`, `RanchGallery` takes a `photos[]` array).

## Styling idiom — Tailwind v4 utilities with a custom brand palette

Style your own layout glue with Tailwind utility classes. Four brand color
families are available across every shade `50–900` and every property prefix
(`bg-`, `text-`, `border-`, `ring-`, `from-`/`via-`/`to-`):

| Family | Role | Examples |
|---|---|---|
| `sand` | warm neutral backgrounds / light surfaces | `bg-sand-50`, `bg-sand-100`, `text-sand-200` |
| `charcoal` | near-black text, dark sections | `bg-charcoal-900`, `text-charcoal-800`, `text-charcoal-400` |
| `walnut` | primary warm accent (wood tone) | `bg-walnut-500`, `bg-walnut-600`, `border-walnut-500`, `text-walnut-400` |
| `forest` | secondary accent (evergreen) | `bg-forest-500`, `text-forest-700` |

Brand **action red** is `#b92516` (hover `#951e13`); near-black is `#171717`.
Use them as arbitrary values: `bg-[#b92516] hover:bg-[#951e13] text-white`.
Body font is `font-sans` (Geist). Standard Tailwind spacing/layout utilities
(`grid`, `flex`, `gap-*`, `py-*`, `max-w-*`, `rounded-*`) all work.

Prefer the brand families over raw Tailwind colors (`blue-500`, `gray-*`) so
new sections match the shipped components.

## Where the truth lives

- **`styles.css`** — the one stylesheet to link; follow its `@import`s
  (`_ds_bundle.css` holds compiled component styles, plus the token + Tailwind
  layers) to see the full class vocabulary.
- **`components/general/<Name>/<Name>.d.ts`** — the prop contract.
- **`components/general/<Name>/<Name>.prompt.md`** — per-component usage.

## Idiomatic snippet

```jsx
import { Hero, Process } from "<pkg>";

function LandingPage() {
  return (
    <main className="bg-sand-50 text-charcoal-900 font-sans">
      <Hero />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-charcoal-900">Why build with us</h2>
        <p className="mt-3 text-charcoal-600">Craftsmanship across Northern Colorado.</p>
        <a href="/contact"
           className="mt-6 inline-block rounded-md bg-[#b92516] px-6 py-3 font-bold uppercase tracking-wide text-white hover:bg-[#951e13]">
          Get a free quote
        </a>
      </section>
      <Process />
    </main>
  );
}
```

Note: section components embed their own marketing photography via host-served
`/images/*` paths — supply your own imagery when composing new layouts.
