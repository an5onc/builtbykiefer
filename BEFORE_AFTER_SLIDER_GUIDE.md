# Before/After Image Slider Component

A professional, interactive before/after image comparison slider built for showcasing construction project transformations. Perfect for displaying kitchen remodels, home renovations, exterior makeovers, and any construction project that shows dramatic improvements.

## Features

- **Smooth Drag Interaction**: Intuitive slider with draggable handle
- **Mobile Touch Support**: Full touch event support for mobile devices
- **Responsive Design**: Works flawlessly across all screen sizes
- **Professional Styling**: Construction industry-appropriate design with custom color palette
- **Accessibility**: Proper alt text support and semantic HTML
- **Performance Optimized**: Uses Next.js Image component for optimal loading
- **Visual Labels**: Clear "Before" and "After" badges
- **Interactive Hint**: Animated "Drag to compare" instruction that appears on initial load

## Component Location

```
/src/components/BeforeAfterSlider.tsx
```

## Basic Usage

### 1. Import the Component

```tsx
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
```

### 2. Add to Your Project Page

```tsx
export default function YourProjectPage() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2>Kitchen Transformation</h2>

        <BeforeAfterSlider
          beforeImage="/images/your-project/kitchen-before.jpg"
          afterImage="/images/your-project/kitchen-after.jpg"
          beforeAlt="Kitchen before renovation with outdated cabinets"
          afterAlt="Kitchen after renovation with modern cabinetry and quartz countertops"
        />

        <p>Complete kitchen remodel with custom cabinetry...</p>
      </div>
    </section>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `beforeImage` | string | Yes | Path to the "before" image (relative to /public) |
| `afterImage` | string | Yes | Path to the "after" image (relative to /public) |
| `beforeAlt` | string | Yes | Accessible alt text describing the before state |
| `afterAlt` | string | Yes | Accessible alt text describing the after state |
| `className` | string | No | Additional CSS classes to apply to the container |

## Examples

### Single Full-Width Slider

```tsx
<BeforeAfterSlider
  beforeImage="/images/project-1/exterior-before.jpg"
  afterImage="/images/project-1/exterior-after.jpg"
  beforeAlt="Home exterior before siding replacement"
  afterAlt="Home exterior after new siding and stone accents"
/>
```

### Grid Layout (Two Sliders Side-by-Side)

```tsx
<div className="grid md:grid-cols-2 gap-8">
  <BeforeAfterSlider
    beforeImage="/images/project-1/kitchen-before.jpg"
    afterImage="/images/project-1/kitchen-after.jpg"
    beforeAlt="Kitchen before remodel"
    afterAlt="Kitchen after complete renovation"
  />

  <BeforeAfterSlider
    beforeImage="/images/project-1/bathroom-before.jpg"
    afterImage="/images/project-1/bathroom-after.jpg"
    beforeAlt="Bathroom before renovation"
    afterAlt="Bathroom after luxury upgrade"
  />
</div>
```

### With Custom Styling

```tsx
<BeforeAfterSlider
  beforeImage="/images/project-1/before.jpg"
  afterImage="/images/project-1/after.jpg"
  beforeAlt="Before renovation"
  afterAlt="After renovation"
  className="max-w-4xl mx-auto shadow-2xl"
/>
```

## Complete Integration Example

See the full working example with multiple sliders and captions:

```
/src/components/BeforeAfterExample.tsx
```

To add this example to any page:

```tsx
import BeforeAfterExample from "@/components/BeforeAfterExample";

export default function ProjectPage() {
  return (
    <div>
      {/* Your other content */}

      <BeforeAfterExample />

      {/* More content */}
    </div>
  );
}
```

## Best Practices

### Image Preparation

1. **Same Aspect Ratio**: Ensure both before and after images have the same aspect ratio (default is 4:3)
2. **Same Dimensions**: Use images with identical dimensions for perfect alignment
3. **Consistent Framing**: Take photos from the same angle and distance
4. **Good Lighting**: Use well-lit, high-quality images that clearly show the transformation
5. **File Size**: Optimize images (recommended: 1200-2000px width, compressed to 100-300KB)

### Accessibility

Always provide descriptive alt text:

```tsx
// Good
beforeAlt="Outdated kitchen with laminate countertops and oak cabinets from 1990s"
afterAlt="Modern kitchen with white quartz countertops and two-tone cabinetry"

// Bad
beforeAlt="Before"
afterAlt="After"
```

### Content Structure

Add context around your sliders:

```tsx
<section className="py-20">
  <div className="max-w-6xl mx-auto px-4">
    {/* Header */}
    <h2>Kitchen Transformation</h2>
    <p>Complete gut renovation including new cabinets, countertops, and appliances.</p>

    {/* Slider */}
    <BeforeAfterSlider
      beforeImage="/images/kitchen-before.jpg"
      afterImage="/images/kitchen-after.jpg"
      beforeAlt="..."
      afterAlt="..."
    />

    {/* Details */}
    <div className="mt-6">
      <h3>Project Highlights</h3>
      <ul>
        <li>Custom two-tone cabinetry</li>
        <li>Quartz countertops and backsplash</li>
        <li>New stainless appliances</li>
      </ul>
    </div>
  </div>
</section>
```

## Customization

### Adjust Aspect Ratio

The default aspect ratio is 4:3. To change it, edit the className:

```tsx
// 16:9 aspect ratio
<BeforeAfterSlider
  // ... props
  className="aspect-video"
/>

// Square aspect ratio
<BeforeAfterSlider
  // ... props
  className="aspect-square"
/>

// Custom aspect ratio
<BeforeAfterSlider
  // ... props
  className="aspect-[21/9]"
/>
```

### Customize Colors

The component uses the project's custom color palette:

- **Before Label**: `charcoal-800` background (dark gray)
- **After Label**: `walnut-600` background (warm brown)
- **Slider Handle**: White with shadow
- **Border**: `stone-300` (light gray)

To customize, edit `/src/components/BeforeAfterSlider.tsx` and update the color variables.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Performance

- Uses Next.js `Image` component for automatic optimization
- Images are lazy-loaded with priority flag for above-fold sliders
- Smooth 75ms transition on slider position updates
- Minimal bundle size impact (~2KB gzipped)

## Troubleshooting

### Images Don't Align

- Ensure both images have identical dimensions
- Verify both images have the same aspect ratio
- Check that images are properly placed in `/public/images/`

### Slider Doesn't Drag Smoothly

- This can occur on very large images (>3000px width)
- Optimize images to 1200-2000px width
- Ensure browser is not throttling due to performance issues

### Mobile Touch Not Working

- Verify you're not preventing default touch behavior elsewhere in the page
- Check that no parent element has `touch-action: none`
- Test in a real mobile device (not just browser dev tools)

## Support

For questions or issues:
- Check the example component: `/src/components/BeforeAfterExample.tsx`
- Review this documentation
- Test with the provided demo images first

---

**Built for Kiefer Built Contracting** - Showcasing quality construction transformations across Northern Colorado.
