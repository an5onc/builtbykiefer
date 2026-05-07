import {
  clients as demoClients,
  invoices as demoInvoices,
  leads as demoLeads,
  projectFiles as demoProjectFiles,
  projects as demoProjects,
  timeEntries as demoTimeEntries,
  workers as demoWorkers,
} from "./demo-data";
import { invoiceTotal, timeEntryHours } from "./formatters";
import {
  mapClientRow,
  mapInvoiceRow,
  mapLeadRow,
  mapProjectFileRow,
  mapProjectRow,
  mapTimeEntryRow,
  mapWorkerRow,
} from "./supabase-mappers";
import { getPublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

async function getSupabaseClientOrNull() {
  const env = getPublicEnv();

  if (env.demoMode || !env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createClient();
}

function logSupabaseFallback(scope: string, error: unknown) {
  console.error(`[admin:${scope}] Falling back to demo data`, error);
}

export async function getDashboardMetrics() {
  const [projects, projectFiles, timeEntries, invoices, leads] = await Promise.all([
    getProjects(),
    getAllProjectFiles(),
    getTimeEntries(),
    getInvoices(),
    getLeads(),
  ]);
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

export async function getClients() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoClients;
  }

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, phone")
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("clients", error);
    return demoClients;
  }

  return (data ?? []).map(mapClientRow);
}

export async function getLeads() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoLeads;
  }

  const { data, error } = await supabase
    .from("leads")
    .select("id, name, email, phone, project_type, budget_range, status, next_follow_up, notes")
    .order("next_follow_up", { ascending: true });

  if (error) {
    logSupabaseFallback("leads", error);
    return demoLeads;
  }

  return (data ?? []).map(mapLeadRow);
}

export async function getProjects() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjects;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      client_id,
      name,
      location,
      type,
      status,
      current_phase,
      progress,
      budget_range,
      start_date,
      estimated_completion,
      notes,
      hero_image,
      project_phases (
        id,
        title,
        description,
        status,
        date_label,
        sort_order
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("projects", error);
    return demoProjects;
  }

  return (data ?? []).map(mapProjectRow);
}

export async function getProject(projectId: string) {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjects.find((project) => project.id === projectId) ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      client_id,
      name,
      location,
      type,
      status,
      current_phase,
      progress,
      budget_range,
      start_date,
      estimated_completion,
      notes,
      hero_image,
      project_phases (
        id,
        title,
        description,
        status,
        date_label,
        sort_order
      )
    `)
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    logSupabaseFallback("project", error);
    return demoProjects.find((project) => project.id === projectId) ?? null;
  }

  return data ? mapProjectRow(data) : null;
}

async function getAllProjectFiles() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectFiles;
  }

  const { data, error } = await supabase
    .from("project_files")
    .select("id, project_id, name, file_type, visibility, uploaded_at, size_label")
    .order("uploaded_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-files", error);
    return demoProjectFiles;
  }

  return (data ?? []).map(mapProjectFileRow);
}

export async function getProjectFiles(projectId: string) {
  const files = await getAllProjectFiles();
  return files.filter((file) => file.projectId === projectId);
}

export async function getProjectTimeEntries(projectId: string) {
  const entries = await getTimeEntries();
  return entries.filter((entry) => entry.projectId === projectId);
}

export async function getProjectInvoices(projectId: string) {
  const invoices = await getInvoices();
  return invoices.filter((invoice) => invoice.projectId === projectId);
}

export async function getWorkers() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoWorkers;
  }

  const { data, error } = await supabase
    .from("workers")
    .select("id, name, role, is_active")
    .order("name", { ascending: true });

  if (error) {
    logSupabaseFallback("workers", error);
    return demoWorkers;
  }

  return (data ?? []).map(mapWorkerRow);
}

export async function getTimeEntries() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoTimeEntries;
  }

  const { data, error } = await supabase
    .from("time_entries")
    .select("id, worker_id, project_id, clock_in, clock_out, notes")
    .order("clock_in", { ascending: false });

  if (error) {
    logSupabaseFallback("time-entries", error);
    return demoTimeEntries;
  }

  return (data ?? []).map(mapTimeEntryRow);
}

export async function getInvoices() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoInvoices;
  }

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      project_id,
      client_id,
      status,
      issue_date,
      due_date,
      notes,
      invoice_line_items (
        id,
        description,
        quantity,
        unit_price,
        sort_order
      )
    `)
    .order("issue_date", { ascending: false });

  if (error) {
    logSupabaseFallback("invoices", error);
    return demoInvoices;
  }

  return (data ?? []).map(mapInvoiceRow);
}

export async function getInvoice(invoiceId: string) {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoInvoices.find((invoice) => invoice.id === invoiceId) ?? null;
  }

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      project_id,
      client_id,
      status,
      issue_date,
      due_date,
      notes,
      invoice_line_items (
        id,
        description,
        quantity,
        unit_price,
        sort_order
      )
    `)
    .eq("id", invoiceId)
    .maybeSingle();

  if (error) {
    logSupabaseFallback("invoice", error);
    return demoInvoices.find((invoice) => invoice.id === invoiceId) ?? null;
  }

  return data ? mapInvoiceRow(data) : null;
}

export async function getClient(clientId: string) {
  const clients = await getClients();
  return clients.find((client) => client.id === clientId) ?? null;
}

export async function getWorker(workerId: string) {
  const workers = await getWorkers();
  return workers.find((worker) => worker.id === workerId) ?? null;
}
