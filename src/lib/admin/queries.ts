import {
  bills as demoBills,
  changeOrders as demoChangeOrders,
  clients as demoClients,
  dailyLogs as demoDailyLogs,
  invoices as demoInvoices,
  leads as demoLeads,
  proposals as demoProposals,
  projectComments as demoProjectComments,
  projectFinancialTargets as demoProjectFinancialTargets,
  projectFiles as demoProjectFiles,
  projectPhotos as demoProjectPhotos,
  projectRfis as demoProjectRfis,
  projectSelections as demoProjectSelections,
  projectTasks as demoProjectTasks,
  projectUpdates as demoProjectUpdates,
  projectVendorAssignments as demoProjectVendorAssignments,
  projects as demoProjects,
  purchaseOrders as demoPurchaseOrders,
  timeEntries as demoTimeEntries,
  vendors as demoVendors,
  vendorRfiResponses as demoVendorRfiResponses,
  vendorSubmittals as demoVendorSubmittals,
  warrantyItems as demoWarrantyItems,
  workers as demoWorkers,
} from "./demo-data";
import { changeOrderTotal, invoiceTotal, timeEntryHours } from "./formatters";
import type { ChangeOrderApprovalInput, ChangeOrderCreateInput } from "./change-orders";
import type { DailyLogCreateInput } from "./daily-logs";
import type { LeadCreateInput, LeadUpdateInput } from "./leads";
import type { BillCreateInput, PurchaseOrderCreateInput } from "./purchasing";
import type { ProjectCommentCreateInput } from "./project-comments";
import type { ProjectFinancialTargetInput } from "./project-financials";
import type { ProjectFileCreateInput } from "./project-files";
import type { ProjectFinanceSnapshotDraft } from "./finance-snapshots";
import type { ProjectPhotoCreateInput } from "./project-photos";
import type { ProjectUpdateCreateInput } from "./project-updates";
import type { ProposalCreateInput } from "./proposals";
import type { RfiCreateInput } from "./rfis";
import type { SelectionApprovalInput, SelectionCreateInput } from "./selections";
import type { ProjectTaskCreateInput } from "./tasks";
import type { VendorRfiResponseCreateInput } from "./vendor-rfi-responses";
import type { VendorSubmittalCreateInput, VendorSubmittalReviewInput } from "./vendor-submittals";
import type { ProjectVendorAssignmentCreateInput, VendorCreateInput } from "./vendors";
import type { WarrantyItemCreateInput } from "./warranty";
import { logSupabaseFallback } from "./supabase-fallback";
import type { Json } from "@/lib/supabase/database.types";
import {
  mapBillRow,
  mapClientRow,
  mapChangeOrderRow,
  mapDailyLogRow,
  mapInvoiceRow,
  mapLeadRow,
  mapProposalRow,
  mapProjectCommentRow,
  mapProjectFinancialTargetRow,
  mapProjectFileRow,
  mapProjectFinanceSnapshotRow,
  mapProjectPhotoRow,
  mapProjectRfiRow,
  mapProjectSelectionRow,
  mapProjectRow,
  mapProjectTaskRow,
  mapProjectUpdateRow,
  mapProjectVendorAssignmentRow,
  mapPurchaseOrderRow,
  mapTimeEntryRow,
  mapVendorRow,
  mapVendorRfiResponseRow,
  mapVendorSubmittalRow,
  mapWarrantyItemRow,
  mapWorkerRow,
} from "./supabase-mappers";
import { getPublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type UpdateResult = { ok: true } | { ok: false; reason: string };
type CreateLeadResult = { ok: true; leadId: string } | { ok: false; reason: string };
type CreateProposalResult = { ok: true; proposalId: string } | { ok: false; reason: string };
type CreateChangeOrderResult = { ok: true; changeOrderId: string } | { ok: false; reason: string };
type ApproveChangeOrderResult = { ok: true } | { ok: false; reason: string };
type CreateProjectUpdateResult = { ok: true; updateId: string } | { ok: false; reason: string };
type CreateProjectFileResult = { ok: true; fileId: string } | { ok: false; reason: string };
type CreateProjectPhotoResult = { ok: true; photoId: string } | { ok: false; reason: string };
type CreateProjectTaskResult = { ok: true; taskId: string } | { ok: false; reason: string };
type CreateProjectCommentResult = { ok: true; commentId: string } | { ok: false; reason: string };
type CreateProjectSelectionResult = { ok: true; selectionId: string } | { ok: false; reason: string };
type ApproveProjectSelectionResult = { ok: true } | { ok: false; reason: string };
type CreateProjectRfiResult = { ok: true; rfiId: string } | { ok: false; reason: string };
type CreateVendorRfiResponseResult = { ok: true; responseId: string } | { ok: false; reason: string };
type CreateVendorSubmittalResult = { ok: true; submittalId: string } | { ok: false; reason: string };
type CreateProjectFinanceSnapshotResult = { ok: true; snapshotId: string } | { ok: false; reason: string };
type CreateDailyLogResult = { ok: true; dailyLogId: string } | { ok: false; reason: string };
type CreatePurchaseOrderResult = { ok: true; purchaseOrderId: string } | { ok: false; reason: string };
type CreateBillResult = { ok: true; billId: string } | { ok: false; reason: string };
type CreateWarrantyItemResult = { ok: true; warrantyItemId: string } | { ok: false; reason: string };
type CreateVendorResult = { ok: true; vendorId: string } | { ok: false; reason: string };
type CreateProjectVendorAssignmentResult = { ok: true; assignmentId: string } | { ok: false; reason: string };
type UpsertProjectFinancialTargetResult = { ok: true } | { ok: false; reason: string };

async function getSupabaseClientOrNull() {
  const env = getPublicEnv();

  if (env.demoMode || !env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createClient();
}

export async function getDashboardMetrics() {
  const [projects, projectFiles, timeEntries, invoices, leads, changeOrders, tasks] = await Promise.all([
    getProjects(),
    getAllProjectFiles(),
    getTimeEntries(),
    getInvoices(),
    getLeads(),
    getChangeOrders(),
    getTasks(),
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
    openTasks: tasks.filter((task) => task.status !== "done").length,
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
    .select("id, name, email, phone, auth_user_id")
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

function makePurchaseOrderNumber() {
  const year = new Date().getFullYear();
  return `KBPO-${year}-${Date.now().toString().slice(-6)}`;
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
  approved_by_name,
  change_order_line_items (
    id,
    description,
    quantity,
    unit_price,
    sort_order
  )
`;

const warrantyItemSelect = `
  id,
  project_id,
  item_type,
  title,
  description,
  location,
  requested_by,
  status,
  priority,
  due_date,
  visibility,
  created_at,
  resolved_at
`;

const projectPhotoSelect = `
  id,
  project_id,
  title,
  photo_date,
  category,
  visibility,
  image_url,
  caption,
  uploaded_at
`;

const vendorSelect = `
  id,
  name,
  company_type,
  trade,
  email,
  auth_email,
  phone,
  status,
  portal_access,
  notes,
  created_at
`;

const projectVendorAssignmentSelect = `
  id,
  project_id,
  vendor_id,
  scope,
  start_date,
  end_date,
  status,
  visibility,
  created_at
`;

const projectFinancialTargetSelect = `
  project_id,
  contract_value,
  budgeted_cost,
  target_margin_percent,
  contingency_percent,
  updated_at
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

export async function getAllProjectFiles() {
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

export async function getTasks() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectTasks;
  }

  const { data, error } = await supabase
    .from("project_tasks")
    .select("id, project_id, assigned_worker_id, title, notes, status, priority, due_date, created_at, completed_at")
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-tasks", error);
    return demoProjectTasks;
  }

  return (data ?? []).map(mapProjectTaskRow);
}

export async function getProjectTasks(projectId: string) {
  const tasks = await getTasks();
  return tasks.filter((task) => task.projectId === projectId);
}

export async function createProjectTask(
  projectId: string,
  input: ProjectTaskCreateInput,
): Promise<CreateProjectTaskResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode task creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("project_tasks")
    .insert({
      project_id: projectId,
      assigned_worker_id: input.assignedWorkerId,
      title: input.title,
      notes: input.notes,
      priority: input.priority,
      due_date: input.dueDate,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the task. Please try again." };
  }

  return { ok: true, taskId: data.id };
}

export async function updateProjectTaskStatus(
  taskId: string,
  status: "open" | "in-progress" | "done",
): Promise<UpdateResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode task updates are not persisted." };
  }

  const { error } = await supabase
    .from("project_tasks")
    .update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", taskId);

  if (error) {
    return { ok: false, reason: "Could not update the task. Please try again." };
  }

  return { ok: true };
}

export async function getProjectFiles(projectId: string) {
  const files = await getAllProjectFiles();
  return files.filter((file) => file.projectId === projectId);
}

export async function getProjectPhotos() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectPhotos;
  }

  const { data, error } = await supabase
    .from("project_photos")
    .select(projectPhotoSelect)
    .order("photo_date", { ascending: false })
    .order("uploaded_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-photos", error);
    return demoProjectPhotos;
  }

  return (data ?? []).map(mapProjectPhotoRow);
}

export async function getProjectPhotoGallery(projectId: string) {
  const photos = await getProjectPhotos();
  return photos.filter((photo) => photo.projectId === projectId);
}

export async function createProjectPhoto(
  projectId: string,
  input: ProjectPhotoCreateInput,
): Promise<CreateProjectPhotoResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode photo creation is not persisted." };
  }

  const { error: uploadError } = await supabase.storage
    .from(input.storageBucket)
    .upload(input.storagePath, input.file, {
      contentType: input.file.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, reason: "Could not upload the photo. Check Supabase Storage bucket settings." };
  }

  const { data: publicUrlData } = supabase.storage
    .from(input.storageBucket)
    .getPublicUrl(input.storagePath);

  const { data, error } = await supabase
    .from("project_photos")
    .insert({
      project_id: projectId,
      title: input.title,
      photo_date: input.photoDate,
      category: input.category,
      visibility: input.visibility,
      image_url: publicUrlData.publicUrl,
      caption: input.caption,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    await supabase.storage.from(input.storageBucket).remove([input.storagePath]);
    return { ok: false, reason: "Could not create the photo record. Please try again." };
  }

  return { ok: true, photoId: data.id };
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

export async function getComments() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectComments;
  }

  const { data, error } = await supabase
    .from("project_comments")
    .select("id, project_id, author_name, body, visibility, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-comments", error);
    return demoProjectComments;
  }

  return (data ?? []).map(mapProjectCommentRow);
}

export async function getProjectComments(projectId: string) {
  const comments = await getComments();
  return comments.filter((comment) => comment.projectId === projectId);
}

export async function createProjectComment(
  projectId: string,
  input: ProjectCommentCreateInput,
): Promise<CreateProjectCommentResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode comment creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("project_comments")
    .insert({
      project_id: projectId,
      author_name: input.authorName,
      body: input.body,
      visibility: input.visibility,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the comment. Please try again." };
  }

  return { ok: true, commentId: data.id };
}

export async function getSelections() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectSelections;
  }

  const { data, error } = await supabase
    .from("project_selections")
    .select(
      "id, project_id, category, title, allowance_amount, selected_option, vendor, due_date, status, internal_notes, client_notes, created_at, approved_at, approved_by_name",
    )
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-selections", error);
    return demoProjectSelections;
  }

  return (data ?? []).map(mapProjectSelectionRow);
}

export async function getProjectSelections(projectId: string) {
  const selections = await getSelections();
  return selections.filter((selection) => selection.projectId === projectId);
}

export async function createProjectSelection(
  projectId: string,
  input: SelectionCreateInput,
): Promise<CreateProjectSelectionResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode selection creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("project_selections")
    .insert({
      project_id: projectId,
      category: input.category,
      title: input.title,
      allowance_amount: input.allowanceAmount,
      selected_option: input.selectedOption,
      vendor: input.vendor,
      due_date: input.dueDate,
      status: input.status,
      internal_notes: input.internalNotes,
      client_notes: input.clientNotes,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the selection. Please try again." };
  }

  return { ok: true, selectionId: data.id };
}

export async function approveProjectSelection(
  projectId: string,
  selectionId: string,
  input: SelectionApprovalInput,
): Promise<ApproveProjectSelectionResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode selection approval is not persisted." };
  }

  const { data, error } = await supabase
    .from("project_selections")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by_name: input.approvedByName,
    })
    .eq("id", selectionId)
    .eq("project_id", projectId)
    .eq("status", "submitted")
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, reason: "Could not approve the selection. Please try again." };
  }

  if (!data?.id) {
    return { ok: false, reason: "This selection is not available for approval." };
  }

  return { ok: true };
}

export async function getRfis() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectRfis;
  }

  const { data, error } = await supabase
    .from("project_rfis")
    .select("id, project_id, title, question, answer, requested_by, due_date, status, visibility, created_at, answered_at")
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-rfis", error);
    return demoProjectRfis;
  }

  return (data ?? []).map(mapProjectRfiRow);
}

export async function getProjectRfis(projectId: string) {
  const rfis = await getRfis();
  return rfis.filter((rfi) => rfi.projectId === projectId);
}

export async function getVendorRfiResponses() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoVendorRfiResponses;
  }

  const { data, error } = await supabase
    .from("vendor_rfi_responses")
    .select("id, project_id, rfi_id, vendor_id, assignment_id, responder_name, response_body, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("vendor-rfi-responses", error);
    return demoVendorRfiResponses;
  }

  return (data ?? []).map(mapVendorRfiResponseRow);
}

export async function getVendorSubmittals() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoVendorSubmittals;
  }

  const { data, error } = await supabase
    .from("vendor_submittals")
    .select("id, project_id, vendor_id, assignment_id, title, category, status, storage_bucket, storage_path, mime_type, size_label, submitted_at, reviewed_at, review_comment, reviewed_by")
    .order("submitted_at", { ascending: false });

  if (error) {
    logSupabaseFallback("vendor-submittals", error);
    return demoVendorSubmittals;
  }

  return (data ?? []).map(mapVendorSubmittalRow);
}

export async function getProjectVendorSubmittals(projectId: string) {
  const submittals = await getVendorSubmittals();
  return submittals.filter((submittal) => submittal.projectId === projectId);
}

export async function getProjectFinanceSnapshots(projectId?: string) {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("project_finance_snapshots")
    .select("id, project_id, projects(name), title, notes, inputs, outputs, created_by, created_at")
    .order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    logSupabaseFallback("project-finance-snapshots", error);
    return [];
  }

  return (data ?? []).map((row) => mapProjectFinanceSnapshotRow(row));
}

export async function getProjectFinanceSnapshot(snapshotId: string) {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("project_finance_snapshots")
    .select("id, project_id, projects(name), title, notes, inputs, outputs, created_by, created_at")
    .eq("id", snapshotId)
    .maybeSingle();

  if (error) {
    logSupabaseFallback("project-finance-snapshot", error);
    return null;
  }

  return data ? mapProjectFinanceSnapshotRow(data) : null;
}

export async function getProjectVendorRfiResponses(projectId: string) {
  const responses = await getVendorRfiResponses();
  return responses.filter((response) => response.projectId === projectId);
}

export async function createVendorRfiResponse(
  input: VendorRfiResponseCreateInput,
): Promise<CreateVendorRfiResponseResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode RFI responses are not persisted." };
  }

  const { data, error } = await supabase
    .from("vendor_rfi_responses")
    .insert({
      project_id: input.projectId,
      rfi_id: input.rfiId,
      vendor_id: input.vendorId,
      assignment_id: input.assignmentId,
      responder_name: input.responderName,
      response_body: input.responseBody,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not save the RFI response. Please try again." };
  }

  return { ok: true, responseId: data.id };
}

export async function createVendorSubmittal(
  input: VendorSubmittalCreateInput,
): Promise<CreateVendorSubmittalResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode vendor submittals are not persisted." };
  }

  const { error: uploadError } = await supabase.storage
    .from(input.storageBucket)
    .upload(input.storagePath, input.file, {
      contentType: input.file.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, reason: "Could not upload the vendor submittal. Check Supabase Storage access." };
  }

  const { data, error } = await supabase
    .from("vendor_submittals")
    .insert({
      project_id: input.projectId,
      vendor_id: input.vendorId,
      assignment_id: input.assignmentId,
      title: input.title,
      category: input.category,
      storage_bucket: input.storageBucket,
      storage_path: input.storagePath,
      mime_type: input.mimeType,
      size_label: input.sizeLabel,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    await supabase.storage.from(input.storageBucket).remove([input.storagePath]);
    return { ok: false, reason: "Could not save the vendor submittal record. Please try again." };
  }

  return { ok: true, submittalId: data.id };
}

export async function updateVendorSubmittalReview(
  submittalId: string,
  input: VendorSubmittalReviewInput,
): Promise<UpdateResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode vendor submittal reviews are not persisted." };
  }

  const shouldMarkReviewed = input.status !== "submitted" || input.reviewComment.length > 0;
  const { error } = await supabase
    .from("vendor_submittals")
    .update({
      status: input.status,
      review_comment: input.reviewComment,
      reviewed_at: shouldMarkReviewed ? new Date().toISOString() : null,
    })
    .eq("id", submittalId);

  if (error) {
    return { ok: false, reason: "Could not save the vendor submittal review. Please try again." };
  }

  return { ok: true };
}

export async function createProjectFinanceSnapshot(
  snapshot: ProjectFinanceSnapshotDraft,
): Promise<CreateProjectFinanceSnapshotResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode finance snapshots are not persisted." };
  }

  const { data, error } = await supabase
    .from("project_finance_snapshots")
    .insert({
      project_id: snapshot.projectId,
      title: snapshot.title,
      notes: snapshot.notes,
      // jsonb columns: these domain objects are JSON-serializable but lack a Json index signature.
      inputs: snapshot.inputs as unknown as Json,
      outputs: snapshot.outputs as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not save the finance snapshot. Please try again." };
  }

  return { ok: true, snapshotId: data.id };
}

export async function getWarrantyItems() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoWarrantyItems;
  }

  const { data, error } = await supabase
    .from("warranty_items")
    .select(warrantyItemSelect)
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("warranty-items", error);
    return demoWarrantyItems;
  }

  return (data ?? []).map(mapWarrantyItemRow);
}

export async function getProjectWarrantyItems(projectId: string) {
  const warrantyItems = await getWarrantyItems();
  return warrantyItems.filter((item) => item.projectId === projectId);
}

export async function createWarrantyItem(
  projectId: string,
  input: WarrantyItemCreateInput,
): Promise<CreateWarrantyItemResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode warranty and punch-list creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("warranty_items")
    .insert({
      project_id: projectId,
      item_type: input.itemType,
      title: input.title,
      description: input.description,
      location: input.location,
      requested_by: input.requestedBy,
      status: input.status,
      priority: input.priority,
      due_date: input.dueDate,
      visibility: input.visibility,
      resolved_at: input.status === "resolved" || input.status === "closed" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the warranty or punch-list item. Please try again." };
  }

  return { ok: true, warrantyItemId: data.id };
}

export async function getVendors() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoVendors;
  }

  const { data, error } = await supabase
    .from("vendors")
    .select(vendorSelect)
    .order("name", { ascending: true });

  if (error) {
    logSupabaseFallback("vendors", error);
    return demoVendors;
  }

  return (data ?? []).map(mapVendorRow);
}

export async function createVendor(input: VendorCreateInput): Promise<CreateVendorResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode vendor creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("vendors")
    .insert({
      name: input.name,
      company_type: input.companyType,
      trade: input.trade,
      email: input.email,
      auth_email: input.email.toLowerCase(),
      phone: input.phone,
      status: input.status,
      portal_access: input.portalAccess,
      notes: input.notes,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the vendor or subcontractor. Please try again." };
  }

  return { ok: true, vendorId: data.id };
}

export async function getProjectVendorAssignments() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectVendorAssignments;
  }

  const { data, error } = await supabase
    .from("project_vendor_assignments")
    .select(projectVendorAssignmentSelect)
    .order("start_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-vendor-assignments", error);
    return demoProjectVendorAssignments;
  }

  return (data ?? []).map(mapProjectVendorAssignmentRow);
}

export async function getProjectVendorAssignmentsForProject(projectId: string) {
  const assignments = await getProjectVendorAssignments();
  return assignments.filter((assignment) => assignment.projectId === projectId);
}

export async function getProjectFinancialTargets() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoProjectFinancialTargets;
  }

  const { data, error } = await supabase
    .from("project_financial_targets")
    .select(projectFinancialTargetSelect)
    .order("updated_at", { ascending: false });

  if (error) {
    logSupabaseFallback("project-financial-targets", error);
    return demoProjectFinancialTargets;
  }

  return (data ?? []).map(mapProjectFinancialTargetRow);
}

export async function getProjectFinancialTarget(projectId: string) {
  const targets = await getProjectFinancialTargets();
  return targets.find((target) => target.projectId === projectId) ?? null;
}

export async function upsertProjectFinancialTarget(
  projectId: string,
  input: ProjectFinancialTargetInput,
): Promise<UpsertProjectFinancialTargetResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode financial targets are not persisted." };
  }

  const { error } = await supabase
    .from("project_financial_targets")
    .upsert({
      project_id: projectId,
      contract_value: input.contractValue,
      budgeted_cost: input.budgetedCost,
      target_margin_percent: input.targetMarginPercent,
      contingency_percent: input.contingencyPercent,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { ok: false, reason: "Could not save the financial targets. Please try again." };
  }

  return { ok: true };
}

export async function createProjectVendorAssignment(
  projectId: string,
  input: ProjectVendorAssignmentCreateInput,
): Promise<CreateProjectVendorAssignmentResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode vendor assignment creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("project_vendor_assignments")
    .insert({
      project_id: projectId,
      vendor_id: input.vendorId,
      scope: input.scope,
      start_date: input.startDate,
      end_date: input.endDate || null,
      status: input.status,
      visibility: input.visibility,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not assign the vendor or subcontractor. Please try again." };
  }

  return { ok: true, assignmentId: data.id };
}

export async function createProjectRfi(
  projectId: string,
  input: RfiCreateInput,
): Promise<CreateProjectRfiResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode RFI creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("project_rfis")
    .insert({
      project_id: projectId,
      title: input.title,
      question: input.question,
      answer: input.answer,
      requested_by: input.requestedBy,
      due_date: input.dueDate,
      status: input.status,
      visibility: input.visibility,
      answered_at: input.answer ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the RFI. Please try again." };
  }

  return { ok: true, rfiId: data.id };
}

export async function getDailyLogs() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoDailyLogs;
  }

  const { data, error } = await supabase
    .from("daily_logs")
    .select(
      "id, project_id, report_date, superintendent, weather, crew_count, work_performed, deliveries, inspections, delays, safety_notes, next_steps, visibility, created_at",
    )
    .order("report_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("daily-logs", error);
    return demoDailyLogs;
  }

  return (data ?? []).map(mapDailyLogRow);
}

export async function getProjectDailyLogs(projectId: string) {
  const dailyLogs = await getDailyLogs();
  return dailyLogs.filter((dailyLog) => dailyLog.projectId === projectId);
}

export async function createDailyLog(
  projectId: string,
  input: DailyLogCreateInput,
): Promise<CreateDailyLogResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode daily log creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("daily_logs")
    .insert({
      project_id: projectId,
      report_date: input.reportDate,
      superintendent: input.superintendent,
      weather: input.weather,
      crew_count: input.crewCount,
      work_performed: input.workPerformed,
      deliveries: input.deliveries,
      inspections: input.inspections,
      delays: input.delays,
      safety_notes: input.safetyNotes,
      next_steps: input.nextSteps,
      visibility: input.visibility,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the daily log. Please try again." };
  }

  return { ok: true, dailyLogId: data.id };
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

export async function getPurchaseOrders() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoPurchaseOrders;
  }

  const { data, error } = await supabase
    .from("purchase_orders")
    .select("id, project_id, po_number, title, vendor, amount, status, due_date, notes, created_at")
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("purchase-orders", error);
    return demoPurchaseOrders;
  }

  return (data ?? []).map(mapPurchaseOrderRow);
}

export async function getProjectPurchaseOrders(projectId: string) {
  const purchaseOrders = await getPurchaseOrders();
  return purchaseOrders.filter((purchaseOrder) => purchaseOrder.projectId === projectId);
}

export async function createPurchaseOrder(
  projectId: string,
  input: PurchaseOrderCreateInput,
): Promise<CreatePurchaseOrderResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode purchase order creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("purchase_orders")
    .insert({
      project_id: projectId,
      po_number: makePurchaseOrderNumber(),
      title: input.title,
      vendor: input.vendor,
      amount: input.amount,
      status: input.status,
      due_date: input.dueDate,
      notes: input.notes,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the purchase order. Please try again." };
  }

  return { ok: true, purchaseOrderId: data.id };
}

export async function getBills() {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return demoBills;
  }

  const { data, error } = await supabase
    .from("bills")
    .select("id, project_id, bill_number, vendor, amount, status, due_date, notes, created_at")
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseFallback("bills", error);
    return demoBills;
  }

  return (data ?? []).map(mapBillRow);
}

export async function getProjectBills(projectId: string) {
  const bills = await getBills();
  return bills.filter((bill) => bill.projectId === projectId);
}

export async function createBill(projectId: string, input: BillCreateInput): Promise<CreateBillResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode bill creation is not persisted." };
  }

  const { data, error } = await supabase
    .from("bills")
    .insert({
      project_id: projectId,
      bill_number: input.billNumber,
      vendor: input.vendor,
      amount: input.amount,
      status: input.status,
      due_date: input.dueDate,
      notes: input.notes,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { ok: false, reason: "Could not create the bill. Please try again." };
  }

  return { ok: true, billId: data.id };
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

export async function approveChangeOrder(
  projectId: string,
  changeOrderId: string,
  input: ChangeOrderApprovalInput,
): Promise<ApproveChangeOrderResult> {
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    return { ok: false, reason: "Demo mode change order approval is not persisted." };
  }

  const { data, error } = await supabase
    .from("change_orders")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by_name: input.approvedByName,
    })
    .eq("id", changeOrderId)
    .eq("project_id", projectId)
    .eq("status", "sent")
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, reason: "Could not approve the change order. Please try again." };
  }

  if (!data?.id) {
    return { ok: false, reason: "This change order is not available for approval." };
  }

  return { ok: true };
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
