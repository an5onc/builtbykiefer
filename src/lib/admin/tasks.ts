import type { ProjectTaskPriority, ProjectTaskStatus } from "./types";

export interface ProjectTaskCreateInput {
  title: string;
  assignedWorkerId: string | null;
  dueDate: string;
  priority: ProjectTaskPriority;
  notes: string;
}

export type ProjectTaskCreateParseResult =
  | { ok: true; data: ProjectTaskCreateInput }
  | { ok: false; reason: string };

export const taskStatusOptions: { value: ProjectTaskStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const taskPriorityOptions: { value: ProjectTaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const priorityValues = new Set<ProjectTaskPriority>(
  taskPriorityOptions.map((option) => option.value),
);

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export function parseProjectTaskCreateFormData(
  formData: FormData,
): ProjectTaskCreateParseResult {
  const title = getTrimmedValue(formData, "title");
  const assignedWorkerId = getTrimmedValue(formData, "assignedWorkerId");
  const dueDate = getTrimmedValue(formData, "dueDate");
  const priority = getTrimmedValue(formData, "priority");
  const notes = getTrimmedValue(formData, "notes");

  if (!title) {
    return { ok: false, reason: "Task title is required." };
  }

  if (!dueDate || !isIsoDate(dueDate)) {
    return { ok: false, reason: "Use a valid task due date." };
  }

  if (!priorityValues.has(priority as ProjectTaskPriority)) {
    return { ok: false, reason: "Choose a valid task priority." };
  }

  return {
    ok: true,
    data: {
      title,
      assignedWorkerId: assignedWorkerId || null,
      dueDate,
      priority: priority as ProjectTaskPriority,
      notes,
    },
  };
}
