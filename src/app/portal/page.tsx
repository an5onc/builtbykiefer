import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  ClipboardCheck,
  ClipboardPenLine,
  FileText,
  Home,
  MessageCircleQuestion,
  ReceiptText,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { redirect } from "next/navigation";
import StatusBadge from "@/components/admin/StatusBadge";
import { signOutClient } from "@/app/portal/login/actions";
import { getCurrentClient, portalLoginUrl } from "@/lib/admin/client-auth";
import {
  buildClientPortalDashboardView,
  filterClientPortalSourceForClient,
  getDashboardNeedsAttention,
} from "@/lib/admin/client-portal";
import {
  changeOrders as demoChangeOrders,
  clients as demoClients,
  dailyLogs as demoDailyLogs,
  invoices as demoInvoices,
  projectFiles as demoProjectFiles,
  projectPhotos as demoProjectPhotos,
  projectRfis as demoProjectRfis,
  projectSelections as demoProjectSelections,
  projectVendorAssignments as demoProjectVendorAssignments,
  projects as demoProjects,
  vendors as demoVendors,
  warrantyItems as demoWarrantyItems,
} from "@/lib/admin/demo-data";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import {
  getAllProjectFiles,
  getChangeOrders,
  getClients,
  getDailyLogs,
  getInvoices,
  getProjectPhotos,
  getProjectVendorAssignments,
  getProjects,
  getRfis,
  getSelections,
  getVendors,
  getWarrantyItems,
} from "@/lib/admin/queries";

export default async function ClientPortalDashboardPage() {
  const clientSession = await getCurrentClient();

  if (!clientSession) {
    redirect(portalLoginUrl({ next: "/portal" }));
  }

  const [
    projects,
    clients,
    files,
    selections,
    rfis,
    dailyLogs,
    invoices,
    changeOrders,
    warrantyItems,
    projectPhotos,
    vendors,
    vendorAssignments,
  ] =
    await Promise.all([
      getProjects(),
      getClients(),
      getAllProjectFiles(),
      getSelections(),
      getRfis(),
      getDailyLogs(),
      getInvoices(),
      getChangeOrders(),
      getWarrantyItems(),
      getProjectPhotos(),
      getVendors(),
      getProjectVendorAssignments(),
    ]);
  const source =
    clientSession.isDemo
      ? {
          projects: demoProjects,
          clients: demoClients,
          files: demoProjectFiles,
          selections: demoProjectSelections,
          rfis: demoProjectRfis,
          dailyLogs: demoDailyLogs,
          invoices: demoInvoices,
          changeOrders: demoChangeOrders,
          warrantyItems: demoWarrantyItems,
          projectPhotos: demoProjectPhotos,
          vendors: demoVendors,
          vendorAssignments: demoProjectVendorAssignments,
          updates: [],
          comments: [],
        }
      : {
          projects,
          clients,
          files,
          selections,
          rfis,
          dailyLogs,
          invoices,
          changeOrders,
          warrantyItems,
          projectPhotos,
          vendors,
          vendorAssignments,
          updates: [],
          comments: [],
        };
  const clientSource = filterClientPortalSourceForClient(source, clientSession.client.id);
  const dashboard = buildClientPortalDashboardView(clientSource);
  const needsAttention = getDashboardNeedsAttention(dashboard);

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#171717]">
      <section className="border-b border-black/10 bg-[#151515] text-white">
        <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6a57]">
            Kiefer Built Client Portal
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
                Project Dashboard
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 md:text-base">
                A private owner view for {clientSession.client.name}: project progress, field reports, selections, RFIs, change orders, files, invoices, and items needing attention.
              </p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <p className="text-3xl font-bold">{dashboard.totals.activeProjects}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    Active Projects
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <p className="text-3xl font-bold">{dashboard.totals.sharedFiles}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    Shared Files
                  </p>
                </div>
              </div>
              <form action={signOutClient} className="mt-3 text-right">
                <button className="text-xs font-bold uppercase tracking-[0.16em] text-white/60 transition hover:text-white">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <div className="mb-6 rounded-lg border border-[#b92516]/20 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Needs Attention
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {needsAttention.total > 0
                  ? `${needsAttention.total} item${needsAttention.total === 1 ? "" : "s"} to review`
                  : "Nothing needs your attention right now"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Review selections, RFIs, change orders, invoices, and warranty items from one owner dashboard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
              <AttentionStat label="Selections" value={needsAttention.selections} />
              <AttentionStat label="RFIs" value={needsAttention.rfis} />
              <AttentionStat label="Change Orders" value={needsAttention.changeOrders} />
              <AttentionStat label="Warranty" value={needsAttention.warranty} />
              <AttentionStat
                label="Balance"
                value={needsAttention.invoiceBalance > 0 ? formatCurrency(needsAttention.invoiceBalance) : "$0"}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
              <Wrench className="size-4 text-[#b92516]" />
              Open Change Orders
            </p>
            <p className="mt-3 text-3xl font-bold">{dashboard.totals.openChangeOrders}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
              <ReceiptText className="size-4 text-[#b92516]" />
              Invoice Balance
            </p>
            <p className="mt-3 text-3xl font-bold">{formatCurrency(dashboard.totals.invoiceBalance)}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
              <Home className="size-4 text-[#b92516]" />
              Kiefer-Owned Portal
            </p>
            <p className="mt-3 text-sm leading-6 text-[#655c52]">
              You only see projects connected to your Kiefer Built client account.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {dashboard.projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm"
            >
              <div className="grid lg:grid-cols-[0.42fr_1fr]">
                <Link href={`/portal/projects/${project.id}`} className="relative min-h-64 overflow-hidden bg-[#151515]">
                  <Image
                    src={project.heroImage}
                    alt={project.name}
                    fill
                    className="object-cover opacity-72 transition duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <StatusBadge status={project.status} />
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                        {project.clientName}
                      </p>
                      <Link
                        href={`/portal/projects/${project.id}`}
                        className="mt-1 block text-2xl font-bold transition hover:text-[#b92516]"
                      >
                        {project.name}
                      </Link>
                      <p className="mt-1 text-sm text-[#655c52]">
                        {project.location} · {project.type} · {project.currentPhase}
                      </p>
                    </div>
                    <p className="text-3xl font-bold">{project.progress}%</p>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-[#b92516]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
                    <div className="rounded-md bg-[#f9f6f0] p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        <ClipboardCheck className="size-4 text-[#b92516]" />
                        Selections
                      </p>
                      <p className="mt-2 text-2xl font-bold">{project.openSelectionCount}</p>
                    </div>
                    <div className="rounded-md bg-[#f9f6f0] p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        <MessageCircleQuestion className="size-4 text-[#b92516]" />
                        RFIs
                      </p>
                      <p className="mt-2 text-2xl font-bold">{project.openRfiCount}</p>
                    </div>
                    <div className="rounded-md bg-[#f9f6f0] p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        <Wrench className="size-4 text-[#b92516]" />
                        Changes
                      </p>
                      <p className="mt-2 text-2xl font-bold">{project.openChangeOrderCount}</p>
                    </div>
                    <div className="rounded-md bg-[#f9f6f0] p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        <ShieldCheck className="size-4 text-[#b92516]" />
                        Warranty
                      </p>
                      <p className="mt-2 text-2xl font-bold">{project.openWarrantyCount}</p>
                    </div>
                    <div className="rounded-md bg-[#f9f6f0] p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        <Camera className="size-4 text-[#b92516]" />
                        Photos
                      </p>
                      <p className="mt-2 text-2xl font-bold">{project.photoCount}</p>
                    </div>
                    <div className="rounded-md bg-[#f9f6f0] p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        <Users className="size-4 text-[#b92516]" />
                        Trades
                      </p>
                      <p className="mt-2 text-2xl font-bold">{project.vendorAssignmentCount}</p>
                    </div>
                    <div className="rounded-md bg-[#f9f6f0] p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                        <FileText className="size-4 text-[#b92516]" />
                        Files
                      </p>
                      <p className="mt-2 text-2xl font-bold">{project.sharedFileCount}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-md border border-black/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-bold">
                      <ClipboardPenLine className="size-4 text-[#b92516]" />
                      Latest Field Report
                    </p>
                    {project.latestFieldReport ? (
                      <>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                          {formatDate(project.latestFieldReport.reportDate)} · {project.latestFieldReport.weather}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#655c52]">
                          {project.latestFieldReport.workPerformed}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-[#655c52]">
                        No client-visible field report has been shared yet.
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#655c52]">
                      Open invoice balance: {formatCurrency(project.invoiceBalance)}
                    </p>
                    <Link
                      href={`/portal/projects/${project.id}`}
                      className="inline-flex items-center rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
                    >
                      Open Project
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {dashboard.projects.length === 0 ? (
            <section className="rounded-lg border border-black/10 bg-white p-6 text-center shadow-sm">
              <h2 className="text-xl font-bold">No projects are connected to this client login yet.</h2>
              <p className="mt-2 text-sm text-[#655c52]">
                Ask Kiefer Built to connect your Supabase Auth user to your client record.
              </p>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function AttentionStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md bg-[#f9f6f0] px-3 py-2 text-center">
      <p className="font-bold text-[#171717]">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a8176]">{label}</p>
    </div>
  );
}
