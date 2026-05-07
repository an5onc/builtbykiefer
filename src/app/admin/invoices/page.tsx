import AdminShell from "@/components/admin/AdminShell";
import InvoiceDownloadButton from "@/components/admin/InvoiceDownloadButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, invoiceTotal } from "@/lib/admin/formatters";
import { getClient, getInvoices, getProject } from "@/lib/admin/queries";

export default function InvoicesPage() {
  const invoices = getInvoices();

  return (
    <AdminShell title="Invoices" eyebrow="Branded PDF Generation">
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="min-w-[940px]">
          <div className="grid grid-cols-[1fr_1fr_0.9fr_0.7fr_0.8fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Invoice</span>
            <span>Project</span>
            <span>Total</span>
            <span>Status</span>
            <span>Download</span>
          </div>
          {invoices.map((invoice) => {
            const project = getProject(invoice.projectId);
            const client = getClient(invoice.clientId);
            return (
              <div
                key={invoice.id}
                className="grid grid-cols-[1fr_1fr_0.9fr_0.7fr_0.8fr] gap-4 border-b border-black/10 px-4 py-4 last:border-0"
              >
                <div>
                  <p className="font-semibold">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-[#655c52]">
                    Due {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{project?.name}</p>
                  <p className="text-sm text-[#655c52]">{client?.name}</p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(invoiceTotal(invoice.lineItems))}
                </p>
                <StatusBadge status={invoice.status} />
                <InvoiceDownloadButton invoiceId={invoice.id} />
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
