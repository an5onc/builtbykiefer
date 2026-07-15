import { serializeMailingCsv } from "@/lib/land-leads/csv";
import { parseLandLeadFilters } from "@/lib/land-leads/filters";
import { getLandLeads } from "@/lib/land-leads/queries";

export const runtime = "nodejs";

/**
 * Export the currently-filtered leads as a mailing-vendor CSV. Auth is enforced
 * by the /admin middleware (src/proxy.ts), matching the other admin download
 * routes.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const filters = parseLandLeadFilters(params);
  const leads = await getLandLeads(filters);
  const csv = serializeMailingCsv(leads);

  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="land-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
