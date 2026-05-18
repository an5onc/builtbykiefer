import { pdf } from "@react-pdf/renderer";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { InvoicePdf } from "@/lib/admin/invoice-pdf";
import { getClient, getInvoice, getProject } from "@/lib/admin/queries";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await params;
  const invoice = await getInvoice(invoiceId);

  if (!invoice) {
    return new Response("Invoice not found", { status: 404 });
  }

  const [client, project] = await Promise.all([
    getClient(invoice.clientId),
    getProject(invoice.projectId),
  ]);

  if (!client || !project) {
    return new Response("Invoice relations not found", { status: 404 });
  }

  const logoPath = join(process.cwd(), "public", "images", "kiefer-k-logo.png");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  const blob = await pdf(
    <InvoicePdf invoice={invoice} client={client} project={project} logoSrc={logoSrc} />,
  ).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
