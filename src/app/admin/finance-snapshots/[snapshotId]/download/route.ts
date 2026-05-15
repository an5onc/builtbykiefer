import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import {
  formatFinanceSnapshotExport,
  type ProjectFinanceSnapshotOutputs,
} from "@/lib/admin/finance-snapshots";
import type { ProjectFinancePreset } from "@/lib/admin/project-finance-presets";
import { getProjectFinanceSnapshot } from "@/lib/admin/queries";

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "finance-snapshot"
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ snapshotId: string }> },
) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { snapshotId } = await params;
  const snapshot = await getProjectFinanceSnapshot(snapshotId);

  if (!snapshot) {
    return NextResponse.json({ error: "Finance snapshot not found" }, { status: 404 });
  }

  const body = formatFinanceSnapshotExport({
    projectId: snapshot.projectId,
    projectName: snapshot.projectName,
    title: snapshot.title,
    notes: snapshot.notes,
    inputs: snapshot.inputs as ProjectFinancePreset,
    outputs: snapshot.outputs as ProjectFinanceSnapshotOutputs,
    createdAt: snapshot.createdAt,
  });

  return new NextResponse(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="${slugify(snapshot.title)}.txt"`,
    },
  });
}
