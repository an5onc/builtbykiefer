import { describe, expect, it } from "vitest";
import { buildScheduleEvents, getWeekRange } from "./schedule";
import type { Lead, Project, ProjectTask } from "./types";

const task: ProjectTask = {
  id: "task-1",
  projectId: "project-1",
  assignedWorkerId: "worker-1",
  title: "Order windows",
  notes: "Confirm lead time before framing inspection.",
  status: "open",
  priority: "high",
  dueDate: "2026-05-15",
  createdAt: "2026-05-13T12:00:00Z",
  completedAt: null,
};

const lead: Lead = {
  id: "lead-1",
  name: "Avery Thompson",
  email: "avery@example.com",
  phone: "970-555-0181",
  projectType: "Custom Home",
  budgetRange: "$900k-$1.2M",
  status: "qualified",
  nextFollowUp: "2026-05-14",
  notes: "Send revised concept range.",
};

const project: Project = {
  id: "project-1",
  clientId: "client-1",
  name: "Highland Ridge Custom Home",
  location: "Windsor, CO",
  type: "Custom Home",
  status: "active",
  currentPhase: "Interior rough-in",
  progress: 58,
  budgetRange: "$1.1M-$1.4M",
  startDate: "2026-05-13",
  estimatedCompletion: "2026-05-20",
  notes: "Demo project.",
  heroImage: "/projects/highland-ridge.jpg",
  phases: [],
};

describe("admin schedule", () => {
  it("builds date-sorted schedule events from tasks, leads, and projects", () => {
    expect(
      buildScheduleEvents({
        leads: [lead],
        projects: [project],
        tasks: [task],
      }).map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        href: event.href,
        kind: event.kind,
      })),
    ).toEqual([
      {
        id: "project-start-project-1",
        title: "Highland Ridge Custom Home starts",
        date: "2026-05-13",
        href: "/admin/projects/project-1",
        kind: "project",
      },
      {
        id: "lead-follow-up-lead-1",
        title: "Follow up with Avery Thompson",
        date: "2026-05-14",
        href: "/admin/leads/lead-1",
        kind: "lead",
      },
      {
        id: "task-task-1",
        title: "Order windows",
        date: "2026-05-15",
        href: "/admin/projects/project-1",
        kind: "task",
      },
      {
        id: "project-completion-project-1",
        title: "Highland Ridge Custom Home target completion",
        date: "2026-05-20",
        href: "/admin/projects/project-1",
        kind: "project",
      },
    ]);
  });

  it("classifies today separately from the rest of this week", () => {
    const events = buildScheduleEvents({
      leads: [lead],
      projects: [project],
      tasks: [task],
      today: "2026-05-13",
    });

    expect(events.filter((event) => event.bucket === "today").map((event) => event.id)).toEqual([
      "project-start-project-1",
    ]);
    expect(events.filter((event) => event.bucket === "this-week").map((event) => event.id)).toEqual([
      "lead-follow-up-lead-1",
      "task-task-1",
    ]);
  });

  it("returns a seven-day agenda range including the anchor date", () => {
    expect(getWeekRange("2026-05-13")).toEqual({
      start: "2026-05-13",
      end: "2026-05-19",
    });
  });
});
