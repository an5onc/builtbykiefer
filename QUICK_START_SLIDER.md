# Before/After Slider - Quick Start

## 30-Second Setup

### 1. Add Images
Place your images in `/public/images/`:
```
/public/images/project-name/kitchen-before.jpg
/public/images/project-name/kitchen-after.jpg
```

### 2. Import Component
```tsx
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
```

### 3. Use It
```tsx
<BeforeAfterSlider
  beforeImage="/images/project-name/kitchen-before.jpg"
  afterImage="/images/project-name/kitchen-after.jpg"
  beforeAlt="Kitchen before renovation"
  afterAlt="Kitchen after renovation"
/>
```

## That's It!

The slider now works with:
- Smooth drag interaction
- Mobile touch support
- Responsive design
- Professional styling

## View Demo
```bash
npm run dev
```
Then visit: `http://localhost:3000/demo-slider`

## Full Documentation
- Complete guide: `/BEFORE_AFTER_SLIDER_GUIDE.md`
- Implementation summary: `/SLIDER_IMPLEMENTATION_SUMMARY.md`
- Example component: `/src/components/BeforeAfterExample.tsx`

## Common Use Cases

### Full Width Hero
```tsx
<BeforeAfterSlider
  beforeImage="/images/project-1/exterior-before.jpg"
  afterImage="/images/project-1/exterior-after.jpg"
  beforeAlt="Home exterior before renovation"
  afterAlt="Home exterior after complete makeover"
/>
```

### Two Sliders Side-by-Side
```tsx
<div className="grid md:grid-cols-2 gap-8">
  <BeforeAfterSlider
    beforeImage="/images/kitchen-before.jpg"
    afterImage="/images/kitchen-after.jpg"
    beforeAlt="Kitchen before"
    afterAlt="Kitchen after"
  />

  <BeforeAfterSlider
    beforeImage="/images/bathroom-before.jpg"
    afterImage="/images/bathroom-after.jpg"
    beforeAlt="Bathroom before"
    afterAlt="Bathroom after"
  />
</div>
```

### With Section Header
```tsx
<section className="py-20">
  <div className="max-w-6xl mx-auto px-4">
    <h2>Kitchen Transformation</h2>
    <p>Complete renovation with premium finishes</p>

    <BeforeAfterSlider
      beforeImage="/images/kitchen-before.jpg"
      afterImage="/images/kitchen-after.jpg"
      beforeAlt="Outdated kitchen with laminate counters"
      afterAlt="Modern kitchen with quartz countertops"
    />

    <div className="mt-6">
      <h3>Project Highlights</h3>
      <ul>
        <li>Custom two-tone cabinetry</li>
        <li>Quartz countertops</li>
        <li>Stainless appliances</li>
      </ul>
    </div>
  </div>
</section>
```

## Image Tips

1. **Same size** - Both images must have identical dimensions
2. **Same angle** - Take photos from the same position
3. **Good lighting** - Well-lit, high-quality images
4. **Optimize** - Compress to 100-300KB
5. **Recommended size** - 1200-2000px width

## Troubleshooting

**Images don't align?**
- Check both images have identical dimensions
- Verify same aspect ratio (e.g., both 4:3)

**Slider not smooth?**
- Optimize images (reduce file size)
- Ensure images are under 500KB each

**Not working on mobile?**
- Test on real device, not just browser dev tools
- Ensure no parent elements block touch events

## File Locations

Created files:
- `/src/components/BeforeAfterSlider.tsx` - Main component
- `/src/components/BeforeAfterExample.tsx` - Complete example
- `/src/app/demo-slider/page.tsx` - Demo page
- `/src/types/slider.ts` - TypeScript types
- `/BEFORE_AFTER_SLIDER_GUIDE.md` - Full documentation
- `/SLIDER_IMPLEMENTATION_SUMMARY.md` - Implementation details

---

**Need help?** Check the full guide at `/BEFORE_AFTER_SLIDER_GUIDE.md`
