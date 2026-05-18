import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getLead } from "@/lib/admin/queries";
import { createProposalAction } from "./actions";

function defaultValidUntil() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

export default async function NewProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ leadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { leadId } = await params;
  const { error } = await searchParams;
  const lead = await getLead(leadId);

  if (!lead) {
    notFound();
  }

  const action = createProposalAction.bind(null, lead.id);
  const rows = [
    { section: "Base Scope", description: `${lead.projectType} planning and preconstruction`, quantity: "1", unitPrice: "" },
    { section: "Construction", description: "", quantity: "1", unitPrice: "" },
    { section: "Allowance", description: "", quantity: "1", unitPrice: "" },
    { section: "Optional Upgrade", description: "", quantity: "1", unitPrice: "" },
  ];

  return (
    <AdminShell title={`Proposal for ${lead.name}`} eyebrow="Lead-To-Proposal Builder">
      <div className="mb-6">
        <Link
          href={`/admin/leads/${lead.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Lead
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}

      <form action={action} className="space-y-6">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-[#b92516]/10 text-[#b92516]">
              <FileText className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Proposal Basics</h2>
              <p className="text-sm text-[#655c52]">{lead.projectType} · {lead.budgetRange}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.5fr_0.7fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Title
              <input
                name="title"
                defaultValue={`${lead.projectType} Proposal`}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-[#171717]">
              Valid until
              <input
                name="validUntil"
                type="date"
                defaultValue={defaultValidUntil()}
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Client-facing scope summary
            <textarea
              name="scopeSummary"
              defaultValue={`Prepared for ${lead.name}. ${lead.notes}`}
              rows={5}
              className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              required
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Internal notes
            <textarea
              name="internalNotes"
              rows={3}
              className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
            />
          </label>
        </section>

        <section className="rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <h2 className="text-lg font-bold">Scope + Pricing</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[0.85fr_1.6fr_0.45fr_0.7fr_0.45fr] gap-3 bg-[#151515] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                <span>Section</span>
                <span>Description</span>
                <span>Qty</span>
                <span>Unit Price</span>
                <span>Optional</span>
              </div>
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[0.85fr_1.6fr_0.45fr_0.7fr_0.45fr] gap-3 border-b border-black/10 px-5 py-4 last:border-0"
                >
                  <input
                    name="section"
                    defaultValue={row.section}
                    className="rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]"
                    aria-label={`Line ${index + 1} section`}
                  />
                  <input
                    name="description"
                    defaultValue={row.description}
                    className="rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]"
                    aria-label={`Line ${index + 1} description`}
                  />
                  <input
                    name="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={row.quantity}
                    className="rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]"
                    aria-label={`Line ${index + 1} quantity`}
                  />
                  <input
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={row.unitPrice}
                    className="rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]"
                    aria-label={`Line ${index + 1} unit price`}
                  />
                  <label className="flex items-center justify-center">
                    <input
                      name="optional"
                      type="checkbox"
                      value={String(index)}
                      defaultChecked={row.section === "Optional Upgrade"}
                      className="size-4 accent-[#b92516]"
                      aria-label={`Line ${index + 1} optional`}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Create Proposal
        </button>
      </form>
    </AdminShell>
  );
}
