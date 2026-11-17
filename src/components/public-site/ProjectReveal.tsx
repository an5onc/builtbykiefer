"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Server-rendered content stays visible; motion is only added on viewport entry. */
export default function ProjectReveal({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!enabled || !element || typeof IntersectionObserver === "undefined" || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const animation = entry.target.animate(
          [{ opacity: 0.45, transform: "translateY(28px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

    element.querySelectorAll("[data-project-reveal]").forEach((item) => observer.observe(item));
    const stop = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    // Keyboard users never have to wait for a moving target to settle.
    element.addEventListener("focusin", stop);
    preference.addEventListener("change", stop);
    return () => {
      stop();
      element.removeEventListener("focusin", stop);
      preference.removeEventListener("change", stop);
    };
  }, [enabled]);

  return <div ref={root} className="mx-auto max-w-7xl">{children}</div>;
}
