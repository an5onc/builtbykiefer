import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, FileText, Mail, MessageSquare, Users } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/admin/formatters";
import {
  getAllProjectFiles,
  getProjectVendorAssignments,
  getProjects,
  getRfis,
  getVendorSubmittals,
  getVendorRfiResponses,
} from "@/lib/admin/queries";
import { getCurrentVendor } from "@/lib/admin/vendor-auth";
import { buildVendorPortalView } from "@/lib/admin/vendor-portal";
import { vendorSubmittalCategoryOptions } from "@/lib/admin/vendor-submittals";
import { createVendorRfiResponseAction, createVendorSubmittalAction, signOutVendor } from "./actions";

export default async function VendorPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const { notice, error } = await searchParams;
  const vendorSession = await getCurrentVendor();

  if (!vendorSession) {
    redirect("/vendor/login?next=%2Fvendor");
  }

  const [assignments, projects, files, rfis, responses, submittals] = await Promise.all([
    getProjectVendorAssignments(),
    getProjects(),
    getAllProjectFiles(),
    getRfis(),
    getVendorRfiResponses(),
    getVendorSubmittals(),
  ]);
  const vendorAssignments = assignments.filter((assignment) => assignment.vendorId === vendorSession.vendor.id);
  const view = buildVendorPortalView({
    vendors: [vendorSession.vendor],
    assignments: vendorAssignments,
    projects,
    files,
    rfis,
    responses,
    submittals,
    rfiResponseEmail: process.env.ADMIN_EMAIL ?? "office@kieferbuilt.com",
  });

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#171717]">
      <header className="border-b border-black/10 bg-[#151515] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/images/kiefer-k-logo.png" alt="Kiefer Built" width={42} height={42} className="h-10 w-auto" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Kiefer Built Trade Portal
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {vendorSession.vendor.name}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white/50"
            >
              Public Site
            </Link>
            <form action={signOutVendor}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white/50"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {notice ? (
          <p className="mb-4 rounded-md border border-green-600/20 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#fbe9e7] px-4 py-3 text-sm font-semibold text-[#9b2015]">
            {error}
          </p>
        ) : null}

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.34fr_0.34fr]">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
              Subcontractor & Vendor Access
            </p>
            <h1 className="mt-2 text-3xl font-bold">Trade Partner Workboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#655c52]">
              Portal-enabled partners can review assigned jobs, current schedule windows, shared documents, and open RFIs without digging through manager emails.
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Active partners</p>
            <p className="mt-2 text-3xl font-bold">{view.totals.activePartners}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Assignments</p>
            <p className="mt-2 text-3xl font-bold">{view.totals.assignments}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold text-[#655c52]">Shared documents</p>
            <p className="mt-2 text-3xl font-bold">{view.totals.sharedDocuments}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Open RFIs</p>
            <p className="mt-2 text-3xl font-bold">{view.totals.openRfis}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm lg:col-span-3">
            <p className="text-sm font-semibold text-[#655c52]">Vendor submittals</p>
            <p className="mt-2 text-3xl font-bold">{view.totals.submittedDocuments}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {view.assignments.length > 0 ? (
            view.assignments.map((assignment) => (
              <article key={assignment.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
                      <Users className="size-4 text-[#b92516]" />
                      {assignment.vendorName}
                    </p>
                    <h2 className="mt-2 text-xl font-bold">{assignment.projectName}</h2>
                    <p className="mt-1 text-sm text-[#655c52]">
                      {assignment.projectLocation} · {assignment.vendorTrade}
                    </p>
                  </div>
                  <StatusBadge status={assignment.status} />
                </div>

                <p className="mt-4 text-sm leading-6 text-[#655c52]">{assignment.scope}</p>

                <div className="mt-4 grid gap-3 rounded-md bg-[#f9f6f0] p-4 text-sm sm:grid-cols-2">
                  <p>
                    <span className="flex items-center gap-2 font-semibold text-[#171717]">
                      <CalendarDays className="size-4 text-[#b92516]" />
                      Schedule
                    </span>
                    <span className="mt-1 block text-[#655c52]">
                      {formatDate(assignment.startDate)}
                      {assignment.endDate ? ` - ${formatDate(assignment.endDate)}` : ""}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-[#171717]">Current phase</span>
                    <span className="mt-1 block text-[#655c52]">{assignment.projectPhase}</span>
                  </p>
                </div>

                <div className="mt-5 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em]">
                      <FileText className="size-4 text-[#b92516]" />
                      Shared Documents
                    </h3>
                    <span className="text-sm font-semibold text-[#655c52]">{assignment.files.length}</span>
                  </div>
                  {assignment.files.length > 0 ? (
                    <ul className="mt-3 divide-y divide-black/10 text-sm">
                      {assignment.files.map((file) => (
                        <li key={file.id} className="flex items-center justify-between gap-4 py-3">
                          <span className="font-semibold">{file.name}</span>
                          <span className="shrink-0 text-[#655c52]">
                            {file.type} · {file.sizeLabel}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[#655c52]">No shared documents have been published yet.</p>
                  )}
                </div>

                <div className="mt-5 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em]">
                      <FileText className="size-4 text-[#b92516]" />
                      Vendor Submittals
                    </h3>
                    <span className="text-sm font-semibold text-[#655c52]">{assignment.submittals.length}</span>
                  </div>

                  {assignment.submittals.length > 0 ? (
                    <ul className="mt-3 divide-y divide-black/10 text-sm">
                      {assignment.submittals.map((submittal) => (
                        <li key={submittal.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                          <div>
                            <p className="font-semibold">{submittal.title}</p>
                            <p className="mt-1 text-[#655c52]">
                              {submittal.category} · {submittal.sizeLabel} · {formatDateTime(submittal.submittedAt)}
                            </p>
                            {submittal.reviewComment ? (
                              <p className="mt-3 rounded-md border border-black/10 bg-white p-3 text-sm leading-6 text-[#655c52]">
                                <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#171717]">
                                  Manager Comment
                                </span>
                                {submittal.reviewComment}
                              </p>
                            ) : null}
                          </div>
                          <StatusBadge status={submittal.status} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[#655c52]">No vendor submittals have been uploaded yet.</p>
                  )}

                  <form action={createVendorSubmittalAction} className="mt-4 space-y-3 rounded-md border border-black/10 bg-[#f9f6f0] p-3">
                    <input type="hidden" name="projectId" value={assignment.projectId} />
                    <input type="hidden" name="assignmentId" value={assignment.id} />
                    <div className="grid gap-3 sm:grid-cols-[1fr_0.45fr]">
                      <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
                        Title
                        <input
                          name="title"
                          className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#171717] outline-none transition focus:border-[#b92516]"
                          placeholder="Insurance cert, shop drawing, closeout doc..."
                        />
                      </label>
                      <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
                        Category
                        <select
                          name="category"
                          defaultValue="submittal"
                          className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#171717] outline-none transition focus:border-[#b92516]"
                        >
                          {vendorSubmittalCategoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
                      File
                      <input
                        name="file"
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        className="mt-2 w-full rounded-md border border-dashed border-black/20 bg-white px-3 py-4 text-sm outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[#151515] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.12em] file:text-white focus:border-[#b92516]"
                      />
                    </label>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                    >
                      <FileText className="size-4" />
                      Upload Submittal
                    </button>
                  </form>
                </div>

                <div className="mt-5 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em]">
                      <MessageSquare className="size-4 text-[#b92516]" />
                      RFIs
                    </h3>
                    <span className="text-sm font-semibold text-[#655c52]">{assignment.rfis.length}</span>
                  </div>
                  {assignment.rfis.length > 0 ? (
                    <ul className="mt-3 divide-y divide-black/10 text-sm">
                      {assignment.rfis.map((rfi) => (
                        <li key={rfi.id} className="py-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{rfi.title}</p>
                              <p className="mt-1 leading-6 text-[#655c52]">{rfi.question}</p>
                            </div>
                            <StatusBadge status={rfi.status} />
                          </div>
                          {rfi.answer ? (
                            <p className="mt-3 rounded-md bg-[#f4efe7] px-3 py-2 leading-6 text-[#655c52]">
                              {rfi.answer}
                            </p>
                          ) : null}

                          {rfi.responses.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {rfi.responses.map((response) => (
                                <div key={response.id} className="rounded-md border border-black/10 bg-[#f9f6f0] p-3">
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b92516]">
                                    Vendor response
                                  </p>
                                  <p className="mt-1 text-sm font-semibold">{response.responderName}</p>
                                  <p className="mt-1 text-sm leading-6 text-[#655c52]">{response.responseBody}</p>
                                  <p className="mt-2 text-xs font-semibold text-[#8a8177]">
                                    {formatDateTime(response.createdAt)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {rfi.status === "open" ? (
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[#655c52]">
                              <span>Due {formatDate(rfi.dueDate)}</span>
                              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                                <Mail className="size-4 text-[#b92516]" />
                                Response needed
                              </span>
                            </div>
                          ) : null}

                          {rfi.status === "open" ? (
                            <form action={createVendorRfiResponseAction} className="mt-3 space-y-3 rounded-md border border-black/10 bg-white p-3">
                              <input type="hidden" name="projectId" value={assignment.projectId} />
                              <input type="hidden" name="rfiId" value={rfi.id} />
                              <input type="hidden" name="vendorId" value={assignment.vendorId} />
                              <input type="hidden" name="assignmentId" value={assignment.id} />
                              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
                                Responder name
                                <input
                                  name="responderName"
                                  className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#171717] outline-none transition focus:border-[#b92516]"
                                  placeholder={assignment.vendorName}
                                />
                              </label>
                              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#655c52]">
                                Response
                                <textarea
                                  name="responseBody"
                                  rows={3}
                                  className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-[#171717] outline-none transition focus:border-[#b92516]"
                                  placeholder="Enter the answer or coordination note for the Kiefer team."
                                />
                              </label>
                              <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                              >
                                <Mail className="size-4" />
                                Submit Response
                              </button>
                            </form>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[#655c52]">No shared RFIs are waiting on this assignment.</p>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-black/10 bg-white p-5 text-sm text-[#655c52] shadow-sm">
              No portal-enabled vendor assignments are available yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
