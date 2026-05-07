import { getPublicEnv } from "@/lib/supabase/env";

export function isDemoMode() {
  return getPublicEnv().demoMode;
}

export function getAllowedAdminEmail() {
  return process.env.ADMIN_EMAIL || "demo-admin@kbuiltco.com";
}
