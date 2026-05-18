import type { Client, Project } from "./types";

export interface JobListItem {
  id: string;
  href: string;
  name: string;
  clientName: string;
  location: string;
  status: Project["status"];
  currentPhase: string;
  progress: number;
}

export function buildJobListItems(projects: Project[], clients: Client[]): JobListItem[] {
  const clientsById = new Map(clients.map((client) => [client.id, client]));

  return projects.map((project) => ({
    id: project.id,
    href: `/admin/projects/${project.id}`,
    name: project.name,
    clientName: clientsById.get(project.clientId)?.name ?? "Unassigned client",
    location: project.location,
    status: project.status,
    currentPhase: project.currentPhase,
    progress: project.progress,
  }));
}

export function pickSelectedJob(jobs: JobListItem[]) {
  return jobs.find((job) => job.status === "active") ?? jobs[0] ?? null;
}
