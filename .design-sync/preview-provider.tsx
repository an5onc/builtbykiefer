import * as React from "react";

// Isolated preview cards never scroll, so framer-motion `whileInView` /
// `useInView` sections (used across most of these page components) would stay
// at their `initial={{opacity:0}}` state and render blank. Patch
// IntersectionObserver to immediately report every observed element as fully
// visible, so reveal animations settle to their final state on mount. This
// runs at module load (the bundle loads before any preview mounts).
if (typeof window !== "undefined" && !(window as { __dsIoPatched?: boolean }).__dsIoPatched) {
  (window as { __dsIoPatched?: boolean }).__dsIoPatched = true;

  class ImmediateIntersectionObserver {
    private cb: IntersectionObserverCallback;
    root = null;
    rootMargin = "0px";
    thresholds = [0];
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
    }
    observe(el: Element) {
      const entry = {
        isIntersecting: true,
        intersectionRatio: 1,
        target: el,
        boundingClientRect: el.getBoundingClientRect(),
        intersectionRect: el.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
      } as IntersectionObserverEntry;
      this.cb([entry], this as unknown as IntersectionObserver);
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
    ImmediateIntersectionObserver;
}

export function DsPreviewProvider({ children }: { children?: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
