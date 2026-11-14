import { NextResponse, type NextRequest } from "next/server";
import { rejectEncodedApiPath } from "@/lib/contact/quote-route-path";

export function proxy(request: NextRequest) {
  if (rejectEncodedApiPath(request.nextUrl.pathname)) {
    return NextResponse.json(
      { ok: false, error: "Please use the website's quote form or contact Kiefer Built directly.", code: "invalid_api_path" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/(.*%.*)"],
};
