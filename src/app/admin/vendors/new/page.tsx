import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { vendorCompanyTypeOptions, vendorStatusOptions } from "@/lib/admin/vendors";
import { createVendorAction } from "./actions";

export default async function NewVendorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AdminShell title="New Trade Partner" eyebrow="Subcontractor & Vendor Portal">
      <div className="mb-6">
        <Link
          href="/admin/vendors"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Trade Partners
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-[#b92516]/30 bg-[#b92516]/10 px-4 py-3 text-sm font-semibold text-[#8d1f13]">
          {error}
        </p>
      ) : null}

      <form action={createVendorAction} className="space-y-6">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-[#b92516]/10 text-[#b92516]">
              <Users className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Partner Profile</h2>
              <p className="text-sm text-[#655c52]">Create a subcontractor or vendor record for project assignments.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.45fr_0.55fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Company name
              <input
                name="name"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Type
              <select
                name="companyType"
                defaultValue="subcontractor"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              >
                {vendorCompanyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Trade or service
              <input
                name="trade"
                placeholder="Cabinetry"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[0.75fr_0.45fr_0.35fr]">
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
              />
            </label>

            <label className="block text-sm font-semibold text-[#171717]">
              Status
              <select
                name="status"
                defaultValue="active"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              >
                {vendorStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 flex items-center gap-3 rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm font-semibold text-[#171717]">
            <input name="portalAccess" type="checkbox" className="size-4 accent-[#b92516]" defaultChecked />
            Enable vendor portal access
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Notes
            <textarea
              name="notes"
              rows={4}
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
            />
          </label>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Create Partner
        </button>
      </form>
    </AdminShell>
  );
}
