import { pdf } from "@react-pdf/renderer";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ProposalPdf } from "@/lib/admin/proposal-pdf";
import { getProposal } from "@/lib/admin/queries";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ proposalId: string }> },
) {
  const { proposalId } = await params;
  const proposal = await getProposal(proposalId);

  if (!proposal) {
    return new Response("Proposal not found", { status: 404 });
  }

  const logoPath = join(process.cwd(), "public", "images", "kiefer-k-logo.png");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  const blob = await pdf(<ProposalPdf proposal={proposal} logoSrc={logoSrc} />).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${proposal.proposalNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
