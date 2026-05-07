import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

  if (request.nextUrl.pathname.startsWith("/admin") && !demoMode) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
