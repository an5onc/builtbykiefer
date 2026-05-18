import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { createLeadAction } from "./actions";

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AdminShell title="New Lead" eyebrow="Sales Pipeline">
      <div className="mb-6">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Leads
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}

      <form action={createLeadAction} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-[#171717]">
            Lead name
            <input
              name="name"
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#171717]">
            Email
            <input
              name="email"
              type="email"
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#171717]">
            Phone
            <input
              name="phone"
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#171717]">
            Project type
            <input
              name="projectType"
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#171717]">
            Budget range
            <input
              name="budgetRange"
              placeholder="$500k-$750k"
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#171717]">
            Next follow-up
            <input
              name="nextFollowUp"
              type="date"
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
              required
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-semibold text-[#171717]">
          Notes
          <textarea
            name="notes"
            rows={7}
            className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          <PlusCircle className="size-4" />
          Create Lead
        </button>
      </form>
    </AdminShell>
  );
}
