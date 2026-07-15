import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency } from "@/lib/admin/formatters";
import { landLeadStatusOptions } from "@/lib/land-leads/constants";
import { getLandLead } from "@/lib/land-leads/queries";
import type { LandLead } from "@/lib/land-leads/types";
import { saveLandLeadNotes } from "./actions";

function countyLabel(county: string): string {
  return county === "weld" ? "Weld" : "Larimer";
}

function money(value: number | null): string {
  return value === null ? "—" : formatCurrency(value);
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-black/5 py-2 last:border-0">
      <span className="text-sm text-[#655c52]">{label}</span>
      <span className="text-right text-sm font-medium text-[#171717]">{value || "—"}</span>
    </div>
  );
}

function flagLabel(lead: LandLead): string {
  const flags: string[] = [];
  if (lead.isLikelyVacant) flags.push("Likely vacant");
  if (lead.mailingDiffersFromSitus) flags.push("Absentee owner");
  if (lead.inTargetMarket) flags.push("Target market");
  if (lead.isEntityOwner) flags.push("Company/developer");
  return flags.join(" · ") || "None";
}

export default async function LandLeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ landLeadId: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { landLeadId } = await params;
  const { error, notice } = await searchParams;
  const lead = await getLandLead(landLeadId);

  if (!lead) {
    notFound();
  }

  const saveAction = saveLandLeadNotes.bind(null, lead.id);

  return (
    <AdminShell title={lead.ownerName || "Land Lead"} eyebrow="Land Lead Record">
      <div className="mb-6">
        <Link
          href="/admin/land-leads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Land Lead Finder
        </Link>
      </div>

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

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                {countyLabel(lead.county)} County · Lead Score {lead.leadScore}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{lead.situsAddress || "No situs address"}</h2>
              <p className="text-sm text-[#655c52]">
                {lead.situsCity}
                {lead.situsZip ? ` ${lead.situsZip}` : ""}
              </p>
            </div>
            <StatusBadge status={lead.status} />
          </div>

          <p className="mt-4 rounded-md bg-[#f9f6f0] px-4 py-3 text-sm text-[#655c52]">
            {lead.leadReason}
          </p>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                Owner &amp; Mailing
              </h3>
              <DetailRow label="Owner" value={lead.ownerName} />
              <DetailRow label="Secondary owner" value={lead.ownerNameSecondary} />
              <DetailRow label="Mailing 1" value={lead.mailingAddress1} />
              <DetailRow label="Mailing 2" value={lead.mailingAddress2} />
              <DetailRow
                label="City / State / ZIP"
                value={[lead.mailingCity, lead.mailingState, lead.mailingZip].filter(Boolean).join(" ")}
              />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                Parcel &amp; Sale
              </h3>
              <DetailRow label="Parcel #" value={lead.parcelNumber} />
              <DetailRow label="Account #" value={lead.accountNumber} />
              <DetailRow label="Acreage" value={lead.acreage === null ? "" : `${lead.acreage} ac`} />
              <DetailRow label="Land use" value={lead.landUse} />
              <DetailRow label="Property class" value={lead.propertyClass} />
              <DetailRow label="Zoning" value={lead.zoning} />
              <DetailRow label="Sale date" value={lead.saleDate ?? ""} />
              <DetailRow label="Sale price" value={money(lead.salePrice)} />
            </div>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                Values
              </h3>
              <DetailRow label="Land value" value={money(lead.landActualValue)} />
              <DetailRow label="Improvement value" value={money(lead.improvementActualValue)} />
              <DetailRow label="Total value" value={money(lead.totalActualValue)} />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8176]">
                Signals &amp; Source
              </h3>
              <DetailRow label="Signals" value={flagLabel(lead)} />
              <DetailRow label="Source dataset" value={lead.sourceDataset} />
              <DetailRow label="First seen" value={lead.firstSeenAt.slice(0, 10)} />
              <DetailRow label="Last refreshed" value={lead.lastRefreshedAt.slice(0, 10)} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <form action={saveAction} className="space-y-5">
            <label className="block text-sm font-semibold text-[#171717]">
              Status
              <select
                name="status"
                defaultValue={lead.status}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              >
                {landLeadStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-[#171717]">
              Notes
              <textarea
                name="notes"
                defaultValue={lead.notes}
                rows={10}
                placeholder="Call notes, campaign history, fit assessment…"
                className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              Save Lead
            </button>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
