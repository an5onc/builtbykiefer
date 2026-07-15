import Link from "next/link";
import { Download } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import LandLeadStatusSelect from "@/components/admin/LandLeadStatusSelect";
import LandLeadUploadButton from "@/components/admin/LandLeadUploadButton";
import { formatCurrency } from "@/lib/admin/formatters";
import {
  countyOptions,
  LAND_LEAD_MAX_UPLOAD_LABEL,
  landLeadStatusOptions,
  saleWindowOptions,
} from "@/lib/land-leads/constants";
import { filtersToQueryString, parseLandLeadFilters } from "@/lib/land-leads/filters";
import { getLandLeads } from "@/lib/land-leads/queries";
import { saveLandLeadStatus, uploadCountyCsv } from "./actions";

const inputClass =
  "mt-1 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]";
const labelClass = "block text-xs font-semibold uppercase tracking-[0.12em] text-[#655c52]";

function countyLabel(county: string): string {
  return county === "weld" ? "Weld" : "Larimer";
}

function formatAcreage(acreage: number | null): string {
  return acreage === null ? "—" : `${acreage.toLocaleString()} ac`;
}

export default async function LandLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const notice = typeof params.notice === "string" ? params.notice : undefined;

  const filters = parseLandLeadFilters(params);
  const leads = await getLandLeads(filters);
  const exportQuery = filtersToQueryString(filters);
  const exportHref = exportQuery
    ? `/admin/land-leads/export?${exportQuery}`
    : "/admin/land-leads/export";

  return (
    <AdminShell title="Land Lead Finder" eyebrow="Sales Pipeline">
      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          {notice}
        </p>
      ) : null}

      {/* Import + export action bar */}
      <section className="mb-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <form
            action={uploadCountyCsv}
            className="flex flex-wrap items-end gap-3"
          >
            <label className={labelClass}>
              County
              <select name="county" defaultValue="weld" className={inputClass}>
                {countyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              County CSV file
              <input
                type="file"
                name="file"
                accept=".csv,text/csv"
                required
                className="mt-1 block w-full text-sm text-[#655c52] file:mr-3 file:rounded-md file:border-0 file:bg-[#151515] file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] file:text-white"
              />
            </label>
            <LandLeadUploadButton />
          </form>

          <Link
            href={exportHref}
            className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#151515] transition hover:bg-[#f9f6f0]"
          >
            <Download className="size-4" />
            Export CSV
          </Link>
        </div>
        <p className="mt-3 text-xs text-[#8a8176]">
          Upload public county exports (Weld GIS parcels CSV, or the Larimer Assessor Public
          Data Center tables joined into one file). Vacant-land detection and lead scoring run
          on import. Files must be {LAND_LEAD_MAX_UPLOAD_LABEL} or smaller. Admin status
          and notes are preserved across re-imports.
        </p>
      </section>

      {/* Filters */}
      <section className="mb-6 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <form method="GET" className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <label className={labelClass}>
            County
            <select name="county" defaultValue={filters.county ?? ""} className={inputClass}>
              <option value="">All</option>
              {countyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Sold within
            <select
              name="saleWindow"
              defaultValue={filters.saleWindowDays === null ? "" : String(filters.saleWindowDays)}
              className={inputClass}
            >
              {saleWindowOptions.map((option) => (
                <option key={option.label} value={option.value === null ? "" : String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Min sale price
            <input
              type="number"
              name="minSalePrice"
              min={0}
              step={1000}
              defaultValue={filters.minSalePrice ?? ""}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Min acreage
            <input
              type="number"
              name="minAcreage"
              min={0}
              step={0.1}
              defaultValue={filters.minAcreage ?? ""}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Status
            <select name="status" defaultValue={filters.status ?? ""} className={inputClass}>
              <option value="">All</option>
              {landLeadStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col justify-end gap-2 text-xs font-semibold text-[#655c52]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="excludeDevelopers"
                value="1"
                defaultChecked={filters.excludeLikelyDevelopers}
              />
              Exclude LLCs / developers
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="mailingDiffers"
                value="1"
                defaultChecked={filters.requireDifferentMailingAddress}
              />
              Mailing ≠ property only
            </label>
          </div>
          <div className="flex items-end gap-3 md:col-span-3 xl:col-span-6">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-[#151515] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-black"
            >
              Apply Filters
            </button>
            <Link
              href="/admin/land-leads"
              className="text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
            >
              Clear
            </Link>
            <span className="ml-auto self-center text-sm text-[#655c52]">
              {leads.length} lead{leads.length === 1 ? "" : "s"}
            </span>
          </div>
        </form>
      </section>

      {/* Results */}
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="min-w-[1040px]">
          <div className="grid grid-cols-[0.5fr_1.5fr_0.7fr_1.5fr_0.7fr_1fr_1.1fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Score</span>
            <span>Owner</span>
            <span>County</span>
            <span>Property</span>
            <span>Acreage</span>
            <span>Sale</span>
            <span>Status</span>
          </div>
          {leads.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#655c52]">
              No leads match these filters. Import a county CSV or widen the filters above.
            </p>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="grid grid-cols-[0.5fr_1.5fr_0.7fr_1.5fr_0.7fr_1fr_1.1fr] items-center gap-4 border-b border-black/10 px-4 py-4 transition hover:bg-[#f9f6f0] last:border-0"
              >
                <span className="text-lg font-bold text-[#b92516]">{lead.leadScore}</span>
                <div>
                  <Link
                    href={`/admin/land-leads/${lead.id}`}
                    className="font-semibold underline-offset-2 hover:underline"
                  >
                    {lead.ownerName || "—"}
                  </Link>
                  <p className="text-xs text-[#655c52]">{lead.parcelNumber || lead.accountNumber}</p>
                  {lead.isEntityOwner ? (
                    <p className="text-xs font-semibold text-[#b92516]">Likely company/developer</p>
                  ) : null}
                </div>
                <span className="text-sm">{countyLabel(lead.county)}</span>
                <div className="text-sm">
                  <p>{lead.situsAddress || "—"}</p>
                  <p className="text-xs text-[#655c52]">{lead.situsCity}</p>
                </div>
                <span className="text-sm">{formatAcreage(lead.acreage)}</span>
                <div className="text-sm">
                  <p>{lead.saleDate ?? "—"}</p>
                  <p className="text-xs text-[#655c52]">
                    {lead.salePrice !== null ? formatCurrency(lead.salePrice) : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <StatusBadge status={lead.status} />
                  <form action={saveLandLeadStatus.bind(null, lead.id)}>
                    <LandLeadStatusSelect defaultValue={lead.status} />
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
