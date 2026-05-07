import Link from "next/link";
import { Download } from "lucide-react";

export default function InvoiceDownloadButton({ invoiceId }: { invoiceId: string }) {
  return (
    <Link
      href={`/admin/invoices/${invoiceId}/download`}
      className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#951e13]"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </Link>
  );
}
