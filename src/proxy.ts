import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canUseAdminSession, getAllowedAdminEmail } from "@/lib/admin/auth";
import { getPublicEnv } from "@/lib/supabase/env";

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const env = getPublicEnv();

  if (!request.nextUrl.pathname.startsWith("/admin") || env.demoMode) {
    return NextResponse.next();
  }

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return redirectToLogin(request);
  }

  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return redirectToLogin(request);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canUseAdminSession({
    userEmail: user.email,
    profileRole: profile?.role,
    allowedAdminEmail: getAllowedAdminEmail(),
  })) {
    return redirectToLogin(request);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
