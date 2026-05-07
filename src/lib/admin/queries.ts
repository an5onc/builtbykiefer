import { clients, invoices, leads, projectFiles, projects, timeEntries, workers } from "./demo-data";
import { invoiceTotal, timeEntryHours } from "./formatters";

export function getDashboardMetrics() {
  const weeklyHours = timeEntries.reduce((sum, entry) => sum + timeEntryHours(entry.clockIn, entry.clockOut), 0);
  const draftInvoiceTotal = invoices
    .filter((invoice) => invoice.status === "draft")
    .reduce((sum, invoice) => sum + invoiceTotal(invoice.lineItems), 0);

  return {
    activeProjects: projects.filter((project) => project.status === "active").length,
    recentUploads: projectFiles.length,
    weeklyHours,
    draftInvoiceTotal,
    openLeads: leads.filter((lead) => lead.status !== "won" && lead.status !== "lost").length,
  };
}

export function getLeads() {
  return leads;
}

export function getProjects() {
  return projects;
}

export function getProject(projectId: string) {
  return projects.find((project) => project.id === projectId) ?? null;
}

export function getProjectFiles(projectId: string) {
  return projectFiles.filter((file) => file.projectId === projectId);
}

export function getProjectTimeEntries(projectId: string) {
  return timeEntries.filter((entry) => entry.projectId === projectId);
}

export function getProjectInvoices(projectId: string) {
  return invoices.filter((invoice) => invoice.projectId === projectId);
}

export function getWorkers() {
  return workers;
}

export function getTimeEntries() {
  return timeEntries;
}

export function getInvoices() {
  return invoices;
}

export function getInvoice(invoiceId: string) {
  return invoices.find((invoice) => invoice.id === invoiceId) ?? null;
}

export function getClient(clientId: string) {
  return clients.find((client) => client.id === clientId) ?? null;
}

export function getWorker(workerId: string) {
  return workers.find((worker) => worker.id === workerId) ?? null;
}
