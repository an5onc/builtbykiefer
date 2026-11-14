"use client";

import { useEffect, type ComponentProps } from "react";
import Lightbox from "yet-another-react-lightbox";

export default function ProjectLightbox(props: ComponentProps<typeof Lightbox>) {
  const { open, close } = props;
  useEffect(() => {
    if (!open) return;
    // The library makes the background inert. Explicit keyboard containment
    // also covers browsers that skip buttons in their default Tab order.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close?.();
      } else if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>(".yarl__root");
        if (!dialog) return;
        const targets = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]'))
          .filter((element) => element.getClientRects().length > 0 && !element.closest("[inert]"));
        if (!targets.length) return;
        const index = targets.indexOf(document.activeElement as HTMLElement);
        const next = index < 0 ? (event.shiftKey ? targets.length - 1 : 0) : (index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length;
        event.preventDefault();
        targets[next].focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, close]);
  return <Lightbox {...props} />;
}
