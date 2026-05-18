"use client";

import { usePathname } from "next/navigation";
import { getFloatingActionForPathname } from "@/lib/floating-actions";
import FloatingCTA from "./FloatingCTA";
import ProjectUpdateNotification from "./ProjectUpdateNotification";

export default function GlobalFloatingAction() {
  const pathname = usePathname();
  const action = getFloatingActionForPathname(pathname);

  if (action === "quote") {
    return <FloatingCTA />;
  }

  if (action === "updates") {
    return <ProjectUpdateNotification />;
  }

  return null;
}
