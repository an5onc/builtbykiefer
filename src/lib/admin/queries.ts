import {
  changeOrders as demoChangeOrders,
  clients as demoClients,
  invoices as demoInvoices,
  leads as demoLeads,
  proposals as demoProposals,
  projectFiles as demoProjectFiles,
  projectUpdates as demoProjectUpdates,
  projects as demoProjects,
  timeEntries as demoTimeEntries,
  workers as demoWorkers,
} from "./demo-data";
import { changeOrderTotal, invoiceTotal, timeEntryHours } from "./formatters";
import type { ChangeOrderCreateInput } from "./change-orders";
import type { LeadCreateInput, LeadUpdateInput } from "./leads";
import type { ProjectFileCreateInput } from "./project-files";
import type { ProjectUpdateCreateInput } from "./project-updates";
import type { ProposalCreateInput } from "./proposals";
import {
  mapClientRow,
  mapChangeOrderRow,
  mapInvoiceRow,
  mapLeadRow,
  mapProposalRow,
  mapProjectFileRow,
  mapProjectRow,
  mapProjectUpdateRow,
  mapTimeEntryRow,
  mapWorkerRow,
} from "./supabase-mappers";
import { getPublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type UpdateResult = { ok: true } | { ok: false; reason: string };
type CreateLeadResult = { ok: true; leadId: string } | { ok: false; reason: string };
type CreateProposalResult = { ok: true; proposalId: string } | { ok: false; reason: string };
type CreateChangeOrderResult = { ok: true; changeOrderId: string } | { ok: false; reason: string };
type CreateProjectUpdateResult = { ok: true; updateId: string } | { ok: false; reason: string };
type CreateProjectFileResult = { ok: true; fileId: string } | { ok: false; reason: string };

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
  const [projects, projectFiles, timeEntries, invoices, leads, changeOrders] = await Promise.all([
    getProjects(),
    getAllProjectFiles(),
    getTimeEntries(),
    getInvoices(),
    getLeads(),
    getChangeOrders(),
  ]);
  const weeklyHours = timeEntries.reduce((sum, entry) => sum + timeEntryHours(entry.clockIn, entry.clockOut), 0);
  const draftInvoiceTotal = invoices
    .filter((invoice) => invoice.status === "draft")
    .reduce((sum, invoice) => sum + invoiceTotal(invoice.lineItems), 0);
  const pendingChangeOrderTotal = changeOrders
    .filter((changeOrder) => changeOrder.status === "draft" || changeOrder.status === "sent")
    .reduce((sum, changeOrder) => sum + changeOrderTotal(changeOrder.lineItems), 0);

  return {
    activeProjects: projects.filter((project) => project.status === "active").length,
    recentUploads: projectFiles.length,
    weeklyHours,
    draftInvoiceTotal,
    pendingChangeOrderTotal,
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

export async function getLead(leadId: string) {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoLeads.find((lead) => lead.id === leadId) ?? null;
  }

  const { data, error } = await supabase
    .from("leads")
    .select("id, name, email, phone, project_type, budget_range, status, next_follow_up, notes")
    .eq("id", leadId)
    .maybeSingle();

  if (error) {
    logSupabaseFallback("lead", error);
    return demoLeads.find((lead) => lead.id === leadId) ?? null;
  }

  return data ? mapLeadRow(data) : null;
}

export async function updateLead(leadId: string, input: LeadUpdateInput): Promise<UpdateResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode lead updates are not persisted." };
  }

  const { error } = await supabase
    .from("leads")
    .update({
      status: input.status,
      next_follow_up: input.nextFollowUp,
      notes: input.notes,
    })
    .eq("id", leadId);

  if (error) {
    return { ok: false, reason: "Could not update the lead. Please try again." };
  }

  return { ok: true };
}

export async function createLead(input: LeadCreateInput): Promise<CreateLeadResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode lead creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      project_type: input.projectType,
      budget_range: input.budgetRange,
      status: input.status,
      next_follow_up: input.nextFollowUp,
      notes: input.notes,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the lead. Please try again." };
  }

  return { ok: true, leadId: data.id };
}

function makeProposalNumber() {
  const year = new Date().getFullYear();
  return `KBP-${year}-${Date.now().toString().slice(-6)}`;
}

function makeChangeOrderNumber() {
  const year = new Date().getFullYear();
  return `KBCO-${year}-${Date.now().toString().slice(-6)}`;
}

const changeOrderSelect = `
  id,
  change_order_number,
  project_id,
  client_id,
  title,
  status,
  reason,
  schedule_impact_days,
  client_message,
  internal_notes,
  created_at,
  approved_at,
  change_order_line_items (
    id,
    description,
    quantity,
    unit_price,
    sort_order
  )
`;

const proposalSelect = `
  id,
  lead_id,
  proposal_number,
  title,
  status,
  client_name,
  client_email,
  scope_summary,
  internal_notes,
  valid_until,
  created_at,
  proposal_line_items (
    id,
    section,
    description,
    quantity,
    unit_price,
    is_optional,
    sort_order
  )
`;

export async function getProposals() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProposals;
  }

  const { data, error } = await supabase
    .from("proposals")
    .select(proposalSelect)
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("proposals", error);
    return demoProposals;
  }

  return (data ?? []).map(mapProposalRow);
}

export async function getLeadProposals(leadId: string) {
  const proposals = await getProposals();
  return proposals.filter((proposal) => proposal.leadId === leadId);
}

export async function getProposal(proposalId: string) {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProposals.find((proposal) => proposal.id === proposalId) ?? null;
  }

  const { data, error } = await supabase
    .from("proposals")
    .select(proposalSelect)
    .eq("id", proposalId)
    .maybeSingle();

  if (error) {
    logSupabaseFallback("proposal", error);
    return demoProposals.find((proposal) => proposal.id === proposalId) ?? null;
  }

  return data ? mapProposalRow(data) : null;
}

export async function createProposalFromLead(
  leadId: string,
  input: ProposalCreateInput,
): Promise<CreateProposalResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode proposal creation is not persisted." };
  }

  const lead = await getLead(leadId);

  if (!lead) {
    return { ok: false, reason: "Lead not found." };
  }

  const { data: proposal, error: proposalError } = await supabase
    .from("proposals")
    .insert({
      lead_id: lead.id,
      proposal_number: makeProposalNumber(),
      title: input.title,
      status: "draft",
      client_name: lead.name,
      client_email: lead.email,
      scope_summary: input.scopeSummary,
      internal_notes: input.internalNotes,
      valid_until: input.validUntil,
    })
    .select("id")
    .single();

  if (proposalError || !proposal?.id) {
    return { ok: false, reason: "Could not create the proposal. Please try again." };
  }

  const { error: lineItemError } = await supabase.from("proposal_line_items").insert(
    input.lineItems.map((item, index) => ({
      proposal_id: proposal.id,
      section: item.section,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      is_optional: item.isOptional,
      sort_order: index,
    })),
  );

  if (lineItemError) {
    await supabase.from("proposals").delete().eq("id", proposal.id);
    return { ok: false, reason: "Could not create the proposal line items. Please try again." };
  }

  await supabase
    .from("leads")
    .update({ status: "proposal" })
    .eq("id", lead.id)
    .neq("status", "won")
    .neq("status", "lost");

  return { ok: true, proposalId: proposal.id };
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
    .select("id, project_id, name, file_type, visibility, storage_bucket, storage_path, uploaded_at, size_label")
    .order("uploaded_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-files", error);
    return demoProjectFiles;
  }

  return (data ?? []).map(mapProjectFileRow);
}

async function getAllProjectUpdates() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectUpdates;
  }

  const { data, error } = await supabase
    .from("project_updates")
    .select("id, project_id, title, body, visibility, update_date, created_at")
    .order("update_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-updates", error);
    return demoProjectUpdates;
  }

  return (data ?? []).map(mapProjectUpdateRow);
}

export async function getProjectFiles(projectId: string) {
  const files = await getAllProjectFiles();
  return files.filter((file) => file.projectId === projectId);
}

export async function createProjectFile(
  projectId: string,
  input: ProjectFileCreateInput,
): Promise<CreateProjectFileResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode file uploads are not persisted." };
  }

  const { error: uploadError } = await supabase.storage
    .from(input.storageBucket)
    .upload(input.storagePath, input.file, {
      contentType: input.file.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, reason: "Could not upload the file. Check Supabase Storage bucket settings." };
  }

  const { data, error } = await supabase
    .from("project_files")
    .insert({
      project_id: projectId,
      name: input.name,
      file_type: input.type,
      visibility: input.visibility,
      storage_bucket: input.storageBucket,
      storage_path: input.storagePath,
      size_label: input.sizeLabel,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    await supabase.storage.from(input.storageBucket).remove([input.storagePath]);
    return { ok: false, reason: "Could not save the file record. Please try again." };
  }

  return { ok: true, fileId: data.id };
}

export async function getProjectUpdates(projectId: string) {
  const updates = await getAllProjectUpdates();
  return updates.filter((update) => update.projectId === projectId);
}

export async function createProjectUpdate(
  projectId: string,
  input: ProjectUpdateCreateInput,
): Promise<CreateProjectUpdateResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode project update creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("project_updates")
    .insert({
      project_id: projectId,
      title: input.title,
      body: input.body,
      visibility: input.visibility,
      update_date: input.updateDate,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the project update. Please try again." };
  }

  return { ok: true, updateId: data.id };
}

export async function getProjectTimeEntries(projectId: string) {
  const entries = await getTimeEntries();
  return entries.filter((entry) => entry.projectId === projectId);
}

export async function getProjectInvoices(projectId: string) {
  const invoices = await getInvoices();
  return invoices.filter((invoice) => invoice.projectId === projectId);
}

export async function getChangeOrders() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoChangeOrders;
  }

  const { data, error } = await supabase
    .from("change_orders")
    .select(changeOrderSelect)
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("change-orders", error);
    return demoChangeOrders;
  }

  return (data ?? []).map(mapChangeOrderRow);
}

export async function getProjectChangeOrders(projectId: string) {
  const changeOrders = await getChangeOrders();
  return changeOrders.filter((changeOrder) => changeOrder.projectId === projectId);
}

export async function getChangeOrder(changeOrderId: string) {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoChangeOrders.find((changeOrder) => changeOrder.id === changeOrderId) ?? null;
  }

  const { data, error } = await supabase
    .from("change_orders")
    .select(changeOrderSelect)
    .eq("id", changeOrderId)
    .maybeSingle();

  if (error) {
    logSupabaseFallback("change-order", error);
    return demoChangeOrders.find((changeOrder) => changeOrder.id === changeOrderId) ?? null;
  }

  return data ? mapChangeOrderRow(data) : null;
}

export async function createChangeOrderForProject(
  projectId: string,
  input: ChangeOrderCreateInput,
): Promise<CreateChangeOrderResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode change order creation is not persisted." };
  }

  const project = await getProject(projectId);

  if (!project) {
    return { ok: false, reason: "Project not found." };
  }

  const { data: changeOrder, error: changeOrderError } = await supabase
    .from("change_orders")
    .insert({
      change_order_number: makeChangeOrderNumber(),
      project_id: project.id,
      client_id: project.clientId,
      title: input.title,
      status: "draft",
      reason: input.reason,
      schedule_impact_days: input.scheduleImpactDays,
      client_message: input.clientMessage,
      internal_notes: input.internalNotes,
    })
    .select("id")
    .single();

  if (changeOrderError || !changeOrder?.id) {
    return { ok: false, reason: "Could not create the change order. Please try again." };
  }

  const { error: lineItemError } = await supabase.from("change_order_line_items").insert(
    input.lineItems.map((item, index) => ({
      change_order_id: changeOrder.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      sort_order: index,
    })),
  );

  if (lineItemError) {
    await supabase.from("change_orders").delete().eq("id", changeOrder.id);
    return { ok: false, reason: "Could not create the change order line items. Please try again." };
  }

  return { ok: true, changeOrderId: changeOrder.id };
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
