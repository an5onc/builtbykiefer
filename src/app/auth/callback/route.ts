import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawNext = requestUrl.searchParams.get("next") ?? "/admin";
  const isInternalNext = rawNext.startsWith("/") && !rawNext.startsWith("//");
  const next = isInternalNext ? rawNext : "/admin";
  const loginPath = next.startsWith("/portal")
    ? "/portal/login"
    : next.startsWith("/vendor")
      ? "/vendor/login"
      : "/login";

  if (!code) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("error", "Missing auth callback code.");
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("error", "Could not complete email sign-in.");
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  const fallback = loginPath === "/portal/login" ? "/portal" : loginPath === "/vendor/login" ? "/vendor" : "/admin";
  return NextResponse.redirect(new URL(isInternalNext ? next : fallback, request.url));
}
