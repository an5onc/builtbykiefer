import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getClient, getProject } from "@/lib/admin/queries";
import { createChangeOrderAction } from "./actions";

export default async function NewChangeOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { projectId } = await params;
  const { error } = await searchParams;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const client = await getClient(project.clientId);
  const action = createChangeOrderAction.bind(null, project.id);
  const rows = [
    { placeholder: "Labor", quantity: "1" },
    { placeholder: "Materials allowance", quantity: "1" },
    { placeholder: "Subcontractor allowance", quantity: "1" },
    { placeholder: "Additional scope", quantity: "1" },
  ];

  return (
    <AdminShell title={`Change Order for ${project.name}`} eyebrow="Scope Control">
      <div className="mb-6">
        <Link
          href={`/admin/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#655c52] transition hover:text-[#b92516]"
        >
          <ArrowLeft className="size-4" />
          Project
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
              <ClipboardList className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Change Order Details</h2>
              <p className="text-sm text-[#655c52]">
                {client?.name ?? "Client"} · {project.location} · {project.currentPhase}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.4fr_0.55fr]">
            <label className="block text-sm font-semibold text-[#171717]">
              Title
              <input
                name="title"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-[#171717]">
              Schedule impact days
              <input
                name="scheduleImpactDays"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm outline-none transition focus:border-[#b92516]"
                required
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Reason
            <textarea
              name="reason"
              rows={4}
              className="mt-2 w-full resize-y rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#b92516]"
              required
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#171717]">
            Client message
            <textarea
              name="clientMessage"
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
            <h2 className="text-lg font-bold">Pricing</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-[1.7fr_0.5fr_0.7fr] gap-3 bg-[#151515] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                <span>Description</span>
                <span>Qty</span>
                <span>Unit Price</span>
              </div>
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1.7fr_0.5fr_0.7fr] gap-3 border-b border-black/10 px-5 py-4 last:border-0"
                >
                  <input
                    name="description"
                    placeholder={row.placeholder}
                    className="rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]"
                    aria-label={`Line ${index + 1} description`}
                  />
                  <input
                    name="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={row.quantity}
                    className="rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]"
                    aria-label={`Line ${index + 1} quantity`}
                  />
                  <input
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className="rounded-md border border-black/10 bg-[#f9f6f0] px-3 py-2 text-sm outline-none transition focus:border-[#b92516]"
                    aria-label={`Line ${index + 1} unit price`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] md:w-auto"
        >
          Create Change Order
        </button>
      </form>
    </AdminShell>
  );
}
