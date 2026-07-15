import { BeforeAfterSlider } from "builtbykiefer-tmp";

// Draggable before/after comparison. Demonstrates the slider handle at its
// default 50% split with two real images.
export function KitchenRemodel() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <BeforeAfterSlider
        beforeImage="https://picsum.photos/seed/kiefer-kitchen-before/1200/800"
        afterImage="https://picsum.photos/seed/kiefer-kitchen-after/1200/800"
        beforeAlt="Dated kitchen with laminate counters before the remodel"
        afterAlt="Modern kitchen with quartz counters after the remodel"
      />
    </div>
  );
}
