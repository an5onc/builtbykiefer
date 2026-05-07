import { getPublicEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export interface AdminSessionCheck {
  userEmail: string | null | undefined;
  profileRole: string | null | undefined;
  allowedAdminEmail: string | null | undefined;
}

export interface AdminSession {
  email: string;
  fullName: string | null;
  role: "admin";
  isDemo: boolean;
}

export function isDemoMode() {
  return getPublicEnv().demoMode;
}

export function getAllowedAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim() || null;
}

export function getDisplayAdminEmail() {
  return getAllowedAdminEmail() ?? "demo-admin@kbuiltco.com";
}

export function canUseAdminSession({
  userEmail,
  profileRole,
  allowedAdminEmail,
}: AdminSessionCheck) {
  if (!userEmail || profileRole !== "admin") {
    return false;
  }

  if (!allowedAdminEmail) {
    return true;
  }

  return userEmail.toLowerCase() === allowedAdminEmail.toLowerCase();
}

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  if (isDemoMode()) {
    return {
      email: getDisplayAdminEmail(),
      fullName: "Demo Admin",
      role: "admin",
      isDemo: true,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("email, role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !canUseAdminSession({
    userEmail: user.email,
    profileRole: profile?.role,
    allowedAdminEmail: getAllowedAdminEmail(),
  })) {
    return null;
  }

  return {
    email: user.email,
    fullName: profile?.full_name ?? null,
    role: "admin",
    isDemo: false,
  };
}
