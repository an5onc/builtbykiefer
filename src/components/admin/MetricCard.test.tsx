import { describe, expect, it } from "vitest";
import { FolderKanban } from "lucide-react";
import MetricCard from "./MetricCard";

describe("MetricCard", () => {
  it("renders as a full-card link when an href is provided", () => {
    const card = MetricCard({
      label: "Active Projects",
      value: "2",
      detail: "Demo construction workload",
      icon: FolderKanban,
      href: "/admin/projects",
    });

    expect(card.type).toBeTruthy();
    expect(card.props.href).toBe("/admin/projects");
    expect(card.props["aria-label"]).toBe("View Active Projects");
  });
});
