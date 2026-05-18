import { describe, expect, it } from "vitest";
import { buildJobListItems, pickSelectedJob } from "./command-center";
import type { Client, Project } from "./types";

const projects: Project[] = [
  {
    id: "project-1",
    clientId: "client-1",
    name: "550 Agfinity Repair Brighton",
    location: "Brighton, CO",
    type: "Repair",
    status: "active",
    currentPhase: "Rough-in",
    progress: 42,
    budgetRange: "$120k-$180k",
    startDate: "2026-04-01",
    estimatedCompletion: "2026-07-01",
    notes: "Repair job.",
    heroImage: "/job.jpg",
    phases: [],
  },
  {
    id: "project-2",
    clientId: "client-2",
    name: "1219-Venn",
    location: "Windsor, CO",
    type: "Custom Home",
    status: "planning",
    currentPhase: "Preconstruction",
    progress: 12,
    budgetRange: "$900k-$1.2M",
    startDate: "2026-05-01",
    estimatedCompletion: "2026-11-01",
    notes: "Planning job.",
    heroImage: "/job-2.jpg",
    phases: [],
  },
];

const clients: Client[] = [
  { id: "client-1", name: "Agfinity", email: "agfinity@example.com", phone: "555-0101" },
  { id: "client-2", name: "Venn Family", email: "venn@example.com", phone: "555-0102" },
];

describe("command center helpers", () => {
  it("builds job list rows from projects and clients", () => {
    expect(buildJobListItems(projects, clients)).toEqual([
      {
        id: "project-1",
        href: "/admin/projects/project-1",
        name: "550 Agfinity Repair Brighton",
        clientName: "Agfinity",
        location: "Brighton, CO",
        status: "active",
        currentPhase: "Rough-in",
        progress: 42,
      },
      {
        id: "project-2",
        href: "/admin/projects/project-2",
        name: "1219-Venn",
        clientName: "Venn Family",
        location: "Windsor, CO",
        status: "planning",
        currentPhase: "Preconstruction",
        progress: 12,
      },
    ]);
  });

  it("selects the first active job before planning work", () => {
    const rows = buildJobListItems([projects[1], projects[0]], clients);
    expect(pickSelectedJob(rows)?.id).toBe("project-1");
  });
});
