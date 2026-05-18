import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ submittalId: string }> },
) {
  const admin = await getCurrentAdmin();
  const { submittalId } = await params;

  if (!admin) {
    const next = `/admin/vendor-submittals/${submittalId}/download`;
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url));
  }

  const supabase = await createClient();
  const { data: submittal, error } = await supabase
    .from("vendor_submittals")
    .select("storage_bucket, storage_path")
    .eq("id", submittalId)
    .maybeSingle();

  if (error || !submittal) {
    return new NextResponse("Vendor submittal not found.", { status: 404 });
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(submittal.storage_bucket)
    .createSignedUrl(submittal.storage_path, 60);

  if (signedUrlError || !data?.signedUrl) {
    return new NextResponse("Could not create a signed download link.", { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
