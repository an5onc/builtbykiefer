import type { Lead, Project, ProjectTask } from "./types";

export type ScheduleEventKind = "task" | "lead" | "project";
export type ScheduleEventBucket = "overdue" | "today" | "this-week" | "upcoming";

export interface ScheduleEvent {
  id: string;
  kind: ScheduleEventKind;
  title: string;
  subtitle: string;
  date: string;
  href: string;
  status: string;
  bucket: ScheduleEventBucket;
}

export interface BuildScheduleEventsInput {
  tasks: ProjectTask[];
  leads: Lead[];
  projects: Project[];
  today?: string;
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

export function getWeekRange(today = toIsoDate(new Date())) {
  return {
    start: today,
    end: addDays(today, 6),
  };
}

function getBucket(date: string, today: string): ScheduleEventBucket {
  const { end } = getWeekRange(today);

  if (date < today) {
    return "overdue";
  }

  if (date === today) {
    return "today";
  }

  if (date <= end) {
    return "this-week";
  }

  return "upcoming";
}

export function buildScheduleEvents({
  leads,
  projects,
  tasks,
  today = toIsoDate(new Date()),
}: BuildScheduleEventsInput): ScheduleEvent[] {
  const events: ScheduleEvent[] = [
    ...tasks
      .filter((task) => task.status !== "done")
      .map((task) => ({
        id: `task-${task.id}`,
        kind: "task" as const,
        title: task.title,
        subtitle: task.notes || "Project task",
        date: task.dueDate,
        href: `/admin/projects/${task.projectId}`,
        status: task.priority,
        bucket: getBucket(task.dueDate, today),
      })),
    ...leads
      .filter((lead) => lead.status !== "won" && lead.status !== "lost" && lead.nextFollowUp)
      .map((lead) => ({
        id: `lead-follow-up-${lead.id}`,
        kind: "lead" as const,
        title: `Follow up with ${lead.name}`,
        subtitle: `${lead.projectType} · ${lead.budgetRange}`,
        date: lead.nextFollowUp,
        href: `/admin/leads/${lead.id}`,
        status: lead.status,
        bucket: getBucket(lead.nextFollowUp, today),
      })),
    ...projects.flatMap((project) => [
      {
        id: `project-start-${project.id}`,
        kind: "project" as const,
        title: `${project.name} starts`,
        subtitle: `${project.location} · ${project.currentPhase}`,
        date: project.startDate,
        href: `/admin/projects/${project.id}`,
        status: project.status,
        bucket: getBucket(project.startDate, today),
      },
      {
        id: `project-completion-${project.id}`,
        kind: "project" as const,
        title: `${project.name} target completion`,
        subtitle: `${project.location} · ${project.currentPhase}`,
        date: project.estimatedCompletion,
        href: `/admin/projects/${project.id}`,
        status: project.status,
        bucket: getBucket(project.estimatedCompletion, today),
      },
    ]),
  ];

  return events.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}
