import { pdf } from "@react-pdf/renderer";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ChangeOrderPdf } from "@/lib/admin/change-order-pdf";
import { getChangeOrder, getClient, getProject } from "@/lib/admin/queries";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ changeOrderId: string }> },
) {
  const { changeOrderId } = await params;
  const changeOrder = await getChangeOrder(changeOrderId);

  if (!changeOrder) {
    return new Response("Change order not found", { status: 404 });
  }

  const [project, client] = await Promise.all([
    getProject(changeOrder.projectId),
    getClient(changeOrder.clientId),
  ]);

  if (!project || !client) {
    return new Response("Change order relations not found", { status: 404 });
  }

  const logoPath = join(process.cwd(), "public", "images", "kiefer-k-logo.png");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  const blob = await pdf(
    <ChangeOrderPdf
      changeOrder={changeOrder}
      client={client}
      project={project}
      logoSrc={logoSrc}
    />,
  ).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${changeOrder.changeOrderNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
